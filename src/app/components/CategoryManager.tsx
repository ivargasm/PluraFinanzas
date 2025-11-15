'use client';

import { useState } from 'react';
import { useWorkspaceStore } from '../store/workspaceStore';
import { useDataStore } from '../store/dataStore';
import { createCategory, deleteCategory } from '../lib/api';
import { toast } from 'sonner';
import { API_URL } from '../lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function CategoryManager() {
  const { currentWorkspace } = useWorkspaceStore();
  const { categories, fetchCategories } = useDataStore();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWorkspace || !newCategoryName) return;

    try {
      await createCategory(API_URL, newCategoryName, currentWorkspace.id);
      setNewCategoryName('');
      fetchCategories(currentWorkspace.id);
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!currentWorkspace) return;
    try {
      await deleteCategory(API_URL, id);
      fetchCategories(currentWorkspace.id);
      toast.success('Categoría eliminada');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Error al eliminar');
    }
  };

  const startEdit = (id: number, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleUpdate = async (id: number) => {
    if (!currentWorkspace || !editingName) return;
    try {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: editingName, workspace_id: currentWorkspace.id }),
      });
      if (res.ok) {
        fetchCategories(currentWorkspace.id);
        setEditingId(null);
        setEditingName('');
        toast.success('Categoría actualizada');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Error al actualizar');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Gestionar Categorías</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gestionar Categorías</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          <form onSubmit={handleCreate} className="flex gap-2">
            <Input
              placeholder="Nueva categoría"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <Button type="submit">Agregar</Button>
          </form>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex justify-between items-center p-2 border rounded gap-2">
                {editingId === category.id ? (
                  <>
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="flex-1"
                      autoFocus
                    />
                    <Button size="sm" onClick={() => handleUpdate(category.id)}>
                      Guardar
                    </Button>
                    <Button variant="outline" size="sm" onClick={cancelEdit}>
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1">{category.name}</span>
                    <Button variant="outline" size="sm" onClick={() => startEdit(category.id, category.name)}>
                      Editar
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(category.id)}>
                      Eliminar
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

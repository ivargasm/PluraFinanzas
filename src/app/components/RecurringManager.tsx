'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWorkspaceStore } from '../store/workspaceStore';
import { useDataStore } from '../store/dataStore';
import { getRecurringTransactions, createRecurringTransaction, toggleRecurringTransaction, deleteRecurringTransaction, generateRecurringForMonth, generateSingleRecurring, getRecurringStatus } from '../lib/api';
import { API_URL } from '../lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface RecurringTransaction {
  id: number;
  name: string;
  amount: number;
  description: string | null;
  day_of_month: number;
  category_id: number | null;
  category_name: string | null;
  is_active: boolean;
}

export default function RecurringManager() {
  const { currentWorkspace } = useWorkspaceStore();
  const { categories, fetchTransactions, dateFilter } = useDataStore();
  const [recurrings, setRecurrings] = useState<RecurringTransaction[]>([]);
  const [open, setOpen] = useState(false);
  const [addedThisMonth, setAddedThisMonth] = useState<number[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [dayOfMonth, setDayOfMonth] = useState('1');
  const [categoryId, setCategoryId] = useState('');
  
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDayOfMonth, setEditDayOfMonth] = useState('1');
  const [editCategoryId, setEditCategoryId] = useState('');

  const loadRecurrings = useCallback(async () => {
    if (!currentWorkspace) return;
    try {
      const [data, status] = await Promise.all([
        getRecurringTransactions(API_URL, currentWorkspace.id),
        getRecurringStatus(API_URL, currentWorkspace.id)
      ]);
      setRecurrings(data);
      setAddedThisMonth(status.added_this_month);
    } catch (error) {
      console.error('Error loading recurring transactions:', error);
    }
  }, [currentWorkspace]);

  useEffect(() => {
    if (open && currentWorkspace) {
      loadRecurrings();
    }
  }, [open, currentWorkspace, loadRecurrings]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWorkspace) return;

    try {
      await createRecurringTransaction(API_URL, {
        name,
        amount: parseFloat(amount),
        description,
        day_of_month: parseInt(dayOfMonth),
        workspace_id: currentWorkspace.id,
        category_id: categoryId ? parseInt(categoryId) : null,
      });
      setName('');
      setAmount('');
      setDescription('');
      setDayOfMonth('1');
      setCategoryId('');
      loadRecurrings();
    } catch (error) {
      console.error('Error creating recurring:', error);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await toggleRecurringTransaction(API_URL, id);
      loadRecurrings();
    } catch (error) {
      console.error('Error toggling recurring:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteRecurringTransaction(API_URL, id);
      loadRecurrings();
      toast.success('Gasto recurrente eliminado');
    } catch (error) {
      console.error('Error deleting recurring:', error);
      toast.error('Error al eliminar');
    }
  };

  const totalMonthly = recurrings
    .filter(r => r.is_active)
    .reduce((sum, r) => sum + r.amount, 0);

  const handleGenerateMonth = async () => {
    if (!currentWorkspace) return;
    try {
      const result = await generateRecurringForMonth(API_URL, currentWorkspace.id);
      toast.success(result.message);
      await loadRecurrings();
      fetchTransactions(currentWorkspace.id, dateFilter.start || undefined, dateFilter.end || undefined);
    } catch (error) {
      console.error('Error generating recurring:', error);
      toast.error('Error al generar transacciones');
    }
  };

  const handleGenerateSingle = async (id: number) => {
    try {
      const result = await generateSingleRecurring(API_URL, id);
      toast.success(result.message);
      await loadRecurrings();
      fetchTransactions(currentWorkspace!.id, dateFilter.start || undefined, dateFilter.end || undefined);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Error al generar transacción');
    }
  };

  const handleGenerateSelected = async () => {
    if (selectedIds.length === 0) {
      toast.error('Selecciona al menos un gasto');
      return;
    }
    let success = 0;
    for (const id of selectedIds) {
      try {
        await generateSingleRecurring(API_URL, id);
        success++;
      } catch (error) {
        console.error('Error generating:', error);
      }
    }
    toast.success(`${success} transacciones agregadas`);
    setSelectedIds([]);
    await loadRecurrings();
    fetchTransactions(currentWorkspace!.id, dateFilter.start || undefined, dateFilter.end || undefined);
  };

  const toggleSelection = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const startEdit = (recurring: RecurringTransaction) => {
    setEditingId(recurring.id);
    setEditName(recurring.name);
    setEditAmount(recurring.amount.toString());
    setEditDescription(recurring.description || '');
    setEditDayOfMonth(recurring.day_of_month.toString());
    setEditCategoryId(recurring.category_id?.toString() || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdate = async (id: number) => {
    if (!currentWorkspace) return;
    try {
      const res = await fetch(`${API_URL}/recurring/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: editName,
          amount: parseFloat(editAmount),
          description: editDescription,
          day_of_month: parseInt(editDayOfMonth),
          workspace_id: currentWorkspace.id,
          category_id: editCategoryId ? parseInt(editCategoryId) : null,
        }),
      });
      if (res.ok) {
        loadRecurrings();
        setEditingId(null);
        toast.success('Gasto fijo actualizado');
      }
    } catch (error) {
      console.error('Error updating recurring:', error);
      toast.error('Error al actualizar');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className='text-xs md:text-sm hover:text-info'>📅 <span className=' md:inline'>Gastos Fijos</span></Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gastos Fijos Mensuales</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <form onSubmit={handleCreate} className="space-y-3 p-4 border rounded-lg bg-background text-foreground">
            <h4 className="font-semibold">Agregar Gasto Fijo</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className='flex flex-col gap-2'>
                <Label>Nombre</Label>
                <Input
                  placeholder="Ej. Netflix, Renta, Luz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className='flex flex-col gap-2'>
                <Label>Monto</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className='flex flex-col gap-2'>
                <Label>Día del mes</Label>
                <Input
                  type="number"
                  min="1"
                  max="31"
                  value={dayOfMonth}
                  onChange={(e) => setDayOfMonth(e.target.value)}
                  required
                />
              </div>
              <div className='flex flex-col gap-2'>
                <Label>Categoría</Label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Sin categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <Label>Descripción (opcional)</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <Button type="submit">Agregar</Button>
          </form>

          <div className="p-3 bg-background text-foreground rounded space-y-2">
            <p className="font-semibold">Total mensual: ${totalMonthly.toFixed(2)}</p>
            <p className="text-sm text-gray-600">{recurrings.filter(r => r.is_active).length} gastos activos • {addedThisMonth.length} agregados este mes</p>
            <div className="flex gap-2">
              <Button onClick={handleGenerateSelected} variant="outline" className="flex-1" disabled={selectedIds.length === 0}>
                Agregar Seleccionados ({selectedIds.length})
              </Button>
              <Button onClick={handleGenerateMonth} className="flex-1">
                Agregar Todos
              </Button>
            </div>
            <p className="text-xs text-gray-500">Solo se agregarán los que no existan este mes</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Gastos Configurados</h4>
            {recurrings.map((recurring) => {
              const isAdded = addedThisMonth.includes(recurring.id);
              const isEditing = editingId === recurring.id;
              
              return (
                <div key={recurring.id} className={`p-3 border rounded ${!recurring.is_active ? 'opacity-50 bg-gray-50' : ''}`}>
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Nombre</Label>
                          <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8" />
                        </div>
                        <div>
                          <Label className="text-xs">Monto</Label>
                          <Input type="number" step="0.01" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} className="h-8" />
                        </div>
                        <div>
                          <Label className="text-xs">Día del mes</Label>
                          <Input type="number" min="1" max="31" value={editDayOfMonth} onChange={(e) => setEditDayOfMonth(e.target.value)} className="h-8" />
                        </div>
                        <div>
                          <Label className="text-xs">Categoría</Label>
                          <select value={editCategoryId} onChange={(e) => setEditCategoryId(e.target.value)} className="w-full px-2 py-1 border rounded text-sm">
                            <option value="">Sin categoría</option>
                            {categories.map((cat) => <option key={cat.id} value={String(cat.id)}>{cat.name}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Descripción</Label>
                        <Input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="h-8" />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleUpdate(recurring.id)}>Guardar</Button>
                        <Button variant="outline" size="sm" onClick={cancelEdit}>Cancelar</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3 items-start">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(recurring.id)}
                        onChange={() => toggleSelection(recurring.id)}
                        disabled={!recurring.is_active || isAdded}
                        className="mt-1 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{recurring.name}</p>
                          {isAdded && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">✓ Agregado</span>}
                        </div>
                        <p className="text-sm text-gray-600">
                          ${recurring.amount.toFixed(2)} • Día {recurring.day_of_month} • {recurring.category_name || 'Sin categoría'}
                        </p>
                        {recurring.description && (
                          <p className="text-xs text-gray-500">{recurring.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {recurring.is_active && !isAdded && (
                          <Button variant="default" size="sm" onClick={() => handleGenerateSingle(recurring.id)}>Agregar</Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => startEdit(recurring)}>Editar</Button>
                        <Button variant={recurring.is_active ? "outline" : "default"} size="sm" onClick={() => handleToggle(recurring.id)}>
                          {recurring.is_active ? 'Pausar' : 'Activar'}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(recurring.id)}>Eliminar</Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {recurrings.length === 0 && (
              <p className="text-center text-gray-500 py-4">No hay gastos fijos configurados</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

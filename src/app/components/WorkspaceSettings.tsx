'use client';

import { useState, useEffect } from 'react';
import { useWorkspaceStore } from '../store/workspaceStore';
import { updateWorkspace } from '../lib/api';
import { API_URL } from '../lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function WorkspaceSettings() {
  const { currentWorkspace, fetchWorkspaces } = useWorkspaceStore();
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (currentWorkspace) {
      setName(currentWorkspace.name);
      setBudget(currentWorkspace.monthly_budget?.toString() || '');
    }
  }, [currentWorkspace]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWorkspace) return;

    try {
      await updateWorkspace(API_URL, currentWorkspace.id, {
        name,
        monthly_budget: budget ? parseFloat(budget) : null,
      });
      setOpen(false);
      fetchWorkspaces();
    } catch (error) {
      console.error('Error updating workspace:', error);
      alert('Error al actualizar workspace.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Configuración</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configuración del Workspace</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nombre</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Presupuesto Mensual</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="Opcional"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Define un presupuesto mensual para análisis futuros
            </p>
          </div>
          <Button type="submit">Guardar Cambios</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useState } from 'react';
import { useWorkspaceStore } from '../store/workspaceStore';
import { useAuthStore } from '../store/Store';
import { createWorkspace } from '../lib/api';
import { API_URL } from '../lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function CreateWorkspace() {
  const { fetchWorkspaces, workspaces } = useWorkspaceStore();
  const { user } = useAuthStore();
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    // Validar límite de workspaces para plan Free
    if (user?.plan === 'free') {
      const userWorkspaces = (workspaces || []).filter(ws => ws.owner_id === parseInt(user.id));
      if (userWorkspaces.length >= 1) {
        toast.error('Plan Free permite solo 1 workspace. Actualiza a Premium para crear más.');
        return;
      }
    }

    try {
      await createWorkspace(API_URL, name, budget ? parseFloat(budget) : undefined);
      setName('');
      setBudget('');
      setOpen(false);
      fetchWorkspaces();
      toast.success('Workspace creado exitosamente');
    } catch (error) {
      console.error('Error creating workspace:', error);
      toast.error(error instanceof Error ? error.message : 'Error al crear workspace');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          disabled={user?.plan === 'free' && (workspaces || []).filter(ws => ws.owner_id === parseInt(user?.id || '0')).length >= 1}
        >
          Crear Workspace
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Nuevo Workspace</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Nombre del workspace (ej. Familia, Personal)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={user?.plan === 'free' && (workspaces || []).filter(ws => ws.owner_id === parseInt(user?.id || '0')).length >= 1}
            />
          </div>
          <div>
            <Input
              type="number"
              step="0.01"
              placeholder="Presupuesto mensual (opcional)"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          {user?.plan === 'free' && (workspaces || []).filter(ws => ws.owner_id === parseInt(user?.id || '0')).length >= 1 && (
            <p className="text-xs text-red-600 font-semibold">
              ⚠️ Límite alcanzado: Plan Free permite solo 1 workspace. Actualiza a Premium para crear más.
            </p>
          )}
          <Button type="submit">Crear</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

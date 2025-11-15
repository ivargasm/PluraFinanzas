'use client';

import { useState } from 'react';
import { useWorkspaceStore } from '../store/workspaceStore';
import { createWorkspace } from '../lib/api';
import { API_URL } from '../lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function CreateWorkspace() {
  const { fetchWorkspaces } = useWorkspaceStore();
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      await createWorkspace(API_URL, name, budget ? parseFloat(budget) : undefined);
      setName('');
      setBudget('');
      setOpen(false);
      fetchWorkspaces();
    } catch (error) {
      console.error('Error creating workspace:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Crear Workspace</Button>
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
          <Button type="submit">Crear</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

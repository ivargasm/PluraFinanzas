'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWorkspaceStore } from '../store/workspaceStore';
import { useAuthStore } from '../store/Store';
import { getWorkspaceMembers, addWorkspaceMember, removeWorkspaceMember } from '../lib/api';
import { API_URL } from '../lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Member {
  user_id: number;
  workspace_id: number;
  role: string;
  username: string;
  email: string;
}

export default function MemberManager() {
  const { currentWorkspace } = useWorkspaceStore();
  const { user } = useAuthStore();
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState('');
  const [open, setOpen] = useState(false);

  const loadMembers = useCallback(async () => {
    if (!currentWorkspace) return;
    try {
      const data = await getWorkspaceMembers(API_URL, currentWorkspace.id);
      setMembers(data);
    } catch (error) {
      console.error('Error loading members:', error);
    }
  }, [currentWorkspace]);

  useEffect(() => {
    if (open && currentWorkspace) {
      loadMembers();
    }
  }, [open, currentWorkspace, loadMembers]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWorkspace || !email) return;

    // Validar límite de miembros para plan Free
    if (user?.plan === 'free') {
      if (members.length >= 2) {
        toast.error('Plan Free permite máximo 2 miembros. Actualiza a Premium para agregar más.');
        return;
      }
    }

    try {
      const result = await addWorkspaceMember(API_URL, currentWorkspace.id, email);
      setEmail('');
      loadMembers();
      toast.success(result.message || 'Invitación enviada exitosamente');
    } catch (error: unknown) {
      console.error('Error adding member:', error);
      const errorMsg = error instanceof Error ? error.message : 'Error al enviar invitación';
      toast.error(errorMsg);
    }
  };

  const handleRemove = async (userId: number) => {
    if (!currentWorkspace) return;
    try {
      await removeWorkspaceMember(API_URL, currentWorkspace.id, userId);
      loadMembers();
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Error al eliminar miembro.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs md:text-sm hover:text-info">👥 <span className=" md:inline">Miembros</span></Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Miembros del Workspace</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <form onSubmit={handleAdd} className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Email del usuario a invitar"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={user?.plan === 'free' && members.length >= 2}
              />
              <Button 
                type="submit"
                disabled={user?.plan === 'free' && members.length >= 2}
              >
                Invitar
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Si el usuario no tiene cuenta, recibirá un email para registrarse y unirse automáticamente.
            </p>
            {user?.plan === 'free' && members.length >= 2 && (
              <p className="text-xs text-red-600 font-semibold">
                ⚠️ Límite alcanzado: Plan Free permite máximo 2 miembros. Actualiza a Premium para agregar más.
              </p>
            )}
          </form>
          <div className="space-y-2">
            <h4 className="font-semibold">Miembros actuales:</h4>
            {members.map((member) => (
              <div key={member.user_id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-medium">{member.username}</p>
                  <p className="text-sm text-gray-600">{member.email}</p>
                  <p className="text-xs text-gray-500">Rol: {member.role}</p>
                </div>
                {member.role !== 'owner' && (
                  <Button variant="destructive" size="sm" onClick={() => handleRemove(member.user_id)}>
                    Eliminar
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

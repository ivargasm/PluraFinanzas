'use client';

import { useState } from 'react';
import { useWorkspaceStore } from '../store/workspaceStore';
import { useDataStore } from '../store/dataStore';
import { createTransaction } from '../lib/api';
import { API_URL } from '../lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function TransactionForm() {
  const { currentWorkspace } = useWorkspaceStore();
  const { categories, fetchTransactions, dateFilter } = useDataStore();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWorkspace) return;

    try {
      await createTransaction(API_URL, {
        amount: parseFloat(amount),
        description,
        workspace_id: currentWorkspace.id,
        category_id: categoryId ? parseInt(categoryId) : null,
        date: new Date(date).toISOString(),
      });
      setAmount('');
      setDescription('');
      setCategoryId('');
      setDate(new Date().toISOString().split('T')[0]);
      fetchTransactions(currentWorkspace.id, dateFilter.start || undefined, dateFilter.end || undefined);
      toast.success('Gasto registrado');
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast.error('Error al registrar gasto');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-border rounded-lg bg-card">
      <h3 className="text-lg font-semibold text-foreground">Registrar Gasto</h3>
      <div>
        <Label>Monto</Label>
        <Input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Descripción</Label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <Label>Categoría</Label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
        >
          <option value="">Sin categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label>Fecha</Label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
        />
      </div>
      <Button type="submit">Agregar Gasto</Button>
    </form>
  );
}

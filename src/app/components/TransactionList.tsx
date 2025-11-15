'use client';

import { useState } from 'react';
import { useDataStore } from '../store/dataStore';
import { useWorkspaceStore } from '../store/workspaceStore';
import { deleteTransaction } from '../lib/api';
import { API_URL } from '../lib/constants';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ConfirmDialog from './ConfirmDialog';

export default function TransactionList() {
  const { transactions, fetchTransactions, dateFilter } = useDataStore();
  const { currentWorkspace } = useWorkspaceStore();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    const id = deleteId;
    if (!currentWorkspace) return;
    try {
      await deleteTransaction(API_URL, id);
      fetchTransactions(currentWorkspace.id, dateFilter.start || undefined, dateFilter.end || undefined);
      toast.success('Transacción eliminada');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Últimas Transacciones</h3>
      <div className="space-y-2">
        {transactions.slice(0, 10).map((transaction) => (
          <div key={transaction.id} className="flex justify-between items-center p-3 border border-border rounded-lg bg-card">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground">${transaction.amount.toFixed(2)}</p>
                {transaction.recurring_transaction_id && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                    🔄 Recurrente
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{transaction.description || 'Sin descripción'}</p>
              <p className="text-xs text-muted-foreground">
                {transaction.category_name || 'Sin categoría'} • {transaction.username}
              </p>
            </div>
            <Button variant="destructive" size="sm" onClick={() => setDeleteId(transaction.id)}>
              Eliminar
            </Button>
          </div>
        ))}
      </div>
      
      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="¿Eliminar transacción?"
        description="Esta acción no se puede deshacer."
      />
    </div>
  );
}

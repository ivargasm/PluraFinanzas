'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/Store';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useDataStore } from '../../store/dataStore';

interface Transaction {
  id: number;
  amount: number;
  description: string | null;
  date: string;
  workspace_id: number;
  category_id: number | null;
  user_id: number;
  username: string;
  category_name: string | null;
  recurring_transaction_id: number | null;
}
import { useRouter } from 'next/navigation';
import { deleteTransaction, exportTransactionsCSV } from '../../lib/api';
import { API_URL } from '../../lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DateFilter from '../../components/DateFilter';
import { toast } from 'sonner';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function TransactionsPage() {
  const { userAuth, userValid } = useAuthStore();
  const { currentWorkspace } = useWorkspaceStore();
  const { transactions, categories, fetchTransactions, dateFilter } = useDataStore();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDate, setEditDate] = useState('');

  useEffect(() => {
    userValid();
  }, [userValid]);

  useEffect(() => {
    if (!userAuth) {
      router.push('/auth/login');
    }
  }, [userAuth, router]);

  const handleDelete = async () => {
    if (!currentWorkspace || !deleteId) return;
    const id = deleteId;
    try {
      await deleteTransaction(API_URL, id);
      fetchTransactions(currentWorkspace.id, dateFilter.start || undefined, dateFilter.end || undefined);
      toast.success('Transacción eliminada');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Error al eliminar');
    }
  };

  const startEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditAmount(transaction.amount.toString());
    setEditDescription(transaction.description || '');
    setEditCategory(transaction.category_id?.toString() || '');
    setEditDate(new Date(transaction.date).toISOString().split('T')[0]);
  };

  const handleUpdate = async () => {
    if (!currentWorkspace || !editingTransaction) return;
    try {
      const res = await fetch(`${API_URL}/transactions/${editingTransaction.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          amount: parseFloat(editAmount),
          description: editDescription,
          category_id: editCategory ? parseInt(editCategory) : null,
          date: editDate,
          workspace_id: currentWorkspace.id,
        }),
      });
      if (res.ok) {
        fetchTransactions(currentWorkspace.id, dateFilter.start || undefined, dateFilter.end || undefined);
        setEditingTransaction(null);
        toast.success('Transacción actualizada');
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Error al actualizar');
    }
  };

  const handleExport = async () => {
    if (!currentWorkspace) return;
    try {
      await exportTransactionsCSV(
        API_URL, 
        currentWorkspace.id, 
        dateFilter.start || undefined, 
        dateFilter.end || undefined
      );
      toast.success('Archivo descargado');
    } catch (error) {
      console.error('Error exporting:', error);
      toast.error('Error al exportar datos');
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = !searchTerm || 
      t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filterCategory || t.category_id === parseInt(filterCategory);

    return matchesSearch && matchesCategory;
  });

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

  if (!userAuth) return null;

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <DateFilter />
        </div>
        
        <div className="bg-card rounded-lg border border-border p-6">
          <h1 className="text-2xl font-bold mb-6 text-foreground">Transacciones Detalladas</h1>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Input
              placeholder="Buscar por descripción o usuario"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-background"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Resumen y Exportar */}
          <div className="mb-4 p-4 bg-mint-100 dark:bg-teal-800 rounded-lg flex justify-between items-center flex-wrap gap-4">
            <p className="text-lg text-teal-900 dark:text-white">
              <span className="font-semibold">Total:</span> ${totalAmount.toFixed(2)} 
              <span className="text-teal-700 dark:text-teal-200 ml-4">({filteredTransactions.length} transacciones)</span>
            </p>
            <Button onClick={handleExport} className="bg-teal-700 hover:bg-teal-800 text-white">
              📄 Exportar CSV
            </Button>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {new Date(transaction.date).toLocaleDateString('es-MX')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {transaction.description || 'Sin descripción'}
                        {transaction.recurring_transaction_id && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                            🔄
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-muted rounded text-sm text-foreground">
                        {transaction.category_name || 'Sin categoría'}
                      </span>
                    </TableCell>
                    <TableCell>{transaction.username}</TableCell>
                    <TableCell className="text-right font-medium">
                      ${transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(transaction)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteId(transaction.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron transacciones
            </div>
          )}
        </div>
        
        <ConfirmDialog
          open={deleteId !== null}
          onOpenChange={(open) => !open && setDeleteId(null)}
          onConfirm={handleDelete}
          title="¿Eliminar transacción?"
          description="Esta acción no se puede deshacer."
        />

        {/* Modal de Edición */}
        {editingTransaction && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Editar Transacción</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Monto</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Descripción</label>
                  <Input
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Categoría</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="">Sin categoría</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Fecha</label>
                  <Input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setEditingTransaction(null)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleUpdate}>
                    Guardar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

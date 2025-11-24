import { create } from 'zustand';
import { API_URL } from '../lib/constants';

interface Category {
  id: number | string;
  name: string;
  workspace_id: number;
}

interface Transaction {
  id: number;
  amount: number;
  description: string | null;
  date: string;
  workspace_id: number;
  category_id: number | string | null;
  user_id: number;
  username: string;
  category_name: string | null;
  recurring_transaction_id: number | null;
}

interface DataState {
  categories: Category[];
  transactions: Transaction[];
  dateFilter: { start: string; end: string };
  setCategories: (categories: Category[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setDateFilter: (start: string, end: string) => void;
  fetchCategories: (workspaceId: number) => Promise<void>;
  fetchTransactions: (workspaceId: number, startDate?: string, endDate?: string) => Promise<void>;
}

const getDefaultDates = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  return {
    start: firstDay.toISOString().split('T')[0],
    end: now.toISOString().split('T')[0]
  };
};

export const useDataStore = create<DataState>((set) => ({
  categories: [],
  transactions: [],
  dateFilter: getDefaultDates(),
  setCategories: (categories) => set({ categories }),
  setTransactions: (transactions) => set({ transactions }),
  setDateFilter: (start, end) => set({ dateFilter: { start, end } }),
  fetchCategories: async (workspaceId: number) => {
    try {
      const res = await fetch(`${API_URL}/categories/?workspace_id=${workspaceId}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Error al cargar categorías');
      const data = await res.json();
      set({ categories: data });
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  },
  fetchTransactions: async (workspaceId: number, startDate?: string, endDate?: string) => {
    try {
      let url = `${API_URL}/transactions/?workspace_id=${workspaceId}`;
      if (startDate) url += `&start_date=${startDate}`;
      if (endDate) url += `&end_date=${endDate}`;
      
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error('Error al cargar transacciones');
      const data = await res.json();
      set({ transactions: data });
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  },
}));

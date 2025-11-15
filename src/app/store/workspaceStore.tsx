import { create } from 'zustand';
import { API_URL } from '../lib/constants';

interface Workspace {
  id: number;
  name: string;
  owner_id: number;
  monthly_budget: number | null;
  created_at: string;
}

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  fetchWorkspaces: () => Promise<void>;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspaces: [],
  currentWorkspace: null,
  setWorkspaces: (workspaces) => set({ workspaces }),
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  fetchWorkspaces: async () => {
    try {
      const res = await fetch(`${API_URL}/workspaces/`, { credentials: 'include' });
      if (!res.ok) throw new Error('Error al cargar workspaces');
      const data = await res.json();
      set({ workspaces: data });
      if (data.length > 0 && !useWorkspaceStore.getState().currentWorkspace) {
        set({ currentWorkspace: data[0] });
      }
    } catch (error) {
      console.error('Error fetching workspaces:', error);
    }
  },
}));

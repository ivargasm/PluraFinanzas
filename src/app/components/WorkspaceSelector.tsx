'use client';

import { useWorkspaceStore } from '../store/workspaceStore';
import { useDataStore } from '../store/dataStore';
import { useEffect } from 'react';

export default function WorkspaceSelector() {
  const { workspaces, currentWorkspace, setCurrentWorkspace, fetchWorkspaces } = useWorkspaceStore();
  const { fetchCategories, fetchTransactions, dateFilter } = useDataStore();

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  useEffect(() => {
    if (currentWorkspace) {
      fetchCategories(currentWorkspace.id);
      fetchTransactions(currentWorkspace.id, dateFilter.start || undefined, dateFilter.end || undefined);
    }
  }, [currentWorkspace, fetchCategories, fetchTransactions, dateFilter.start, dateFilter.end]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const workspace = workspaces.find(w => w.id === parseInt(e.target.value));
    setCurrentWorkspace(workspace || null);
  };

  return (
    <select
      value={currentWorkspace?.id || ''}
      onChange={handleChange}
      className="px-3 py-2 border rounded-md bg-background text-foreground cursor-pointer hover:bg-accent transition-colors"
    >
      {workspaces.map((workspace) => (
        <option key={workspace.id} value={workspace.id}>
          {workspace.name}
        </option>
      ))}
    </select>
  );
}

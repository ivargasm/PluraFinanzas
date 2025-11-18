'use client';

import { useWorkspaceStore } from '../store/workspaceStore';
import { useAuthStore } from '../store/Store';
import { useDataStore } from '../store/dataStore';
import { useEffect } from 'react';
import PlanBadge from './PlanBadge';

export default function WorkspaceSelector() {
  const { workspaces, currentWorkspace, setCurrentWorkspace, fetchWorkspaces } = useWorkspaceStore();
  const { user } = useAuthStore();
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
    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
      <select
        value={currentWorkspace?.id || ''}
        onChange={handleChange}
        className="w-full md:w-auto px-3 py-2 border rounded-md bg-background text-foreground cursor-pointer hover:bg-accent transition-colors text-sm md:text-base"
      >
        {workspaces.map((workspace) => (
          <option key={workspace.id} value={workspace.id}>
            {workspace.name}
            {workspace.plan === 'premium' ? ' ⭐' : ''}
          </option>
        ))}
      </select>
      {currentWorkspace && (
        <div className="flex gap-2 flex-wrap w-full md:w-auto">
          <div className="hidden sm:block">
            <PlanBadge plan={(user?.plan as 'free' | 'premium') || "free"} showUpgradeButton={false} />
          </div>
          {currentWorkspace.plan === 'premium' && (
            <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full font-medium whitespace-nowrap">
              Premium ⭐
            </span>
          )}
        </div>
      )}
    </div>
  );
}

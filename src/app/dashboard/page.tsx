'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../store/Store';
import { useRouter } from 'next/navigation';
import WorkspaceSelector from '../components/WorkspaceSelector';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import BasicChart from '../components/BasicChart';
import CategoryManager from '../components/CategoryManager';
import CreateWorkspace from '../components/CreateWorkspace';
import MemberManager from '../components/MemberManager';
import WorkspaceSettings from '../components/WorkspaceSettings';
import BudgetOverview from '../components/BudgetOverview';
import RecurringManager from '../components/RecurringManager';
import DateFilter from '../components/DateFilter';
import InsightsPanel from '../components/InsightsPanel';

export default function Dashboard() {
  const { userAuth, userValid } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    userValid();
  }, [userValid]);

  useEffect(() => {
    if (!userAuth) {
      router.push('/auth/login');
    }
  }, [userAuth, router]);

  if (!userAuth) return null;

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="bg-card border-b border-border shadow-sm mb-6">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold text-foreground">Dashboard de Finanzas</h2>
            <div className="flex gap-2 items-center">
              <InsightsPanel />
              <CreateWorkspace />
            </div>
          </div>
          
          <div className="flex gap-3 items-center flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Workspace:</span>
              <WorkspaceSelector />
            </div>
            <div className="h-6 w-px bg-border" />
            <div className="flex gap-2">
              <CategoryManager />
              <RecurringManager />
              <MemberManager />
              <WorkspaceSettings />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 pb-8">
        <div className="mb-6">
          <DateFilter />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TransactionForm />
              <BudgetOverview />
            </div>
            <BasicChart />
          </div>
          <div>
            <TransactionList />
          </div>
        </div>
      </main>
    </div>
  );
}

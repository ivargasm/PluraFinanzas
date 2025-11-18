'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../store/Store';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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
import TelegramLinkModal from '../components/TelegramLinkModal';

export default function Dashboard() {
  const { userAuth, userValid } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Refrescar datos del usuario siempre al cargar
    userValid();

    // Si viene de un pago exitoso, forzar refresco
    if (searchParams.get('upgrade') === 'success') {
      userValid();
    }
  }, [userValid, searchParams]);

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
          {/* Encabezado - Responsive */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-foreground">Dashboard de Finanzas</h2>
            {/* Botones principales - Ocultos en móvil, mostrados en tablet+ */}
            <div className="hidden md:flex gap-2 items-center">
              <InsightsPanel />
              <TelegramLinkModal />
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  👤 Perfil
                </Button>
              </Link>
              <CreateWorkspace />
            </div>
          </div>
          
          {/* Workspace selector - Full width en móvil */}
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center mb-4 flex-wrap">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Workspace:</span>
              <div className="flex-1 md:flex-none">
                <WorkspaceSelector />
              </div>
            </div>
            
            {/* Separador - Oculto en móvil */}
            <div className="hidden md:block h-6 w-px bg-border" />
            
            {/* Botones secundarios - Responsive grid */}
            <div className="w-full md:w-auto flex gap-2 flex-wrap">
              <CategoryManager />
              <RecurringManager />
              <MemberManager />
              <WorkspaceSettings />
            </div>
          </div>

          {/* Botones móvil - Mostrados solo en móvil */}
          <div className="md:hidden flex gap-2 flex-wrap">
            <InsightsPanel />
            <TelegramLinkModal />
            <Link href="/profile" className="flex-1">
              <Button variant="outline" size="sm" className="w-full hover:text-info">
                👤 Perfil
              </Button>
            </Link>
            <CreateWorkspace />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 pb-8">
        <div className="mb-6">
          <DateFilter />
        </div>
        
        {/* Grid responsivo - 1 columna en móvil, 2 en tablet, 3 en desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Formulario y presupuesto - Stack en móvil */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <TransactionForm />
              <BudgetOverview />
            </div>
            <BasicChart />
          </div>
          {/* Lista de transacciones - Full width en móvil */}
          <div className="col-span-1">
            <TransactionList />
          </div>
        </div>
      </main>
    </div>
  );
}

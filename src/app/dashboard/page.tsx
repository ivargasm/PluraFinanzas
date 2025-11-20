import { Suspense } from 'react';
import DashboardContent from './dashboard-content';

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Cargando...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

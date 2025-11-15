'use client';

import { useState, useMemo } from 'react';
import { useWorkspaceStore } from '../store/workspaceStore';
import { useDataStore } from '../store/dataStore';
import { Button } from '@/components/ui/button';

type ViewPeriod = 'weekly' | 'biweekly' | 'monthly';

export default function BudgetOverview() {
  const { currentWorkspace } = useWorkspaceStore();
  const { transactions } = useDataStore();
  const [viewPeriod, setViewPeriod] = useState<ViewPeriod>('monthly');

  const monthlyBudget = currentWorkspace?.monthly_budget || 0;
  const monthlySpent = transactions.reduce((sum, t) => sum + t.amount, 0);

  const { budget, spent, label } = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const daysInMonth = endOfMonth.getDate();
    const currentDay = now.getDate();

    if (viewPeriod === 'weekly') {
      const weekBudget = monthlyBudget / 4;
      const dayOfWeek = now.getDay();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - dayOfWeek);
      startOfWeek.setHours(0, 0, 0, 0);
      
      const weekSpent = transactions
        .filter(t => new Date(t.date) >= startOfWeek)
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        budget: weekBudget,
        spent: weekSpent,
        label: 'Semanal',
        daysInPeriod: 7
      };
    }

    if (viewPeriod === 'biweekly') {
      const biweeklyBudget = monthlyBudget / 2;
      const isFirstHalf = currentDay <= 15;
      const startDate = isFirstHalf ? startOfMonth : new Date(now.getFullYear(), now.getMonth(), 16);
      
      const biweeklySpent = transactions
        .filter(t => new Date(t.date) >= startDate)
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        budget: biweeklyBudget,
        spent: biweeklySpent,
        label: isFirstHalf ? 'Quincenal (1ra)' : 'Quincenal (2da)',
        daysInPeriod: 15
      };
    }

    return {
      budget: monthlyBudget,
      spent: monthlySpent,
      label: 'Mensual',
      daysInPeriod: daysInMonth
    };
  }, [viewPeriod, transactions, monthlyBudget, monthlySpent]);

  if (!currentWorkspace?.monthly_budget) return null;

  const percentage = (spent / budget) * 100;
  const remaining = budget - spent;

  const getColorClass = () => {
    if (percentage >= 100) return 'text-destructive';
    if (percentage >= 80) return 'text-warning';
    return 'text-success';
  };

  const getBarColorClass = () => {
    if (percentage >= 100) return 'bg-destructive';
    if (percentage >= 80) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="p-4 border border-border rounded-lg bg-card">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-foreground">Presupuesto {label}</h3>
        <div className="flex gap-1">
          <Button
            variant={viewPeriod === 'weekly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewPeriod('weekly')}
            className="text-xs px-2 py-1 h-7"
          >
            Semanal
          </Button>
          <Button
            variant={viewPeriod === 'biweekly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewPeriod('biweekly')}
            className="text-xs px-2 py-1 h-7"
          >
            Quincenal
          </Button>
          <Button
            variant={viewPeriod === 'monthly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewPeriod('monthly')}
            className="text-xs px-2 py-1 h-7"
          >
            Mensual
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Presupuesto:</span>
          <span className="font-medium text-foreground">${budget.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Gastado:</span>
          <span className={`font-medium ${getColorClass()}`}>${spent.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Restante:</span>
          <span className={`font-medium ${getColorClass()}`}>${remaining.toFixed(2)}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5 mt-3">
          <div
            className={`h-2.5 rounded-full ${getBarColorClass()}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
        <p className="text-sm text-muted-foreground text-center">{percentage.toFixed(1)}% del presupuesto</p>
        {viewPeriod !== 'monthly' && (
          <p className="text-xs text-muted-foreground text-center mt-1">
            Presupuesto mensual: ${monthlyBudget.toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
}

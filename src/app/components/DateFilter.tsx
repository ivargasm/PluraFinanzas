"use client";

import { useDataStore } from "@/app/store/dataStore";
import { useWorkspaceStore } from "@/app/store/workspaceStore";

export default function DateFilter() {
    const { dateFilter, setDateFilter, fetchTransactions } = useDataStore();
    const { currentWorkspace } = useWorkspaceStore();

    const handlePreset = (preset: 'current' | 'last' | 'all') => {
        const now = new Date();
        let start = '', end = '';

        switch (preset) {
            case 'current':
                start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
                // Agregar un día para incluir el día completo
                const tomorrow = new Date(now);
                tomorrow.setDate(tomorrow.getDate() + 1);
                end = tomorrow.toISOString().split('T')[0];
                break;
            case 'last':
                start = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
                end = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
                break;
            case 'all':
                start = '';
                end = '';
                break;
        }

        setDateFilter(start, end);
        if (currentWorkspace) {
            fetchTransactions(currentWorkspace.id, start || undefined, end || undefined);
        }
    };

    const handleCustomDate = () => {
        if (currentWorkspace) {
            fetchTransactions(currentWorkspace.id, dateFilter.start || undefined, dateFilter.end || undefined);
        }
    };

    return (
        <div className="bg-card p-4 rounded-lg border border-border space-y-3">
            <h3 className="font-semibold text-sm text-foreground">📅 Período</h3>
            
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => handlePreset('current')}
                    className="px-3 py-1 text-sm bg-mint-500 text-teal-900 rounded hover:bg-mint-400 transition-colors font-medium"
                >
                    Mes actual
                </button>
                <button
                    onClick={() => handlePreset('last')}
                    className="px-3 py-1 text-sm bg-teal-700 text-white rounded hover:bg-teal-800 transition-colors font-medium"
                >
                    Mes anterior
                </button>
                <button
                    onClick={() => handlePreset('all')}
                    className="px-3 py-1 text-sm bg-teal-700 text-white rounded hover:bg-teal-800 transition-colors font-medium"
                >
                    Todo
                </button>
            </div>

            <div className="flex gap-2 items-center flex-wrap">
                <input
                    type="date"
                    value={dateFilter.start}
                    onChange={(e) => setDateFilter(e.target.value, dateFilter.end)}
                    className="border border-input rounded px-2 py-1 text-sm bg-background text-foreground"
                />
                <span className="text-muted-foreground">-</span>
                <input
                    type="date"
                    value={dateFilter.end}
                    onChange={(e) => setDateFilter(dateFilter.start, e.target.value)}
                    className="border border-input rounded px-2 py-1 text-sm bg-background text-foreground"
                />
                <button
                    onClick={handleCustomDate}
                    className="px-3 py-1 text-sm bg-teal-700 dark:bg-mint-500 text-white dark:text-teal-900 rounded hover:bg-teal-800 dark:hover:bg-mint-400 transition-colors font-medium"
                >
                    Aplicar
                </button>
            </div>
        </div>
    );
}

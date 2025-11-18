"use client";

import { useEffect, useState, useCallback } from "react";
import { useWorkspaceStore } from "@/app/store/workspaceStore";
import { useDataStore } from "@/app/store/dataStore";
import { getReportSummary, getMonthlyTrend } from "@/app/lib/api";
import { API_URL } from "@/app/lib/constants";
import UpgradeModal from "@/app/components/UpgradeModal";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import DateFilter from "@/app/components/DateFilter";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D'];

interface CategoryData {
    name: string;
    total: number;
    [key: string]: string | number;
}

interface MonthlyData {
    month: string;
    total: number;
}

interface ReportSummary {
    total_spent: number;
    total_transactions: number;
    daily_average: number;
    top_categories: CategoryData[];
    by_category: CategoryData[];
    period: { start: string; end: string };
    previous_period?: {
        total: number;
        change_percentage: number;
        start: string;
        end: string;
    };
}

export default function ReportsPage() {
    const { currentWorkspace } = useWorkspaceStore();
    const { dateFilter } = useDataStore();
    const [summary, setSummary] = useState<ReportSummary | null>(null);
    const [monthlyTrend, setMonthlyTrend] = useState<MonthlyData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [isPremiumBlocked, setIsPremiumBlocked] = useState(false);

    const loadReports = useCallback(async () => {
        if (!currentWorkspace) return;
        
        setLoading(true);
        try {
            // Intentar cargar resumen
            const summaryData = await getReportSummary(
                API_URL, 
                currentWorkspace.id, 
                dateFilter.start || undefined, 
                dateFilter.end || undefined
            );
            setSummary(summaryData);
            
            // Intentar cargar tendencia
            const trendData = await getMonthlyTrend(API_URL, currentWorkspace.id, 6);
            setMonthlyTrend(trendData);
            setIsPremiumBlocked(false);
        } catch (error) {
            // Manejar error 403 (Premium required)
            if ((error as Error & { status?: number })?.status === 403) {
                setIsPremiumBlocked(true);
                setShowUpgradeModal(true);
                setSummary(null);
                setMonthlyTrend([]);
            } else {
                console.error("Error al cargar reportes:", error);
            }
        } finally {
            setLoading(false);
        }
    }, [currentWorkspace, dateFilter]);

    useEffect(() => {
        if (currentWorkspace) {
            loadReports();
        }
    }, [currentWorkspace, loadReports]);

    if (!currentWorkspace) {
        return (
            <div className="p-6">
                <p className="text-muted-foreground">Selecciona un workspace para ver reportes</p>
            </div>
        );
    }

    if (isPremiumBlocked) {
        return (
            <div className="p-6">
                <div className="max-w-md mx-auto py-12 text-center">
                    <h2 className="text-2xl font-bold mb-2">🔒 Reportes Avanzados</h2>
                    <p className="text-muted-foreground mb-6">
                        Esta función requiere plan Premium para acceder a reportes avanzados y análisis detallado.
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <h1 className="text-3xl font-bold text-foreground">📊 Reportes</h1>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="bg-card p-6 rounded-lg border border-border animate-pulse">
                            <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                            <div className="h-8 bg-muted rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1,2].map(i => (
                        <div key={i} className="bg-card p-6 rounded-lg border border-border animate-pulse">
                            <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
                            <div className="h-64 bg-muted rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold text-foreground">📊 Reportes</h1>
            
            {isPremiumBlocked ? (
                <div className="max-w-md mx-auto py-12 text-center">
                    <h2 className="text-xl font-bold mb-2">🔒 Reportes Avanzados</h2>
                    <p className="text-muted-foreground mb-6">
                        Esta función requiere plan Premium para acceder a reportes avanzados y análisis detallado.
                    </p>
                </div>
            ) : (
                <>
                    <DateFilter />

                    {summary && (
                        <>
                            {/* Tarjetas de resumen */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-card p-6 rounded-lg border border-border">
                            <p className="text-muted-foreground text-sm">Total Gastado</p>
                            <p className="text-2xl font-bold text-foreground">${summary.total_spent.toFixed(2)}</p>
                            {summary.previous_period && (
                                <div className="mt-2 space-y-1">
                                    <p className={`text-sm font-semibold ${summary.previous_period.change_percentage > 0 ? 'text-destructive' : 'text-success'}`}>
                                        {summary.previous_period.change_percentage > 0 ? '↑' : '↓'} {Math.abs(summary.previous_period.change_percentage).toFixed(1)}%
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Anterior: ${summary.previous_period.total.toFixed(2)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Diferencia: ${Math.abs(summary.total_spent - summary.previous_period.total).toFixed(2)}
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        <div className="bg-card p-6 rounded-lg border border-border">
                            <p className="text-muted-foreground text-sm">Transacciones</p>
                            <p className="text-2xl font-bold text-foreground">{summary.total_transactions}</p>
                        </div>
                        
                        <div className="bg-card p-6 rounded-lg border border-border">
                            <p className="text-muted-foreground text-sm">Promedio Diario</p>
                            <p className="text-2xl font-bold text-foreground">${summary.daily_average.toFixed(2)}</p>
                        </div>
                        
                        <div className="bg-card p-6 rounded-lg border border-border">
                            <p className="text-muted-foreground text-sm">Top Categoría</p>
                            <p className="text-xl font-bold text-foreground">{summary.top_categories[0]?.name || 'N/A'}</p>
                            <p className="text-sm text-muted-foreground">${summary.top_categories[0]?.total.toFixed(2) || '0.00'}</p>
                        </div>
                    </div>

                    {/* Comparativa detallada */}
                    {summary.previous_period && summary.previous_period.total > 0 && (
                        <div className="bg-card p-6 rounded-lg border border-mint-300 dark:border-teal-700">
                            <h3 className="text-lg font-bold mb-4 text-teal-900 dark:text-white">📊 Comparativa con Período Anterior</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-teal-700 dark:text-teal-200 font-medium">Período Actual</p>
                                    <p className="text-xs text-teal-600 dark:text-teal-300 mb-1">
                                        {summary.period.start} a {summary.period.end}
                                    </p>
                                    <p className="text-2xl font-bold text-teal-900 dark:text-white">${summary.total_spent.toFixed(2)}</p>
                                    <p className="text-xs text-teal-600 dark:text-teal-300">{summary.total_transactions} transacciones</p>
                                </div>
                                <div>
                                    <p className="text-sm text-teal-700 dark:text-teal-200 font-medium">Período Anterior</p>
                                    <p className="text-xs text-teal-600 dark:text-teal-300 mb-1">
                                        {summary.previous_period.start} a {summary.previous_period.end}
                                    </p>
                                    <p className="text-2xl font-bold text-teal-900 dark:text-white">${summary.previous_period.total.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-teal-700 dark:text-teal-200 font-medium">Diferencia</p>
                                    <p className={`text-2xl font-bold ${summary.previous_period.change_percentage > 0 ? 'text-coral-600 dark:text-coral-400' : 'text-green-700 dark:text-green-400'}`}>
                                        {summary.previous_period.change_percentage > 0 ? '+' : ''}
                                        ${(summary.total_spent - summary.previous_period.total).toFixed(2)}
                                    </p>
                                    <p className={`text-sm font-semibold ${summary.previous_period.change_percentage > 0 ? 'text-coral-600 dark:text-coral-400' : 'text-green-700 dark:text-green-400'}`}>
                                        {summary.previous_period.change_percentage > 0 ? '↑' : '↓'} {Math.abs(summary.previous_period.change_percentage).toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Gráficos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Gasto por categoría - Barras */}
                        <div className="bg-card p-6 rounded-lg border border-border">
                            <h2 className="text-xl font-bold mb-4 text-foreground">Gasto por Categoría</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={summary.by_category}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="total" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Distribución - Pie */}
                        <div className="bg-card p-6 rounded-lg border border-border">
                            <h2 className="text-xl font-bold mb-4 text-foreground">Distribución</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={summary.by_category}
                                        dataKey="total"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label
                                    >
                                        {summary.by_category.map((entry, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Tendencia mensual */}
                        <div className="bg-card p-6 rounded-lg border border-border md:col-span-2">
                            <h2 className="text-xl font-bold mb-4 text-foreground">Tendencia Mensual (Últimos 6 meses)</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={monthlyTrend}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Top 5 categorías */}
                        <div className="bg-card p-6 rounded-lg border border-border md:col-span-2">
                            <h2 className="text-xl font-bold mb-4 text-foreground">🏆 Top 5 Categorías</h2>
                            <div className="space-y-3">
                                {summary.top_categories.map((cat, index: number) => {
                                    const percentage = ((cat.total / summary.total_spent) * 100);
                                    return (
                                        <div key={index} className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl font-bold text-muted-foreground">#{index + 1}</span>
                                                    <span className="font-medium text-foreground">{cat.name}</span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-foreground">${cat.total.toFixed(2)}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {percentage.toFixed(1)}%
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-2">
                                                <div 
                                                    className="bg-primary h-2 rounded-full transition-all"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    </>
                )}
                </>
            )}
            
            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                featureName="Reportes Avanzados"
            />
        </div>
    );
}

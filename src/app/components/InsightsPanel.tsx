'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWorkspaceStore } from '../store/workspaceStore';
import { useAuthStore } from '../store/Store';
import { API_URL } from '../lib/constants';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import UpgradeModal from './UpgradeModal';

interface Insight {
  id: number;
  type: string;
  title: string;
  message: string;
  priority: string;
  is_read: boolean;
  created_at: string;
}

export default function InsightsPanel() {
  const { currentWorkspace } = useWorkspaceStore();
  const { user } = useAuthStore();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPremiumBlocked, setIsPremiumBlocked] = useState(false);

  const loadInsights = useCallback(async () => {
    if (!currentWorkspace) return;
    try {
      const res = await fetch(`${API_URL}/insights/?workspace_id=${currentWorkspace.id}`, {
        credentials: 'include',
      });
      
      if (res.status === 403) {
        // El workspace no tiene plan Premium
        setIsPremiumBlocked(true);
        setInsights([]);
        return;
      }
      
      if (res.ok) {
        const data = await res.json();
        setInsights(data);
        setIsPremiumBlocked(false);
      }
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  }, [currentWorkspace]);

  const generateInsights = async () => {
    if (!currentWorkspace) return;
    
    // Validación híbrida: user es premium O workspace es premium
    const hasUserPremium = user?.plan === "premium";
    const hasWorkspacePremium = currentWorkspace.plan === "premium";
    
    if (!hasUserPremium && !hasWorkspacePremium) {
      setShowUpgradeModal(true);
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/insights/generate?workspace_id=${currentWorkspace.id}`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (res.status === 403) {
        setShowUpgradeModal(true);
        return;
      }
      
      if (res.ok) {
        const data = await res.json();
        toast.success(data.message);
        loadInsights();
      } else {
        toast.error('Error al generar sugerencias');
      }
    } catch (error) {
      console.error('Error generating insights:', error);
      toast.error('Error al generar sugerencias');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await fetch(`${API_URL}/insights/${id}/read`, {
        method: 'PATCH',
        credentials: 'include',
      });
      loadInsights();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const deleteInsight = async (id: number) => {
    try {
      await fetch(`${API_URL}/insights/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      toast.success('Sugerencia eliminada');
      loadInsights();
    } catch (error) {
      console.error('Error deleting insight:', error);
      toast.error('Error al eliminar');
    }
  };

  useEffect(() => {
    if (open && currentWorkspace) {
      loadInsights();
    }
  }, [open, currentWorkspace, loadInsights]);

  const unreadCount = insights.filter(i => !i.is_read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert': return '⚠️';
      case 'tip': return '💡';
      case 'prediction': return '🔮';
      case 'comparison': return '📊';
      default: return '📌';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-red-500 bg-red-50 dark:bg-red-950';
      case 'medium': return 'border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950';
      case 'low': return 'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950';
      default: return 'border-l-4 border-gray-500';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative hover:text-info">
          🔔 Sugerencias
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>💡 Sugerencias Inteligentes</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={generateInsights} disabled={loading} className="flex-1">
              {loading ? 'Analizando...' : '🔄 Generar Sugerencias'}
            </Button>
          </div>

          {insights.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No hay sugerencias disponibles</p>
              <p className="text-sm mt-2">Haz clic en &quot;Generar Sugerencias&quot; para analizar tus gastos</p>
            </div>
          ) : (
            <div className="space-y-3">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className={`p-4 rounded-lg ${getPriorityColor(insight.priority)} ${
                    insight.is_read ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{getIcon(insight.type)}</span>
                        <h4 className="font-semibold text-foreground">{insight.title}</h4>
                      </div>
                      <p className="text-sm text-foreground/80">{insight.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(insight.created_at).toLocaleDateString('es-MX', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      {!insight.is_read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(insight.id)}
                          className="text-xs"
                        >
                          ✓ Leído
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteInsight(insight.id)}
                        className="text-xs text-red-600"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
      
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureName="Sugerencias Inteligentes con IA"
      />
    </Dialog>
  );
}

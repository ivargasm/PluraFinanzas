'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/Store';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../components/ProtectedRoutes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { API_URL } from '../lib/constants';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ProfilePage() {
  const { user, userValid, logout } = useAuthStore();
  const router = useRouter();
  const [cancelLoading, setCancelLoading] = useState(false);

  // Refrescar datos del usuario al cargar la página
  useEffect(() => {
    userValid();
  }, [userValid]);

  const handleCancelSubscription = async () => {
    setCancelLoading(true);
    try {
      const res = await fetch(`${API_URL}/payments/cancel-subscription`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || 'Error al cancelar suscripción');
      }

      toast.success('✅ Suscripción cancelada');
      // Refrescar datos del usuario para actualizar el estado
      setTimeout(() => userValid(), 1000);
    } catch (error) {
      console.error('Error:', error);
      toast.error((error as Error).message || 'Error al cancelar suscripción');
    } finally {
      setCancelLoading(false);
    }
  };

  const isPremium = user?.plan === 'premium';
  const subscriptionEndsAt = user?.subscription_ends_at
    ? format(new Date(user.subscription_ends_at), "d 'de' MMMM 'de' yyyy", { locale: es })
    : null;

  const displayStatus = user?.subscription_status === 'active'
    ? '✅ Activa'
    : user?.subscription_status === 'cancel_at_period_end'
    ? `⏳ Cancelado — acceso hasta ${subscriptionEndsAt ?? 'la fecha de término'}`
    : user?.subscription_status || 'N/A';

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-2xl mx-auto px-4 pb-8 space-y-6">
          {/* Información Personal */}
          <Card>
            <CardHeader>
              <CardTitle>👤 Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Usuario</p>
                <p className="text-lg font-semibold">{user?.username}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-lg font-semibold">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rol</p>
                <p className="text-lg font-semibold capitalize">{user?.role}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ID Stripe</p>
                <p className="text-sm font-mono text-muted-foreground break-all">
                  {user?.stripe_customer_id || 'No vinculado'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Plan y Suscripción */}
          <Card className={isPremium ? 'border-amber-500 bg-amber-50 dark:bg-amber-950' : ''}>
            <CardHeader>
              <CardTitle>💳 Plan y Suscripción</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Plan Actual</p>
                  <p className="text-2xl font-bold">
                    {isPremium ? (
                      <span className="text-amber-600 dark:text-amber-400">Premium 🚀</span>
                    ) : (
                      <span className="text-blue-600 dark:text-blue-400">Free</span>
                    )}
                  </p>
                </div>
                {isPremium && (
                  <div className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                    ✅ Activo
                  </div>
                )}
              </div>

              {isPremium && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Estado</p>
                    <p className="text-lg font-semibold">{displayStatus}</p>
                  </div>

                  {subscriptionEndsAt && (
                    <div>
                      <p className="text-sm text-muted-foreground">Renovación</p>
                      <p className="text-lg font-semibold">{subscriptionEndsAt}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-3">Acciones</p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          ❌ Cancelar Plan Premium
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Cancelar Plan Premium?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">
                            Al cancelar tu plan Premium, perderás acceso a:
                          </p>
                          <ul className="ml-4 space-y-1 text-sm list-disc list-inside">
                            <li className="text-muted-foreground">✖️ Bot de Telegram</li>
                            <li className="text-muted-foreground">✖️ Insights con IA</li>
                            <li className="text-muted-foreground">✖️ Reportes Avanzados</li>
                            <li className="text-muted-foreground">✖️ Exportar a CSV</li>
                            <li className="text-muted-foreground">✖️ Workspaces ilimitados</li>
                            <li className="text-muted-foreground">✖️ Miembros ilimitados</li>
                          </ul>
                          <p className="text-xs text-muted-foreground">
                            Esto es irreversible. Puedes volver a comprar Premium en cualquier momento.
                          </p>
                        </div>
                        <div className="flex gap-3 justify-end mt-4">
                          <AlertDialogCancel>No, mantener Premium</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleCancelSubscription}
                            disabled={cancelLoading || user?.subscription_status === 'cancel_at_period_end'}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {cancelLoading ? 'Cancelando...' : user?.subscription_status === 'cancel_at_period_end' ? 'Cancelación pendiente' : 'Sí, cancelar'}
                          </AlertDialogAction>
                        </div>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </>
              )}

              {!isPremium && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-3">Actualiza a Premium</p>
                  <Button className="w-full" onClick={() => router.push('/pricing')}>
                    Comprar Premium 🚀
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Beneficios Premium */}
          <Card>
            <CardHeader>
              <CardTitle>✨ Beneficios Premium</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 text-xl">✅</span>
                <div>
                  <p className="font-semibold">🤖 Bot de Telegram</p>
                  <p className="text-sm text-muted-foreground">Notificaciones en tiempo real</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 text-xl">✅</span>
                <div>
                  <p className="font-semibold">🧠 Insights con IA</p>
                  <p className="text-sm text-muted-foreground">Análisis inteligente de gastos</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 text-xl">✅</span>
                <div>
                  <p className="font-semibold">📊 Reportes Avanzados</p>
                  <p className="text-sm text-muted-foreground">Análisis profundos y tendencias</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 text-xl">✅</span>
                <div>
                  <p className="font-semibold">📥 Exportar a CSV</p>
                  <p className="text-sm text-muted-foreground">Descarga tus datos</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 text-xl">✅</span>
                <div>
                  <p className="font-semibold">♾️ Workspaces Ilimitados</p>
                  <p className="text-sm text-muted-foreground">Crea todos los que necesites</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 text-xl">✅</span>
                <div>
                  <p className="font-semibold">👥 Miembros Ilimitados</p>
                  <p className="text-sm text-muted-foreground">Invita a todo tu equipo</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cerrar Sesión */}
          <Card>
            <CardHeader>
              <CardTitle>🚪 Sesión</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                className="w-full"
                onClick={logout}
              >
                Cerrar Sesión
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}

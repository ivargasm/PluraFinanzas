'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { API_URL } from '../lib/constants';

function LinkTelegramContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const chatId = searchParams.get('chat_id');
    
    if (!chatId) {
      setStatus('error');
      setMessage('Parámetro chat_id no encontrado');
      return;
    }

    const linkAccount = async () => {
      try {
        const res = await fetch(`${API_URL}/telegram/link?chat_id=${chatId}`, {
          method: 'POST',
          credentials: 'include',
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.detail || 'Error al vincular cuenta');
        }

        setStatus('success');
        setMessage('¡Cuenta vinculada exitosamente! Ahora puedes usar el bot de Telegram.');
      } catch (error: unknown) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Error al vincular cuenta');
      }
    };

    linkAccount();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-8 border rounded-lg bg-card text-center">
        {status === 'loading' && (
          <>
            <div className="text-4xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold mb-2">Vinculando cuenta...</h2>
            <p className="text-muted-foreground">Espera un momento</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-2 text-green-600">¡Éxito!</h2>
            <p className="text-muted-foreground mb-6">{message}</p>
            <p className="text-sm text-muted-foreground mb-4">
              Regresa a Telegram y empieza a registrar gastos.
            </p>
            <Button onClick={() => router.push('/dashboard')}>
              Ir al Dashboard
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-4xl mb-4">❌</div>
            <h2 className="text-2xl font-bold mb-2 text-destructive">Error</h2>
            <p className="text-muted-foreground mb-6">{message}</p>
            <Button onClick={() => router.push('/dashboard')}>
              Ir al Dashboard
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default function LinkTelegramPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <LinkTelegramContent />
    </Suspense>
  );
}

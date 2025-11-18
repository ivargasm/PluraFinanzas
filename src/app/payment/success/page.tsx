"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Aquí podrías verificar el session_id con el backend
    // para confirmar que el pago fue exitoso
  }, [sessionId]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 dark:from-teal-950 dark:to-teal-900 pt-20 flex items-center justify-center px-6">
      <div className="bg-white dark:bg-teal-900 rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <CheckCircle className="w-16 h-16 text-green-500 animate-bounce" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          ¡Éxito!
        </h1>

        <p className="text-gray-600 dark:text-teal-100 mb-2">
          Tu suscripción a Plan Premium ha sido activada.
        </p>

        <p className="text-gray-500 dark:text-teal-200 text-sm mb-8">
          Ya puedes disfrutar de todas las funciones premium en tu workspace.
        </p>

        <div className="space-y-3">
          <Link href="/dashboard" className="block">
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2">
              Ir al Dashboard
            </Button>
          </Link>

          <Link href="/pricing" className="block">
            <Button
              variant="outline"
              className="w-full border-gray-300 text-gray-700 dark:border-teal-600 dark:text-teal-100 hover:bg-gray-100 dark:hover:bg-teal-800"
            >
              Ver Planes
            </Button>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-teal-700">
          <p className="text-xs text-gray-500 dark:text-teal-300">
            Si tienes problemas, contáctanos en support@plurafinanzas.com
          </p>
        </div>
      </div>
    </main>
  );
}

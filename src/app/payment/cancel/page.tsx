"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CancelPage() {


  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-teal-950 dark:to-teal-900 pt-20 flex items-center justify-center px-6">
      <div className="bg-white dark:bg-teal-900 rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <XCircle className="w-16 h-16 text-red-500" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Pago Cancelado
        </h1>

        <p className="text-gray-600 dark:text-teal-100 mb-2">
          Tu pago ha sido cancelado.
        </p>

        <p className="text-gray-500 dark:text-teal-200 text-sm mb-8">
          No se realizó ningún cargo. Puedes intentarlo de nuevo cuando lo desees.
        </p>

        <div className="space-y-3">
          <Link href="/pricing" className="block">
            <Button className="w-full bg-coral-500 hover:bg-coral-600 text-white font-semibold py-2">
              Volver a Planes
            </Button>
          </Link>

          <Link href="/dashboard" className="block">
            <Button
              variant="outline"
              className="w-full border-gray-300 text-gray-700 dark:border-teal-600 dark:text-teal-100 hover:bg-gray-100 dark:hover:bg-teal-800"
            >
              Ir al Dashboard
            </Button>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-teal-700">
          <p className="text-xs text-gray-500 dark:text-teal-300">
            Si necesitas ayuda, contáctanos en support@plurafinanzas.com
          </p>
        </div>
      </div>
    </main>
  );
}

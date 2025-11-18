"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/Store";
import { Loader2, CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const { userValid, user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleSuccess = async () => {
      try {
        // Refrescar datos del usuario desde el backend
        // Esto obtiene el plan actualizado a "premium" desde la BD
        await userValid();
        
        // Esperar 2 segundos y redirigir al dashboard
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } catch (error) {
        console.error("Error al refrescar datos:", error);
        // Incluso si hay error, redirigir al dashboard
        setTimeout(() => {
          router.push("/dashboard");
        }, 2500);
      } finally {
        setLoading(false);
      }
    };

    handleSuccess();
  }, [userValid, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-teal-900 rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          {loading ? (
            <Loader2 className="w-12 h-12 text-coral-500 animate-spin" />
          ) : (
            <CheckCircle className="w-12 h-12 text-green-500" />
          )}
        </div>
        <h1 className="text-2xl font-bold text-teal-900 dark:text-white mb-3">
          {loading ? "¡Pago Exitoso!" : "¡Cuenta Activada!"}
        </h1>
        <p className="text-gray-600 dark:text-teal-200 mb-6">
          {loading
            ? "Tu plan Premium está siendo activado. Te estamos redirigiendo al dashboard..."
            : `Tu plan ${user?.plan === "premium" ? "Premium" : "Gratuito"} está listo. Redirigiendo...`}
        </p>
        <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg text-sm">
          {loading ? "Cargando tu cuenta..." : "Finalizando..."}
        </div>
      </div>
    </div>
  );
}

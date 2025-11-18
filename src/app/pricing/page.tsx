"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { useAuthStore } from "../store/Store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { API_URL } from "../lib/constants";
import { createCheckoutSession } from "../lib/api";

const pricingPlans = [
  {
    name: "Plan Gratuito",
    price: "$0",
    period: "/mes",
    description: "Perfecto para comenzar",
    cta: "Comenzar Gratis",
    highlighted: false,
    features: [
      { name: "1 Workspace", included: true },
      { name: "2 Miembros por workspace", included: true },
      { name: "Transacciones ilimitadas", included: true },
      { name: "Categorías ilimitadas", included: true },
      { name: "Bot de Telegram", included: false },
      { name: "Reportes Avanzados", included: false },
      { name: "Exportar a CSV", included: false },
      { name: "Sugerencias con IA", included: false },
      { name: "Soporte", included: true, detail: "Email" },
    ],
  },
  {
    name: "Plan Premium",
    price: "$9.99",
    period: "/mes",
    description: "Todo lo que necesitas",
    cta: "Actualizar a Premium",
    highlighted: true,
    features: [
      { name: "Workspaces ilimitados", included: true },
      { name: "Miembros ilimitados", included: true },
      { name: "Transacciones ilimitadas", included: true },
      { name: "Categorías ilimitadas", included: true },
      { name: "Bot de Telegram", included: true },
      { name: "Reportes Avanzados", included: true },
      { name: "Exportar a CSV", included: true },
      { name: "Sugerencias con IA", included: true },
      { name: "Soporte", included: true, detail: "Prioritario" },
    ],
  },
];

const faqItems = [
  {
    question: "¿Puedo cambiar de plan después?",
    answer:
      "Sí, puedes cambiar o cancelar tu suscripción en cualquier momento desde la configuración de tu cuenta.",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer:
      "Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express) a través de Stripe.",
  },
  {
    question: "¿Hay período de prueba?",
    answer:
      "No hay período de prueba, pero puedes comenzar con el plan gratuito sin necesidad de tarjeta de crédito.",
  },
  {
    question: "¿Qué pasa si cancelo mi suscripción?",
    answer:
      "Tu workspace pasará al plan gratuito. No perderás tus datos, pero tendrás acceso limitado a funciones premium.",
  },
  {
    question: "¿Se puede compartir una suscripción?",
    answer:
      "Cada usuario necesita su propia suscripción. Sin embargo, todos los miembros de un workspace premium pueden usar las funciones premium.",
  },
  {
    question: "¿Hay descuentos por volumen?",
    answer:
      "Contáctanos para hablar sobre planes empresariales y descuentos especiales.",
  },
];

export default function PricingPage() {
  const { userAuth, user } = useAuthStore();
  const router = useRouter();

  const handleUpgrade = async () => {
    if (!userAuth) {
      router.push("/auth/register");
      return;
    }

    if (user?.plan === "premium") {
      toast.info("Ya tienes plan Premium");
      router.push("/dashboard");
      return;
    }

    try {
      // Llamar a través de la API centralizada usando cookies
      const data = await createCheckoutSession(API_URL);
      
      // Redirigir a Stripe Checkout
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        toast.error("No se pudo obtener la URL de pago");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "Error al procesar el pago");
    }
  };

  const handleGetStarted = () => {
    if (userAuth) {
      router.push("/dashboard");
    } else {
      router.push("/auth/register");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-teal-950 pt-20">
      {/* Hero Section */}
      <section className="py-12 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-teal-900 dark:text-white mb-4">
          Planes Simples y Transparentes
        </h1>
        <p className="text-xl text-gray-600 dark:text-teal-100 mb-8 max-w-2xl mx-auto">
          Elige el plan que mejor se adapte a tus necesidades. Sin sorpresas, sin compromisos a largo plazo.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative flex flex-col p-8 transition-all duration-300 ${
                  plan.highlighted
                    ? "md:scale-105 border-2 border-coral-500 shadow-xl"
                    : "border border-gray-200 dark:border-teal-700 hover:shadow-lg"
                } dark:bg-teal-900`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-coral-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    ⭐ Más Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-teal-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 dark:text-teal-200 text-sm mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold text-teal-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 dark:text-teal-200">
                      {plan.period}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={
                    plan.price === "$0" ? handleGetStarted : handleUpgrade
                  }
                  className={`w-full mb-8 font-semibold py-2 rounded-lg transition ${
                    plan.highlighted
                      ? "bg-coral-500 hover:bg-coral-600 text-white"
                      : "bg-teal-600 hover:bg-teal-700 text-white"
                  }`}
                >
                  {plan.cta}
                </Button>

                <div className="space-y-4 flex-1">
                  {plan.features.map((feature) => (
                    <div key={feature.name} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 dark:text-teal-700 flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included
                            ? "text-gray-700 dark:text-teal-100"
                            : "text-gray-500 dark:text-teal-300"
                        }`}
                      >
                        {feature.name}
                        {feature.detail && (
                          <span className="block text-xs text-gray-500 dark:text-teal-300">
                            ({feature.detail})
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Features Comparison Table */}
          <div className="mt-16 bg-white dark:bg-teal-900 rounded-lg border border-gray-200 dark:border-teal-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-teal-700">
              <h2 className="text-2xl font-bold text-teal-900 dark:text-white">
                Comparativa Detallada
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-teal-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Característica
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      Gratuito
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      Premium
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-teal-700">
                  {pricingPlans[0].features.map((feature) => (
                    <tr
                      key={feature.name}
                      className="hover:bg-gray-50 dark:hover:bg-teal-800 transition"
                    >
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-teal-100">
                        {feature.name}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 dark:text-teal-700 mx-auto" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 bg-white dark:bg-teal-900">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-teal-900 dark:text-white text-center mb-12">
            Preguntas Frecuentes
          </h2>

          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <details
                key={index}
                className="group bg-gray-50 dark:bg-teal-800 rounded-lg border border-gray-200 dark:border-teal-700 p-6 cursor-pointer transition hover:shadow-md"
              >
                <summary className="flex items-center justify-between font-semibold text-teal-900 dark:text-white">
                  <span>{item.question}</span>
                  <span className="text-coral-500 transition group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <p className="mt-4 text-gray-600 dark:text-teal-100 leading-relaxed">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-teal-600 to-teal-800 dark:from-teal-800 dark:to-teal-900">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para controlar tus finanzas?
          </h2>
          <p className="text-teal-100 mb-8 text-lg">
            Comienza hoy mismo. Es gratis, sin tarjeta de crédito requerida.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleGetStarted}
              className="bg-white text-teal-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg transition"
            >
              Registrarse Gratis
            </Button>
            {!userAuth && (
              <Link
                href="/"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-teal-600 font-semibold px-8 py-3 rounded-lg transition flex items-center justify-center"
              >
                Volver al Inicio
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

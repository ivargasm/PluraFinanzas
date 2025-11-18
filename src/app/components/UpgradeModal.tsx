"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

export default function UpgradeModal({ isOpen, onClose, featureName }: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-teal-900 rounded-lg shadow-lg max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-coral-500 to-coral-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">🔒 Función Premium</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-coral-100 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
          <p className="text-gray-600 dark:text-teal-100">
            La función <span className="font-semibold">{featureName}</span> está disponible solo en el plan <span className="font-semibold">Premium</span>.
          </p>

          <div className="bg-gray-50 dark:bg-teal-800 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-teal-900 dark:text-white mb-3">
              Desbloquea con Premium:
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-teal-100">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Workspaces ilimitados
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Miembros ilimitados
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Bot de Telegram
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Reportes Avanzados
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Exportar a CSV
              </li>
            </ul>
          </div>

          <div className="pt-2">
            <p className="text-lg font-bold text-teal-900 dark:text-white">
              $9.99 <span className="text-sm font-normal">/mes</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-teal-800 px-6 py-4 flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-gray-300 dark:border-teal-600 text-gray-700 dark:text-teal-100 hover:bg-gray-100 dark:hover:bg-teal-700"
          >
            Después
          </Button>
          <Link href="/pricing" className="flex-1">
            <Button
              onClick={onClose}
              className="w-full bg-coral-500 hover:bg-coral-600 text-white font-semibold"
            >
              Ver Planes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

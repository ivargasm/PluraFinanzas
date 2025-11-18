"use client";

import { Lock } from "lucide-react";
import Link from "next/link";

interface PremiumFeatureBlockProps {
  featureName: string;
  description?: string;
  planRequired?: string;
}

export function PremiumFeatureBlock({
  featureName,
  description,
  planRequired = "Premium",
}: PremiumFeatureBlockProps) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-teal-900 dark:to-teal-800 rounded-lg border border-dashed border-gray-300 dark:border-teal-700 p-8 text-center flex flex-col items-center justify-center min-h-48">
      <Lock className="w-12 h-12 text-gray-400 dark:text-teal-600 mb-4" />
      <h3 className="text-lg font-semibold text-gray-700 dark:text-teal-100 mb-2">
        🔒 {featureName}
      </h3>
      {description && (
        <p className="text-gray-600 dark:text-teal-200 text-sm mb-4">
          {description}
        </p>
      )}
      <p className="text-gray-600 dark:text-teal-200 text-sm mb-6">
        Esta función está disponible solo en el plan <span className="font-semibold">{planRequired}</span>
      </p>
      <Link
        href="/pricing"
        className="bg-coral-500 hover:bg-coral-600 text-white px-6 py-2 rounded-lg font-semibold transition text-sm"
      >
        Ver Planes
      </Link>
    </div>
  );
}

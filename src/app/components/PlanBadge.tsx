"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface PlanBadgeProps {
  plan: "free" | "premium";
  showUpgradeButton?: boolean;
}

export default function PlanBadge({ plan, showUpgradeButton = true }: PlanBadgeProps) {

  if (plan === "premium") {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="success" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
          ⭐ Premium
        </Badge>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline">Plan Gratuito</Badge>
      {showUpgradeButton && (
        <Link
          href="/pricing"
          className="text-xs font-semibold text-coral-500 hover:text-coral-600 dark:hover:text-coral-400 transition"
        >
          Actualizar →
        </Link>
      )}
    </div>
  );
}

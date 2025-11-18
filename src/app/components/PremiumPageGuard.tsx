import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/Store";
import UpgradeModal from "@/app/components/UpgradeModal";

interface PremiumPageProps {
  children: React.ReactNode;
  showModalOnFree?: boolean; // Si es true, muestra modal; si es false, redirige
}

/**
 * Wrapper para proteger páginas que requieren Premium
 * Muestra modal o redirige según la configuración
 */
export function PremiumPageGuard({
  children,
  showModalOnFree = false,
}: PremiumPageProps) {
  const { user, userAuth } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const [showModal, setShowModal] = React.useState(false);

  useEffect(() => {
    if (!userAuth) {
      router.push("/auth/login");
      return;
    }

    if (!user) {
      setIsLoading(false);
      return;
    }

    const isPremium = user.plan === "premium";

    if (!isPremium) {
      if (showModalOnFree) {
        setShowModal(true);
        setIsLoading(false);
      } else {
        // Redirigir a pricing
        router.push("/pricing?upgrade_required=true");
      }
    } else {
      setIsLoading(false);
    }
  }, [userAuth, user, router, showModalOnFree]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
        </div>
      </div>
    );
  }

  const userPlan = user?.plan;
  if (!userPlan || userPlan === "free") {
    if (showModalOnFree) {
      return (
        <>
          {children}
          <UpgradeModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            featureName="Esta funcionalidad"
          />
        </>
      );
    }
    return null;
  }

  return <>{children}</>;
}

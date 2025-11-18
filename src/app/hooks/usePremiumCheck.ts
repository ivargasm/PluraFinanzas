import { useWorkspaceStore } from "../store/workspaceStore";
import { useAuthStore } from "../store/Store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Hook para verificar si un usuario tiene acceso a features premium
 * Redirige a pricing si no tiene acceso
 */
export function usePremiumCheck() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Verificar si el usuario tiene plan premium
    const hasPremium = user.plan === "premium";
    setIsPremium(hasPremium);
    setIsLoading(false);

    // Si no tiene premium, redirigir a pricing
    if (!hasPremium) {
      router.push("/pricing?upgrade_required=true");
    }
  }, [user, router]);

  return { isPremium, isLoading };
}

/**
 * Hook para bloquear features específicas
 * Muestra modal de upgrade en lugar de redirigir
 * Valida lógica híbrida: user.plan OR workspace.plan
 */
export function usePremiumFeatureGuard() {
  const { user } = useAuthStore();
  const { currentWorkspace } = useWorkspaceStore();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const checkPremium = () => {
    if (!user) {
      setShowUpgradeModal(true);
      return false;
    }

    // Validación híbrida: user es premium O workspace es premium
    const hasUserPremium = user.plan === "premium";
    const hasWorkspacePremium = currentWorkspace?.plan === "premium";
    
    if (!hasUserPremium && !hasWorkspacePremium) {
      setShowUpgradeModal(true);
      return false;
    }
    return true;
  };

  return {
    isPremium: user?.plan === "premium" || currentWorkspace?.plan === "premium",
    showUpgradeModal,
    setShowUpgradeModal,
    checkPremium,
  };
}

/**
 * Hook para verificar límites de workspace (Free plan)
 */
export function useWorkspaceLimit() {
  const { workspaces } = useWorkspaceStore();
  const { user } = useAuthStore();

  const canCreateWorkspace = (): boolean => {
    if (!user) return false;

    // Si es Premium, no hay límite
    if (user.plan === "premium") {
      return true;
    }

    // Si es Free, solo puede tener 1 workspace
    const userWorkspaceCount = (workspaces ?? []).filter((ws) => {
      return ws.owner_id === parseInt(user.id);
    }).length;

    return userWorkspaceCount < 1;
  };

  return { canCreateWorkspace };
}

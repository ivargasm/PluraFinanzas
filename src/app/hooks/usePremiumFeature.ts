import { useState, useCallback } from "react";

export function usePremiumFeature() {
  const [upgradeModal, setUpgradeModal] = useState({
    isOpen: false,
    featureName: "",
  });

  const showUpgradePrompt = useCallback((featureName: string) => {
    setUpgradeModal({
      isOpen: true,
      featureName,
    });
  }, []);

  const closeUpgradePrompt = useCallback(() => {
    setUpgradeModal({
      isOpen: false,
      featureName: "",
    });
  }, []);

  return {
    upgradeModal,
    showUpgradePrompt,
    closeUpgradePrompt,
  };
}

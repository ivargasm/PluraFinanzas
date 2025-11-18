import React, { useState } from "react";
import { useWorkspaceStore } from "../store/workspaceStore";
import { usePremiumFeatureGuard } from "../hooks/usePremiumCheck";
import { API_URL } from "../lib/constants";
import UpgradeModal from "./UpgradeModal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function TelegramLinkModal() {
  const { currentWorkspace } = useWorkspaceStore();
  const { isPremium, checkPremium, showUpgradeModal, setShowUpgradeModal } =
    usePremiumFeatureGuard();
  const [open, setOpen] = useState(false);
  const [telegramCode, setTelegramCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLinkTelegram = async () => {
    // Validar Premium
    if (!checkPremium()) return;

    if (!telegramCode.trim()) {
      toast.error("Ingresa el código de Telegram");
      return;
    }

    if (!currentWorkspace) {
      toast.error("Selecciona un workspace");
      return;
    }

    setLoading(true);
    try {
      // Extraer chat_id si es una URL, si no usar el valor directamente
      let chatId = telegramCode;
      try {
        const url = new URL(telegramCode);
        chatId = url.searchParams.get("chat_id") || telegramCode;
      } catch {
        // No es una URL válida, usar el valor tal cual
      }

      const res = await fetch(
        `${API_URL}/telegram/link?chat_id=${chatId}&workspace_id=${currentWorkspace.id}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (res.status === 403) {
        // No tiene Premium
        setShowUpgradeModal(true);
        return;
      }

      if (res.ok) {
        toast.success("✅ Telegram vinculado exitosamente");
        setTelegramCode("");
        setOpen(false);
      } else {
        const error = await res.json();
        toast.error(error.detail || "Error al vincular Telegram");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al vincular Telegram");
    } finally {
      setLoading(false);
    }
  };

  const openTelegramBot = () => {
    // Abre el bot de Telegram (reemplaza con tu nombre de usuario del bot)
    window.open("https://t.me/plurafinanzas_bot", "_blank");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2 hover:text-info">
            🤖 Vincular Telegram
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>🤖 Vincular Bot de Telegram</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-100 font-semibold mb-2">
                Pasos:
              </p>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-sm text-blue-900 dark:text-blue-100">
                <li>Abre el bot de Telegram</li>
                <li>Escribe <code className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">/start</code></li>
                <li>El bot enviará una URL (ej: http://localhost:3000/link-telegram?chat_id=354567247)</li>
                <li>Copia esa URL o solo el número del chat_id</li>
                <li>Pégalo abajo y haz clic en &quot;Vincular&quot;</li>
              </ol>
            </div>

            <Button
              className="w-full bg-blue-500 hover:bg-blue-600"
              onClick={openTelegramBot}
            >
              🚀 Abrir Telegram Bot
            </Button>

            <div>
              <label className="text-sm font-medium">
                URL o Chat ID de Telegram:
              </label>
              <input
                type="text"
                value={telegramCode}
                onChange={(e) => setTelegramCode(e.target.value)}
                placeholder="Pega la URL o el número: 354567247"
                className="w-full mt-2 px-3 py-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <Button
              onClick={handleLinkTelegram}
              disabled={loading || !isPremium}
              className="w-full"
            >
              {loading ? "Vinculando..." : "✅ Vincular"}
            </Button>

            {!isPremium && (
              <p className="text-xs text-red-600 dark:text-red-400">
                ⚠️ Telegram requiere plan Premium
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureName="Bot de Telegram"
      />
    </>
  );
}

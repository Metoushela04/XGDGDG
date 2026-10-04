"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { resendVerificationAction } from "@/app/(auth)/actions";
import { AuthCard, FormAlert } from "./ui";

export function VerifyEmailPanel({ email }: { email?: string }) {
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const resend = () => {
    if (!email) return;
    setFeedback(null);
    startTransition(async () => {
      const res = await resendVerificationAction({ email });
      setFeedback(res.ok ? { type: "success", text: res.message ?? "E-mail renvoyé." } : { type: "error", text: res.error });
    });
  };

  return (
    <AuthCard
      title="Vérifie ta boîte mail"
      subtitle={
        email ? (
          <>
            Nous avons envoyé un lien de confirmation à <span className="text-text">{email}</span>.
          </>
        ) : (
          "Nous t'avons envoyé un lien de confirmation."
        )
      }
    >
      <div className="space-y-5">
        <div className="flex justify-center">
          <MailCheck className="w-12 h-12 text-accent" aria-hidden="true" />
        </div>
        <p className="text-sm text-muted text-center">
          Clique sur le lien dans l&apos;e-mail pour activer ton compte. Pense à regarder tes spams.
        </p>

        {feedback && <FormAlert type={feedback.type}>{feedback.text}</FormAlert>}

        {email && (
          <button
            type="button"
            onClick={resend}
            disabled={pending}
            className="w-full py-3 border border-[#222222] rounded-xl hover:border-accent/30 transition-all disabled:opacity-60"
          >
            {pending ? "Envoi…" : "Renvoyer l'e-mail"}
          </button>
        )}

        <div className="text-center">
          <Link href="/connexion" className="text-sm text-accent hover:text-accent-dim transition-colors">
            ← Retour à la connexion
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}

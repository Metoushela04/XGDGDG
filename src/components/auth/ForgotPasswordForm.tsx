"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestPasswordResetAction } from "@/app/(auth)/actions";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validation/auth";
import { AuthCard, Field, FormAlert, SubmitButton } from "./ui";

export function ForgotPasswordForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = (values: ForgotPasswordInput) => {
    setError(null);
    startTransition(async () => {
      const res = await requestPasswordResetAction(values);
      if (!res.ok) return setError(res.error);
      setDone(res.message ?? "Vérifie ta boîte mail.");
    });
  };

  return (
    <AuthCard title="Mot de passe oublié" subtitle="Entrez votre email pour recevoir un lien de réinitialisation.">
      {done ? (
        <FormAlert type="success">{done}</FormAlert>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {error && <FormAlert type="error">{error}</FormAlert>}
          <Field
            id="email"
            type="email"
            label="Email"
            autoComplete="email"
            placeholder="votre@email.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <SubmitButton pending={pending}>Envoyer le lien</SubmitButton>
        </form>
      )}
      <div className="mt-6 text-center">
        <Link href="/connexion" className="text-sm text-accent hover:text-accent-dim transition-colors">
          ← Retour à la connexion
        </Link>
      </div>
    </AuthCard>
  );
}

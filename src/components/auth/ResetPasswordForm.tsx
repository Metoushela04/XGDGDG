"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePasswordAction } from "@/app/(auth)/actions";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validation/auth";
import { AuthCard, Field, FormAlert, SubmitButton } from "./ui";

export function ResetPasswordForm({ hasSession }: { hasSession: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = (values: ResetPasswordInput) => {
    setError(null);
    startTransition(async () => {
      const res = await updatePasswordAction(values);
      if (!res.ok) return setError(res.error);
      router.push(res.redirectTo ?? "/dashboard");
      router.refresh();
    });
  };

  if (!hasSession) {
    return (
      <AuthCard title="Lien expiré" subtitle="Ce lien de réinitialisation n'est plus valable.">
        <Link
          href="/mot-de-passe-oublie"
          className="block w-full py-4 text-center bg-accent text-background font-medium rounded-xl hover:bg-accent-dim transition-all glow-accent"
        >
          Demander un nouveau lien
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Nouveau mot de passe" subtitle="Choisis un mot de passe d'au moins 8 caractères.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {error && <FormAlert type="error">{error}</FormAlert>}
        <Field
          id="password"
          type="password"
          label="Nouveau mot de passe"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Field
          id="confirmPassword"
          type="password"
          label="Confirmer le mot de passe"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <SubmitButton pending={pending}>Enregistrer</SubmitButton>
      </form>
    </AuthCard>
  );
}

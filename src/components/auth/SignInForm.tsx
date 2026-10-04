"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInAction } from "@/app/(auth)/actions";
import { signInSchema, type SignInInput } from "@/lib/validation/auth";
import { createClient } from "@/lib/supabase/client";
import { AuthCard, Divider, Field, FormAlert, GoogleButton, SubmitButton } from "./ui";

const URL_ERRORS: Record<string, string> = {
  suspended: "Ce compte est suspendu. Contacte le support.",
  "lien-invalide": "Ce lien est invalide ou a expiré. Reconnecte-toi ou redemande un lien.",
  callback: "La connexion a échoué. Réessaie.",
};

export function SignInForm({ next, urlError }: { next?: string; urlError?: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(urlError ? (URL_ERRORS[urlError] ?? null) : null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({ resolver: zodResolver(signInSchema), defaultValues: { next } });

  const onSubmit = (values: SignInInput) => {
    setError(null);
    startTransition(async () => {
      const res = await signInAction({ ...values, next });
      if (!res.ok) return setError(res.error);
      router.push(res.redirectTo ?? "/dashboard");
      router.refresh();
    });
  };

  const signInWithGoogle = async () => {
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ""}`;
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
    if (error) setError("Connexion Google indisponible pour le moment.");
  };

  return (
    <AuthCard
      title="Bon retour"
      subtitle={
        <>
          Pas de compte ?{" "}
          <Link href="/inscription" className="text-accent hover:text-accent-dim transition-colors">
            S&apos;inscrire
          </Link>
        </>
      }
    >
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

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Mot de passe
            </label>
            <Link href="/mot-de-passe-oublie" className="text-xs text-accent hover:text-accent-dim transition-colors">
              Mot de passe oublié ?
            </Link>
          </div>
          <Field
            id="password"
            type="password"
            label=""
            autoComplete="current-password"
            placeholder="Votre mot de passe"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        <SubmitButton pending={pending}>Se connecter</SubmitButton>
      </form>

      <Divider />
      <GoogleButton onClick={signInWithGoogle} disabled={pending} />
    </AuthCard>
  );
}

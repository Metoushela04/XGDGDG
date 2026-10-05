"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpAction } from "@/app/(auth)/actions";
import { getAuthCallbackUrl } from "@/lib/auth/callback-url";
import { signUpSchema, type SignUpInput } from "@/lib/validation/auth";
import { createClient } from "@/lib/supabase/client";
import { AuthCard, Divider, Field, FormAlert, GoogleButton, SubmitButton } from "./ui";

export function SignUpForm({ urlError }: { urlError?: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(
    urlError === "conditions"
      ? "Pour créer un compte avec Google, accepte d'abord les conditions ci-dessous."
      : null,
  );

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { acceptTerms: false },
  });

  const onSubmit = (values: SignUpInput) => {
    setError(null);
    startTransition(async () => {
      const res = await signUpAction(values);
      if (!res.ok) return setError(res.error);
      router.push(res.redirectTo ?? "/verifier-email");
    });
  };

  // Google : la case des conditions doit être cochée avant de partir chez Google.
  const signUpWithGoogle = async () => {
    setError(null);
    const valid = await trigger("acceptTerms");
    if (!valid || !getValues("acceptTerms")) return;
    const supabase = createClient();
    const redirectTo = getAuthCallbackUrl({ accepted: "1" });
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
    if (error) setError("Inscription Google indisponible pour le moment.");
  };

  return (
    <AuthCard
      title="Créer un compte"
      subtitle={
        <>
          Déjà membre ?{" "}
          <Link href="/connexion" className="text-accent hover:text-accent-dim transition-colors">
            Se connecter
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {error && <FormAlert type="error">{error}</FormAlert>}

        <Field
          id="name"
          type="text"
          label="Nom complet"
          autoComplete="name"
          placeholder="Votre nom complet"
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <Field
          id="email"
          type="email"
          label="Email"
          autoComplete="email"
          placeholder="votre@email.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Field
          id="password"
          type="password"
          label="Mot de passe"
          autoComplete="new-password"
          placeholder="Min. 8 caractères"
          error={errors.password?.message}
          {...register("password")}
        />

        <div>
          <div className="flex items-start gap-3">
            <input type="checkbox" id="terms" className="mt-1 rounded" {...register("acceptTerms")} />
            <label htmlFor="terms" className="text-xs text-muted leading-relaxed">
              J&apos;accepte les{" "}
              <Link href="/conditions-generales-utilisation" target="_blank" className="text-accent hover:text-accent-dim">
                CGU
              </Link>
              , les{" "}
              <Link href="/conditions-generales-vente" target="_blank" className="text-accent hover:text-accent-dim">
                CGV
              </Link>{" "}
              et la{" "}
              <Link href="/politique-de-confidentialite" target="_blank" className="text-accent hover:text-accent-dim">
                Politique de confidentialité
              </Link>
            </label>
          </div>
          {errors.acceptTerms && <p className="mt-2 text-xs text-red-400">{errors.acceptTerms.message}</p>}
        </div>

        <SubmitButton pending={pending}>Créer mon compte</SubmitButton>
      </form>

      <Divider />
      <GoogleButton onClick={signUpWithGoogle} disabled={pending} />
    </AuthCard>
  );
}

// Vendix - Mot de passe oublié
import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = { title: "Mot de passe oublié — Vendix", robots: { index: false } };

export default function MotDePasseOubliePage() {
  return <ForgotPasswordForm />;
}

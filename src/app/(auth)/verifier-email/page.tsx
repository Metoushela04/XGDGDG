// Vendix - Vérifier son e-mail
import type { Metadata } from "next";
import { VerifyEmailPanel } from "@/components/auth/VerifyEmailPanel";

export const metadata: Metadata = { title: "Vérifie ta boîte mail — Vendix", robots: { index: false } };

export default async function VerifierEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  return <VerifyEmailPanel email={email} />;
}

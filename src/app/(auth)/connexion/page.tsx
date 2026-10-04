// Vendix - Connexion
import type { Metadata } from "next";
import { SignInForm } from "@/components/auth/SignInForm";
import { safeNext } from "@/lib/auth/safe-next";

export const metadata: Metadata = { title: "Connexion — Vendix", robots: { index: false } };

export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  return <SignInForm next={next ? safeNext(next) : undefined} urlError={error} />;
}

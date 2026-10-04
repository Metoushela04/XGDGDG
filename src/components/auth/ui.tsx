// Petits composants partagés par les formulaires d'authentification (style Vendix existant).
"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export const inputClass =
  "w-full px-4 py-3 bg-surface2 border border-[#222222] rounded-xl focus:border-accent/50 focus:outline-none transition-colors";

export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto px-6"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-8">
            <img src="/logo-mark.png" alt="Vendix" className="w-10 h-10" style={{ mixBlendMode: "screen" }} />
          </Link>
          <h1 className="font-display text-3xl font-bold mb-2">{title}</h1>
          <p className="text-sm text-muted">{subtitle}</p>
        </div>
        <div className="bg-surface border border-[#222222] rounded-2xl p-8">{children}</div>
      </motion.div>
    </div>
  );
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string };

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, error, id, ...props },
  ref,
) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium mb-2">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={inputClass}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});

export function FormAlert({ type, children }: { type: "error" | "success"; children: React.ReactNode }) {
  const styles =
    type === "error"
      ? "border-red-500/30 bg-red-500/10 text-red-300"
      : "border-green-500/30 bg-green-500/10 text-green-300";
  return (
    <div role={type === "error" ? "alert" : "status"} className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>
      {children}
    </div>
  );
}

export function SubmitButton({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-4 bg-accent text-background font-medium rounded-xl hover:bg-accent-dim transition-all glow-accent disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? "Veuillez patienter…" : children}
    </button>
  );
}

export function Divider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-[#222222]" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-surface px-4 text-xs text-muted">ou</span>
      </div>
    </div>
  );
}

export function GoogleButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full py-3 border border-[#222222] rounded-xl hover:border-accent/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
      Continuer avec Google
    </button>
  );
}

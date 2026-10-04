// Schémas Zod partagés : validation côté formulaire ET côté serveur (Server Actions).
import { z } from "zod";

const email = z.string().trim().toLowerCase().pipe(z.email("Adresse e-mail invalide."));
// 72 octets = limite de bcrypt utilisée par Supabase Auth
const password = z
  .string()
  .min(8, "Au moins 8 caractères.")
  .max(72, "72 caractères maximum.");

export const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Entre ton nom complet.").max(100, "Nom trop long."),
  email,
  password,
  acceptTerms: z.boolean().refine((v) => v === true, {
    message: "Tu dois accepter les CGU, les CGV et la Politique de confidentialité.",
  }),
});

export const signInSchema = z.object({
  email,
  password: z.string().min(1, "Entre ton mot de passe.").max(72),
  next: z.string().optional(),
});

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({ password, confirmPassword: z.string() })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

export const resendSchema = z.object({ email });

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Vendix — Votre stock illimité de produits digitaux prêts à vendre",
  description: "Débloquez la première banque de produits digitaux sous licence de revente. Téléchargez, déployez, gardez 100% de vos revenus.",
  keywords: ["PLR", "produits digitaux", "revente", "ebooks", "templates", "formations"],
  authors: [{ name: "Vendix" }],
  openGraph: {
    title: "Vendix — Produits digitaux prêts à revendre",
    description: "Téléchargez nos ressources clés en main et gardez 100% de votre chiffre d'affaires.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} font-body`}
      >
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kidscenter — Animasi Edukatif untuk Si Kecil",
  description:
    "Platform animasi edukatif berkualitas tinggi, aman, dan menyenangkan bagi anak-anak Indonesia.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    /*
     * suppressHydrationWarning diperlukan karena ThemeProvider
     * mengubah atribut data-theme di sisi client setelah mount.
     * Tanpa ini Next.js akan memunculkan hydration warning.
     */
    <html lang="id" className={nunito.variable} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
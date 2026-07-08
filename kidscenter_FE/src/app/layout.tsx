import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import "./landing.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import GlobalPopup from "@/components/GlobalPopup";

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
  icons: {
    icon: "/Mari.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={nunito.variable} data-theme="light" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col">
        <ConditionalLayout>
          {children}
          <GlobalPopup />
        </ConditionalLayout>
      </body>
    </html>
  );
}
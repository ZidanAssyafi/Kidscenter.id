import Link from "next/link";
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  tagline: React.ReactNode;
  desc: React.ReactNode;
  illustrationSrc?: string;
  illustrationAlt?: string;
}

export default function AuthLayout({
  children,
  tagline,
  desc,
  illustrationSrc = "/Mari.webp",
  illustrationAlt = "Mari",
}: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-content">
          <Link href="/" className="auth-logo">
            <img src="/logo.png" alt="Kidscenter" className="logo-img" />
          </Link>

          <div className="auth-illustration">
            <img src={illustrationSrc} alt={illustrationAlt} />
          </div>

          <h2 className="auth-tagline">{tagline}</h2>

          <p className="auth-desc">{desc}</p>
        </div>
      </div>

      <div className="auth-right">
        {children}
      </div>
    </div>
  );
}

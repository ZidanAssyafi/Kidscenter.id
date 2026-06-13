"use client";
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/profile" || pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <footer className="footer">
      <div className="footer-texture-overlay"></div>
      <div className="footer-wave">
        <svg viewBox="0 0 1440 140" preserveAspectRatio="none">
          <path className="wave-orange" d="M0,40 C240,120 480,-40 720,40 C960,-40 1200,120 1440,40 L1440,50 C1200,130 960,-30 720,50 C480,-30 240,130 0,50 Z" />
          <path className="wave-tosca" d="M0,50 C240,130 480,-30 720,50 C960,-30 1200,130 1440,50 L1440,60 C1200,140 960,-20 720,60 C480,-20 240,140 0,60 Z" />
          <path className="wave-bg" d="M0,60 C240,140 480,-20 720,60 C960,-20 1200,140 1440,60 L1440,145 L0,145 Z" />
        </svg>
      </div>

      <div className="footer-flex-container">
        <div className="footer-logo-wrap">
          <Image src="/logo.webp" alt="Kidscenter Logo" width={200} height={60} onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }} />
        </div>

        <div className="footer-socials">
          <a href="#" className="social-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            <span>@kidscenter.id</span>
          </a>
          <a href="#" className="social-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            <span>Kids Center Indonesia</span>
          </a>
          <a href="#" className="social-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            <span>Kidscenter.id</span>
          </a>
        </div>

        <div className="footer-mascot-wrap">
          <Image src="/images/mascot-footer.webp" alt="Kidscenter Mascot" width={200} height={300} onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }} />
        </div>
      </div>

      <p className="footer-copy">© 2026 <span>Kidscenter.id</span> — All rights reserved</p>
    </footer>
  );
}

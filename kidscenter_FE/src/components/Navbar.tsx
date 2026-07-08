"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { logoutUser } from "@/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pesanPopupOpen, setPesanPopupOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    setIsLoggedIn(false);
    setMobileMenuOpen(false);
    window.location.href = "/";
  };

  useEffect(() => {
    // Cek token: sessionStorage (akun demo) atau localStorage (akun database)
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const user = sessionStorage.getItem("user") || localStorage.getItem("user");
    if (token && user) {
      setIsLoggedIn(true);
    }

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname === "/profile" || pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <>
      {/* HEADER */}
      <nav className={`header-nav${scrolled ? " scrolled" : ""}`}>
        <div className="logo-text">
          <Image
            src="/logo.webp"
            alt="Kidscenter Logo"
            width={150}
            height={42}
            style={{ height: 42, width: "auto", display: "block" }}
            onError={(e) => {
              const t = e.currentTarget;
              t.style.display = "none";
              const sibling = t.nextElementSibling as HTMLElement;
              if (sibling) sibling.style.display = "flex";
            }}
          />
          <div className="logo-icon" style={{ display: "none" }}>🌟</div>
          <span>Kidscenter</span>
        </div>
        <ul className="header-nav-links">
          <li><Link href="/">Home</Link></li>
          <li>
            <Link href="/catalog" prefetch={false}>
              Catalog
            </Link>
          </li>
          <li>
            <Link 
              href="/portal"
              prefetch={false}
              onClick={(e) => {
                if (!isLoggedIn) {
                  e.preventDefault();
                  setPesanPopupOpen(true);
                  document.body.style.overflow = "hidden";
                }
              }}
            >
              Portal
            </Link>
          </li>
        </ul>
        <div className="header-nav-actions">
          {isLoggedIn ? (
            <Link href="/profile" className="btn-profile desktop-only" title="Profile" prefetch={false}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>
          ) : (
            <Link href="/login" className="btn-login" prefetch={false}>Masuk</Link>
          )}
          <button 
            className="mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </nav>

      {/* MOBILE DROPDOWN MENU */}
      <div className={`mobile-dropdown ${mobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-dropdown-links">
          {isLoggedIn && (
            <li><Link href="/profile" onClick={() => setMobileMenuOpen(false)}>Profil</Link></li>
          )}
          <li><Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
          <li>
            <Link 
              href="/catalog"
              prefetch={false}
              onClick={() => setMobileMenuOpen(false)}
            >
              Catalog
            </Link>
          </li>
          <li>
            <Link 
              href="/portal"
              prefetch={false}
              onClick={(e) => {
                setMobileMenuOpen(false);
                if (!isLoggedIn) {
                  e.preventDefault();
                  setPesanPopupOpen(true);
                  document.body.style.overflow = "hidden";
                }
              }}
            >
              Portal
            </Link>
          </li>
          {isLoggedIn && (
            <li><button className="mobile-logout-btn" onClick={handleLogout}>Logout</button></li>
          )}
        </ul>
      </div>

      {/* POPUP PESAN SEKARANG */}
      {pesanPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-backdrop" onClick={() => { setPesanPopupOpen(false); document.body.style.overflow = ""; }} />
          <div className="popup-box">
            <button className="popup-close" onClick={() => { setPesanPopupOpen(false); document.body.style.overflow = ""; }} aria-label="Tutup">✕</button>
            <div className="popup-pesan">
              <h2 className="popup-pesan-title">Masuk dulu, yuk!</h2>
              <p className="popup-pesan-desc">
                Untuk mengakses halaman ini, kamu perlu <strong>masuk ke akun</strong> terlebih dahulu. Proses cepat dan gratis!
              </p>
              <Link href="/login" className="btn-popup-login" prefetch={false} onClick={() => { setPesanPopupOpen(false); document.body.style.overflow = ""; }}>Masuk Sekarang</Link>
              <p className="popup-gate-alt">Belum punya akun? <Link href="/register" prefetch={false} onClick={() => { setPesanPopupOpen(false); document.body.style.overflow = ""; }}>Daftar gratis di sini</Link></p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

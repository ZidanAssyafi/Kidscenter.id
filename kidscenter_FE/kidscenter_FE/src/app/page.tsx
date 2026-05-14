"use client";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "../components/ThemeToggle";

const animations = [
  {
    id: 1,
    title: "Petualangan Bintang",
    description: "Ikuti perjalanan seru Bintang si kucing pemberani menjelajahi hutan ajaib yang penuh kejutan dan pelajaran berharga.",
    genre: "Petualangan",
    duration: "24 menit",
  },
  {
    id: 2,
    title: "Robot Kecil Riko",
    description: "Riko, robot mungil yang baru belajar tentang dunia manusia. Temukan kisah persahabatan yang menghangatkan hati.",
    genre: "Komedi",
    duration: "22 menit",
  },
  {
    id: 3,
    title: "Negeri Di Atas Awan",
    description: "Sebuah negeri tersembunyi di atas awan menyimpan rahasia besar. Bisakah Lila dan teman-temannya mengungkapnya?",
    genre: "Fantasi",
    duration: "26 menit",
  },
  {
    id: 4,
    title: "Sahabat Laut Biru",
    description: "Petualangan menyelam bersama Nemo si ikan berani dan kawanannya menghadapi tantangan di lautan dalam.",
    genre: "Edukasi",
    duration: "20 menit",
  },
  {
    id: 5,
    title: "Tim Pahlawan Cilik",
    description: "Lima anak dengan kekuatan berbeda bersatu melindungi kota mereka dari ancaman kejahatan yang misterius.",
    genre: "Aksi",
    duration: "25 menit",
  },
  {
    id: 6,
    title: "Ajaibnya Musim Semi",
    description: "Ketika musim semi tiba, bunga-bunga ajaib bermekaran dan membawa keajaiban ke seluruh desa kecil yang damai.",
    genre: "Drama",
    duration: "21 menit",
  },
];

const genreColors: Record<string, string> = {
  Petualangan: "#F04E23",
  Komedi: "#FFB800",
  Fantasi: "#1E2D6B",
  Edukasi: "#2ecc71",
  Aksi: "#F04E23",
  Drama: "#FFB800",
};

// ─── Types ───────────────────────────────────────────────────────────────────
type SelectedAnim = (typeof animations)[number] | null;

export default function LandingPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const trailerVideoRef = useRef<HTMLVideoElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const introRef = useRef<HTMLDivElement>(null);
  const [introVisible, setIntroVisible] = useState(false);

  // ─── Auth & Popup State ───────────────────────────────────────────────────
  // Replace `isLoggedIn` with your real auth logic (e.g. from context/session/cookie).
  // The toggle button at the bottom-right is for demo only — remove it in production.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedAnim, setSelectedAnim] = useState<SelectedAnim>(null);

  // ─── Scroll Handler ───────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ─── Card Intersection Observer ───────────────────────────────────────────
  useEffect(() => {
    const makeVisible = (index: number) => {
      setVisibleCards((prev) => (prev.includes(index) ? prev : [...prev, index]));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = cardRefs.current.indexOf(entry.target as HTMLDivElement);
          if (entry.isIntersecting && index !== -1) {
            setTimeout(() => makeVisible(index), index * 100);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -20px 0px" }
    );

    // Observe all cards
    cardRefs.current.forEach((ref) => ref && observer.observe(ref));

    // Fallback: manually check which cards are already in viewport on mount
    const checkOnMount = () => {
      cardRefs.current.forEach((ref, index) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (inViewport) setTimeout(() => makeVisible(index), index * 100);
      });
    };

    // Run immediately and also after a short delay to catch late renders
    checkOnMount();
    const t1 = setTimeout(checkOnMount, 100);
    const t2 = setTimeout(checkOnMount, 400);

    return () => {
      observer.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // ─── Intro Intersection Observer ─────────────────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIntroVisible(true); },
      { threshold: 0.2 }
    );
    if (introRef.current) observer.observe(introRef.current);
    return () => observer.disconnect();
  }, []);

  // ─── Stop trailer video when popup closes ─────────────────────────────────
  useEffect(() => {
    if (!popupOpen && trailerVideoRef.current) {
      trailerVideoRef.current.pause();
      trailerVideoRef.current.currentTime = 0;
    }
  }, [popupOpen]);

  // ─── Trap ESC key to close popup ─────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closePopup(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ─── Helpers ─────────────────────────────────────────────────────────────
  const openTrailer = (anim: (typeof animations)[number]) => {
    setSelectedAnim(anim);
    setPopupOpen(true);
    // Prevent body scroll while popup is open
    document.body.style.overflow = "hidden";
  };

  const closePopup = () => {
    setPopupOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <div
  style={{
    fontFamily: "'Nunito', 'Poppins', sans-serif",
    background: "var(--kc-bg)",
    minHeight: "100vh",
    overflowX: "hidden",
  }}
>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .header-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          transition: all 0.3s ease;
          padding: 20px 40px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .header-nav.scrolled {
          background: rgba(26, 26, 62, 0.95);
          backdrop-filter: blur(12px);
          padding: 14px 40px;
          box-shadow: 0 4px 30px rgba(0,0,0,0.3);
        }

        .logo-text {
          font-family: 'Fredoka One', cursive;
          font-size: 28px;
          color: #FFB800;
          letter-spacing: 1px;
          display: flex; align-items: center; gap: 10px;
        }
        .logo-icon {
          width: 42px; height: 42px;
          background: linear-gradient(135deg, #FFB800, #F04E23);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
        }

        .btn-login {
          background: transparent;
          border: 2px solid #FFB800;
          color: #FFB800;
          padding: 10px 28px;
          border-radius: 50px;
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }
        .btn-login:hover {
          background: #FFB800;
          color: var(--kc-bg);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255,184,0,0.4);
        }

        .hero-section {
          position: relative;
          height: 100vh;
          min-height: 600px;
          overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        .hero-video {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          z-index: 0;
        }
        .hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(26,26,62,0.5) 0%, rgba(26,26,62,0.3) 50%, rgba(26,26,62,0.9) 100%);
          z-index: 1;
        }
        .hero-placeholder {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, var(--kc-bg) 0%, #1E2D6B 50%, #0d1a4a 100%);
          display: flex; align-items: center; justify-content: center;
          z-index: 0;
        }
        .hero-content {
          position: relative; z-index: 2;
          text-align: center;
          padding: 0 20px;
          max-width: 800px;
        }
        .hero-badge {
          display: inline-block;
          background: rgba(255,184,0,0.2);
          border: 1px solid rgba(255,184,0,0.5);
          color: #FFB800;
          padding: 6px 18px;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 20px;
          animation: fadeInDown 0.8s ease forwards;
        }
        .hero-title {
          font-family: 'Fredoka One', cursive;
          font-size: clamp(48px, 8vw, 90px);
          color: var(--kc-text);
          line-height: 1.05;
          margin-bottom: 10px;
          animation: fadeInUp 0.8s ease 0.2s both;
        }
        .hero-title span { color: #FFB800; }
        .hero-subtitle {
          font-size: clamp(16px, 2.5vw, 22px);
          color: var(--kc-text-muted);
          margin-bottom: 36px;
          font-weight: 600;
          animation: fadeInUp 0.8s ease 0.4s both;
        }
        .hero-cta {
          display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;
          animation: fadeInUp 0.8s ease 0.6s both;
        }
        .btn-primary {
          background: linear-gradient(135deg, #F04E23, #ff6b42);
          color: white;
          padding: 14px 36px;
          border-radius: 50px;
          font-family: 'Nunito', sans-serif;
          font-weight: 800;
          font-size: 16px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 8px 25px rgba(240,78,35,0.4);
        }
        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(240,78,35,0.5);
        }
        .btn-secondary {
          background: var(--kc-border);
          color: white;
          padding: 14px 36px;
          border-radius: 50px;
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          font-size: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.2);
          transform: translateY(-3px);
        }

        .scroll-indicator {
          position: absolute; bottom: 30px; left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          animation: bounce 2s infinite;
        }
        .scroll-indicator span {
          color: var(--kc-text-muted);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .scroll-arrow {
          width: 24px; height: 24px;
          border-right: 2px solid rgba(255,255,255,0.6);
          border-bottom: 2px solid rgba(255,255,255,0.6);
          transform: rotate(45deg);
        }

        /* Intro Section */
        .intro-section {
          background: var(--kc-bg);
          padding: 100px 40px;
          position: relative;
          overflow: hidden;
        }
        .intro-section::before {
          content: '';
          position: absolute;
          top: -100px; right: -100px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(255,184,0,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .intro-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .section-label {
          color: #FFB800;
          font-weight: 800;
          font-size: 13px;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 16px;
          display: flex; align-items: center; gap: 10px;
        }
        .section-label::before {
          content: '';
          display: block;
          width: 30px; height: 3px;
          background: #FFB800;
          border-radius: 2px;
        }
        .intro-title {
          font-family: 'Fredoka One', cursive;
          font-size: clamp(32px, 4vw, 50px);
          color: var(--kc-text);
          line-height: 1.15;
          margin-bottom: 24px;
        }
        .intro-title span { color: #F04E23; }
        .intro-desc {
          color: var(--kc-text-muted);
          font-size: 17px;
          line-height: 1.8;
          margin-bottom: 32px;
          font-weight: 600;
        }
        .intro-stats {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .stat-card {
          background: var(--kc-surface-hover);
          border: 1px solid var(--kc-border);
          border-radius: 16px;
          padding: 20px 16px;
          text-align: center;
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          background: rgba(255,184,0,0.1);
          border-color: rgba(255,184,0,0.3);
          transform: translateY(-4px);
        }
        .stat-number {
          font-family: 'Fredoka One', cursive;
          font-size: 32px;
          color: #FFB800;
          display: block;
        }
        .stat-label {
          color: var(--kc-text-muted);
          font-size: 13px;
          font-weight: 700;
          margin-top: 4px;
        }
        .intro-mascot {
          position: relative;
          display: flex; align-items: center; justify-content: center;
        }
        .mascot-bg {
          width: 380px; height: 380px;
          background: linear-gradient(135deg, rgba(30,45,107,0.6), rgba(240,78,35,0.2));
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          position: relative;
          border: 2px solid rgba(255,184,0,0.2);
        }
        .mascot-img {
          width: 300px; height: 300px;
          object-fit: contain;
          filter: drop-shadow(0 20px 40px rgba(255,184,0,0.3));
          animation: float 3s ease-in-out infinite;
        }
        .mascot-placeholder {
          width: 200px; height: 200px;
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 12px;
          color: var(--kc-text-faint);
          font-size: 14px; font-weight: 700;
          text-align: center;
        }
        .mascot-placeholder-icon {
          font-size: 80px;
          filter: grayscale(1) opacity(0.3);
        }
        .mascot-orbit {
          position: absolute;
          width: 60px; height: 60px;
          background: rgba(255,184,0,0.15);
          border: 2px solid rgba(255,184,0,0.3);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px;
        }
        .orbit-1 { top: 20px; right: 20px; animation: float 2.5s ease-in-out infinite; }
        .orbit-2 { bottom: 40px; left: 10px; animation: float 3.5s ease-in-out infinite 0.5s; }
        .orbit-3 { top: 50%; right: -10px; animation: float 3s ease-in-out infinite 1s; }

        /* Cards Section */
        .cards-section {
          background: var(--kc-bg-alt);
          padding: 100px 40px;
          position: relative;
        }
        .cards-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #FFB800, #F04E23, transparent);
        }
        .cards-header {
          text-align: center;
          margin-bottom: 60px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        .cards-title {
          font-family: 'Fredoka One', cursive;
          font-size: clamp(32px, 4vw, 50px);
          color: var(--kc-text);
          margin-bottom: 16px;
        }
        .cards-title span { color: #FFB800; }
        .cards-subtitle {
          color: var(--kc-text-muted);
          font-size: 17px;
          font-weight: 600;
        }
        .cards-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 28px;
        }
        .anim-card {
          background: var(--kc-surface);
          border: 1px solid var(--kc-surface-hover);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.4s ease;
          opacity: 0;
          transform: translateY(30px);
          cursor: pointer;
        }
        .anim-card.visible {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .anim-card:hover {
          transform: translateY(-8px) !important;
          box-shadow: 0 20px 50px rgba(0,0,0,0.4);
          border-color: rgba(255,184,0,0.3);
        }
        .card-poster {
          width: 100%;
          aspect-ratio: 16/9;
          object-fit: cover;
          display: block;
        }
        .card-poster-placeholder {
          width: 100%;
          aspect-ratio: 16/9;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 12px;
          font-size: 13px;
          font-weight: 700;
          color: rgba(255,255,255,0.3);
          background: linear-gradient(135deg, rgba(30,45,107,0.5), rgba(26,26,62,0.8));
          position: relative;
          overflow: hidden;
        }
        .card-poster-placeholder::after {
          content: '';
          position: absolute; inset: 0;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 20px,
            rgba(255,255,255,0.02) 20px,
            rgba(255,255,255,0.02) 40px
          );
        }
        .play-icon-big {
          width: 60px; height: 60px;
          background: rgba(240,78,35,0.8);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 26px;
          position: relative; z-index: 1;
          transition: all 0.3s ease;
        }
        .anim-card:hover .play-icon-big {
          background: #F04E23;
          transform: scale(1.1);
        }
        .card-body {
          padding: 20px 22px 22px;
        }
        .card-meta {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 12px;
        }
        .card-genre {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 50px;
          color: white;
        }
        .card-duration {
          color: var(--kc-text-faint);
          font-size: 13px;
          font-weight: 600;
          display: flex; align-items: center; gap: 4px;
        }
        .card-title {
          font-family: 'Fredoka One', cursive;
          font-size: 22px;
          color: var(--kc-text);
          margin-bottom: 10px;
          line-height: 1.2;
        }
        .card-desc {
          color: var(--kc-text-muted);
          font-size: 14px;
          line-height: 1.7;
          margin-bottom: 20px;
          font-weight: 600;
        }
        .btn-trailer {
          width: 100%;
          background: linear-gradient(135deg, #F04E23, #ff6b42);
          color: white;
          padding: 12px 20px;
          border-radius: 12px;
          font-family: 'Nunito', sans-serif;
          font-weight: 800;
          font-size: 14px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          letter-spacing: 0.5px;
        }
        .btn-trailer:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(240,78,35,0.5);
        }

        /* ── POPUP OVERLAY ─────────────────────────────────────────────── */
        .popup-overlay {
          position: fixed; inset: 0;
          z-index: 999;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: overlayIn 0.25s ease forwards;
        }
        .popup-backdrop {
          position: absolute; inset: 0;
          background: var(--kc-overlay);
          backdrop-filter: blur(8px);
          cursor: pointer;
        }
        .popup-box {
          position: relative; z-index: 1;
          background: var(--kc-bg-alt);
          border: 1px solid rgba(255,184,0,0.25);
          border-radius: 24px;
          overflow: hidden;
          width: 100%;
          max-width: 680px;
          box-shadow: 0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05);
          animation: popupIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        .popup-close {
          position: absolute; top: 16px; right: 16px; z-index: 10;
          width: 36px; height: 36px;
          background: var(--kc-surface-hover);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          font-size: 18px; color: var(--kc-text-muted);
          transition: all 0.2s ease;
          line-height: 1;
        }
        .popup-close:hover {
          background: rgba(240,78,35,0.3);
          border-color: #F04E23;
          color: white;
          transform: rotate(90deg);
        }

        /* Popup — not logged in */
        .popup-gate {
          padding: 60px 40px 50px;
          text-align: center;
        }
        .popup-gate-icon {
          width: 80px; height: 80px;
          background: linear-gradient(135deg, rgba(255,184,0,0.2), rgba(240,78,35,0.2));
          border: 2px solid rgba(255,184,0,0.35);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 36px;
          margin: 0 auto 24px;
          animation: float 3s ease-in-out infinite;
        }
        .popup-gate-title {
          font-family: 'Fredoka One', cursive;
          font-size: 28px;
          color: var(--kc-text);
          margin-bottom: 12px;
        }
        .popup-gate-desc {
          color: var(--kc-text-muted);
          font-size: 16px;
          font-weight: 600;
          line-height: 1.6;
          margin-bottom: 32px;
          max-width: 380px;
          margin-left: auto;
          margin-right: auto;
        }
        .popup-gate-desc strong {
          color: #FFB800;
        }
        .btn-popup-login {
          display: inline-flex; align-items: center; gap: 10px;
          background: linear-gradient(135deg, #FFB800, #ff9f00);
          color: var(--kc-bg);
          padding: 14px 40px;
          border-radius: 50px;
          font-family: 'Nunito', sans-serif;
          font-weight: 800;
          font-size: 16px;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(255,184,0,0.35);
        }
        .btn-popup-login:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 35px rgba(255,184,0,0.5);
        }
        .popup-gate-alt {
          margin-top: 18px;
          color: rgba(255,255,255,0.35);
          font-size: 13px;
          font-weight: 600;
        }
        .popup-gate-alt a {
          color: var(--kc-text-muted);
          text-decoration: underline;
          cursor: pointer;
          transition: color 0.2s;
        }
        .popup-gate-alt a:hover { color: #FFB800; }

        /* Popup — video player */
        .popup-player {}
        .popup-player-header {
          padding: 20px 56px 16px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .popup-player-genre {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 50px;
          color: white;
          display: inline-block;
          margin-bottom: 8px;
        }
        .popup-player-title {
          font-family: 'Fredoka One', cursive;
          font-size: 26px;
          color: var(--kc-text);
          line-height: 1.2;
        }
        .popup-player-duration {
          color: var(--kc-text-faint);
          font-size: 13px;
          font-weight: 600;
          margin-top: 4px;
          display: flex; align-items: center; gap: 5px;
        }
        .popup-video-wrap {
          position: relative;
          background: #000;
        }
        .popup-video {
          width: 100%;
          aspect-ratio: 16/9;
          display: block;
          background: #000;
        }
        .popup-video-fallback {
          width: 100%;
          aspect-ratio: 16/9;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 12px;
          background: linear-gradient(135deg, var(--kc-bg-deep), var(--kc-bg));
          color: rgba(255,255,255,0.3);
          font-size: 13px; font-weight: 700;
        }

        /* Demo toggle (remove in production) */
        .demo-toggle {
          position: fixed; bottom: 24px; right: 24px; z-index: 200;
          background: rgba(30,32,80,0.9);
          border: 1px solid rgba(255,184,0,0.3);
          border-radius: 50px;
          padding: 10px 18px;
          display: flex; align-items: center; gap: 10px;
          cursor: pointer;
          font-family: 'Nunito', sans-serif;
          font-size: 12px; font-weight: 700;
          color: var(--kc-text-muted);
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
          transition: all 0.2s ease;
          user-select: none;
        }
        .demo-toggle:hover { border-color: #FFB800; color: #FFB800; }
        .demo-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          transition: background 0.3s ease;
        }

        /* Footer */
        .footer {
          background: var(--kc-bg-deep);
          padding: 60px 40px 30px;
          text-align: center;
        }
        .footer-logo {
          font-family: 'Fredoka One', cursive;
          font-size: 36px;
          color: #FFB800;
          margin-bottom: 16px;
        }
        .footer-desc {
          color: var(--kc-text-faint);
          font-size: 14px;
          font-weight: 600;
          max-width: 400px;
          margin: 0 auto 30px;
          line-height: 1.7;
        }
        .footer-divider {
          border: none;
          border-top: 1px solid var(--kc-surface-hover);
          margin: 30px 0;
        }
        .footer-copy {
          color: var(--kc-text-faint);
          font-size: 13px;
          font-weight: 600;
        }
        .footer-copy span { color: #FFB800; }

        /* Animations */
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes overlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popupIn {
          from { opacity: 0; transform: scale(0.88) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .intro-text.visible { animation: fadeIn 0.8s ease forwards; }
        .intro-mascot.visible { animation: fadeInRight 0.8s ease 0.2s both; }

        @media (max-width: 768px) {
          .header-nav { padding: 16px 20px; }
          .header-nav.scrolled { padding: 12px 20px; }
          .intro-inner { grid-template-columns: 1fr; gap: 40px; }
          .mascot-bg { width: 280px; height: 280px; }
          .intro-section { padding: 70px 20px; }
          .cards-section { padding: 70px 20px; }
          .cards-grid { grid-template-columns: 1fr; }
          .intro-stats { grid-template-columns: repeat(3, 1fr); gap: 12px; }
          .popup-gate { padding: 50px 24px 40px; }
          .popup-player-header { padding: 16px 48px 14px 18px; }
        }
      `}</style>

      {/* HEADER */}
      <nav className={`header-nav${scrolled ? " scrolled" : ""}`}>
        <div className="logo-text">
          <img
            src="/logo.png"
            alt="Kidscenter Logo"
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
        {/* Tombol Masuk → arahkan ke /login */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <ThemeToggle inline />
          <a href="/login" className="btn-login">Masuk</a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section">
        <video
          ref={videoRef}
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          onError={(e) => {
            (e.currentTarget as HTMLVideoElement).style.display = "none";
            const placeholder = document.getElementById("hero-placeholder");
            if (placeholder) placeholder.style.display = "flex";
          }}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div id="hero-placeholder" className="hero-placeholder" style={{ display: "none" }}>
          <div style={{ textAlign: "center", color: "var(--kc-border)", fontSize: 15, fontWeight: 700 }}>
            <div style={{ fontSize: 80, marginBottom: 16 }}>🎬</div>
            Tempatkan video animasi di /public/videos/hero.mp4
          </div>
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge">✨ Animasi Berkualitas Tinggi</div>
          <h1 className="hero-title">
            Dunia Animasi<br /><span>Penuh Warna</span>
          </h1>
          <p className="hero-subtitle">
            Temukan ratusan serial animasi seru dan edukatif<br />khusus untuk si kecil yang penuh imajinasi
          </p>
          <div className="hero-cta">
            <a href="#animasi" className="btn-primary">Jelajahi Animasi</a>
            <button className="btn-secondary" onClick={() => document.getElementById("tentang")?.scrollIntoView({ behavior: "smooth" })}>
              Tentang Kami
            </button>
          </div>
        </div>
        <div className="scroll-indicator">
          <span>Scroll</span>
          <div className="scroll-arrow" />
        </div>
      </section>

      {/* INTRO SECTION */}
      <section className="intro-section" id="tentang" ref={introRef}>
        <div className="intro-inner">
          <div className={`intro-text${introVisible ? " visible" : ""}`}>
            <div className="section-label">Tentang Kidscenter</div>
            <h2 className="intro-title">
              Make<br />Learning<br /><span>Addictive</span>
            </h2>
            <p className="intro-desc">
              Kids Center hadir sebagai studio animasi edugame pertama yang menggabungkan keseruan bermain dengan kekayaan budaya Indonesia dirancang khusus untuk si kecil yang cerdas dan ceria.
            </p>
            <div className="intro-stats">
              <div className="stat-card">
                <span className="stat-number">30+</span>
                <div className="stat-label">Univeersitas di Jangkau</div>
              </div>
              <div className="stat-card">
                <span className="stat-number">100+</span>
                <div className="stat-label">Konten Edukatif</div>
              </div>
              <div className="stat-card">
                <span className="stat-number">100%</span>
                <div className="stat-label">Aman Buat Anak</div>
              </div>
            </div>
          </div>

          <div className={`intro-mascot${introVisible ? " visible" : ""}`}>
            <div className="mascot-bg">
              <img
                src="/mascot.gif"
                alt="Maskot Kidscenter"
                className="mascot-img"
                onError={(e) => {
                  const t = e.currentTarget;
                  t.style.display = "none";
                  const sibling = t.nextElementSibling as HTMLElement;
                  if (sibling) sibling.style.display = "flex";
                }}
              />
              <div className="mascot-placeholder" style={{ display: "none" }}>
                <div className="mascot-placeholder-icon">🦁</div>
                <div>Tambahkan maskot<br />di /public/mascot.gif</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CARDS SECTION */}
      <section className="cards-section" id="animasi">
        <div className="cards-header">
          <div className="section-label" style={{ justifyContent: "center" }}>Koleksi Trailer</div>
          <h2 className="cards-title">Serial <span>Animasi</span> Pilihan</h2>
          <p className="cards-subtitle">Saksikan cuplikan seru dari serial animasi unggulan kami</p>
        </div>

        <div className="cards-grid">
          {animations.map((anim, index) => (
            <div
              key={anim.id}
              className={`anim-card${visibleCards.includes(index) ? " visible" : ""}`}
              ref={(el) => { cardRefs.current[index] = el; }}
            >
              <img
                src={`/posters/poster-${anim.id}.jpg`}
                alt={anim.title}
                className="card-poster"
                onError={(e) => {
                  const t = e.currentTarget;
                  t.style.display = "none";
                  const sibling = t.nextElementSibling as HTMLElement;
                  if (sibling) sibling.style.display = "flex";
                }}
              />
              <div className="card-poster-placeholder" style={{ display: "none" }}>
                <div className="play-icon-big">▶</div>
                <span>Poster: /public/posters/poster-{anim.id}.jpg</span>
              </div>

              <div className="card-body">
                <div className="card-meta">
                  <span
                    className="card-genre"
                    style={{ background: genreColors[anim.genre] || "#1E2D6B" }}
                  >
                    {anim.genre}
                  </span>
                  <span className="card-duration">⏱ {anim.duration}</span>
                </div>
                <h3 className="card-title">{anim.title}</h3>
                <p className="card-desc">{anim.description}</p>

                {/* ── Tombol Lihat Trailer ── */}
                <button className="btn-trailer" onClick={() => openTrailer(anim)}>
                  ▶ Lihat Trailer
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">Kidscenter</div>
        <p className="footer-desc">
          Platform animasi edukatif terpercaya untuk anak-anak Indonesia yang penuh semangat dan imajinasi.
        </p>
        <hr className="footer-divider" />
        <p className="footer-copy">
          © 2026 <span>Kidscenter.id</span> — All rights reserved
        </p>
      </footer>

      {/* ── POPUP ──────────────────────────────────────────────────────────── */}
      {popupOpen && selectedAnim && (
        <div className="popup-overlay">
          {/* Klik backdrop untuk tutup */}
          <div className="popup-backdrop" onClick={closePopup} />

          <div className="popup-box">
            {/* Tombol tutup */}
            <button className="popup-close" onClick={closePopup} aria-label="Tutup">✕</button>

            {!isLoggedIn ? (
              /* ── Kondisi 1: Belum login ── */
              <div className="popup-gate">
                <div className="popup-gate-icon">🔒</div>
                <h2 className="popup-gate-title">Oops, belum masuk!</h2>
                <p className="popup-gate-desc">
                  Anda belum masuk. Silahkan masuk terlebih dahulu untuk
                  menonton trailer <strong>{selectedAnim.title}</strong> dan
                  konten seru lainnya.
                </p>
                <a href="/login" className="btn-popup-login">
                  🚀 Masuk Sekarang
                </a>
                <p className="popup-gate-alt">
                  Belum punya akun?{" "}
                  <a href="/register">Daftar gratis di sini</a>
                </p>
              </div>
            ) : (
              /* ── Kondisi 2: Sudah login → tampilkan video ── */
              <div className="popup-player">
                <div className="popup-player-header">
                  <span
                    className="popup-player-genre"
                    style={{ background: genreColors[selectedAnim.genre] || "#1E2D6B" }}
                  >
                    {selectedAnim.genre}
                  </span>
                  <div className="popup-player-title">{selectedAnim.title}</div>
                  <div className="popup-player-duration">⏱ {selectedAnim.duration}</div>
                </div>

                <div className="popup-video-wrap">
                  {/* Video trailer — letakkan file di /public/videos/trailer-{id}.mp4 */}
                  <video
                    ref={trailerVideoRef}
                    className="popup-video"
                    controls
                    autoPlay
                    onError={(e) => {
                      (e.currentTarget as HTMLVideoElement).style.display = "none";
                      const fb = document.getElementById(`video-fallback-${selectedAnim.id}`);
                      if (fb) fb.style.display = "flex";
                    }}
                  >
                    <source src={`/videos/trailer-${selectedAnim.id}.mp4`} type="video/mp4" />
                    Browser Anda tidak mendukung tag video.
                  </video>
                  <div
                    id={`video-fallback-${selectedAnim.id}`}
                    className="popup-video-fallback"
                    style={{ display: "none" }}
                  >
                    <div style={{ fontSize: 56 }}>🎬</div>
                    <div>Tambahkan file trailer di:<br />/public/videos/trailer-{selectedAnim.id}.mp4</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Demo Toggle (hapus di production) ──────────────────────────────── */}
      {/* Ganti `isLoggedIn` dengan auth session/cookie dari sistem Anda */}
      <button
        className="demo-toggle"
        onClick={() => setIsLoggedIn((v) => !v)}
        title="Demo only — hapus di production"
      >
        <div className="demo-dot" style={{ background: isLoggedIn ? "#2ecc71" : "#F04E23" }} />
        {isLoggedIn ? "Login: ON" : "Login: OFF"}
      </button>

    </div>
  );
}
"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

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

// 3 foto produk — simpan di /public/images/produk-1.jpg, produk-2.jpg, produk-3.jpg
const produkFotos = [
  { src: "/images/mascot-footer.png", alt: "Produk 1" },
  { src: "/images/produk-2.png", alt: "Produk 2" },
  { src: "/images/produk-3.png", alt: "Produk 3" },
];

// 4 award — simpan di /public/images/award-1.png s/d award-4.png
const awards = [
  { id: 1, src: "/images/award-1.png", alt: "Award 1", label: "3rd Winner of IDENTIK\nContent Creator\nCategory, Kominfo" },
  { id: 2, src: "/images/award-2.png", alt: "Award 2", label: "Finalist AICTA\nand APICTA\n2021" },
  { id: 3, src: "/images/award-3.png", alt: "Award 3", label: "Awardee PPBT\nKemenristekdikti" },
  { id: 4, src: "/images/award-4.png", alt: "Award 4", label: "Best Edupreuner\ndi acara\niYES Malaysia" },
];

// 2 maskot untuk seksi award — simpan di /public/images/mascot-award-1.png & mascot-award-2.png
const awardMascots = [
  { src: "/images/mascot-award-1.png", alt: "Maskot 1" },
  { src: "/images/mascot-award-2.png", alt: "Maskot 2" },
];

// 3 foto dokumentasi — simpan di /public/images/dokumentasi-1.jpg s/d dokumentasi-3.jpg
const dokumentasiItems = [
  { id: 1, src: "/images/dokumentasi-1.png", alt: "Dokumentasi 1" },
  { id: 2, src: "/images/dokumentasi-2.png", alt: "Dokumentasi 2" },
  { id: 3, src: "/images/dokumentasi-3.png", alt: "Dokumentasi 3" },
];

type SelectedAnim = (typeof animations)[number] | null;

export default function LandingPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const trailerVideoRef = useRef<HTMLVideoElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const introRef = useRef<HTMLDivElement>(null);
  const [introVisible, setIntroVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedAnim, setSelectedAnim] = useState<SelectedAnim>(null);
  const [pesanPopupOpen, setPesanPopupOpen] = useState(false);

  const produkGridRef = useRef<HTMLDivElement>(null);
  const [isInteractingProduk, setIsInteractingProduk] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll-triggered hero video play - Optimize loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (videoRef.current) {
            videoRef.current.play().catch(() => {
              // Browser autoplay policy - video will play on user interaction
            });
          }
        } else if (!entry.isIntersecting && videoRef.current) {
          videoRef.current.pause();
        }
      },
      { threshold: 0.3 }
    );

    if (heroSectionRef.current) {
      observer.observe(heroSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
    cardRefs.current.forEach((ref) => ref && observer.observe(ref));
    const checkOnMount = () => {
      cardRefs.current.forEach((ref, index) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (inViewport) setTimeout(() => makeVisible(index), index * 100);
      });
    };
    checkOnMount();
    const t1 = setTimeout(checkOnMount, 100);
    const t2 = setTimeout(checkOnMount, 400);
    return () => { observer.disconnect(); clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIntroVisible(true); },
      { threshold: 0.2 }
    );
    if (introRef.current) observer.observe(introRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const scroll = (time: number) => {
      if (!isInteractingProduk && produkGridRef.current && window.innerWidth <= 768) {
        if (time - lastTime > 25) { // Control scroll speed (lower = faster)
          const grid = produkGridRef.current;
          grid.scrollLeft += 1;

          // Seamless infinite loop: jump to 0 when halfway through duplicated items
          if (grid.scrollLeft >= grid.scrollWidth / 2) {
            grid.scrollLeft = 0;
          }
          lastTime = time;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInteractingProduk]);

  useEffect(() => {
    if (!popupOpen && trailerVideoRef.current) {
      trailerVideoRef.current.pause();
      trailerVideoRef.current.currentTime = 0;
    }
  }, [popupOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePopup();
        setPesanPopupOpen(false);
        document.body.style.overflow = "";
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handlePesan = () => {
    if (isLoggedIn) {
      window.location.href = "/katalog";
    } else {
      setPesanPopupOpen(true);
      document.body.style.overflow = "hidden";
    }
  };

  const openTrailer = (anim: (typeof animations)[number]) => {
    setSelectedAnim(anim);
    setPopupOpen(true);
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
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link href="/login" className="btn-login">Masuk</Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section" ref={heroSectionRef}>
        <video
          ref={videoRef}
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={(e) => {
            (e.currentTarget as HTMLVideoElement).style.display = "none";
            const placeholder = document.getElementById("hero-placeholder");
            if (placeholder) placeholder.style.display = "flex";
          }}
        >
          <source src="/videos/hero.webm" type="video/webm" />
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div id="hero-placeholder" className="hero-placeholder" style={{ display: "none" }}>
          <div style={{ textAlign: "center", color: "var(--kc-text-faint)", fontSize: 15, fontWeight: 700 }}>
            <div style={{ fontSize: 80, marginBottom: 16 }}>🎬</div>
            Tempatkan video animasi di /public/videos/hero.webm
          </div>
        </div>
        <div className="hero-overlay" style={{ opacity: 0.35 }} />
      </section>

      {/* INTRO SECTION */}
      <section className="intro-section" id="tentang" ref={introRef}>
        <div className="intro-inner">
          <div className={`intro-text${introVisible ? " visible" : ""}`}>
            <div className="section-label">Tentang Kidscenter</div>
            <h2 className="intro-title">Make<br />Learning<br /><span>Addictive</span></h2>
            <p className="intro-desc">
              Kids Center hadir sebagai studio animasi edugame pertama yang menggabungkan keseruan bermain dengan kekayaan budaya Indonesia dirancang khusus untuk si kecil yang cerdas dan ceria.
            </p>
            <div className="intro-stats">
              <div className="stat-card"><span className="stat-number">30+</span><div className="stat-label">Universitas di Jangkau</div></div>
              <div className="stat-card"><span className="stat-number">100+</span><div className="stat-label">Konten Edukatif</div></div>
              <div className="stat-card"><span className="stat-number">100%</span><div className="stat-label">Aman Buat Anak</div></div>
            </div>
          </div>
          <div className={`intro-mascot${introVisible ? " visible" : ""}`}>
            <div className="mascot-bg">
              <img
                src="/mascot.webp"
                alt="Maskot Kidscenter"
                className="mascot-img"
                loading="lazy"
                onError={(e) => {
                  const t = e.currentTarget; t.style.display = "none";
                  const sibling = t.nextElementSibling as HTMLElement;
                  if (sibling) sibling.style.display = "flex";
                }}
              />
              <div className="mascot-placeholder" style={{ display: "none" }}>
                <div className="mascot-placeholder-icon">🦁</div>
                <div>Tambahkan maskot<br />di /public/mascot.webp</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CARDS SECTION */}
      <section className="cards-section texture-cream-bg-scroll" id="animasi">
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
                loading="lazy"
                onError={(e) => {
                  const t = e.currentTarget; t.style.display = "none";
                  const sibling = t.nextElementSibling as HTMLElement;
                  if (sibling) sibling.style.display = "flex";
                }}
              />
              <div className="card-poster-placeholder" style={{ display: "none" }}>
                <div className="play-icon-big">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
                <span>Poster: /public/posters/poster-{anim.id}.jpg</span>
              </div>
              <div className="card-body">
                <div className="card-meta">
                  <span className="card-genre" style={{ background: genreColors[anim.genre] || "#1E2D6B" }}>{anim.genre}</span>
                  <span className="card-duration">⏱ {anim.duration}</span>
                </div>
                <h3 className="card-title">{anim.title}</h3>
                <p className="card-desc">{anim.description}</p>
                <button className="btn-trailer" onClick={() => openTrailer(anim)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  Lihat Trailer
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUK & LAYANAN SECTION */}
      <section className="produk-layanan-section" id="produk">

        {/* Panel Kiri: Produk Kami */}
        <div className="panel-produk">
          <div className="panel-content">
            <div className="panel-label">Studio Kami</div>
            <h2 className="panel-title">Produk Kami</h2>
            <div
              className="produk-foto-grid"
              ref={produkGridRef}
              onTouchStart={() => setIsInteractingProduk(true)}
              onTouchEnd={() => { setTimeout(() => setIsInteractingProduk(false), 2000); }}
              onMouseEnter={() => setIsInteractingProduk(true)}
              onMouseLeave={() => setIsInteractingProduk(false)}
            >
              {[...produkFotos, ...produkFotos].map((foto, i) => (
                <div key={i} className="produk-foto-item">
                  <img
                    src={foto.src}
                    alt={foto.alt}
                    className="produk-foto-img"
                    loading="lazy"
                    onError={(e) => {
                      const t = e.currentTarget; t.style.display = "none";
                      const sibling = t.nextElementSibling as HTMLElement;
                      if (sibling) sibling.style.display = "flex";
                    }}
                  />
                  <div className="produk-foto-placeholder" style={{ display: "none" }}>
                    <div className="produk-foto-placeholder-icon">🖼️</div>
                    <div>produk-{(i % produkFotos.length) + 1}.jpg</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel Kanan: Layanan Kami */}
        <div className="panel-layanan">
          <div className="panel-content">
            <div className="panel-label">Apa yang Kami Tawarkan</div>
            <h2 className="panel-title">Pelayanan Kami</h2>
            <div className="layanan-grid">
              {["Animation Content", "Motion Graphic", "Character Design", "Voice Over", "Video Editing", "Sound Design"].map((item) => (
                <div key={item} className="layanan-item">{item}</div>
              ))}
            </div>
            <button className="btn-bergabung-tosca" onClick={handlePesan}>
              Bergabung Sekarang <span className="btn-bergabung-tosca-arrow">›</span>
            </button>
          </div>
        </div>
      </section>

      {/* AWARD DAN DOKUMENTASI SECTION */}
      <section className="award-dokumentasi-section" id="award">

        {/* Panel Kiri: Award & Prestasi */}
        <div className="panel-award">
          <div className="award-content-wrapper">
            <h2 className="award-section-title">Award dan<br />Prestasi</h2>

            <div className="awards-grid">
              {awards.map((award) => (
                <div key={award.id} className="award-item">
                  <img
                    src={award.src}
                    alt={award.alt}
                    className="award-badge-img"
                    loading="lazy"
                    onError={(e) => {
                      const t = e.currentTarget; t.style.display = "none";
                      const sibling = t.nextElementSibling as HTMLElement;
                      if (sibling) sibling.style.display = "flex";
                    }}
                  />
                  <div className="award-badge-placeholder" style={{ display: "none" }}>🏆</div>
                </div>
              ))}
            </div>

            <div className="award-cta-row">
              <button className="btn-bergabung" onClick={handlePesan}>
                Bergabung Sekarang <span className="btn-bergabung-arrow">›</span>
              </button>
            </div>
          </div>

          <div className="panel-award-mascot">
            <img
              src={awardMascots[0].src}
              alt={awardMascots[0].alt}
              loading="lazy"
              onError={(e) => {
                const t = e.currentTarget; t.style.display = "none";
                const sibling = t.nextElementSibling as HTMLElement;
                if (sibling) sibling.style.display = "flex";
              }}
            />
            <div className="award-mascot-placeholder" style={{ display: "none" }}>
              🐱
            </div>
          </div>
        </div>

        {/* Panel Kanan: Dokumentasi */}
        <div className="panel-dokumentasi">
          <div className="panel-dokumentasi-mascot">
            <img
              src={awardMascots[1].src}
              alt={awardMascots[1].alt}
              loading="lazy"
              onError={(e) => {
                const t = e.currentTarget; t.style.display = "none";
                const sibling = t.nextElementSibling as HTMLElement;
                if (sibling) sibling.style.display = "flex";
              }}
            />
            <div className="award-mascot-placeholder" style={{ display: "none" }}>
              👧
            </div>
          </div>

          <div className="dokumentasi-content-wrapper">
            <h2 className="dokumentasi-section-title">Dokumentasi<br /><span style={{ visibility: 'hidden' }}>-</span></h2>

            <div className="dokumentasi-grid">
              {dokumentasiItems.map((item) => (
                <div key={item.id} className="dokumentasi-item">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="dokumentasi-img"
                    loading="lazy"
                    onError={(e) => {
                      const t = e.currentTarget; t.style.display = "none";
                      const sibling = t.nextElementSibling as HTMLElement;
                      if (sibling) sibling.style.display = "flex";
                    }}
                  />
                  <div className="dokumentasi-placeholder" style={{ display: "none" }}>
                    <div className="dokumentasi-placeholder-icon">📷</div>
                    <div>dokumentasi-{item.id}.jpg</div>
                  </div>
                  <div className="dokumentasi-overlay" />
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* FOOTER */}
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
            <img src="/logo.png" alt="Kidscenter Logo" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
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
            <img src="/images/mascot-footer.png" alt="Kidscenter Mascot" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </div>
        </div>

        <p className="footer-copy">© 2026 <span>Kidscenter.id</span> — All rights reserved</p>
      </footer>

      {/* POPUP TRAILER */}
      {popupOpen && selectedAnim && (
        <div className="popup-overlay">
          <div className="popup-backdrop" onClick={closePopup} />
          <div className="popup-box">
            <button className="popup-close" onClick={closePopup} aria-label="Tutup">✕</button>
            <div className="popup-player">
              <div className="popup-player-header">
                <span className="popup-player-genre" style={{ background: genreColors[selectedAnim.genre] || "#1E2D6B" }}>{selectedAnim.genre}</span>
                <div className="popup-player-title">{selectedAnim.title}</div>
                <div className="popup-player-duration">⏱ {selectedAnim.duration}</div>
              </div>
              <div className="popup-video-wrap">
                <video
                  ref={trailerVideoRef}
                  className="popup-video"
                  controls
                  autoPlay
                  preload="none"
                  onError={(e) => {
                    (e.currentTarget as HTMLVideoElement).style.display = "none";
                    const fb = document.getElementById(`video-fallback-${selectedAnim.id}`);
                    if (fb) fb.style.display = "flex";
                  }}
                >
                  <source src={`/videos/trailer-${selectedAnim.id}.mp4`} type="video/mp4" />
                  Browser Anda tidak mendukung tag video.
                </video>
                <div id={`video-fallback-${selectedAnim.id}`} className="popup-video-fallback" style={{ display: "none" }}>
                  <div style={{ fontSize: 56 }}>🎬</div>
                  <div>Tambahkan file trailer di:<br />/public/videos/trailer-{selectedAnim.id}.mp4</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POPUP PESAN SEKARANG */}
      {pesanPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-backdrop" onClick={() => { setPesanPopupOpen(false); document.body.style.overflow = ""; }} />
          <div className="popup-box">
            <button className="popup-close" onClick={() => { setPesanPopupOpen(false); document.body.style.overflow = ""; }} aria-label="Tutup">✕</button>
            <div className="popup-pesan">
              <h2 className="popup-pesan-title">Masuk dulu, yuk!</h2>
              <p className="popup-pesan-desc">
                Untuk memesan layanan kami, kamu perlu <strong>masuk ke akun</strong> terlebih dahulu. Proses cepat dan gratis!
              </p>
              <Link href="/login" className="btn-popup-login">Masuk Sekarang</Link>
              <p className="popup-gate-alt">Belum punya akun? <Link href="/register">Daftar gratis di sini</Link></p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
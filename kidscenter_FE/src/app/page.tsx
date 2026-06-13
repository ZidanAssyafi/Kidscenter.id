"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const animations = [
  {
    id: 1,
    title: "Petualangan Bintang",
    description: "Ikuti perjalanan seru Bintang si kucing menjelajahi hutan ajaib yang penuh kejutan dan pelajaran berharga.",
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

// 3 foto produk — simpan di /public/images/produk-1.webp, produk-2.webp, produk-3.webp
const produkFotos = [
  { src: "/images/mascot-footer.webp", alt: "Produk 1" },
  { src: "/images/produk-2.webp", alt: "Produk 2" },
  { src: "/images/produk-3.webp", alt: "Produk 3" },
];

// Daftar Pertanyaan Umum (FAQ)
const faqs = [
  {
    id: 1,
    question: "Apa itu Kidscenter?",
    answer: "Studio animasi yang mengembangkan cerita, karakter, animasi, ilustrasi, dan visual storytelling untuk brand, lembaga, dan mitra kreatif."
  },
  {
    id: 2,
    question: "Apakah hanya untuk animasi anak?",
    answer: "Tidak. kidscenter mengerjakan animasi untuk berbagai kebutuhan brand, edukasi, kampanye, produk, hiburan, dan komunikasi visual."
  },
  {
    id: 3,
    question: "Layanan utamanya apa saja?",
    answer: "Character design, story development, storyboard, visual development, animasi 2D/3D, commercial animation, illustration, dan interactive content."
  },
  {
    id: 4,
    question: "Bisa membuat karakter dari nol?",
    answer: "Bisa. kidscenter dapat membantu merancang karakter, personality, visual style, dan dunia cerita sejak tahap awal."
  },
  {
    id: 5,
    question: "Bisa untuk kebutuhan brand campaign?",
    answer: "Bisa. kidscenter membantu membuat animasi dan visual storytelling agar pesan brand lebih hidup dan mudah diingat."
  },
  {
    id: 6,
    question: "Bagaimana cara mulai kerja sama?",
    answer: "Mulai dengan menghubungi kidscenter dan menceritakan ide, kebutuhan, target audiens, serta bentuk animasi yang diinginkan."
  }
];


// Problems list
const problems = [
  {
    id: 1,
    title: "Pesan brand sulit menonjol",
    description: "Di tengah banyaknya konten visual yang cepat lewat dan mudah dilupakan."
  },
  {
    id: 2,
    title: "Ide atau konsep masih abstrak",
    description: "Sehingga sulit dijelaskan hanya dengan teks, foto, atau presentasi biasa."
  },
  {
    id: 3,
    title: "Produk, program, atau kampanye belum punya cerita visual",
    description: "Yang membuat audiens lebih mudah memahami dan merasa terhubung."
  },
  {
    id: 4,
    title: "Karakter atau IP belum berkembang maksimal",
    description: "Karena belum memiliki animasi, gaya visual, atau dunia cerita yang kuat."
  },
  {
    id: 5,
    title: "Konten promosi terasa terlalu biasa",
    description: "Padahal brand membutuhkan visual yang lebih hidup, engaging, dan mudah dibagikan."
  },
  {
    id: 6,
    title: "Proses komunikasi visual sering tidak konsisten",
    description: "Karena belum ada storytelling, storyboard, dan visual direction yang jelas sejak awal."
  }
];

// Solutions list
const solutions = [
  {
    id: 1,
    title: "Original IP Development",
    description: "Mengembangkan ide, karakter, dan dunia cerita menjadi aset kreatif yang bisa tumbuh jangka panjang"
  },
  {
    id: 2,
    title: "Character Design",
    description: "Merancang karakter yang ekspresif, memorable, dan sesuai dengan identitas brand atau cerita."
  },
  {
    id: 3,
    title: "Story Development & Script",
    description: "Mengolah ide menjadi premis, alur cerita, dialog, dan narasi yang lebih kuat."
  },
  {
    id: 4,
    title: "Storyboard & Visual Development",
    description: "Menyusun alur visual, mood, komposisi, scene, dan gaya visual sebelum masuk tahap produksi."
  },
  {
    id: 5,
    title: "2D & 3D Animation Production",
    description: "Memproduksi animasi 2D dan 3D untuk kebutuhan brand, edukasi, hiburan, kampanye, produk, dan konten digital."
  },
  {
    id: 6,
    title: "Commercial / Brand Animation",
    description: "Membantu brand menyampaikan pesan melalui animasi yang lebih engaging, mudah dipahami, dan mudah diingat."
  },
  {
    id: 7,
    title: "Illustration & Key Visual",
    description: "Membuat ilustrasi, asset visual, poster, cover, campaign visual, dan kebutuhan visual pendukung lainnya."
  },
  {
    id: 8,
    title: "Games & Interactive Content",
    description: "Mengembangkan konten interaktif berbasis cerita, karakter, dan visual untuk pengalaman audiens yang lebih aktif."
  }
];

// Testimonies list
const testimonies = [
  {
    id: 1,
    quote: "kidscenter membantu kami mengubah konsep brand menjadi visual animasi yang lebih hidup dan mudah dipahami.",
    name: "Rina Prameswari",
    position: "Brand Manager",
    avatar: "/images/testimonial-1.webp"
  },
  {
    id: 2,
    quote: "Dengan storytelling dan visual yang tepat, pesan kampanye kami terasa lebih kuat dan mudah diingat audiens.",
    name: "Andika Wibowo",
    position: "Campaign Lead",
    avatar: "/images/testimonial-2.webp"
  },
  {
    id: 3,
    quote: "Karakter yang dikembangkan terasa ekspresif, konsisten, dan punya potensi besar untuk menjadi IP jangka panjang.",
    name: "Maya Fadila",
    position: "Creative Director",
    avatar: "/images/testimonial-3.webp"
  },
  {
    id: 4,
    quote: "Proses visual development-nya membantu kami melihat arah cerita dengan lebih jelas sebelum masuk produksi.",
    name: "Dewi Kartika",
    position: "Project Manager",
    avatar: "/images/testimonial-4.webp"
  },
  {
    id: 5,
    quote: "Animasi dari kidscenter membuat produk kami tampil lebih menarik, modern, dan mudah dijelaskan ke calon pelanggan.",
    name: "Fajar Nugroho",
    position: "Founder Startup Edukasi",
    avatar: "/images/testimonial-5.webp"
  }
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
  const [userData, setUserData] = useState<any>(null);
  const [expandedProblem, setExpandedProblem] = useState<number | null>(null);
  const [expandedSolution, setExpandedSolution] = useState<number | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev + 1) % testimonies.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev - 1 + testimonies.length) % testimonies.length);
  };


  useEffect(() => {
    // Cek token: sessionStorage (akun demo) atau localStorage (akun database)
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const user = sessionStorage.getItem("user") || localStorage.getItem("user");
    if (token && user) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(user));
    }
  }, []);

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
      window.location.href = "/catalog";
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
    <div className="landing-root">

      {/* HERO SECTION */}
      <section className="hero-section" ref={heroSectionRef}>
        <video
          ref={videoRef}
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/posters/poster-1.webp"
        >
          {/* Prioritaskan MP4 untuk kompabilitas iOS/Safari yang optimal */}
          <source src="/videos/hero.mp4" type="video/mp4" />
          <source src="/videos/hero.webm" type="video/webm" />
        </video>
        <div className="hero-overlay" style={{ opacity: 0.35 }} />
      </section>

      {/* INTRO SECTION */}
      <section className="intro-section" id="tentang" ref={introRef}>
        <div className="intro-inner">
          <div className={`intro-text${introVisible ? " visible" : ""}`}>
            <div className="section-label">Tentang Kidscenter</div>
            <h2 className="intro-title">Bring Your Story<br />to Life<br /><span>Through Animation</span></h2>
            <p className="intro-desc">
              kidscenter membantu brand, lembaga, dan mitra kreatif mengubah ide, pesan, dan karakter menjadi animasi yang hidup, menarik, dan mudah diingat.
            </p>
            <button className="btn-bergabung-navy" onClick={handlePesan} style={{ alignSelf: "flex-start", marginTop: "16px" }}>
              Diskusikan Proyek Animasi <span className="btn-bergabung-navy-arrow">›</span>
            </button>
          </div>
          <div className={`intro-mascot${introVisible ? " visible" : ""}`}>
            <div className="mascot-bg">
              <Image
                src="/mascot.webp"
                alt="Maskot Kidscenter"
                width={800}
                height={800}
                className="mascot-img"
                loading="lazy"
                unoptimized
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

      {/* PRODUK & LAYANAN SECTION */}
      <section className="produk-layanan-section" id="produk">

        {/* Panel Kiri: The Problem */}
        <div className="panel-produk">
          <div className="panel-content">
            <div className="panel-label">Tantangan</div>
            <h2 className="panel-title">The Problem</h2>
            <div className="problems-list">
              {problems.map((problem) => {
                const isActive = expandedProblem === problem.id;
                return (
                  <div key={problem.id} className={`problem-item${isActive ? " active" : ""}`}>
                    <div
                      className="problem-header"
                      onClick={() => {
                        if (window.innerWidth <= 768) {
                          setExpandedProblem(isActive ? null : problem.id);
                        }
                      }}
                    >
                      <h3 className="problem-title">{problem.title}</h3>
                      <button className="problem-toggle" aria-label="Toggle problem description">
                        <span className="toggle-icon">›</span>
                      </button>
                    </div>
                    <div className="problem-description-wrap">
                      <div className="problem-description">
                        {problem.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="problem-mascot-wrapper">
              <img src="/images/mari_caca.webp" alt="Mari Caca Mascot" className="problem-mascot" />
            </div>
          </div>
        </div>

        {/* Panel Kanan: Layanan Kami */}
        <div className="panel-layanan">
          <div className="panel-content">
            <div className="panel-label">Solusi Kami</div>
            <h2 className="panel-title">The Solution</h2>
            <div className="solutions-list">
              {solutions.map((solution) => {
                const isActive = expandedSolution === solution.id;
                return (
                  <div key={solution.id} className={`solution-item${isActive ? " active" : ""}`}>
                    <div
                      className="solution-header"
                      onClick={() => {
                        if (window.innerWidth <= 768) {
                          setExpandedSolution(isActive ? null : solution.id);
                        }
                      }}
                    >
                      <h3 className="solution-title">{solution.title}</h3>
                      <button className="solution-toggle" aria-label="Toggle solution description">
                        <span className="toggle-icon">›</span>
                      </button>
                    </div>
                    <div className="solution-description-wrap">
                      <div className="solution-description">
                        {solution.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="btn-bergabung-tosca" onClick={handlePesan}>
              Diskusikan Proyek Animasi <span className="btn-bergabung-tosca-arrow">›</span>
            </button>
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
              <Image
                src={`/posters/poster-${anim.id}.webp`}
                alt={anim.title}
                width={400}
                height={600}
                className="card-poster"
                loading="lazy"
              />
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

      {/* TESTIMONIES SECTION */}
      <section className="testimonies-section" id="testimoni">
        <div className="testimonies-header">
          <div className="section-label" style={{ justifyContent: "center" }}>Testimoni</div>
          <h2 className="testimonies-title">Apa Kata <span>Pelanggan Kami</span></h2>
          <p className="testimonies-subtitle">Kisah sukses kolaborasi kreatif bersama kidscenter</p>
        </div>

        <div className="testimonies-carousel-container">
          <button className="carousel-nav-btn prev" onClick={prevTestimonial} aria-label="Sebelumnya">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>

          <div className="testimonies-stage">
            {testimonies.map((item, idx) => {
              let cardClass = "testimonial-card";
              if (idx === currentTestimonialIndex) {
                cardClass += " active";
              } else if (idx === (currentTestimonialIndex - 1 + testimonies.length) % testimonies.length) {
                cardClass += " prev";
              } else if (idx === (currentTestimonialIndex + 1) % testimonies.length) {
                cardClass += " next";
              } else {
                cardClass += " hidden";
              }

              return (
                <div key={item.id} className={cardClass}>
                  <p className="testimonial-quote">{item.quote}</p>
                  <div className="testimonial-author">
                    <div className="avatar-wrapper">
                      <Image
                        src={item.avatar}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="testimonial-avatar"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = "none";
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                      <div className="avatar-fallback" style={{ display: "none" }}>
                        {item.name.charAt(0)}
                      </div>
                    </div>
                    <div className="author-info">
                      <h4 className="author-name">{item.name}</h4>
                      <p className="author-position">{item.position}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="carousel-nav-btn next" onClick={nextTestimonial} aria-label="Berikutnya">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>

        {/* PAGINATION DOTS */}
        <div className="testimonies-dots">
          {testimonies.map((_, idx) => (
            <button
              key={idx}
              className={`dot${idx === currentTestimonialIndex ? " active" : ""}`}
              onClick={() => setCurrentTestimonialIndex(idx)}
              aria-label={`Pilih testimoni ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="hiw-section" id="cara-kerja">
        <div className="hiw-header">
          <div className="section-label" style={{ justifyContent: "center" }}>Proses Kreatif</div>
          <h2 className="hiw-title">How It <span>Works</span></h2>
          <p className="hiw-subtitle">Dari ide hingga animasi siap tayang — prosesnya sederhana dan kolaboratif</p>
        </div>

        <div className="hiw-steps">
          {/* Connector line */}
          <div className="hiw-connector" aria-hidden="true" />

          {/* Step 1 */}
          <div className="hiw-step">
            <div className="hiw-step-icon-wrap hiw-color-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              <div className="hiw-step-number">01</div>
            </div>
            <div className="hiw-step-body">
              <h3 className="hiw-step-title">Share Your Idea</h3>
              <p className="hiw-step-desc">Ceritakan ide, pesan, karakter, atau kebutuhan animasi yang ingin kamu wujudkan.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="hiw-step">
            <div className="hiw-step-icon-wrap hiw-color-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
              <div className="hiw-step-number">02</div>
            </div>
            <div className="hiw-step-body">
              <h3 className="hiw-step-title">Build the Visual Direction</h3>
              <p className="hiw-step-desc">Kami bantu susun konsep cerita, gaya visual, storyboard, dan karakter yang tepat.</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="hiw-step">
            <div className="hiw-step-icon-wrap hiw-color-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" />
              </svg>
              <div className="hiw-step-number">03</div>
            </div>
            <div className="hiw-step-body">
              <h3 className="hiw-step-title">Create the Animation</h3>
              <p className="hiw-step-desc">Produksi animasi, ilustrasi, key visual, atau konten interaktif berkualitas tinggi.</p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="hiw-step">
            <div className="hiw-step-icon-wrap hiw-color-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
              </svg>
              <div className="hiw-step-number">04</div>
            </div>
            <div className="hiw-step-body">
              <h3 className="hiw-step-title">Launch the Story</h3>
              <p className="hiw-step-desc">Gunakan hasilnya untuk campaign, brand content, edukasi, atau pengembangan IP jangka panjang.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="faq-section texture-cream-bg-scroll" id="faq">
        <div className="faq-header">
          <div className="section-label" style={{ justifyContent: "center" }}>FAQ</div>
          <h2 className="faq-title">Pertanyaan <span>Umum</span></h2>
          <p className="faq-subtitle">Temukan jawaban atas beberapa pertanyaan yang paling sering diajukan mengenai layanan kami.</p>
        </div>

        {/* Layout Desktop (2 Kolom) */}
        <div className="faq-grid desktop-faq">
          {/* Kolom Kiri (Index 0, 2, 4) */}
          <div className="faq-column">
            {faqs.filter((_, idx) => idx % 2 === 0).map((faq) => {
              const isOpen = expandedFaq === faq.id;
              return (
                <div key={faq.id} className={`faq-item${isOpen ? " active" : ""}`}>
                  <button
                    className="faq-question-btn"
                    onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-question-text">{faq.question}</span>
                    <span className="faq-icon-wrap">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="faq-chevron">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </button>
                  <div className={`faq-answer-wrap${isOpen ? " open" : ""}`}>
                    <div className="faq-answer-content">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Kolom Kanan (Index 1, 3, 5) */}
          <div className="faq-column">
            {faqs.filter((_, idx) => idx % 2 === 1).map((faq) => {
              const isOpen = expandedFaq === faq.id;
              return (
                <div key={faq.id} className={`faq-item${isOpen ? " active" : ""}`}>
                  <button
                    className="faq-question-btn"
                    onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-question-text">{faq.question}</span>
                    <span className="faq-icon-wrap">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="faq-chevron">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </button>
                  <div className={`faq-answer-wrap${isOpen ? " open" : ""}`}>
                    <div className="faq-answer-content">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Layout Mobile (1 Kolom - Menjaga Urutan) */}
        <div className="faq-grid mobile-faq">
          <div className="faq-column" style={{ width: '100%' }}>
            {faqs.map((faq) => {
              const isOpen = expandedFaq === faq.id;
              return (
                <div key={faq.id} className={`faq-item${isOpen ? " active" : ""}`}>
                  <button
                    className="faq-question-btn"
                    onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-question-text">{faq.question}</span>
                    <span className="faq-icon-wrap">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="faq-chevron">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </button>
                  <div className={`faq-answer-wrap${isOpen ? " open" : ""}`}>
                    <div className="faq-answer-content">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CLOSING CALL TO ACTION */}
      <section className="closing-cta-section">
        {/* Mascot Kiri */}
        <div className="closing-cta-mascot mascot-left">
          <Image
            src="/images/mascot-award-2.webp"
            alt="Maskot Kiri"
            width={180}
            height={240}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        <div className="closing-cta-content">
          <h2 className="closing-cta-title">Siap Menghidupkan Cerita Brand Anda Lewat Animasi?</h2>
          <p className="closing-cta-desc">
            Bangun animasi, karakter, dan visual storytelling yang membuat pesan Anda lebih menarik, mudah dipahami, dan mudah diingat.
          </p>
          <button className="btn-bergabung-navy" onClick={handlePesan}>
            Diskusikan Proyek Animasi <span className="btn-bergabung-navy-arrow">›</span>
          </button>
        </div>

        {/* Mascot Kanan */}
        <div className="closing-cta-mascot mascot-right">
          <Image
            src="/images/mascot-award-1.webp"
            alt="Maskot Kanan"
            width={180}
            height={240}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </section>



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
                  <source src="/videos/trailer-1.webm" type="video/webm" />
                  Browser Anda tidak mendukung tag video.
                </video>
                <div id={`video-fallback-${selectedAnim.id}`} className="popup-video-fallback" style={{ display: "none" }}>
                  <div style={{ fontSize: 56 }}>🎬</div>
                  <div>Tambahkan file trailer di:<br />/public/videos/trailer-1.webm</div>
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
              <Link href="/login" className="btn-popup-login" prefetch={false}>Masuk Sekarang</Link>
              <p className="popup-gate-alt">Belum punya akun? <Link href="/register" prefetch={false}>Daftar gratis di sini</Link></p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
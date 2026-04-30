"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { registerUser } from "@/lib/api"; // sesuaikan path
import { useRouter } from "next/navigation";

interface FormState {
  nama: string;
  username: string;
  email: string;
  nomorWa: string;
  password: string;
  konfirmasiPassword: string;
}
interface FieldErrors {
  nama?: string;
  username?: string;
  email?: string;
  nomorWa?: string;
  password?: string;
  konfirmasiPassword?: string;
}

export default function RegisterPage() {
  const [form, setForm] = useState<FormState>({
    nama: "", username: "", email: "",
    nomorWa: "", password: "", konfirmasiPassword: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [showKonfirm, setShowKonfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  // Track which field has been touched (blurred)
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setServerError("");
    setFieldErrors(prev => ({ ...prev, [name]: "" }));
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    if (!form.nama.trim()) errors.nama = "Nama wajib diisi";
    if (!form.username.trim()) errors.username = "Username wajib diisi";
    else if (form.username.length < 3) errors.username = "Minimal 3 karakter";
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) errors.username = "Hanya huruf, angka, _";
    if (!form.email.trim()) errors.email = "Email wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Format email tidak valid";
    if (!form.nomorWa.trim()) errors.nomorWa = "Nomor WA wajib diisi";
    else if (!/^(\+62|08)[0-9]{7,12}$/.test(form.nomorWa.replace(/\s/g, "")))
      errors.nomorWa = "Format: 08xx atau +62xx";
    if (!form.password) errors.password = "Password wajib diisi";
    else if (form.password.length < 6) errors.password = "Minimal 6 karakter";
    if (!form.konfirmasiPassword) errors.konfirmasiPassword = "Wajib diisi";
    else if (form.password !== form.konfirmasiPassword) errors.konfirmasiPassword = "Password tidak cocok";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const router = useRouter();

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setTouched({
    nama: true, username: true, email: true,
    nomorWa: true, password: true, konfirmasiPassword: true,
  });
  if (!validate()) return;

  setLoading(true);
  setServerError("");

  try {
    await registerUser({
      nama: form.nama,
      username: form.username,
      email: form.email,
      nomorWa: form.nomorWa,
      password: form.password,
    });

    setSuccess(true);

    // Redirect ke login setelah 2 detik
    setTimeout(() => router.push("/login"), 2000);

  } catch (err: any) {
    // Error duplikat username/email — tandai field spesifik
    if (err.field === "username") {
      setFieldErrors((prev) => ({ ...prev, username: "Username sudah digunakan" }));
    } else if (err.field === "email") {
      setFieldErrors((prev) => ({ ...prev, email: "Email sudah terdaftar" }));
    } else {
      setServerError(err.message || "Terjadi kesalahan, coba lagi");
    }
  } finally {
    setLoading(false);
  }
};

  // Password strength
  const getPwStrength = (pw: string) => {
    if (!pw) return null;
    if (pw.length < 6) return { label: "Lemah", color: "#F04E23", pct: 25 };
    if (/[A-Z]/.test(pw) && /[0-9]/.test(pw) && /[^a-zA-Z0-9]/.test(pw))
      return { label: "Sangat Kuat", color: "#00d68f", pct: 100 };
    if (/[A-Z]/.test(pw) && /[0-9]/.test(pw))
      return { label: "Kuat", color: "#2ecc71", pct: 75 };
    if (pw.length >= 8)
      return { label: "Cukup", color: "#FFB800", pct: 55 };
    return { label: "Cukup", color: "#FFB800", pct: 45 };
  };
  const strength = getPwStrength(form.password);
  const pwMatch = form.konfirmasiPassword.length > 0
    ? form.password === form.konfirmasiPassword
    : null;

  // Step progress (visual only)
  const filledCount = Object.values(form).filter(v => v.trim().length > 0).length;
  const progress = Math.round((filledCount / 6) * 100);

  return (
    <div style={{
      fontFamily: "'Nunito', sans-serif",
      minHeight: "100vh",
      background: "var(--kc-bg)",
      display: "flex",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .stars {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            radial-gradient(1px 1px at 8% 12%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 22% 65%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 45% 28%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 68% 78%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 78% 18%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 88% 50%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 55% 92%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 32% 88%, rgba(255,255,255,0.4) 0%, transparent 100%);
        }

        /* ── Left panel ── */
        .reg-left {
          flex: 1;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 60px 40px;
          position: relative; z-index: 1;
        }
        .reg-left-deco {
          position: absolute; inset: 0;
          background: linear-gradient(145deg, rgba(30,45,107,0.55) 0%, rgba(26,26,62,0.25) 100%);
          pointer-events: none;
        }
        .blob-tl {
          position: absolute; width: 450px; height: 450px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,184,0,0.12) 0%, transparent 70%);
          top: -120px; left: -100px; pointer-events: none;
        }
        .blob-br {
          position: absolute; width: 380px; height: 380px; border-radius: 50%;
          background: radial-gradient(circle, rgba(240,78,35,0.1) 0%, transparent 70%);
          bottom: -100px; right: -60px; pointer-events: none;
        }

        .reg-left-content {
          position: relative; z-index: 1;
          text-align: center; max-width: 400px;
        }
        .reg-logo {
          display: inline-flex; align-items: center; gap: 12px;
          margin-bottom: 48px; text-decoration: none;
        }
        .reg-logo-icon {
          width: 65px; height: 65px;
          border-radius: 15px;
          display: flex; align-items: center; justify-content: center;
          font-size: 25px;
        }
        .reg-logo-text { font-family: 'Fredoka One', cursive; font-size: 30px; color: #FFB800; }

        .reg-illustration {
          font-size: 96px; display: block;
          margin-bottom: 28px;
          animation: float 4s ease-in-out infinite;
          filter: drop-shadow(0 16px 32px rgba(255,184,0,0.2));
        }
        .reg-tagline {
          font-family: 'Fredoka One', cursive;
          font-size: 34px; color: var(--kc-text);
          line-height: 1.2; margin-bottom: 14px;
        }
        .reg-tagline span { color: #F04E23; }
        .reg-desc {
          color: var(--kc-text-muted);
          font-size: 15px; font-weight: 600;
          line-height: 1.75;
        }

        /* Orbit decorations */
        .orbit-item {
          position: absolute;
          width: 52px; height: 52px;
          background: var(--kc-surface-hover);
          border: 1px solid var(--kc-border);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
        }
        .orbit-a { top: 22%; right: 8%; animation: floatO 3s ease-in-out infinite; }
        .orbit-b { bottom: 28%; left: 6%; animation: floatO 4s ease-in-out infinite 1s; }
        .orbit-c { top: 55%; right: 5%; animation: floatO 3.5s ease-in-out infinite 0.5s; }

        /* ── Right panel ── */
        .reg-right {
          width: 540px;
          min-height: 100vh;
          background: var(--kc-surface);
          border-left: 1px solid var(--kc-border);
          display: flex; align-items: flex-start; justify-content: center;
          padding: 40px 44px 48px;
          position: relative; z-index: 1;
          backdrop-filter: blur(24px);
          overflow-y: auto;
          box-shadow: -8px 0 30px var(--kc-shadow);
        }
        .reg-right::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(240,78,35,0.03) 0%, transparent 30%);
          pointer-events: none;
        }

        .reg-form-inner {
          width: 100%; max-width: 420px;
          padding-top: 20px;
          animation: slideUp 0.5s cubic-bezier(0.34,1.2,0.64,1) forwards;
          position: relative; z-index: 1;
        }

        /* Progress bar */
        .progress-wrap {
          margin-bottom: 32px;
        }
        .progress-meta {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 8px;
        }
        .progress-label {
          font-size: 11px; font-weight: 800; letter-spacing: 1px;
          text-transform: uppercase; color: var(--kc-text-muted);
        }
        .progress-pct {
          font-size: 12px; font-weight: 800;
          color: #FFB800;
          font-family: 'Fredoka One', cursive;
        }
        .progress-bar {
          height: 5px;
          background: var(--kc-surface-hover);
          border-radius: 10px; overflow: hidden;
        }
        .progress-fill {
          height: 100%; border-radius: 10px;
          background: linear-gradient(90deg, #FFB800, #F04E23);
          transition: width 0.4s ease;
          box-shadow: 0 0 8px rgba(255,184,0,0.4);
        }

        .reg-heading {
          font-family: 'Fredoka One', cursive;
          font-size: 34px; color: var(--kc-text);
          line-height: 1.1; margin-bottom: 6px;
        }
        .reg-heading span { color: #FFB800; }
        .reg-subheading {
          color: rgba(255,255,255,0.38);
          font-size: 14px; font-weight: 600;
          margin-bottom: 30px;
        }

        /* Form grid */
        .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .form-group { margin-bottom: 16px; }
        .form-label {
          display: flex; align-items: center; justify-content: space-between;
          color: var(--kc-text-muted);
          font-size: 11px; font-weight: 800;
          letter-spacing: 1px; text-transform: uppercase;
          margin-bottom: 8px;
        }
        .field-err { color: #ff8a6e; font-size: 10px; font-weight: 700; letter-spacing: 0.3px; }

        .input-wrap { position: relative; }
        .input-icon {
          position: absolute; left: 14px; top: 50%;
          transform: translateY(-50%);
          font-size: 15px; pointer-events: none; opacity: 0.38;
        }
        .form-input {
          width: 100%;
          background: var(--kc-surface-hover);
          border: 1.5px solid var(--kc-border);
          border-radius: 12px;
          padding: 13px 14px 13px 40px;
          color: var(--kc-text);
          font-family: 'Nunito', sans-serif;
          font-size: 14px; font-weight: 600;
          outline: none;
          transition: all 0.22s ease;
        }
        .form-input::placeholder { color: var(--kc-text-faint); }
        .form-input:focus {
          border-color: #FFB800;
          background: rgba(255,184,0,0.05);
          box-shadow: 0 0 0 4px rgba(255,184,0,0.07);
        }
        .form-input.has-error {
          border-color: rgba(240,78,35,0.55);
          background: rgba(240,78,35,0.04);
        }
        .form-input.is-valid {
          border-color: rgba(46,204,113,0.5);
          background: rgba(46,204,113,0.04);
        }
        .toggle-pw {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          font-size: 15px; opacity: 0.32; padding: 4px; line-height: 1;
          transition: opacity 0.2s;
        }
        .toggle-pw:hover { opacity: 0.8; }

        /* Password strength */
        .pw-extras { margin-top: 7px; }
        .pw-bar-track {
          height: 4px; background: var(--kc-surface-hover);
          border-radius: 4px; overflow: hidden; margin-bottom: 5px;
        }
        .pw-bar-fill {
          height: 100%; border-radius: 4px;
          transition: width 0.3s ease, background 0.3s ease;
        }
        .pw-bar-label { font-size: 10px; font-weight: 800; }

        /* Match pill */
        .match-pill {
          display: inline-flex; align-items: center; gap: 5px;
          margin-top: 7px; font-size: 10px; font-weight: 800;
          padding: 3px 10px; border-radius: 50px;
        }

        /* Server error */
        .server-error {
          background: rgba(240,78,35,0.1);
          border: 1px solid rgba(240,78,35,0.3);
          border-radius: 12px;
          padding: 12px 15px;
          color: #ff8a6e;
          font-size: 13px; font-weight: 700;
          margin-bottom: 18px;
          display: flex; align-items: center; gap: 9px;
          animation: shake 0.4s ease;
        }

        /* Success */
        .success-state {
          text-align: center;
          padding: 40px 20px;
          animation: fadeIn 0.4s ease;
        }
        .success-emoji { font-size: 72px; margin-bottom: 20px; display: block; animation: popIn 0.5s cubic-bezier(0.34,1.6,0.64,1) forwards; }
        .success-title { font-family: 'Fredoka One', cursive; font-size: 30px; color: #2ecc71; margin-bottom: 10px; }
        .success-desc { color: var(--kc-text-muted); font-size: 14px; font-weight: 600; line-height: 1.7; }

        /* Submit */
        .btn-submit {
          width: 100%;
          background: linear-gradient(135deg, #F04E23 0%, #FFB800 100%);
          color: white;
          padding: 15px;
          border-radius: 14px;
          font-family: 'Nunito', sans-serif;
          font-weight: 900; font-size: 16px;
          border: none; cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 6px;
          box-shadow: 0 10px 28px rgba(240,78,35,0.28);
          display: flex; align-items: center; justify-content: center; gap: 10px;
          position: relative; overflow: hidden;
        }
        .btn-submit::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .btn-submit:hover:not(:disabled)::before { opacity: 1; }
        .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 16px 36px rgba(240,78,35,0.42); }
        .btn-submit:disabled { opacity: 0.55; cursor: not-allowed; }

        .spinner {
          width: 17px; height: 17px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite; flex-shrink: 0;
        }

        .form-footer-reg {
          margin-top: 24px;
          padding-top: 22px;
          border-top: 1px solid var(--kc-border);
          text-align: center;
        }
        .footer-text-reg {
          color: var(--kc-text-muted);
          font-size: 13px; font-weight: 600; margin-bottom: 14px;
        }
        .btn-login-alt {
          display: flex;
          width: 100%;
          justify-content: center;
          align-items: center;
          gap: 8px;

          background: var(--kc-surface-hover);
          border: 1.5px solid var(--kc-border);
          border-radius: 13px;
          padding: 14px 18px;

          color: var(--kc-text);
          font-family: 'Nunito', sans-serif;
          font-weight: 800;
          font-size: 15px;
          text-decoration: none;
          text-align: center;

          transition: all 0.25s ease;
          cursor: pointer;

          box-sizing: border-box;
        }

        .btn-login-alt:hover {
          border-color: #FFB800;
          color: #FFB800;
          background: rgba(255, 184, 0, 0.08);
          transform: translateY(-2px);
        }

        /* Animations */
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes floatO {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @media (max-width: 960px) {
          .reg-left { display: none; }
          .reg-right {
            width: 100%; border-left: none;
            background: transparent; backdrop-filter: none;
            padding: 36px 22px 48px; align-items: flex-start;
          }
          .reg-form-inner { max-width: 100%; }
        }
        @media (max-width: 420px) {
          .form-row-2 { grid-template-columns: 1fr; gap: 0; }
        }
      `}</style>

      <div className="stars" />

      {/* ── LEFT PANEL ── */}
      <div className="reg-left">
        <div className="reg-left-deco" />
        <div className="blob-tl" />
        <div className="blob-br" />

        <div className="reg-left-content">
          <Link href="/" className="reg-logo">
            <div className="reg-logo-icon"><img src="logo.png" alt="logo" /></div>
            <span className="reg-logo-text">Kidscenter</span>
          </Link>

          <span className="reg-illustration"><img src="Mari.png" alt="Mari" /></span>

          <h2 className="reg-tagline">
            Bergabung &<br />Mulai <span>Petualangan!</span>
          </h2>
          <p className="reg-desc">
            Buat akunmu sekarang dan dapatkan<br />
            akses ke ratusan animasi edukatif<br />
            yang seru untuk si kecil.
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL (FORM) ── */}
      <div className="reg-right">
        <div className="reg-form-inner">

          {/* Progress bar */}
          <div className="progress-wrap">
            <div className="progress-meta">
              <span className="progress-label">Kelengkapan Data</span>
              <span className="progress-pct">{progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <h1 className="reg-heading">Buat Akun <span>Baru</span></h1>
          <p className="reg-subheading">Isi data di bawah untuk memulai petualangan</p>

          {success ? (
            <div className="success-state">
              <span className="success-emoji">🎉</span>
              <div className="success-title">Akun Berhasil Dibuat!</div>
              <p className="success-desc">
                Selamat bergabung di Kidscenter!<br />
                Mengalihkan ke halaman masuk...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {serverError && (
                <div className="server-error">
                  <span>⚠️</span><span>{serverError}</span>
                </div>
              )}

              {/* Nama + Username */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="nama">
                    Nama Lengkap
                    {fieldErrors.nama && <span className="field-err">{fieldErrors.nama}</span>}
                  </label>
                  <div className="input-wrap">
                    <span className="input-icon">✏️</span>
                    <input
                      id="nama" name="nama" type="text"
                      className={`form-input${fieldErrors.nama ? " has-error" : touched.nama && form.nama ? " is-valid" : ""}`}
                      placeholder="Nama kamu"
                      value={form.nama}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="username">
                    Username
                    {fieldErrors.username && <span className="field-err">{fieldErrors.username}</span>}
                  </label>
                  <div className="input-wrap">
                    <span className="input-icon" style={{ fontStyle: "normal", fontWeight: 900, fontSize: 14 }}>@</span>
                    <input
                      id="username" name="username" type="text"
                      className={`form-input${fieldErrors.username ? " has-error" : touched.username && form.username.length >= 3 ? " is-valid" : ""}`}
                      placeholder="username_kamu"
                      value={form.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="username"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Alamat Email
                  {fieldErrors.email && <span className="field-err">{fieldErrors.email}</span>}
                </label>
                <div className="input-wrap">
                  <span className="input-icon">📧</span>
                  <input
                    id="email" name="email" type="email"
                    className={`form-input${fieldErrors.email ? " has-error" : touched.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? " is-valid" : ""}`}
                    placeholder="email@contoh.com"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Nomor WA */}
              <div className="form-group">
                <label className="form-label" htmlFor="nomorWa">
                  Nomor WhatsApp
                  {fieldErrors.nomorWa && <span className="field-err">{fieldErrors.nomorWa}</span>}
                </label>
                <div className="input-wrap">
                  <span className="input-icon">📱</span>
                  <input
                    id="nomorWa" name="nomorWa" type="tel"
                    className={`form-input${fieldErrors.nomorWa ? " has-error" : touched.nomorWa && form.nomorWa.length > 8 ? " is-valid" : ""}`}
                    placeholder="08xx atau +62xx"
                    value={form.nomorWa}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="tel"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="password">
                  Password
                  {fieldErrors.password && <span className="field-err">{fieldErrors.password}</span>}
                </label>
                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input
                    id="password" name="password"
                    type={showPw ? "text" : "password"}
                    className={`form-input${fieldErrors.password ? " has-error" : strength && strength.pct >= 75 ? " is-valid" : ""}`}
                    placeholder="Min. 6 karakter"
                    value={form.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="new-password"
                  />
                  <button type="button" className="toggle-pw" onClick={() => setShowPw(v => !v)}>
                    {showPw ? "🙈" : "👁️"}
                  </button>
                </div>
                {strength && (
                  <div className="pw-extras">
                    <div className="pw-bar-track">
                      <div className="pw-bar-fill" style={{ width: `${strength.pct}%`, background: strength.color }} />
                    </div>
                    <span className="pw-bar-label" style={{ color: strength.color }}>
                      Kekuatan: {strength.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Konfirmasi Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="konfirmasiPassword">
                  Konfirmasi Password
                  {fieldErrors.konfirmasiPassword && <span className="field-err">{fieldErrors.konfirmasiPassword}</span>}
                </label>
                <div className="input-wrap">
                  <span className="input-icon">🔑</span>
                  <input
                    id="konfirmasiPassword" name="konfirmasiPassword"
                    type={showKonfirm ? "text" : "password"}
                    className={`form-input${fieldErrors.konfirmasiPassword ? " has-error" : pwMatch === true ? " is-valid" : ""}`}
                    placeholder="Ulangi password"
                    value={form.konfirmasiPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="new-password"
                  />
                  <button type="button" className="toggle-pw" onClick={() => setShowKonfirm(v => !v)}>
                    {showKonfirm ? "🙈" : "👁️"}
                  </button>
                </div>
                {pwMatch !== null && (
                  <div
                    className="match-pill"
                    style={{
                      background: pwMatch ? "rgba(46,204,113,0.12)" : "rgba(240,78,35,0.12)",
                      color: pwMatch ? "#2ecc71" : "#ff8a6e",
                      border: `1px solid ${pwMatch ? "rgba(46,204,113,0.3)" : "rgba(240,78,35,0.3)"}`,
                    }}
                  >
                    {pwMatch ? "✓ Password cocok" : "✗ Password tidak cocok"}
                  </div>
                )}
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading
                  ? <><span className="spinner" /> Mendaftarkan...</>
                  : <>Daftar Sekarang</>
                }
              </button>
            </form>
          )}

          {!success && (
            <div className="form-footer-reg">
              <p className="footer-text-reg">Sudah punya akun?</p>
              <Link href="/login" className="btn-login-alt">
                Masuk di sini
              </Link>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
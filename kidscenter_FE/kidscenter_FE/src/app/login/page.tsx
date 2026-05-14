"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.identifier || !form.password) {
      setError("Username/email dan password wajib diisi");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await loginUser(form);

      // Simpan token & info user di localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect ke landing page
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Login gagal, coba lagi");
    } finally {
      setLoading(false);
    }
  };

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

        /* ── Stars background ── */
        .stars {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 25% 60%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 40% 30%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 55% 80%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 70% 20%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 80% 55%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 90% 35%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 15% 85%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 60% 10%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 35% 95%, rgba(255,255,255,0.3) 0%, transparent 100%);
        }

        /* ── Left panel ── */
        .login-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 40px;
          position: relative;
          z-index: 1;
        }
        .left-deco {
          position: absolute; inset: 0;
          background: linear-gradient(145deg, rgba(30,45,107,0.6) 0%, rgba(26,26,62,0.3) 100%);
          pointer-events: none;
        }
        .left-blob-1 {
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(240,78,35,0.15) 0%, transparent 70%);
          top: -150px; left: -150px;
          pointer-events: none;
        }
        .left-blob-2 {
          position: absolute;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,184,0,0.1) 0%, transparent 70%);
          bottom: -100px; right: -50px;
          pointer-events: none;
        }
        .left-content {
          position: relative; z-index: 1;
          text-align: center;
          max-width: 420px;
        }
        .left-logo {
          display: inline-flex; align-items: center; gap: 12px;
          margin-bottom: 60px;
          text-decoration: none;
        }
        .left-logo-icon {
          width: 65px; height: 65px;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 26px;
        }
        .left-logo-text {
          font-family: 'Fredoka One', cursive;
          font-size: 32px; color: #FFB800;
        }
        .left-illustration {
          font-size: 110px;
          margin-bottom: 32px;
          animation: float 3.5s ease-in-out infinite;
          display: block;
          filter: drop-shadow(0 20px 40px rgba(255,184,0,0.2));
        }
        .left-tagline {
          font-family: 'Fredoka One', cursive;
          font-size: 36px;
          color: var(--kc-text);
          line-height: 1.2;
          margin-bottom: 16px;
        }
        .left-tagline span { color: #FFB800; }
        .left-desc {
          color: var(--kc-text-muted);
          font-size: 16px; font-weight: 600;
          line-height: 1.7;
        }

        /* ── Floating badges ── */
        .float-badge {
          position: absolute;
          background: var(--kc-surface-hover);
          border: 1px solid var(--kc-border);
          border-radius: 50px;
          padding: 8px 16px;
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; font-weight: 700;
          color: var(--kc-text-muted);
          backdrop-filter: blur(10px);
          white-space: nowrap;
        }
        .badge-1 { top: 18%; left: 5%; animation: floatBadge 4s ease-in-out infinite; }
        .badge-2 { top: 35%; right: 3%; animation: floatBadge 3.5s ease-in-out infinite 0.8s; }
        .badge-3 { bottom: 25%; left: 8%; animation: floatBadge 4.5s ease-in-out infinite 1.5s; }

        /* ── Right panel (form) ── */
        .login-right {
          width: 500px;
          min-height: 100vh;
          background: var(--kc-surface);
          border-left: 1px solid var(--kc-border);
          display: flex; align-items: center; justify-content: center;
          padding: 48px 44px;
          position: relative; z-index: 1;
          backdrop-filter: blur(20px);
          box-shadow: -8px 0 30px var(--kc-shadow);
        }
        .login-right::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(255,184,0,0.03) 0%, transparent 40%);
          pointer-events: none;
        }
        .form-inner {
          width: 100%;
          max-width: 400px;
          position: relative; z-index: 1;
          animation: slideUp 0.5s cubic-bezier(0.34,1.2,0.64,1) forwards;
        }

        .form-header { margin-bottom: 36px; }
        .form-greeting {
          font-size: 13px; font-weight: 800;
          letter-spacing: 3px; text-transform: uppercase;
          color: #FFB800; margin-bottom: 10px;
          display: flex; align-items: center; gap: 8px;
        }
        .form-greeting::before {
          content: ''; display: block;
          width: 24px; height: 3px;
          background: #FFB800; border-radius: 2px;
        }
        .form-title {
          font-family: 'Fredoka One', cursive;
          font-size: 38px; color: var(--kc-text);
          line-height: 1.1; margin-bottom: 10px;
        }
        .form-title span { color: #F04E23; }
        .form-subtitle {
          color: var(--kc-text-faint);
          font-size: 15px; font-weight: 600;
        }

        /* ── Form elements ── */
        .form-group { margin-bottom: 22px; }
        .form-label {
          display: block;
          color: var(--kc-text-muted);
          font-size: 12px; font-weight: 800;
          letter-spacing: 1px; text-transform: uppercase;
          margin-bottom: 9px;
        }
        .input-wrap { position: relative; }
        .input-icon {
          position: absolute; left: 16px; top: 50%;
          transform: translateY(-50%);
          font-size: 16px; pointer-events: none;
          opacity: 0.4; transition: opacity 0.2s;
        }
        .form-input {
          width: 100%;
          background: var(--kc-surface-hover);
          border: 1.5px solid var(--kc-border);
          border-radius: 14px;
          padding: 15px 16px 15px 46px;
          color: var(--kc-text);
          font-family: 'Nunito', sans-serif;
          font-size: 15px; font-weight: 600;
          outline: none;
          transition: all 0.25s ease;
          letter-spacing: 0.3px;
        }
        .form-input::placeholder { color: var(--kc-text-faint); }
        .form-input:focus {
          border-color: #FFB800;
          background: rgba(255,184,0,0.05);
          box-shadow: 0 0 0 4px rgba(255,184,0,0.08);
        }
        .form-input:focus + .input-focus-line { transform: scaleX(1); }
        .form-input.has-error {
          border-color: rgba(240,78,35,0.6);
          background: rgba(240,78,35,0.05);
        }
        .toggle-pw {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          font-size: 17px; opacity: 0.35;
          transition: opacity 0.2s; padding: 4px; line-height: 1;
        }
        .toggle-pw:hover { opacity: 0.8; }

        /* ── Error box ── */
        .error-box {
          background: rgba(240,78,35,0.1);
          border: 1px solid rgba(240,78,35,0.3);
          border-radius: 12px;
          padding: 12px 16px;
          color: #ff8a6e;
          font-size: 13px; font-weight: 700;
          margin-bottom: 22px;
          display: flex; align-items: center; gap: 10px;
          animation: shake 0.4s ease;
        }

        /* ── Submit button ── */
        .btn-submit {
          width: 100%;
          background: linear-gradient(135deg, #FFB800 0%, #F04E23 100%);
          color: white;
          padding: 16px;
          border-radius: 14px;
          font-family: 'Nunito', sans-serif;
          font-weight: 900; font-size: 16px;
          border: none; cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 4px;
          box-shadow: 0 10px 30px rgba(240,78,35,0.3);
          display: flex; align-items: center; justify-content: center; gap: 10px;
          letter-spacing: 0.3px;
          position: relative; overflow: hidden;
        }
        .btn-submit::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .btn-submit:hover:not(:disabled)::before { opacity: 1; }
        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(240,78,35,0.45);
        }
        .btn-submit:active:not(:disabled) { transform: translateY(0); }
        .btn-submit:disabled { opacity: 0.55; cursor: not-allowed; }

        .spinner {
          width: 18px; height: 18px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        /* ── Bottom links ── */
        .form-footer {
          margin-top: 32px;
          padding-top: 28px;
          border-top: 1px solid rgba(255,255,255,0.07);
          text-align: center;
        }
        .form-footer-text {
          color: var(--kc-text-faint);
          font-size: 14px; font-weight: 600;
          margin-bottom: 16px;
        }
        .btn-register {
          display: block; width: 100%;
          background: transparent;
          border: 1.5px solid var(--kc-border);
          border-radius: 14px;
          padding: 14px;
          color: var(--kc-text);
          font-family: 'Nunito', sans-serif;
          font-weight: 800; font-size: 15px;
          text-decoration: none;
          text-align: center;
          transition: all 0.25s ease;
          letter-spacing: 0.3px;
          background: var(--kc-surface-hover);
        }
        .btn-register:hover {
          border-color: rgba(255,184,0,0.5);
          color: #FFB800;
          background: rgba(255,184,0,0.05);
        }

        /* ── Animations ── */
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .login-left { display: none; }
          .login-right {
            width: 100%; min-height: 100vh;
            border-left: none;
            background: transparent;
            backdrop-filter: none;
            padding: 40px 24px;
          }
          .form-inner { max-width: 100%; }
        }
      `}</style>

      <div className="stars" />

      {/* ── LEFT PANEL ── */}
      <div className="login-left">
        <div className="left-deco" />
        <div className="left-blob-1" />
        <div className="left-blob-2" />

        {/* Floating badges */}
        <div className="left-content">
          <Link href="/" className="left-logo">
            <div className="left-logo-icon"><img src="logo.png" alt="logo" /></div>
            <span className="left-logo-text">Kidscenter</span>
          </Link>

          <span className="left-illustration"><img src="Mari.png" alt="Mari" /></span>

          <h2 className="left-tagline">
            Dunia Animasi<br /><span>Penuh Warna</span><br />Menantimu!
          </h2>
          <p className="left-desc">
            Masuk dan nikmati ratusan serial animasi<br />
            seru dan edukatif untuk si kecil.
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL (FORM) ── */}
      <div className="login-right">
        <div className="form-inner">

          <div className="form-header">
            <div className="form-greeting">Selamat Datang</div>
            <h1 className="form-title">Masuk ke<br /><span>Akunmu</span></h1>
            <p className="form-subtitle">Petualangan seru sudah menunggumu di dalam!</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="error-box">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Username / Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="identifier">Username atau Email</label>
              <div className="input-wrap">
                <span className="input-icon">👤</span>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  className={`form-input${error ? " has-error" : ""}`}
                  placeholder="Masukkan username atau email"
                  value={form.identifier}
                  onChange={handleChange}
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className={`form-input${error ? " has-error" : ""}`}
                  placeholder="Masukkan password kamu"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-pw"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label="Toggle password"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading
                ? <><span className="spinner" /> Memverifikasi...</>
                : <>Masuk Sekarang</>
              }
            </button>
          </form>

          <div className="form-footer">
            <p className="form-footer-text">Belum punya akun?</p>
            <Link href="/register" className="btn-register">
              Daftar Gratis Sekarang
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
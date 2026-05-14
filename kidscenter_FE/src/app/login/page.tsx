"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/");
    } catch (err: any) {
      setError(err.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          background: var(--kc-bg);
          color: var(--kc-text);
          font-family: "Nunito", sans-serif;
        }

        /* LEFT PANEL */
        .auth-left {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
          background-color: var(--kc-bg);
          background-image: 
            linear-gradient(
              135deg,
              var(--kc-bg-alt) 0%,
              var(--kc-bg) 100%
            );
          background-size: cover;
          background-position: center;
        }

        :global([data-theme="light"]) .auth-left {
          background-image: url('/textureBg.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        .auth-content {
          width: 100%;
          max-width: 500px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .auth-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          text-decoration: none;
        }

        .logo-img {
          width: 180px;
          height: auto;
          display: block;
          object-fit: contain;
        }

        .logo-text {
          margin-top: 10px;
          font-size: 22px;
          font-weight: 800;
          color: var(--kc-navy);
        }

        .auth-illustration {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 28px;
        }

        .auth-illustration img {
          width: 260px;
          height: auto;
          display: block;
          object-fit: contain;
          margin: 0 auto;
        }

        .auth-tagline {
          font-size: 38px;
          font-weight: 900;
          line-height: 1.15;
          margin-bottom: 14px;
        }

        .auth-tagline span {
          color: #FFB11B;
        }

        .auth-desc {
          font-size: 16px;
          color: var(--kc-text-muted);
          line-height: 1.7;
        }

        /* RIGHT PANEL */
        .auth-right {
          width: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 42px;
          background: var(--kc-panel);
          border-left: 1px solid var(--kc-border);
        }

        .form-inner {
          width: 100%;
          max-width: 360px;
        }

        .form-header {
          margin-bottom: 30px;
        }

        .form-greeting {
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 8px;
          color: #FFB11B;
        }

        .form-title {
          font-size: 38px;
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 8px;
          color: white;
        }

        :global([data-theme="dark"]) .form-title {
          color: var(--kc-text);
        }

        .form-title span {
          color: var(--kc-yellow);
        }

        :global([data-theme="dark"]) .form-title span {
          color: var(--kc-red);
        }

        .form-subtitle {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.82);
        }

        :global([data-theme="dark"]) .form-subtitle {
          color: var(--kc-text-muted);
        }

        .form-group {
          margin-bottom: 18px;
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          font-size: 13px;
          font-weight: 700;
          color: white;
        }

        :global([data-theme="dark"]) .form-label {
          color: var(--kc-text-muted);
        }

        .input-wrap {
          position: relative;
        }

        .form-input {
          width: 100%;
          padding: 14px 46px 14px 16px;
          border-radius: 14px;
          border: 1.5px solid transparent;
          background: white;
          color: var(--kc-navy);
          font-size: 15px;
          font-weight: 600;
          outline: none;
        }

        :global([data-theme="dark"]) .form-input {
          background: var(--kc-input-bg);
          color: var(--kc-text);
          border-color: var(--kc-border);
        }

        .toggle-pw {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          cursor: pointer;
        }

        .error-box {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 12px 14px;
          border-radius: 12px;
          margin-bottom: 18px;
          font-size: 14px;
          font-weight: 700;
        }

        :global([data-theme="dark"]) .error-box {
          background: var(--kc-error-bg);
          border: 1px solid var(--kc-error-border);
          color: var(--kc-error);
        }

        .btn-submit {
          width: 100%;
          padding: 15px;
          border-radius: 14px;
          border: none;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          color: var(--kc-btn-text);
          background: var(--kc-btn-primary);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
          transition: all 0.25s ease;
          margin-top: 10px;
        }

        :global([data-theme="light"]) .btn-submit {
          background: linear-gradient(135deg, #FFB11B 0%, #e09d10 100%);
          color: white;
        }

        :global([data-theme="light"]) .btn-submit:hover {
          background: linear-gradient(135deg, #ffc133 0%, #f0aa14 100%);
          box-shadow: 0 12px 28px rgba(255,177,27,0.35);
          transform: translateY(-2px);
        }

        :global([data-theme="dark"]) .btn-submit {
          background: var(--kc-btn-primary);
        }

        .form-footer {
          margin-top: 26px;
          padding-top: 22px;
          border-top: 1px solid rgba(255, 255, 255, 0.18);
          text-align: center;
        }

        :global([data-theme="dark"]) .form-footer {
          border-top: 1px solid var(--kc-border);
        }

        .form-footer-text {
          color: white;
          margin-bottom: 14px;
          font-size: 14px;
        }

        :global([data-theme="dark"]) .form-footer-text {
          color: var(--kc-text-muted);
        }

        .btn-outline {
          display: block;
          padding: 14px;
          border-radius: 14px;
          text-decoration: none;
          text-align: center;
          font-weight: 700;
          background: white;
          color: var(--kc-cyan);
        }

        .btn-outline:hover {
          transform: translateY(-2px);
          background: #f0fffe;
        }

        :global([data-theme="dark"]) .btn-outline {
          background: var(--kc-surface-hover);
          color: var(--kc-text);
          border: 1px solid var(--kc-border);
        }

        @media (max-width: 900px) {
          .auth-page {
            flex-direction: column;
            min-height: 100vh;
            background: var(--kc-cream);
            background-image: url('/textureBg.png');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            background-attachment: fixed;
          }

          :global([data-theme="dark"]) .auth-page {
            background: var(--kc-bg);
            background-image: none;
          }

          .auth-left {
            display: flex;
            flex: none;
            width: 100%;
            padding: 40px 20px 30px;
            background: transparent;
            border-bottom: none;
            justify-content: center;
            align-items: center;
          }

          :global([data-theme="light"]) .auth-left {
            background-image: none;
          }

          .auth-content {
            width: 100%;
            max-width: 100%;
          }

          .auth-logo {
            margin-bottom: 28px;
          }

          .logo-img {
            width: 120px !important;
            height: auto;
          }

          .logo-text {
            font-size: 18px;
            margin-top: 8px;
          }

          .auth-illustration {
            width: 140px;
            height: 140px;
            margin: 0 auto 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            background: white;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          }

          :global([data-theme="dark"]) .auth-illustration {
            background: var(--kc-surface);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
          }

          .auth-illustration img {
            width: 120px;
            height: auto;
          }

          .auth-tagline {
            font-size: 24px;
            margin-bottom: 16px;
            line-height: 1.3;
          }

          :global([data-theme="dark"]) .auth-tagline {
            color: var(--kc-text);
          }

          .auth-tagline span {
            color: var(--kc-red);
          }

          :global([data-theme="dark"]) .auth-tagline span {
            color: var(--kc-cyan);
          }

          .auth-desc {
            display: none;
          }

          .auth-right {
            flex: 1;
            width: 100%;
            border-left: none;
            padding: 0 0 40px 0;
            background: transparent;
            border-radius: 0;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            margin-top: -20px;
            position: relative;
            z-index: 10;
          }

          .form-inner {
            width: 100%;
            max-width: 100%;
            background: #17B7BD;
            padding: 28px 0;
            border-radius: 32px 32px 0 0;
            box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.08);
          }

          :global([data-theme="dark"]) .form-inner {
            background: var(--kc-panel);
            box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.35);
          }

          .form-header {
            margin-bottom: 24px;
            padding-left: 20px;
            padding-right: 20px;
          }

          .form-greeting {
            font-size: 12px;
            margin-bottom: 6px;
            color: rgba(255, 255, 255, 0.9);
          }

          :global([data-theme="dark"]) .form-greeting {
            color: var(--kc-cyan);
          }

          .form-title {
            font-size: 28px;
            margin-bottom: 6px;
            color: white;
          }

          :global([data-theme="dark"]) .form-title {
            color: var(--kc-text);
          }

          .form-title span {
            color: white;
          }

          :global([data-theme="dark"]) .form-title span {
            color: rgba(255, 255, 255, 0.85);
            color: var(--kc-red);
          }

          .form-subtitle {
            font-size: 13px;
          }

          :global([data-theme="dark"]) .form-subtitle {
            color: var(--kc-text-muted);
          }

          .form-input {
            padding: 12px 42px 12px 14px;
            font-size: 14px;
            background: rgba(255, 255, 255, 0.95);
            color: var(--kc-navy);
          }

          :global([data-theme="dark"]) .form-input {
            background: var(--kc-input-bg);
            color: var(--kc-text);
          }

          .form-header {
            padding-left: 20px;
            padding-right: 20px;
          }

          .form-group {
            padding-left: 20px;
            padding-right: 20px;
            margin-bottom: 16px;
          }

          .error-box {
            padding-left: 20px;
            padding-right: 20px;
          }

          .btn-submit {
            width: calc(100% - 40px);
            margin: 0 20px 20px 20px;
          }

          .form-footer {
            background: #17B7BD;
            padding: 20px;
            margin: 0;
            border-top: none;
            border-radius: 0 0 32px 32px;
          }

          .form-footer-text {
            color: rgba(255, 255, 255, 0.9);
          }

          .btn-outline {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
          }

          .btn-outline:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        }
      `}</style>

      <div className="auth-left">
        <div className="auth-content">
          <Link href="/" className="auth-logo">
            <img src="/logo.png" alt="Kidscenter" className="logo-img" />
          </Link>

          <div className="auth-illustration">
            <img src="/Mari.png" alt="Mari" />
          </div>

          <h2 className="auth-tagline">
            Dunia Animasi <br />
            <span>Penuh Warna</span>
          </h2>

          <p className="auth-desc">
            Masuk dan nikmati ratusan serial animasi seru
            <br />
            dan edukatif untuk si kecil.
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="form-inner">
          <div className="form-header">
            <div className="form-greeting">Selamat Datang</div>
            <h1 className="form-title">
              Masuk ke <span>Akunmu</span>
            </h1>
            <p className="form-subtitle">
              Petualangan seru sudah menunggumu!
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className="error-box">{error}</div>}

            <div className="form-group">
              <label className="form-label">Username / Email</label>
              <div className="input-wrap">
                <input
                  className="form-input"
                  name="identifier"
                  type="text"
                  value={form.identifier}
                  onChange={handleChange}
                  placeholder="Masukkan username/email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrap">
                <input
                  className="form-input"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Masukkan password"
                />
                <button
                  type="button"
                  className="toggle-pw"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Memverifikasi..." : "Masuk Sekarang"}
            </button>
          </form>

          <div className="form-footer">
            <p className="form-footer-text">Belum punya akun?</p>
            <Link href="/register" className="btn-outline">
              Daftar Gratis Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
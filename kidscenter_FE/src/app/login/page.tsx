"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";
import "../auth.css";
import AuthLayout from "@/components/AuthLayout";
import PasswordInput from "@/components/PasswordInput";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

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

      // Akun demo/tes → sessionStorage (hilang saat browser ditutup)
      // Akun database → localStorage (sesi persisten)
      const storage = data.isDemo ? sessionStorage : localStorage;
      storage.setItem("token", data.token);
      storage.setItem("user", JSON.stringify(data.user));

      // Redirect to admin dashboard if user is admin
      if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      tagline={
        <>
          Dunia Animasi <br />
          <span>Penuh Warna</span>
        </>
      }
      desc={
        <>
          Masuk dan nikmati ratusan serial animasi seru
          <br />
          dan edukatif untuk si kecil.
        </>
      }
    >
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
            <PasswordInput
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Masukkan password"
            />
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
    </AuthLayout>
  );
}
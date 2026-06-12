"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { registerUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import "../auth.css";
import AuthLayout from "@/components/AuthLayout";
import PasswordInput from "@/components/PasswordInput";

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
    nama: "",
    username: "",
    email: "",
    nomorWa: "",
    password: "",
    konfirmasiPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServerError("");
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));

    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const errors: FieldErrors = {};

    if (!form.nama.trim()) errors.nama = "Nama wajib diisi";
    if (!form.username.trim()) errors.username = "Username wajib diisi";
    if (!form.email.trim()) errors.email = "Email wajib diisi";
    if (!form.nomorWa.trim()) errors.nomorWa = "Nomor WA wajib diisi";
    if (!form.password.trim()) errors.password = "Password wajib diisi";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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

      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setServerError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      tagline={
        <>
          Bergabung & <br />
          Mulai <span>Petualangan!</span>
        </>
      }
      desc={
        <>
          Buat akunmu sekarang dan dapatkan akses
          ke ratusan animasi edukatif seru untuk si kecil.
        </>
      }
    >
      <div className="form-inner">
        <div className="form-header">
          <div className="form-greeting">Mari Bergabung</div>
          <h1 className="form-title">
            Buat Akun <span>Baru</span>
          </h1>
          <p className="form-subtitle">
            Isi data di bawah untuk memulai
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {serverError && <div className="error-box">{serverError}</div>}

          <div className="form-group">
            <label className="form-label">Nama Lengkap</label>
            <div className="input-wrap">
              <input
                className="form-input"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="input-wrap">
              <input
                className="form-input"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Masukkan username"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-wrap">
              <input
                className="form-input"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Masukkan email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nomor WhatsApp</label>
            <div className="input-wrap">
              <input
                className="form-input"
                name="nomorWa"
                value={form.nomorWa}
                onChange={handleChange}
                placeholder="Masukkan nomor WA"
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
            {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
          </button>
        </form>

        <div className="form-footer">
          <p className="form-footer-text">Sudah punya akun?</p>
          <Link href="/login" className="btn-outline">
            Masuk Sekarang
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
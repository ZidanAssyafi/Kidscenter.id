"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { logoutUser, updateProfile, changePassword, uploadAvatar } from "@/lib/api";
import PasswordInput from "@/components/PasswordInput";
import "../auth.css";
import "./profile.css";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"edit-profile" | "change-password">("edit-profile");
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (!storedUser) {
      router.push("/");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    setProfileForm({
      name: parsedUser.name || "",
      username: parsedUser.username || "",
      email: parsedUser.email || "",
      phone: parsedUser.phone || "",
    });
  }, [router]);

  const saveUserToStorage = (updatedUser: any) => {
    const inLocalStorage = !!localStorage.getItem("user");
    if (inLocalStorage) {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } else {
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
    }
    setUser(updatedUser);
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      // isDemo is true if user is in sessionStorage
      const isDemo = !!sessionStorage.getItem("user");
      const res = await updateProfile({ ...user, ...profileForm }, isDemo);
      saveUserToStorage(res.user);
      setMessage({ type: "success", text: res.message });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Gagal memperbarui profil" });
    } finally {
      setLoading(false);
    }
  };

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "Password baru dan konfirmasi tidak cocok" });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password baru minimal 6 karakter" });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const isDemo = !!sessionStorage.getItem("user");
      const res = await changePassword(passwordForm, isDemo);
      setMessage({ type: "success", text: res.message });
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Gagal mengubah password" });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage(null);
    try {
      const isDemo = !!sessionStorage.getItem("user");
      const res = await uploadAvatar(file, isDemo);
      const updatedUser = { ...user, avatar: res.avatarUrl };
      saveUserToStorage(updatedUser);
      setMessage({ type: "success", text: res.message });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Gagal mengunggah foto" });
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!user) return null; // Wait for redirect or load

  return (
    <div className="profile-page-full">
      <Link href="/" className="back-to-home" prefetch={false}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Beranda
      </Link>

      <div className="profile-sidebar-full">
        <div style={{ width: "100%", maxWidth: 360, margin: "0 auto" }}>
          <div className="profile-avatar-wrap">
            {user.avatar ? (
              <img src={user.avatar} alt="Profile" className="profile-avatar-img" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="profile-avatar-placeholder">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            )}
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
            <button className="btn-upload-avatar" onClick={handleAvatarClick} disabled={loading}>
              Ubah Foto
            </button>
          </div>
          
          <h2 style={{ fontSize: 32, marginBottom: 4, fontWeight: 900, color: "var(--kc-navy, #2E2A5E)" }}>{user.name}</h2>
          <p style={{ color: "var(--kc-navy, #2E2A5E)", fontWeight: 800, fontSize: 16 }}>@{user.username}</p>

          <div className="profile-nav">
            <button
              className={`btn-profile-nav ${activeTab === "edit-profile" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("edit-profile");
                setMessage(null);
                setIsMobileModalOpen(true);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              Edit Profil
            </button>
            <button
              className={`btn-profile-nav ${activeTab === "change-password" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("change-password");
                setMessage(null);
                setIsMobileModalOpen(true);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Ganti Password
            </button>
            
            <button className="btn-logout" onClick={handleLogout} style={{ marginTop: 20 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Keluar
            </button>
          </div>
        </div>
      </div>

      <div className={`profile-content-full ${isMobileModalOpen ? "show-modal" : ""}`}>
        <div className="profile-content-inner">
          <button className="btn-close-modal" onClick={() => setIsMobileModalOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <div className="form-header">
            <div className="form-greeting">Pengaturan Akun</div>
            <h1 className="form-title">
              {activeTab === "edit-profile" ? "Informasi Akun" : "Keamanan Akun"}
            </h1>
            <p className="form-subtitle">
              {activeTab === "edit-profile"
                ? "Perbarui informasi pribadi dan data kontak Anda."
                : "Pastikan akun Anda aman dengan password yang kuat."}
            </p>
          </div>

          {message && (
            <div className={`alert-message ${message.type === "success" ? "alert-success" : "alert-error"}`}>
              {message.text}
            </div>
          )}

          {activeTab === "edit-profile" ? (
            <form onSubmit={submitProfile}>
              <div className="form-group">
                <label className="form-label">Nama Lengkap</label>
                <div className="input-wrap">
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Username</label>
                <div className="input-wrap">
                  <input
                    type="text"
                    name="username"
                    className="form-input"
                    value={profileForm.username}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <div className="input-wrap">
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    value={profileForm.email}
                    disabled
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Nomor WhatsApp</label>
                <div className="input-wrap">
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </form>
          ) : (
            <form onSubmit={submitPassword}>
              <div className="form-group">
                <label className="form-label">Password Lama</label>
                <PasswordInput
                  name="oldPassword"
                  value={passwordForm.oldPassword}
                  onChange={handlePasswordChange}
                  placeholder="Masukkan password lama"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password Baru</label>
                <PasswordInput
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Masukkan password baru"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Konfirmasi Password Baru</label>
                <PasswordInput
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Ketik ulang password baru"
                />
              </div>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Perbarui Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

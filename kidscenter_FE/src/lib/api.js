const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.22:5000";

export async function registerUser(formData) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data.message || "Gagal mendaftar");
    err.field = data.field || null;
    err.status = res.status;
    throw err;
  }

  return data;
}

export async function loginUser({ identifier, password }) {
  // Temporary admin login for development — hanya sesi (sessionStorage)
  if (identifier === "admin" && password === "admin123") {
    return {
      token: "admin_token_temporary",
      isDemo: true,
      user: {
        id: "admin_001",
        username: "admin",
        email: "admin@kidscenter.id",
        role: "admin",
        name: "Admin Kidscenter",
      },
    };
  }

  // Temporary test user login for development — hanya sesi (sessionStorage)
  if (identifier === "test" && password === "test123") {
    return {
      token: "test_token_temporary",
      isDemo: true,
      user: {
        id: "test_001",
        username: "test",
        email: "test@gmail.com",
        phone: "08123456789",
        role: "user",
        name: "Zidan Assyafi",
        avatar: "",
      },
    };
  }

  // Login via database/backend — gunakan localStorage agar sesi persisten
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      identifier,
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data.message || "Login gagal");
    err.field = data.field || null;
    err.status = res.status;
    throw err;
  }

  return { ...data, isDemo: false };
}

export async function getMe(token) {
  const res = await fetch(`${BASE_URL}/api/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data.message || "Gagal mengambil data user");
    err.status = res.status;
    throw err;
  }

  return data;
}

export async function logoutUser() {
  if (typeof window !== "undefined") {
    // Bersihkan keduanya agar logout selalu berhasil
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  }

  return {
    message: "Logout success",
  };
}

// Mock function: Update Profile (Hanya simulasi)
export async function updateProfile(data, isDemo = false) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: "Profil berhasil diperbarui", user: data });
    }, 800);
  });
}

// Mock function: Change Password (Hanya simulasi)
export async function changePassword(data, isDemo = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate verifying old password for the 'test' user
      if (isDemo && data.oldPassword !== "test123") {
        reject(new Error("Password lama salah"));
      } else {
        resolve({ message: "Password berhasil diubah" });
      }
    }, 800);
  });
}

// Mock function: Upload Avatar (Hanya simulasi)
export async function uploadAvatar(file, isDemo = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (file.size > 1024 * 1024) {
        reject(new Error("Ukuran file maksimal 1MB"));
      } else {
        // Convert to base64 for simulation
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({ message: "Foto profil berhasil diperbarui", avatarUrl: reader.result });
        };
        reader.onerror = () => {
          reject(new Error("Gagal membaca file gambar"));
        };
        reader.readAsDataURL(file);
      }
    }, 1000);
  });
}
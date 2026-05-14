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

  return data;
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
    localStorage.removeItem("token");
  }

  return {
    message: "Logout success",
  };
}
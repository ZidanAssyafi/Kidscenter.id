const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://kidscenter-bagian-belakang.vercel.app";

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

// Fungsi: Update Profile
export async function updateProfile(data, isDemo = false) {
  if (isDemo) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: "Profil berhasil diperbarui (Demo)", user: data });
      }, 800);
    });
  }

  const token = typeof window !== "undefined" ? (sessionStorage.getItem("token") || localStorage.getItem("token")) : null;

  const res = await fetch(`${BASE_URL}/api/auth/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      nama: data.name || data.nama,
      username: data.username,
      nomorWa: data.phone || data.nomorWa,
    }),
  });

  const responseData = await res.json();
  if (!res.ok) {
    throw new Error(responseData.message || "Gagal memperbarui profil");
  }

  return responseData;
}

// Fungsi: Change Password
export async function changePassword(data, isDemo = false) {
  if (isDemo) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data.oldPassword !== "test123") {
          reject(new Error("Password lama salah (Demo)"));
        } else {
          resolve({ message: "Password berhasil diubah (Demo)" });
        }
      }, 800);
    });
  }

  const token = typeof window !== "undefined" ? (sessionStorage.getItem("token") || localStorage.getItem("token")) : null;

  const res = await fetch(`${BASE_URL}/api/auth/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    }),
  });

  const responseData = await res.json();
  if (!res.ok) {
    throw new Error(responseData.message || "Gagal mengubah password");
  }

  return responseData;
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

// ----------------------------------------------------
// PRODUCT APIs
// ----------------------------------------------------

export async function getProducts() {
  const res = await fetch(`${BASE_URL}/api/products`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil data produk");
  }

  return (data.data || []).map(p => {
    let extra = {};
    try {
      if (p.deskripsi && p.deskripsi.startsWith("{")) {
        extra = JSON.parse(p.deskripsi);
      } else {
        extra = { desc: p.deskripsi };
      }
    } catch (e) {
      extra = { desc: p.deskripsi };
    }

    return {
      id: p.id_product,
      name: p.nama_product,
      price: p.harga,
      stock: p.stok,
      category: extra.category || (p.tipe === "merchandise" ? "Fisik" : "Digital"),
      type: extra.type || p.tipe,
      image: extra.image || "",
      desc: extra.desc || p.deskripsi || "",
      pdfFile: extra.pdfFile || ""
    };
  });
}

export async function createProduct(productData) {
  const token = typeof window !== "undefined" ? (sessionStorage.getItem("token") || localStorage.getItem("token")) : null;

  const payload = {
    nama_product: productData.name,
    harga: productData.price,
    stok: productData.stock,
    tipe: (productData.category === "Fisik" || productData.category === "merchandise") ? "merchandise" : "jasa",
    deskripsi: JSON.stringify({
      desc: productData.description,
      image: productData.image,
      category: productData.category,
      type: productData.type || productData.category
    })
  };

  const res = await fetch(`${BASE_URL}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Gagal membuat produk");
  }
  return data.data;
}

export async function updateProductData(id, productData) {
  const token = typeof window !== "undefined" ? (sessionStorage.getItem("token") || localStorage.getItem("token")) : null;

  const payload = {
    nama_product: productData.name,
    harga: productData.price,
    stok: productData.stock,
    tipe: (productData.category === "Fisik" || productData.category === "merchandise") ? "merchandise" : "jasa",
    deskripsi: JSON.stringify({
      desc: productData.description,
      image: productData.image,
      category: productData.category,
      type: productData.type || productData.category
    })
  };

  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Gagal memperbarui produk");
  }
  return data.data;
}

// ================= ORDERS =================

export async function checkoutOrder(orderData) {
  const token = typeof window !== "undefined" ? (sessionStorage.getItem("token") || localStorage.getItem("token")) : null;
  const user = JSON.parse(sessionStorage.getItem("user") || localStorage.getItem("user") || "{}");

  const checkoutPayload = {
    id_user: user.id || user.id_user,
    items: orderData.cart.map(item => ({
      id_product: item.product.id,
      jumlah: item.quantity
    })),
    alamat_pengiriman: orderData.address || ""
  };

  const res = await fetch(`${BASE_URL}/api/orders/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(checkoutPayload)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal checkout");

  const newOrder = data.data.order;

  // Jika ada bukti pembayaran, kirim ke API payment
  if (orderData.paymentProof) {
    const paymentPayload = {
      id_order: newOrder.id_order,
      metode: "transfer",
      total_harga: newOrder.total_harga,
      bukti_pembayaran: orderData.paymentProof
    };

    const paymentRes = await fetch(`${BASE_URL}/api/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(paymentPayload)
    });
    const paymentData = await paymentRes.json();
    if (!paymentRes.ok) console.error("Payment failed", paymentData.message);
  }

  return data.data;
}

export async function getAllOrders() {
  const token = typeof window !== "undefined" ? (sessionStorage.getItem("token") || localStorage.getItem("token")) : null;
  const res = await fetch(`${BASE_URL}/api/orders`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    if (!res.ok) throw new Error("Endpoint API belum tersedia (404). Pastikan backend terbaru sudah di-deploy.");
    throw new Error("Gagal mengurai respons API pesanan.");
  }

  if (!res.ok) throw new Error(data?.message || "Gagal mengambil pesanan");

  return (data.data || []).map(o => mapOrderData(o));
}

export async function getUserOrders(id_user) {
  const token = typeof window !== "undefined" ? (sessionStorage.getItem("token") || localStorage.getItem("token")) : null;
  const res = await fetch(`${BASE_URL}/api/orders/user/${id_user}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    if (!res.ok) throw new Error("Endpoint API belum tersedia (404). Pastikan backend terbaru sudah di-deploy.");
    throw new Error("Gagal mengurai respons API pesanan.");
  }

  if (!res.ok) throw new Error(data?.message || "Gagal mengambil pesanan");

  return (data.data || []).map(o => mapOrderData(o));
}

function mapOrderData(o) {
  let status = o.status;
  if (status) {
    const s = status.toLowerCase();
    if (s === "pending" || s === "verifikasi_pembayaran" || s === "verifikasi pembayaran") status = "Verifikasi Pembayaran";
    else if (s === "ditolak") status = "Ditolak";
    else if (s === "diproses" || s === "dibayar") status = "Diproses";
    else if (s === "dikirim") status = "Dikirim";
    else if (s === "selesai") status = "Selesai";
  }

  let type = "Digital";
  if (o.order_detail && o.order_detail.some(d => d.products?.tipe === "merchandise")) {
    type = "Fisik";
  }

  const payment = (o.payment && o.payment.length > 0) ? o.payment[0] : null;

  return {
    id: o.id_order,
    customer: o.users?.name || "Unknown",
    wa: o.users?.whatsapp_number || "-",
    date: new Date(o.tanggal_order).toLocaleDateString("id-ID"),
    type: type,
    total: o.total_harga,
    status: status,
    paymentProof: payment?.bukti_pembayaran || "",
    address: o.alamat_pengiriman || "",
    resi: o.resi || o.no_resi || "",
    items: (o.order_detail || []).map(d => {
      let image = "";
      try {
        if (d.products?.deskripsi && d.products.deskripsi.startsWith("{")) {
          const parsed = JSON.parse(d.products.deskripsi);
          image = parsed.image || "";
        }
      } catch (e) { }

      return {
        name: d.products?.nama_product || "Produk",
        quantity: d.jumlah,
        price: d.harga_satuan,
        image: image || "/product/default.webp"
      };
    })
  };
}

export async function updateOrderData(id, updateData) {
  const token = typeof window !== "undefined" ? (sessionStorage.getItem("token") || localStorage.getItem("token")) : null;

  // Map back to backend status
  let backendStatus = updateData.status;
  if (backendStatus === "Verifikasi Pembayaran") backendStatus = "verifikasi pembayaran";
  else if (backendStatus === "Ditolak") backendStatus = "ditolak";
  else if (backendStatus === "Diproses") backendStatus = "diproses";
  else if (backendStatus === "Dikirim") backendStatus = "dikirim";
  else if (backendStatus === "Selesai") backendStatus = "selesai";

  const payload = {
    status: backendStatus,
  };
  if (updateData.resi !== undefined) {
    payload.resi = updateData.resi;
  }

  const res = await fetch(`${BASE_URL}/api/orders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal update pesanan");
  return data.data;
}

export async function deleteOrderData(id) {
  const token = typeof window !== "undefined" ? (sessionStorage.getItem("token") || localStorage.getItem("token")) : null;
  const res = await fetch(`${BASE_URL}/api/orders/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal menghapus pesanan");
  return data;
}

export async function deleteProduct(id) {
  const token = typeof window !== "undefined" ? (sessionStorage.getItem("token") || localStorage.getItem("token")) : null;
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Gagal menghapus produk");
  }
  return data;
}

// ================= PROJECTS =================

export async function createProject(payload) {
  const token = typeof window !== "undefined" ? (sessionStorage.getItem("token") || localStorage.getItem("token")) : null;
  const res = await fetch(`${BASE_URL}/api/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ? `Gagal: ${data.error}` : (data.message || "Gagal membuat proyek"));
  return data.data;
}

export async function getAllProjects() {
  const token = typeof window !== "undefined" ? (sessionStorage.getItem("token") || localStorage.getItem("token")) : null;
  const res = await fetch(`${BASE_URL}/api/projects`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    if (!res.ok) throw new Error("Endpoint API belum tersedia (404).");
    throw new Error("Gagal mengurai respons API proyek.");
  }

  if (!res.ok) throw new Error(data?.message || "Gagal mengambil proyek");
  return (data.data || []).map(mapProjectData);
}

export async function getUserProjects(id_user) {
  const token = typeof window !== "undefined" ? (sessionStorage.getItem("token") || localStorage.getItem("token")) : null;
  const res = await fetch(`${BASE_URL}/api/projects/user/${id_user}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    if (!res.ok) throw new Error("Endpoint API belum tersedia (404).");
    throw new Error("Gagal mengurai respons API proyek.");
  }

  if (!res.ok) throw new Error(data?.message || "Gagal mengambil proyek");
  return (data.data || []).map(mapProjectData);
}

export async function updateProjectData(id, payload) {
  const token = typeof window !== "undefined" ? (sessionStorage.getItem("token") || localStorage.getItem("token")) : null;

  let backendStatus = payload.status;
  if (backendStatus === "Briefing dan Pembayaran") {
    backendStatus = "briefing";
  } else if (backendStatus === "In Progress") {
    backendStatus = "progres"; // Sesuaikan dengan nilai di DB Anda
  } else if (backendStatus === "In Review") {
    backendStatus = "review";
  } else if (backendStatus === "Done") {
    backendStatus = "selesai";
  } else if (backendStatus === "Pembayaran ditolak") {
    backendStatus = "pembayaran_ditolak";
  }

  const res = await fetch(`${BASE_URL}/api/projects/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ ...payload, status: backendStatus })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal update proyek");
  return data.data;
}

function mapProjectData(p) {
  let extraDesc = {};
  try {
    if (p.deskripsi && p.deskripsi.startsWith("{")) {
      extraDesc = JSON.parse(p.deskripsi);
    }
  } catch (e) { }

  // Safe parse JSON columns
  let chatMessages = [];
  try {
    if (typeof p.chat_messages === 'string') chatMessages = JSON.parse(p.chat_messages);
    else if (Array.isArray(p.chat_messages)) chatMessages = p.chat_messages;
  } catch (e) { }

  let reviewComments = [];
  try {
    if (typeof p.review_comments === 'string') reviewComments = JSON.parse(p.review_comments);
    else if (Array.isArray(p.review_comments)) reviewComments = p.review_comments;
  } catch (e) { }

  let status = p.status;
  // Jika karena suatu alasan ada typo saat pengetesan sebelumnya, kita tangani
  if (status === "Breafing dan Pembayaran" || status === "briefing") {
    status = "Briefing dan Pembayaran";
  } else if (status === "review") {
    status = "In Review";
  } else if (status === "selesai") {
    status = "Done";
  } else if (status === "in_progress") {
    status = "In Progress";
  } else if (status === "pembayaran_ditolak") {
    status = "Pembayaran ditolak";
  }

  return {
    id: p.id_project,
    client: p.users?.name || "Unknown",
    title: p.nama_project,
    genre: extraDesc.genre || "Animasi",
    date: new Date(p.created_at || Date.now()).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' }),
    status: status,
    description: extraDesc.description || p.deskripsi || "",
    resultLink: p.result_link || "",
    paymentProof: p.payment_proof || "",
    chatMessages: chatMessages,
    reviewComments: reviewComments
  };
}
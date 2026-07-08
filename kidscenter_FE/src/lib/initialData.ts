export const INITIAL_PRODUCTS = [
  // Digital Products
  { id: "d1", name: "Stiker WhatsApp Mari Caca A", desc: "Kumpulan stiker lucu dan edukatif karakter Mari Caca untuk WhatsApp dan Line (Edisi A).", price: 15000, stock: "Tersedia", type: "Digital Asset", category: "Digital", image: "/product/sticker-1.webp" },
  { id: "d2", name: "Stiker WhatsApp Mari Caca B", desc: "Kumpulan stiker lucu dan edukatif karakter Mari Caca untuk WhatsApp dan Line (Edisi B).", price: 15000, stock: "Tersedia", type: "Digital Asset", category: "Digital", image: "/product/sticker-2.webp" },
  { id: "d3", name: "Aset Karakter Resolusi Tinggi A", desc: "File aset karakter Kidscenter transparan (PNG/SVG) untuk kebutuhan desain anak (Set A).", price: 35000, stock: "Tersedia", type: "Digital Asset", category: "Digital", image: "/product/asset_digital.webp" },
  { id: "d4", name: "Aset Karakter Resolusi Tinggi B", desc: "File aset karakter Kidscenter transparan (PNG/SVG) untuk kebutuhan desain anak (Set B).", price: 35000, stock: "Tersedia", type: "Digital Asset", category: "Digital", image: "/product/asset_digital.webp" },
  // Download Hub (also treated as Digital)
  { id: "dl1", name: "Lembar Mewarnai Hutan Ajaib A", desc: "Lembar Mewarnai Hutan Ajaib A", price: 0, stock: "Tersedia", type: "Coloring Sheets", category: "Digital", image: "/product/coloring_sheets.webp", pdfFile: "mewarnai-hutan-ajaib-a.pdf" },
  { id: "dl2", name: "Lembar Mewarnai Hutan Ajaib B", desc: "Lembar Mewarnai Hutan Ajaib B", price: 0, stock: "Tersedia", type: "Coloring Sheets", category: "Digital", image: "/product/coloring_sheets.webp", pdfFile: "mewarnai-hutan-ajaib-b.pdf" },
  { id: "dl3", name: "Papercraft Karakter Bintang A", desc: "Papercraft Karakter Bintang A", price: 0, stock: "Tersedia", type: "Papercraft", category: "Digital", image: "/product/papercraft.webp", pdfFile: "papercraft-bintang-a.pdf" },
  { id: "dl4", name: "Papercraft Karakter Bintang B", desc: "Papercraft Karakter Bintang B", price: 0, stock: "Tersedia", type: "Papercraft", category: "Digital", image: "/product/papercraft.webp", pdfFile: "papercraft-bintang-b.pdf" },
  // Physical Products
  { id: "p1", name: "Kaos Anak Petualang A", desc: "Kaos katun premium bergambar Mari Caca (Desain A). Nyaman untuk aktivitas anak sehari-hari.", price: 95000, stock: 12, type: "Apparel", category: "Fisik", image: "/product/kaos.webp" },
  { id: "p2", name: "Kaos Anak Petualang B", desc: "Kaos katun premium bergambar Mari Caca (Desain B). Nyaman untuk aktivitas anak sehari-hari.", price: 95000, stock: 8, type: "Apparel", category: "Fisik", image: "/product/kaos.webp" },
  { id: "p3", name: "Gantungan Kunci Kidscenter A", desc: "Gantungan kunci akrilik tebal bergambar karakter-karakter lucu Kidscenter (Set A).", price: 25000, stock: 45, type: "Aksesoris", category: "Fisik", image: "/product/gantungan_kunci.webp" },
  { id: "p4", name: "Gantungan Kunci Kidscenter B", desc: "Gantungan kunci akrilik tebal bergambar karakter-karakter lucu Kidscenter (Set B).", price: 25000, stock: 30, type: "Aksesoris", category: "Fisik", image: "/product/gantungan_kunci.webp" },
  { id: "p5", name: "Buku Cerita Petualangan Mari Caca A", desc: "Buku cerita bergambar (Seri A) penuh pesan moral untuk menemani waktu tidur anak.", price: 55000, stock: 20, type: "Buku Cerita", category: "Fisik", image: "/product/buku-1.webp" },
  { id: "p6", name: "Buku Cerita Petualangan Mari Caca B", desc: "Buku cerita bergambar (Seri B) penuh pesan moral untuk menemani waktu tidur anak.", price: 55000, stock: 15, type: "Buku Cerita", category: "Fisik", image: "/product/buku-2.webp" },
];

export const INITIAL_PROJECTS = [
  { 
    id: "PRJ-001", 
    client: "User Test",
    title: "Video Edukasi Tata Surya", 
    genre: "EDUKASI", 
    date: "12 Agt 2026", 
    status: "In Review", 
    description: "Bercerita tentang tata surya untuk anak-anak.",
    resultLink: "",
    paymentProof: "",
    chatMessages: [
      { id: 1, sender: "User Test (Klien)", text: "Apakah progress video sudah sampai bagian planet Jupiter?" },
      { id: 2, sender: "Admin", text: "Sudah Kak! Saat ini kami sedang tahap final render. Sebentar lagi kami upload untuk review." }
    ],
    reviewComments: [
      { id: 1, time: 5.5, text: "Gerakan karakter di sini terlalu cepat.", sender: "User Test" },
      { id: 2, time: 12.0, text: "Warna background tolong diterangkan sedikit.", sender: "User Test" }
    ]
  },
  { 
    id: "PRJ-002", 
    client: "User Test",
    title: "Karakter Maskot 3D", 
    genre: "PROMOSI", 
    date: "15 Agt 2026", 
    status: "In Progress", 
    description: "Pembuatan maskot beruang 3D lucu.",
    resultLink: "",
    paymentProof: "",
    chatMessages: [],
    reviewComments: []
  },
  { 
    id: "PRJ-003", 
    client: "User Test",
    title: "Animasi Logo Perusahaan", 
    genre: "BRANDING", 
    date: "20 Agt 2026", 
    status: "Briefing dan Pembayaran", 
    description: "Animasi intro untuk logo perusahaan agar terlihat lebih dinamis. Durasi 5-7 detik. Background putih dengan elemen pendukung biru muda.",
    resultLink: "",
    paymentProof: "",
    chatMessages: [
      { id: 1, sender: "User Test (Klien)", text: "Tolong nanti warnanya dibikin lebih cerah ya kak." },
      { id: 2, sender: "Admin", text: "Baik kak, kami catat." }
    ],
    reviewComments: []
  },
  { 
    id: "PRJ-004", 
    client: "User Test",
    title: "Video Explainer Medis", 
    genre: "Kesehatan", 
    date: "01 Agt 2026", 
    status: "Done", 
    description: "Penjelasan tata cara cuci tangan yang benar.",
    resultLink: "",
    paymentProof: "",
    chatMessages: [],
    reviewComments: []
  }
];

export const INITIAL_ORDERS = [
  {
    id: "ORD-001",
    customer: "User Test",
    type: "Fisik",
    date: "01 Sep 2026",
    status: "Dikirim",
    total: 110000,
    resi: "JNE-1234567890",
    paymentProof: "https://dummyimage.com/300x400/ccc/000.png&text=Bukti+Pembayaran",
    items: [
      { name: "Kaos Anak Petualang A", quantity: 1, price: 95000, image: "/product/kaos.webp" }
    ]
  },
  {
    id: "ORD-002",
    customer: "User Test",
    type: "Digital",
    date: "02 Sep 2026",
    status: "Selesai",
    total: 35000,
    resi: "",
    paymentProof: "https://dummyimage.com/300x400/ccc/000.png&text=Bukti+Pembayaran",
    items: [
      { name: "Aset Karakter Resolusi Tinggi A", quantity: 1, price: 35000, image: "/product/asset_digital.webp" }
    ]
  }
];

"use client";

import React, { useState } from "react";
import Image from "next/image";
import "./catalog.css";

// --- MOCK DATA ---
const digitalProducts = [
  {
    id: "d1",
    name: "Stiker WhatsApp Mari Caca A",
    desc: "Kumpulan stiker lucu dan edukatif karakter Mari Caca untuk WhatsApp dan Line (Edisi A).",
    price: 15000,
    stock: "Tersedia",
    type: "Digital Asset",
    image: "/product/sticker-1.webp",
  },
  {
    id: "d2",
    name: "Stiker WhatsApp Mari Caca B",
    desc: "Kumpulan stiker lucu dan edukatif karakter Mari Caca untuk WhatsApp dan Line (Edisi B).",
    price: 15000,
    stock: "Tersedia",
    type: "Digital Asset",
    image: "/product/sticker-2.webp",
  },
  {
    id: "d3",
    name: "Aset Karakter Resolusi Tinggi A",
    desc: "File aset karakter Kidscenter transparan (PNG/SVG) untuk kebutuhan desain anak (Set A).",
    price: 35000,
    stock: "Tersedia",
    type: "Digital Asset",
    image: "/product/asset_digital.webp",
  },
  {
    id: "d4",
    name: "Aset Karakter Resolusi Tinggi B",
    desc: "File aset karakter Kidscenter transparan (PNG/SVG) untuk kebutuhan desain anak (Set B).",
    price: 35000,
    stock: "Tersedia",
    type: "Digital Asset",
    image: "/product/asset_digital.webp",
  },
];

const physicalProducts = [
  {
    id: "p1",
    name: "Kaos Anak Petualang A",
    desc: "Kaos katun premium bergambar Mari Caca (Desain A). Nyaman untuk aktivitas anak sehari-hari.",
    price: 95000,
    stock: "Sisa 12",
    type: "Apparel",
    image: "/product/kaos.webp",
  },
  {
    id: "p2",
    name: "Kaos Anak Petualang B",
    desc: "Kaos katun premium bergambar Mari Caca (Desain B). Nyaman untuk aktivitas anak sehari-hari.",
    price: 95000,
    stock: "Sisa 8",
    type: "Apparel",
    image: "/product/kaos.webp",
  },
  {
    id: "p3",
    name: "Gantungan Kunci Kidscenter A",
    desc: "Gantungan kunci akrilik tebal bergambar karakter-karakter lucu Kidscenter (Set A).",
    price: 25000,
    stock: "Sisa 45",
    type: "Aksesoris",
    image: "/product/gantungan_kunci.webp",
  },
  {
    id: "p4",
    name: "Gantungan Kunci Kidscenter B",
    desc: "Gantungan kunci akrilik tebal bergambar karakter-karakter lucu Kidscenter (Set B).",
    price: 25000,
    stock: "Sisa 30",
    type: "Aksesoris",
    image: "/product/gantungan_kunci.webp",
  },
  {
    id: "p5",
    name: "Buku Cerita Petualangan Mari Caca A",
    desc: "Buku cerita bergambar (Seri A) penuh pesan moral untuk menemani waktu tidur anak.",
    price: 55000,
    stock: "Sisa 20",
    type: "Buku Cerita",
    image: "/product/buku-1.webp",
  },
  {
    id: "p6",
    name: "Buku Cerita Petualangan Mari Caca B",
    desc: "Buku cerita bergambar (Seri B) penuh pesan moral untuk menemani waktu tidur anak.",
    price: 55000,
    stock: "Sisa 15",
    type: "Buku Cerita",
    image: "/product/buku-2.webp",
  },
];

const downloads = [
  {
    id: "dl1",
    title: "Lembar Mewarnai Hutan Ajaib A",
    category: "Coloring Sheets",
    thumbnail: "/product/coloring_sheets.webp",
    pdfFile: "mewarnai-hutan-ajaib-a.pdf",
  },
  {
    id: "dl2",
    title: "Lembar Mewarnai Hutan Ajaib B",
    category: "Coloring Sheets",
    thumbnail: "/product/coloring_sheets.webp",
    pdfFile: "mewarnai-hutan-ajaib-b.pdf",
  },
  {
    id: "dl3",
    title: "Papercraft Karakter Bintang A",
    category: "Papercraft",
    thumbnail: "/product/papercraft.webp",
    pdfFile: "papercraft-bintang-a.pdf",
  },
  {
    id: "dl4",
    title: "Papercraft Karakter Bintang B",
    category: "Papercraft",
    thumbnail: "/product/papercraft.webp",
    pdfFile: "papercraft-bintang-b.pdf",
  },
];

interface CartItem {
  product: any;
  quantity: number;
}

export default function CatalogPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === id) {
          const newQ = item.quantity + delta;
          return { ...item, quantity: Math.max(1, newQ) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== id));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    alert("Proses Checkout Berhasil! Terima kasih telah berbelanja di Kidscenter.");
    setCart([]);
    setIsCartOpen(false);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="catalog-root">
      <div className="catalog-container">

        {/* HEADER */}
        <div className="catalog-header">
          <h1 className="catalog-title">
            The Economy <span>(Merchandise)</span>
          </h1>
          <button className="cart-toggle-btn" onClick={() => setIsCartOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Keranjang
            {totalItems > 0 && <div className="cart-badge">{totalItems}</div>}
          </button>
        </div>

        {/* 1. DIGITAL STORE */}
        <section className="catalog-section">
          <h2 className="section-title">Digital Store</h2>
          <div className="product-grid">
            {digitalProducts.map((p) => (
              <div key={p.id} className="product-card" onClick={() => setSelectedProduct(p)}>
                <div className="product-img-wrapper">
                  <span className="product-badge">{p.type}</span>
                  {/* Using standard img to avoid Next Image errors if file doesn't exist yet */}
                  <img src={p.image.startsWith("/") ? p.image : `/images/${p.image}`} alt={p.name} className="product-img" />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{p.name}</h3>
                  <div className="product-meta">
                    <span className="product-stock">{p.stock}</span>
                    <span className="product-price">Rp {p.price.toLocaleString("id-ID")}</span>
                  </div>
                  <button className="btn-order" onClick={(e) => { e.stopPropagation(); addToCart(p); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Pesan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. PHYSICAL PRODUCT */}
        <section className="catalog-section">
          <h2 className="section-title">Physical Product</h2>
          <div className="product-grid">
            {physicalProducts.map((p) => (
              <div key={p.id} className="product-card" onClick={() => setSelectedProduct(p)}>
                <div className="product-img-wrapper">
                  <span className="product-badge">{p.type}</span>
                  <img src={p.image.startsWith("/") ? p.image : `/images/${p.image}`} alt={p.name} className="product-img" />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{p.name}</h3>
                  <div className="product-meta">
                    <span className="product-stock">{p.stock}</span>
                    <span className="product-price">Rp {p.price.toLocaleString("id-ID")}</span>
                  </div>
                  <button className="btn-order" onClick={(e) => { e.stopPropagation(); addToCart(p); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Pesan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. DOWNLOAD HUB */}
        <section className="catalog-section">
          <h2 className="section-title">Download Hub</h2>
          <div className="product-grid">
            {downloads.map((d) => (
              <div key={d.id} className="product-card" onClick={() => setSelectedProduct(d)}>
                <div className="product-img-wrapper">
                  <span className="product-badge" style={{ background: "var(--kc-yellow)", color: "var(--kc-navy)" }}>
                    {d.category}
                  </span>
                  <img src={d.thumbnail.startsWith("/") ? d.thumbnail : `/images/${d.thumbnail}`} alt={d.title} className="product-img" />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{d.title}</h3>
                  <button className="btn-download" onClick={(e) => { e.stopPropagation(); alert(`Mengunduh ${d.pdfFile}...`); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* PRODUCT MODAL */}
      <div
        className={`product-modal-overlay ${selectedProduct ? "open" : ""}`}
        onClick={() => setSelectedProduct(null)}
      >
        {selectedProduct && (
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedProduct(null)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="modal-img-col">
              <img
                src={(selectedProduct.image || selectedProduct.thumbnail).startsWith("/")
                  ? (selectedProduct.image || selectedProduct.thumbnail)
                  : `/images/${selectedProduct.image || selectedProduct.thumbnail}`}
                alt={selectedProduct.name || selectedProduct.title}
                className="modal-img"
              />
            </div>
            <div className="modal-info-col">
              <span
                className="modal-badge"
                style={selectedProduct.category ? { background: "var(--kc-yellow)", color: "var(--kc-navy)" } : {}}
              >
                {selectedProduct.type || selectedProduct.category}
              </span>
              <h2 className="modal-title">{selectedProduct.name || selectedProduct.title}</h2>
              <p className="modal-desc">
                {selectedProduct.desc || `Akses PDF resolusi tinggi untuk aktivitas kreatif bersama anak. File: ${selectedProduct.pdfFile}`}
              </p>

              {selectedProduct.price && (
                <div className="modal-meta">
                  <div className="modal-meta-row">
                    <span className="modal-meta-label">Harga</span>
                    <span className="modal-meta-val price">Rp {selectedProduct.price.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="modal-meta-row">
                    <span className="modal-meta-label">Status</span>
                    <span className="modal-meta-val stock">{selectedProduct.stock}</span>
                  </div>
                </div>
              )}

              {selectedProduct.price ? (
                <button
                  className="btn-order"
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  style={{ marginTop: "auto" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Masukkan Keranjang
                </button>
              ) : (
                <button
                  className="btn-download"
                  onClick={() => {
                    alert(`Mengunduh ${selectedProduct.pdfFile}...`);
                    setSelectedProduct(null);
                  }}
                  style={{ marginTop: "auto" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download File
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CART SIDEBAR */}
      <div
        className={`cart-sidebar-overlay ${isCartOpen ? "open" : ""}`}
        onClick={() => setIsCartOpen(false)}
      />
      <div className={`cart-sidebar ${isCartOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h3>Keranjang Belanja</h3>
          <button className="btn-close-cart" onClick={() => setIsCartOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}>
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <p>Keranjang kamu masih kosong nih!</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="cart-item">
                <img src={item.product.image.startsWith("/") ? item.product.image : `/images/${item.product.image}`} alt={item.product.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <h4 className="cart-item-name">{item.product.name}</h4>
                  <p className="cart-item-price">Rp {item.product.price.toLocaleString("id-ID")}</p>
                  <div className="cart-item-controls">
                    <button className="qty-btn" onClick={() => updateQuantity(item.product.id, -1)}>−</button>
                    <span className="qty-val">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.product.id, 1)}>+</button>
                    <button className="btn-remove" onClick={() => removeFromCart(item.product.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span className="cart-total-label">Total Pembayaran</span>
            <span className="cart-total-val">Rp {totalPrice.toLocaleString("id-ID")}</span>
          </div>
          <button
            className="btn-checkout"
            onClick={handleCheckout}
            disabled={cart.length === 0}
            style={{ opacity: cart.length === 0 ? 0.5 : 1 }}
          >
            Checkout Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}

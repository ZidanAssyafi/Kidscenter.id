"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import "./catalog.css";

import { useSharedState } from "@/lib/useSharedState";
import { INITIAL_ORDERS } from "@/lib/initialData";
import { compressImage } from "@/lib/imageUtils";
import { showPopup } from "@/lib/popupUtils";
import { getProducts, checkoutOrder } from "@/lib/api";

const getImgSrc = (img: string) => {
  if (!img) return "";
  if (img.startsWith("/") || img.startsWith("data:") || img.startsWith("http")) return img;
  return `/images/${img}`;
};

interface CartItem {
  product: any;
  quantity: number;
}

export default function CatalogPage() {
  const [products, setProducts] = useState<any[]>([]);
  
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error: any) {
      console.error("Gagal mengambil produk:", error);
    }
  };

  const digitalProducts = products.filter(p => p.category === "Digital" && p.type === "Digital Asset");
  const physicalProducts = products.filter(p => p.category === "Fisik");
  const downloads = products.filter(p => p.category === "Digital" && (p.type === "Coloring Sheets" || p.type === "Papercraft"));

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginPopupOpen, setLoginPopupOpen] = useState(false);
  const [checkoutPopupOpen, setCheckoutPopupOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [catalogOrders, setCatalogOrders] = useSharedState("kc_orders", INITIAL_ORDERS);

  useEffect(() => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const user = sessionStorage.getItem("user") || localStorage.getItem("user");
    if (token && user) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (selectedProduct || isCartOpen || checkoutPopupOpen || loginPopupOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedProduct, isCartOpen, checkoutPopupOpen, loginPopupOpen]);

  const addToCart = (product: any) => {
    if (!isLoggedIn) {
      setLoginPopupOpen(true);
      document.body.style.overflow = "hidden";
      return;
    }
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
    setIsCartOpen(false);
    setCheckoutPopupOpen(true);
  };

  const submitCheckout = async () => {
    try {
      await checkoutOrder({
        cart,
        address: address,
        paymentProof: paymentProof
      });

      showPopup("Pesanan berhasil dibuat! Kami akan segera memprosesnya.");
      setCheckoutPopupOpen(false);
      setCart([]);
      setIsCartOpen(false);
      setAddress("");
      setPaymentProof(null);
    } catch (error: any) {
      showPopup(error.message || "Gagal melakukan checkout, coba lagi.");
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.product.price || 0) * item.quantity,
    0
  );

  const hasPhysical = cart.some(item => item.product.type && item.product.type !== "Digital Asset");
  const ongkir = hasPhysical ? 15000 : 0;

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
                  <img src={getImgSrc(p.image)} alt={p.name} className="product-img" />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{p.name}</h3>
                  <div className="product-meta">
                    <span className="product-stock">{p.stock}</span>
                    <span className="product-price">Rp {(p.price || 0).toLocaleString("id-ID")}</span>
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
                  <img src={getImgSrc(p.image)} alt={p.name} className="product-img" />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{p.name}</h3>
                  <div className="product-meta">
                    <span className="product-stock">{p.stock}</span>
                    <span className="product-price">Rp {(p.price || 0).toLocaleString("id-ID")}</span>
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
                    {d.type || d.category}
                  </span>
                  <img src={getImgSrc(d.image || "")} alt={d.name || ""} className="product-img" />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{d.name || ""}</h3>
                  <button className="btn-download" onClick={(e) => {
                    e.stopPropagation();
                    if (!isLoggedIn) {
                      setLoginPopupOpen(true);
                      document.body.style.overflow = "hidden";
                    } else {
                      showPopup(`Mengunduh ${d.pdfFile}...`);
                    }
                  }}>
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
                src={getImgSrc(selectedProduct.image || "")}
                alt={selectedProduct.name || ""}
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
              <h2 className="modal-title">{selectedProduct.name || ""}</h2>
              <p className="modal-desc">
                {selectedProduct.desc || `Akses PDF resolusi tinggi untuk aktivitas kreatif bersama anak. File: ${selectedProduct.pdfFile}`}
              </p>

              {selectedProduct.price && (
                <div className="modal-meta">
                  <div className="modal-meta-row">
                    <span className="modal-meta-label">Harga</span>
                    <span className="modal-meta-val price">Rp {(selectedProduct.price || 0).toLocaleString("id-ID")}</span>
                  </div>
                  <div className="modal-meta-row">
                    <span className="modal-meta-label">Stok</span>
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
                    if (!isLoggedIn) {
                      setLoginPopupOpen(true);
                      document.body.style.overflow = "hidden";
                    } else {
                      showPopup(`Mengunduh ${selectedProduct.pdfFile}...`);
                      setSelectedProduct(null);
                    }
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
                <img src={getImgSrc(item.product.image || "")} alt={item.product.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <h4 className="cart-item-name">{item.product.name}</h4>
                  <p className="cart-item-price">Rp {(item.product.price || 0).toLocaleString("id-ID")}</p>
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

      {/* POPUP CHECKOUT */}
      {checkoutPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-backdrop" onClick={() => setCheckoutPopupOpen(false)} />
          <div className="popup-box" style={{ maxWidth: "600px", width: "90%", maxHeight: "90vh", overflowY: "auto" }}>
            <button className="popup-close" onClick={() => setCheckoutPopupOpen(false)}>✕</button>
            <div className="checkout-content">
              <h2 className="popup-pesan-title" style={{ textAlign: "center", marginBottom: "1.5rem" }}>Checkout Pesanan</h2>

              <div className="checkout-items" style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Daftar Produk:</h3>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {cart.map((item, idx) => (
                    <li key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", borderBottom: "1px dashed var(--kc-border)", paddingBottom: "0.5rem" }}>
                      <span>{item.quantity}x {item.product.name}</span>
                      <span style={{ fontWeight: 600 }}>Rp {((item.product.price || 0) * item.quantity).toLocaleString("id-ID")}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {hasPhysical && (
                <div className="checkout-form-group" style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 700 }}>Alamat Lengkap (Beserta Kode Pos)</label>
                  <textarea
                    className="portal-textarea"
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--kc-border)", minHeight: "80px" }}
                    rows={3}
                    placeholder="Masukkan alamat pengiriman lengkap..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              )}

              <div className="checkout-summary" style={{ marginBottom: "1.5rem", padding: "1rem", background: "var(--kc-bg-alt)", borderRadius: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span>Subtotal:</span>
                  <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
                </div>
                {hasPhysical && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span>Ongkos Kirim:</span>
                    <span>Rp {ongkir.toLocaleString("id-ID")}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: "1.2rem", marginTop: "1rem", borderTop: "1px solid var(--kc-border)", paddingTop: "1rem" }}>
                  <span>Total Bayar:</span>
                  <span style={{ color: "var(--kc-cyan)" }}>Rp {(totalPrice + ongkir).toLocaleString("id-ID")}</span>
                </div>
              </div>

              <div className="checkout-payment" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Scan QRIS untuk Membayar</h3>
                <div style={{ background: "white", padding: "1rem", display: "inline-block", borderRadius: "12px", border: "2px solid var(--kc-border)", marginBottom: "1rem" }}>
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=KidscenterPayment" alt="QRIS" style={{ width: 150, height: 150 }} />
                </div>

                <div style={{ textAlign: "left" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 700 }}>Upload Bukti Pembayaran</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        compressImage(file, (dataUrl) => {
                          setPaymentProof(dataUrl);
                        });
                      }
                    }}
                    style={{ width: "100%", padding: "0.5rem", border: "1px dashed var(--kc-border)", borderRadius: "8px" }}
                  />
                </div>
              </div>

              <button
                className="btn-checkout"
                style={{ width: "100%", opacity: ((hasPhysical && !address.trim()) || !paymentProof) ? 0.5 : 1, marginTop: "1rem" }}
                disabled={(hasPhysical && !address.trim()) || !paymentProof}
                onClick={submitCheckout}
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP PESAN SEKARANG */}
      {loginPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-backdrop" onClick={() => { setLoginPopupOpen(false); document.body.style.overflow = ""; }} />
          <div className="popup-box">
            <button className="popup-close" onClick={() => { setLoginPopupOpen(false); document.body.style.overflow = ""; }} aria-label="Tutup">✕</button>
            <div className="popup-pesan">
              <h2 className="popup-pesan-title">Masuk dulu, yuk!</h2>
              <p className="popup-pesan-desc">
                Untuk melakukan pemesanan atau mengunduh aset, kamu perlu <strong>masuk ke akun</strong> terlebih dahulu. Proses cepat dan gratis!
              </p>
              <Link href="/login" className="btn-popup-login" prefetch={false} onClick={() => { setLoginPopupOpen(false); document.body.style.overflow = ""; }}>Masuk Sekarang</Link>
              <p className="popup-gate-alt">Belum punya akun? <Link href="/register" prefetch={false} onClick={() => { setLoginPopupOpen(false); document.body.style.overflow = ""; }}>Daftar gratis di sini</Link></p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

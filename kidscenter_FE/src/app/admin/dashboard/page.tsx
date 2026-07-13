"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "../admin.css";
import { useSharedState } from "@/lib/useSharedState";
import { INITIAL_PROJECTS, INITIAL_ORDERS } from "@/lib/initialData";
import { compressImage } from "@/lib/imageUtils";
import { showPopup } from "@/lib/popupUtils";
import { getProducts, createProduct, updateProductData, deleteProduct, getAllOrders, updateOrderData, deleteOrderData, getAllProjects, updateProjectData } from "@/lib/api";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeMenu, setActiveMenu] = useState("jasa_animasi");

  // Route Protection
  useEffect(() => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const userStr = sessionStorage.getItem("user") || localStorage.getItem("user");
    
    if (!token || !userStr) {
      router.push("/");
      return;
    }
    
    try {
      const user = JSON.parse(userStr);
      if (user.role?.toLowerCase() !== "admin") {
        router.push("/");
      } else {
        setIsAuthorized(true);
      }
    } catch (e) {
      router.push("/");
    }
  }, [router]);

  // Real Data: Pemesanan Jasa Animasi
  const [jasaProjects, setJasaProjects] = useState<any[]>([]);
  const [selectedJasa, setSelectedJasa] = useState<any>(null);
  const [jasaResultLink, setJasaResultLink] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isAuthorized) {
      fetchProjects();
    }
  }, [isAuthorized]);

  const fetchProjects = async () => {
    try {
      const data = await getAllProjects();
      setJasaProjects(data);
    } catch (error: any) {
      showPopup(error.message || "Gagal mengambil data proyek animasi");
    }
  };
  
  // Mock Comments for In Review
  const [newReviewComment, setNewReviewComment] = useState("");
  const [adminChatMessage, setAdminChatMessage] = useState("");
  
  const handleJumpToTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play();
    }
  };
  
  const formatTime = (timeInSeconds: number) => {
    const m = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const s = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Real Data: Katalog Produk
  const [products, setProducts] = useState<any[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({ name: "", price: "", type: "Fisik", stock: "", image: "", desc: "" });

  useEffect(() => {
    if (isAuthorized) {
      fetchProducts();
    }
  }, [isAuthorized]);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error: any) {
      showPopup(error.message || "Gagal mengambil data produk");
    }
  };

  // Real Data: Pesanan Masuk
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    if (isAuthorized) {
      fetchOrders();
    }
  }, [isAuthorized]);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error: any) {
      showPopup(error.message || "Gagal mengambil data pesanan");
    }
  };

  useEffect(() => {
    if (selectedJasa || selectedOrder) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedJasa, selectedOrder]);

  if (!isAuthorized) {
    return null; // Don't render anything while checking authorization
  }

  // --- Handlers for Jasa Animasi ---
  const handleUpdateJasaStatus = async (id: string, newStatus: string) => {
    try {
      await updateProjectData(id, { status: newStatus });
      setJasaProjects(jasaProjects.map(p => p.id === id ? { ...p, status: newStatus } : p));
      if (selectedJasa && selectedJasa.id === id) {
        setSelectedJasa({ ...selectedJasa, status: newStatus });
      }
      showPopup("Status proyek berhasil diupdate!");
    } catch (error: any) {
      showPopup(error.message || "Gagal mengupdate status proyek");
    }
  };

  const handleAdminSendChat = async () => {
    if (!adminChatMessage.trim() || !selectedJasa) return;
    const newMessage = { id: Date.now(), sender: 'Admin', text: adminChatMessage, role: 'admin' };
    const newChatMessages = [...(selectedJasa.chatMessages || []), newMessage];
    
    try {
      await updateProjectData(selectedJasa.id, { chat_messages: newChatMessages });
      const updatedProject = { ...selectedJasa, chatMessages: newChatMessages };
      setJasaProjects(jasaProjects.map(p => p.id === selectedJasa.id ? updatedProject : p));
      setSelectedJasa(updatedProject);
      setAdminChatMessage("");
    } catch (error: any) {
      showPopup("Gagal mengirim chat admin");
    }
  };

  const handleSaveJasaResult = async () => {
    if (!selectedJasa) return;
    try {
      await updateProjectData(selectedJasa.id, { result_link: jasaResultLink });
      setJasaProjects(prev => prev.map(p => p.id === selectedJasa.id ? { ...p, resultLink: jasaResultLink } : p));
      setSelectedJasa({ ...selectedJasa, resultLink: jasaResultLink });
      showPopup("Hasil pekerjaan berhasil disimpan!");
    } catch (error: any) {
      showPopup("Gagal menyimpan hasil pekerjaan");
    }
  };

  // --- Handlers for Produk ---
  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: "", price: "", type: "Fisik", stock: "", image: "", desc: "" });
    setIsProductModalOpen(true);
  };
  const openEditProduct = (p: any) => {
    setEditingProduct(p);
    setProductForm({ name: p.name, price: p.price?.toString() || "0", type: p.category || p.type || "Fisik", stock: p.stock?.toString() || "0", image: p.image || "", desc: p.description || p.desc || "" });
    setIsProductModalOpen(true);
  };
  const handleDeleteProduct = async (id: string) => {
    if(confirm("Yakin ingin menghapus produk ini?")) {
      try {
        await deleteProduct(id);
        fetchProducts();
        showPopup("Produk berhasil dihapus");
      } catch (error: any) {
        showPopup(error.message || "Gagal menghapus produk");
      }
    }
  };
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: productForm.name,
        price: parseInt(productForm.price),
        category: productForm.type,
        stock: parseInt(productForm.stock),
        description: productForm.desc,
        image: productForm.image
      };

      if (editingProduct) {
        await updateProductData(editingProduct.id, payload);
        showPopup("Produk berhasil diperbarui");
      } else {
        await createProduct(payload);
        showPopup("Produk berhasil ditambahkan");
      }
      
      setIsProductModalOpen(false);
      fetchProducts();
    } catch (error: any) {
      showPopup(error.message || "Gagal menyimpan produk");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressImage(file, (dataUrl) => {
        setProductForm(prev => ({ ...prev, image: dataUrl }));
      });
    }
  };

  // --- Handlers for Pesanan ---
  const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
    try {
      await updateOrderData(id, { status: newStatus });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      showPopup(`Status pesanan diubah menjadi ${newStatus}`);
    } catch (error: any) {
      showPopup(error.message || "Gagal mengubah status pesanan");
    }
  };
  const handleUpdateResi = async (e: React.FormEvent) => {
    e.preventDefault();
    const resi = (e.target as any).resi.value;
    try {
      await updateOrderData(selectedOrder.id, { resi, status: selectedOrder.status });
      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, resi } : o));
      setSelectedOrder({ ...selectedOrder, resi });
      showPopup("Resi berhasil diupdate.");
    } catch (error: any) {
      showPopup(error.message || "Gagal menyimpan resi");
    }
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-title">Admin Panel</div>
        <div className="admin-menu-list" style={{ flexGrow: 1 }}>
          <button className={`admin-menu-btn ${activeMenu === "jasa_animasi" ? "active" : ""}`} onClick={() => setActiveMenu("jasa_animasi")}>
            Jasa Animasi
          </button>
          <button className={`admin-menu-btn ${activeMenu === "katalog_produk" ? "active" : ""}`} onClick={() => setActiveMenu("katalog_produk")}>
            Katalog Produk
          </button>
          <button className={`admin-menu-btn ${activeMenu === "pesanan_masuk" ? "active" : ""}`} onClick={() => setActiveMenu("pesanan_masuk")}>
            Pesanan Masuk
          </button>
        </div>
        <div style={{ padding: "0 16px", marginTop: "auto" }}>
          <button 
            className="admin-menu-btn" 
            style={{ width: "100%", color: "var(--kc-orange)", textAlign: "center" }} 
            onClick={() => {
              sessionStorage.clear();
              localStorage.clear();
              router.push("/");
            }}
          >
            Keluar (Logout)
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="admin-content">
        
        {/* VIEW: JASA ANIMASI */}
        {activeMenu === "jasa_animasi" && (
          <div>
            <div className="admin-header">
              <h2>Pemesanan Jasa Animasi</h2>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID Proyek</th>
                    <th>Klien</th>
                    <th>Judul</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {jasaProjects.map(p => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.client}</td>
                      <td>{p.title}</td>
                      <td>{p.date}</td>
                      <td><span className="admin-badge badge-info">{p.status}</span></td>
                      <td>
                        <button className="admin-btn-secondary" onClick={() => { setSelectedJasa(p); setJasaResultLink(p.resultLink); }}>Detail</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW: KATALOG PRODUK */}
        {activeMenu === "katalog_produk" && (
          <div>
            <div className="admin-header">
              <h2>Katalog Produk</h2>
              <button className="admin-btn-primary" onClick={openAddProduct}>+ Tambah Produk</button>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nama Produk</th>
                    <th>Jenis</th>
                    <th>Harga</th>
                    <th>Stok</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.name}</td>
                      <td>{p.type}</td>
                      <td>Rp {(p.price || 0).toLocaleString("id-ID")}</td>
                      <td>{p.stock}</td>
                      <td>
                        <button className="admin-btn-secondary" style={{ marginRight: '8px' }} onClick={() => openEditProduct(p)}>Edit</button>
                        <button className="admin-btn-secondary" style={{ color: 'var(--kc-orange)', borderColor: 'var(--kc-orange)' }} onClick={() => handleDeleteProduct(p.id)}>Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW: PESANAN MASUK */}
        {activeMenu === "pesanan_masuk" && (
          <div>
            <div className="admin-header">
              <h2>Pesanan Masuk (Katalog)</h2>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Pelanggan</th>
                    <th>Jenis</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>{o.customer}</td>
                      <td>{o.type}</td>
                      <td>Rp {(o.total || 0).toLocaleString("id-ID")}</td>
                      <td>
                        <span className={`admin-badge ${o.status === 'Verifikasi Pembayaran' ? 'badge-warning' : o.status === 'Ditolak' ? 'badge-danger' : o.status === 'Diproses' ? 'badge-secondary' : o.status === 'Dikirim' ? 'badge-info' : 'badge-success'}`}>
                          {o.status}
                        </span>
                      </td>
                      <td>
                        <button className="admin-btn-secondary" onClick={() => setSelectedOrder(o)}>Verifikasi / Detail</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* MODALS */}
      
      {/* Modal Jasa Animasi */}
      {selectedJasa && (
        <div className="admin-modal-overlay" onClick={() => setSelectedJasa(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setSelectedJasa(null)}>✕</button>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--kc-navy)' }}>Detail Proyek: {selectedJasa.id}</h3>
            
            <div className="admin-form-group">
              <label>Status Proyek</label>
              <select className="admin-form-select" value={selectedJasa.status} onChange={(e) => handleUpdateJasaStatus(selectedJasa.id, e.target.value)}>
                <option value="Briefing dan Pembayaran">Briefing dan Pembayaran</option>
                <option value="Pembayaran ditolak">Pembayaran ditolak</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review">In Review</option>
                <option value="Done">Done</option>
              </select>
            </div>

            {(selectedJasa.status === "Briefing dan Pembayaran" || selectedJasa.status === "Pembayaran ditolak") && (
              <div className="admin-form-group">
                <label>Diskusi & Revisi (Briefing) dari Klien</label>
                <div className="admin-chat-box">
                  <div className="admin-chat-messages">
                    {(selectedJasa.chatMessages || []).map((msg: any) => (
                      <div key={msg.id} style={{ padding: '10px', background: msg.role === 'admin' ? 'var(--kc-cyan)' : 'white', color: msg.role === 'admin' ? 'white' : 'black', borderRadius: '8px', alignSelf: msg.role === 'admin' ? 'flex-end' : 'flex-start', border: msg.role === 'admin' ? 'none' : '1px solid #cbd5e1', marginBottom: '10px', maxWidth: '80%' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: msg.role === 'admin' ? 'white' : 'var(--kc-cyan)', marginBottom: '5px' }}>{msg.sender}</div>
                        {msg.text}
                      </div>
                    ))}
                  </div>
                  <div className="admin-chat-input-area">
                    <input type="text" className="admin-chat-input" placeholder="Balas pesan..." value={adminChatMessage} onChange={e => setAdminChatMessage(e.target.value)} />
                    <button className="admin-chat-btn" onClick={handleAdminSendChat}>Kirim</button>
                  </div>
                </div>
                
                <div className="admin-form-group" style={{ marginTop: "1.5rem", borderTop: "1px solid #cbd5e1", paddingTop: "1rem" }}>
                  <label>Verifikasi Pembayaran</label>
                  {selectedJasa.paymentProof ? (
                    <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginTop: "1rem" }}>
                      <div style={{ flex: 1 }}>
                        <img src={selectedJasa.paymentProof} alt="Bukti Pembayaran" style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "12px", border: "1px solid #cbd5e1" }} />
                      </div>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <p style={{ margin: 0, fontWeight: "bold" }}>Klien telah mengunggah bukti pembayaran.</p>
                        <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--kc-text-muted)" }}>Silakan periksa mutasi rekening Anda sebelum menyetujui. Jika disetujui, status akan berubah menjadi <strong>In Progress</strong>.</p>
                        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                          <button className="admin-btn-primary" style={{ background: "var(--kc-success)" }} onClick={() => handleUpdateJasaStatus(selectedJasa.id, "In Progress")}>
                            Setujui Pembayaran
                          </button>
                          <button className="admin-btn-secondary" style={{ color: "var(--kc-red)", borderColor: "var(--kc-red)" }} onClick={() => handleUpdateJasaStatus(selectedJasa.id, "Pembayaran ditolak")}>
                            Tolak Pembayaran
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: "1.5rem", background: "#f8fafc", borderRadius: "12px", textAlign: "center", color: "var(--kc-text-muted)", marginTop: "1rem" }}>
                      Menunggu klien mengunggah bukti pembayaran...
                    </div>
                  )}
                </div>

              </div>
            )}

            {selectedJasa.status === "In Review" && (
              <>
                <div className="admin-form-group">
                  <label>Unggah Hasil Pekerjaan (Video)</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      type="file" 
                      className="admin-form-input" 
                      accept="video/*" 
                      style={{ padding: '8px' }} 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setJasaResultLink(reader.result as string);
                            showPopup("File video berhasil dimuat! Silakan klik Upload.");
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <button className="admin-btn-primary" onClick={handleSaveJasaResult}>Upload</button>
                  </div>
                </div>

                <div className="admin-form-group" style={{ borderTop: "1px solid #cbd5e1", paddingTop: "1rem" }}>
                  <label>Review Video & Catatan Revisi</label>
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
                    <div style={{ flex: "1.5", minWidth: "300px" }}>
                      <video 
                        ref={videoRef}
                        className="video-player"
                        controls
                        src={selectedJasa.resultLink || "/videos/hero.webm"}
                        style={{ width: "100%", borderRadius: "12px", border: "2px solid #cbd5e1", background: "#000" }}
                      />
                    </div>
                    <div style={{ flex: "1", minWidth: "250px", display: "flex", flexDirection: "column", background: "#f8fafc", borderRadius: "12px", border: "1px solid #cbd5e1", padding: "1rem" }}>
                      <h4 style={{ margin: "0 0 1rem 0", fontSize: "1rem", color: "var(--kc-navy)" }}>Catatan Klien</h4>
                      <div style={{ flexGrow: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "250px" }}>
                        {(selectedJasa?.reviewComments || []).map((c: any) => (
                          <div 
                            key={c.id} 
                            onClick={() => handleJumpToTime(c.time)}
                            style={{ padding: "0.75rem", background: "white", borderRadius: "8px", border: "1px solid #cbd5e1", cursor: "pointer", display: "flex", gap: "0.75rem" }}
                          >
                            <div style={{ background: "var(--kc-cyan)", color: "white", padding: "0.2rem 0.4rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "bold", height: "fit-content" }}>
                              {formatTime(c.time)}
                            </div>
                            <div>
                              <div style={{ fontSize: "0.75rem", fontWeight: "bold", color: "var(--kc-navy)", marginBottom: "0.2rem" }}>{c.sender}</div>
                              <div style={{ fontSize: "0.85rem", color: "#475569" }}>{c.text}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
                        <input 
                          type="text" 
                          className="admin-form-input" 
                          placeholder="Balas revisi..." 
                          value={newReviewComment}
                          onChange={(e) => setNewReviewComment(e.target.value)}
                        />
                        <button className="admin-btn-primary" style={{ padding: "0 1rem" }}>Kirim</button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* Modal Produk (CRUD) */}
      {isProductModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsProductModalOpen(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setIsProductModalOpen(false)}>✕</button>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--kc-navy)' }}>
              {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
            </h3>
            <form onSubmit={handleSaveProduct}>
              <div className="admin-form-group">
                <label>Nama Produk</label>
                <input required className="admin-form-input" type="text" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Jenis</label>
                  <select className="admin-form-select" value={productForm.type} onChange={e => setProductForm({...productForm, type: e.target.value})}>
                    <option value="Fisik">Fisik</option>
                    <option value="Digital">Digital</option>
                    <option value="Download Hub">Download Hub</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Harga (Rp)</label>
                  <input required className="admin-form-input" type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Stok</label>
                  <input required className="admin-form-input" type="number" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} />
                </div>
                <div className="admin-form-group">
                  <label>Gambar Produk</label>
                  <div className="admin-image-upload-wrapper">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="admin-image-upload-input" 
                      onChange={handleImageChange}
                      required={!productForm.image}
                    />
                    {productForm.image ? (
                      <>
                        <img src={productForm.image} alt="Preview" className="admin-image-upload-preview" />
                        <div className="admin-image-upload-overlay">Ubah Gambar</div>
                      </>
                    ) : (
                      <div className="admin-image-upload-content">
                        <div className="admin-image-upload-icon">📷</div>
                        <div>Klik atau Drag Gambar ke Sini</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="admin-form-group">
                <label>Deskripsi Produk</label>
                <textarea required className="admin-form-textarea" value={productForm.desc} onChange={e => setProductForm({...productForm, desc: e.target.value})}></textarea>
              </div>
              <button type="submit" className="admin-btn-primary" style={{ width: '100%' }}>Simpan Produk</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Pesanan Masuk */}
      {selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--kc-navy)' }}>Detail Pesanan: {selectedOrder.id}</h3>
            
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '250px' }}>
                <p><strong>Pelanggan:</strong> {selectedOrder.customer}</p>
                <p><strong>Tanggal:</strong> {selectedOrder.date}</p>
                <p><strong>Jenis:</strong> {selectedOrder.type}</p>
                <p><strong>Total Bayar:</strong> Rp {(selectedOrder.total || 0).toLocaleString("id-ID")}</p>
                <p><strong>Status Saat Ini:</strong> <span className={`admin-badge ${selectedOrder.status === 'Verifikasi Pembayaran' ? 'badge-warning' : selectedOrder.status === 'Ditolak' ? 'badge-danger' : selectedOrder.status === 'Diproses' ? 'badge-secondary' : selectedOrder.status === 'Dikirim' ? 'badge-info' : 'badge-success'}`} style={{marginLeft:'8px'}}>{selectedOrder.status}</span></p>
                
                {selectedOrder.status === "Verifikasi Pembayaran" && (
                  <div style={{ marginTop: '1.5rem', display: 'flex', gap: '10px' }}>
                    <button className="admin-btn-primary" onClick={() => handleUpdateOrderStatus(selectedOrder.id, "Diproses")}>Konfirmasi Pembayaran</button>
                    <button className="admin-btn-secondary" style={{color:'red', borderColor:'red'}} onClick={() => handleUpdateOrderStatus(selectedOrder.id, "Ditolak")}>Tolak</button>
                  </div>
                )}

                {(selectedOrder.status === "Diproses" || selectedOrder.status === "Dikirim" || selectedOrder.status === "Selesai") && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <div className="admin-form-group">
                      <label>Update Status Pesanan</label>
                      <select className="admin-form-select" value={selectedOrder.status} onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value)}>
                        <option value="Diproses">Diproses</option>
                        <option value="Dikirim">Dikirim</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                    </div>
                  </div>
                )}

                {selectedOrder.type === "Fisik" && (selectedOrder.status === "Diproses" || selectedOrder.status === "Dikirim" || selectedOrder.status === "Selesai") && (
                  <form onSubmit={handleUpdateResi} style={{ marginTop: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                    <label style={{display:'block', fontWeight:'bold', marginBottom:'4px'}}>Input Nomor Resi</label>
                    <p style={{ fontSize: '0.8rem', color: 'var(--kc-text-muted)', margin: '0 0 8px 0' }}>Untuk pengiriman produk fisik ke alamat klien.</p>
                    <input name="resi" className="admin-form-input" placeholder="Contoh: JNE-12345" defaultValue={selectedOrder.resi} />
                    <button type="submit" className="admin-btn-primary" style={{marginTop:'10px', width:'100%'}}>Simpan Resi</button>
                  </form>
                )}

              </div>
              <div style={{ flex: '1', minWidth: '250px', textAlign: 'center' }}>
                <h4 style={{ marginBottom: '10px' }}>Bukti Pembayaran</h4>
                {selectedOrder.paymentProof ? (
                  <img src={selectedOrder.paymentProof} alt="Bukti Transfer" style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '12px', border: '1px solid #cbd5e1' }} />
                ) : (
                  <div style={{ padding: '2rem', background: '#f1f5f9', borderRadius: '12px' }}>Belum ada bukti</div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

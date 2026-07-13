const fs = require('fs');
async function test() {
  const res = await fetch('https://kidscenter-bagian-belakang.vercel.app/api/orders');
  const data = await res.json();
  const orders = data.data || [];
  
  const mapped = orders.map(o => {
    let status = o.status;
    if (status === "pending" || status === "verifikasi_pembayaran" || status === "Verifikasi Pembayaran") status = "Verifikasi Pembayaran";
    else if (status === "ditolak" || status === "Ditolak") status = "Ditolak";
    else if (status === "diproses" || status === "dibayar" || status === "Diproses") status = "Diproses";
    else if (status === "dikirim" || status === "Dikirim") status = "Dikirim";
    else if (status === "selesai" || status === "Selesai") status = "Selesai";
    return { id: o.id_order, original: o.status, mapped: status };
  });
  console.log(mapped.slice(0, 5));
}
test();

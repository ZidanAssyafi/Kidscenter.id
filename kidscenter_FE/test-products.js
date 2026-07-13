async function test() {
  const types = ["fisik", "Fisik", "digital", "Digital", "download hub", "Download Hub"];
  for (const t of types) {
    console.log("Testing:", t);
    const putRes = await fetch('https://kidscenter-bagian-belakang.vercel.app/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama_product: "Test", harga: 1000, stok: 10, tipe: t, deskripsi: "{}" })
    });
    console.log("Status:", putRes.status);
    const result = await putRes.text();
    if (putRes.status === 200 || putRes.status === 201) {
      console.log("SUCCESS:", t);
      // delete it if it succeeded so we don't spam their DB
      // actually we can't easily delete unless we parse ID, but let's just see
    } else {
      console.log("FAIL:", t, result);
    }
  }
}
test();

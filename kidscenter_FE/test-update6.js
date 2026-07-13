async function test() {
  const res = await fetch('https://kidscenter-bagian-belakang.vercel.app/api/orders');
  const data = await res.json();
  const orderId = data.data[0].id_order;
  
  for (const status of ['dikonfirmasi', 'proses', 'diproses', 'dibayar', 'pending']) {
    console.log("Testing:", status);
    const putRes = await fetch('https://kidscenter-bagian-belakang.vercel.app/api/orders/' + orderId, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: status })
    });
    console.log("Status:", putRes.status);
    const result = await putRes.text();
    if (putRes.status === 200) console.log("SUCCESS:", status);
    else console.log("FAIL:", status, result);
  }
}
test();

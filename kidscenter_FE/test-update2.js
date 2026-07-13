async function test() {
  const res = await fetch('https://kidscenter-bagian-belakang.vercel.app/api/orders');
  const data = await res.json();
  const orderId = data.data[0].id_order;
  console.log("Updating order", orderId);
  
  const putRes = await fetch('https://kidscenter-bagian-belakang.vercel.app/api/orders/' + orderId, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'sukses' })
  });
  console.log("Status:", putRes.status);
  const result = await putRes.text();
  console.log(result);
}
test();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log('✅ Webhook received from NOWPayments:', req.body);

  const paymentStatus = req.body.payment_status;
  const orderId = req.body.order_id;

  if (paymentStatus === 'confirmed' || paymentStatus === 'finished') {
    console.log(`✅ Payment CONFIRMED for order: ${orderId}`);
    // You can add logic here to update your database or send confirmation emails
  }

  res.status(200).json({ received: true });
}

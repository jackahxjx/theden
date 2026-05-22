import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { customerEmail, brand, productName, purchasePrice, currency, orderNumber } = req.body;

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: customerEmail,
      subject: `Your ${brand} Receipt`,
      html: `
        <h2>Thank you for your purchase!</h2>
        <p><strong>Product:</strong> ${productName}</p>
        <p><strong>Order:</strong> ${orderNumber}</p>
        <p><strong>Total:</strong> ${currency} ${purchasePrice}</p>
      `
    });
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send email.' });
  }
}

import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

function appleTemplate(data) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;padding:40px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
  <tr><td style="padding:40px;text-align:center;border-bottom:1px solid #e5e5e5;">
    <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" width="30" style="margin-bottom:20px;"><br>
    <h1 style="font-size:28px;font-weight:600;color:#1d1d1f;margin:0 0 10px;">Thank you for your order.</h1>
    <p style="color:#6e6e73;font-size:15px;margin:0;">We'll let you know when your items are on their way.</p>
  </td></tr>
  <tr><td style="padding:30px 40px;border-bottom:1px solid #e5e5e5;">
    <p style="margin:0 0 5px;color:#1d1d1f;font-size:14px;"><strong>Order Number:</strong> <a href="#" style="color:#0066cc;">${data.orderNumber}</a></p>
    <p style="margin:0;color:#1d1d1f;font-size:14px;"><strong>Ordered on:</strong> ${data.orderDate}</p>
  </td></tr>
  <tr><td style="padding:30px 40px;border-bottom:1px solid #e5e5e5;">
    <h2 style="font-size:16px;font-weight:600;color:#1d1d1f;margin:0 0 20px;">Items to be Dispatched</h2>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="80"><img src="${data.productImage || 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch_GEO_EMEA?wid=80&hei=80'}" width="70" height="70" style="border-radius:8px;object-fit:contain;background:#f5f5f7;padding:5px;"></td>
        <td style="padding-left:16px;vertical-align:top;">
          <p style="margin:0 0 4px;font-size:15px;font-weight:500;color:#1d1d1f;">${data.productName}</p>
          <p style="margin:0;font-size:14px;color:#6e6e73;">${data.currency} ${data.purchasePrice}</p>
          <p style="margin:4px 0 0;font-size:13px;color:#6e6e73;">Qty 1</p>
        </td>
        <td align="right" style="vertical-align:top;">
          <p style="margin:0;font-size:15px;color:#1d1d1f;">${data.currency} ${data.purchasePrice}</p>
        </td>
      </tr>
    </table>
    <div style="margin-top:20px;">
      <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#1d1d1f;">Shipping Address:</p>
      <p style="margin:0;font-size:14px;color:#6e6e73;line-height:1.6;">${data.fullName}<br>${data.streetAddress}<br>${data.city}<br>${data.zipCode}<br>${data.country}</p>
    </div>
  </td></tr>
  <tr><td style="padding:30px 40px;border-bottom:1px solid #e5e5e5;">
    <h2 style="font-size:16px;font-weight:600;color:#1d1d1f;margin:0 0 20px;">Billing and Payment</h2>
    <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#1d1d1f;">Bill To:</p>
    <p style="margin:0 0 16px;font-size:14px;color:#6e6e73;line-height:1.6;">${data.fullName}<br><a href="mailto:${data.customerEmail}" style="color:#0066cc;">${data.customerEmail}</a></p>
    <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#1d1d1f;">Billing Address:</p>
    <p style="margin:0;font-size:14px;color:#6e6e73;line-height:1.6;">${data.streetAddress}<br>${data.city}<br>${data.zipCode}<br>${data.country}</p>
  </td></tr>
  <tr><td style="padding:30px 40px;border-bottom:1px solid #e5e5e5;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="font-size:14px;color:#1d1d1f;padding:4px 0;">Bag Subtotal</td><td align="right" style="font-size:14px;color:#1d1d1f;">${data.currency} ${data.purchasePrice}</td></tr>
      <tr><td style="font-size:14px;color:#1d1d1f;padding:4px 0;">Delivery</td><td align="right" style="font-size:14px;color:#00ac47;">$0.00</td></tr>
      <tr><td style="font-size:16px;font-weight:600;color:#1d1d1f;padding:12px 0 0;">Order Total</td><td align="right" style="font-size:16px;font-weight:600;color:#1d1d1f;padding-top:12px;">${data.currency} ${data.purchasePrice}</td></tr>
    </table>
  </td></tr>
  <tr><td style="padding:30px 40px;text-align:center;">
    <p style="color:#6e6e73;font-size:12px;margin:0;">Copyright © 2026 Apple Inc. All rights reserved.</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

const templates = {
  apple: appleTemplate,
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const data = req.body;
  const { customerEmail, brand, productName, orderNumber } = data;

  const templateFn = templates[brand];
  const html = templateFn ? templateFn(data) : `
    <h2>Thank you for your purchase!</h2>
    <p><strong>Product:</strong> ${productName}</p>
    <p><strong>Order:</strong> ${orderNumber}</p>
  `;

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: customerEmail,
      subject: templateFn ? `Your ${brand} order is being processed` : `Your ${brand} Receipt`,
      html
    });
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send email.' });
  }
}

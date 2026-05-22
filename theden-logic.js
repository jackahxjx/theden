// ============================================================
// theden — receipt generator logic
// Replace the entire <script> block in your HTML with this
// ============================================================

const BACKEND_URL = 'https://theden-six.vercel.app/api/generate-receipt';

let isUnlocked = false;
let sessionId = null;

async function keyauthInit() {
  const res = await fetch(`https://keyauth.win/api/1.3/?type=init&ver=1.0&name=The%20Den&ownerid=BoqHHoq9nD`);
  const data = await res.json();
  if (data.success) sessionId = data.sessionid;
  return data.success;
}

async function keyauthLicense(key) {
  if (!sessionId) await keyauthInit();
  const res = await fetch(`https://keyauth.win/api/1.3/?type=license&key=${encodeURIComponent(key)}&sessionid=${sessionId}&name=The%20Den&ownerid=BoqHHoq9nD`);
  return await res.json();
}

function openLicenseInput() {
  if (isUnlocked) { alert('✓ Already unlocked!'); return; }
  const key = prompt('Enter your license key:');
  if (!key) return;
  keyauthLicense(key.trim()).then(data => {
    if (data.success) {
      isUnlocked = true;
      localStorage.setItem('theden_key', key.trim());
      alert('✓ Access granted!');
    } else {
      alert(data.message || 'Invalid key.');
      document.getElementById('upsellModalOverlay').style.display = 'flex';
    }
  }).catch(() => alert('Could not connect. Try again.'));
}

window.addEventListener('load', () => {
  const saved = localStorage.getItem('theden_key');
  if (saved) {
    keyauthLicense(saved).then(data => {
      if (data.success) isUnlocked = true;
    }).catch(() => {});
  }
});

async function openLicenseInput() {
  if (isUnlocked) return;
  const key = prompt("Enter your license key:");
  if (!key) return;
  try {
    await KeyAuthApp.init();
    const result = await KeyAuthApp.license(key);
    if (result) {
      isUnlocked = true;
      localStorage.setItem('theden_key', key);
      alert('✓ Access granted!');
    } else {
      alert('Invalid key.');
      document.getElementById('upsellModalOverlay').style.display = 'flex';
    }
  } catch (err) {
    alert('Invalid or expired key.');
  }
}

window.addEventListener('load', async () => {
  const saved = localStorage.getItem('theden_key');
  if (saved) {
    try {
      await KeyAuthApp.init();
      const result = await KeyAuthApp.license(saved);
      if (result) isUnlocked = true;
    } catch {}
  }
});

// ---- Currency list ----
const CURRENCIES = [
  'USD','EUR','GBP','JPY','AUD','CAD','CHF','CNY',
  'SEK','NOK','DKK','PLN','CZK','HUF','RON','BGN',
  'ISK','RSD','BAM','ALL','MKD','MDL','UAH','RUB',
  'TRY','MXN','INR','ZAR','BRL'
];

// ---- Brand field definitions ----
const brandFields = {
  stockx: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'sku', label:'Style ID', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'shippingFee', label:'Shipping Fee', type:'number', isPrice:true },
    { id:'salesTax', label:'Sales Tax', type:'number', isPrice:true },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. 47196039-40159634' },
    { id:'deliveryDate', label:'Date of Delivery', type:'text', placeholder:'e.g. March 15, 2026' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  apple: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. W7150743374' },
    { id:'orderDate', label:'Order Date', type:'text', placeholder:'DD/MM/YYYY' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  goat: [
    { id:'goatCategory', label:'Category', type:'select', options:['Sneakers','Apparel'] },
    { id:'productName', label:'Product Name', type:'text' },
    { id:'brandName', label:'Brand Name', type:'text', placeholder:'e.g. Air Jordan' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'sku', label:'Style ID (SKU)', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'color', label:'Color', type:'text', specificTo:'Apparel' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'tax', label:'Tax', type:'number', isPrice:true },
    { id:'shippingFee', label:'Shipping Fee', type:'number', isPrice:true },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. 7106938306' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'shoeCondition', label:'Shoe Condition', type:'select', options:['New','Good Condition','Used','Bad Condition'], specificTo:'Sneakers' },
    { id:'boxCondition', label:'Box Condition', type:'select', options:['Good Condition','Badly Damaged','No Original Box','Missing Lid'], specificTo:'Sneakers' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  zalando: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'brandName', label:'Brand Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'shippingFee', label:'Shipping Fee', type:'number', isPrice:true },
    { id:'orderDate', label:'Order Date', type:'text', placeholder:'e.g. Mon, 11 May 2026' },
    { id:'deliveryDate', label:'Delivery Date', type:'text', placeholder:'e.g. Wed, 13 May 2026' },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. 7106938306' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  farfetch: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'brandName', label:'Brand Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'shippingFee', label:'Shipping Fee', type:'number', isPrice:true },
    { id:'tax', label:'Tax', type:'number', isPrice:true },
    { id:'orderDate', label:'Est. Delivery (From)', type:'text', placeholder:'e.g. 24/03/2026' },
    { id:'deliveryDate', label:'Est. Delivery (To)', type:'text', placeholder:'e.g. 26/03/2026' },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. 5019582' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  ebay: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'sku', label:'Item ID (SKU)', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'shippingFee', label:'Shipping Fee', type:'number', isPrice:true },
    { id:'deliveryDate', label:'Est. Delivery Date', type:'text', placeholder:'e.g. Tue, 21 Apr - Mon, 27 Apr' },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. 05-40186-25492' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  louisvuitton: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'sku', label:'Item ID (SKU)', type:'text' },
    { id:'color', label:'Color', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'deliveryDate', label:'Est. Delivery Date', type:'text', placeholder:'e.g. 20/03 and 21/03' },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. nx719506247' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  dyson: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'tax', label:'Tax', type:'number', isPrice:true },
    { id:'shippingFee', label:'Shipping Fee', type:'number', isPrice:true },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. 5910642734' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  balenciaga: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'color', label:'Color', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'tax', label:'Tax', type:'number', isPrice:true },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. F1BAUSO102570976' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  grailed: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'brandName', label:'Brand Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'tax', label:'Tax', type:'number', isPrice:true },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  moncler: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'color', label:'Color', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'orderDate', label:'Order Date', type:'text', placeholder:'e.g. 25 April 2026' },
    { id:'deliveryDate', label:'Est. Delivery Dates', type:'text', placeholder:'e.g. 29 April and 30 April 2026' },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. 10007413549' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  selfridges: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'brandName', label:'Brand Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'sku', label:'Item ID (SKU)', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'color', label:'Color', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'shippingFee', label:'Shipping Fee', type:'number', isPrice:true },
    { id:'orderDate', label:'Order Date', type:'text', placeholder:'e.g. 11-04-2026' },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. 630521634' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  amazon: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'deliveryDate', label:'Delivery Date', type:'text', placeholder:'e.g. Monday, 13 April' },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. 811-5719680-9550' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  viviennewestwood: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'color', label:'Color', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'shippingFee', label:'Shipping Fee', type:'number', isPrice:true },
    { id:'orderDate', label:'Order Date', type:'text', placeholder:'e.g. 15/04/2026' },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. VW-VW0001353429' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  flannels: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'sku', label:'Product ID (SKU)', type:'text' },
    { id:'orderDate', label:'Order Date', type:'text', placeholder:'e.g. 10 March 2026' },
    { id:'deliveryDate', label:'Delivery Date', type:'text', placeholder:'e.g. 13 March 2026' },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. FLAN800000031763890' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  mrporter: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'brandName', label:'Brand Name', type:'text', placeholder:'e.g. Bottega Veneta' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'color', label:'Color', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'tax', label:'Tax', type:'number', isPrice:true },
    { id:'shippingFee', label:'Shipping Fee', type:'number', isPrice:true },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. 83ND5721QA94027' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  dior: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'tax', label:'Tax', type:'number', isPrice:true },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. DL21840502' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  nike: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'tax', label:'Tax', type:'number', isPrice:true },
    { id:'orderDate', label:'Order Date', type:'text', placeholder:'e.g. Mar 24, 2026' },
    { id:'deliveryDate', label:'Est. Delivery Date', type:'text', placeholder:'e.g. Mar 29, 2026' },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. C105311759' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  kickgame: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'shippingFee', label:'Shipping Fee', type:'number', isPrice:true },
    { id:'orderDate', label:'Order Date', type:'text', placeholder:'e.g. 15/04/2026' },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. 61591750' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  hermes: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'sku', label:'Product ID (SKU)', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'color', label:'Color', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'orderDate', label:'Order Date', type:'text', placeholder:'e.g. 15/04/2026' },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. 61591750' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  vinted: [
    { id:'productName', label:'Listing Name', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  rickowens: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'sku', label:'Product ID (SKU)', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'shippingFee', label:'Shipping Fee', type:'number', isPrice:true },
    { id:'orderDate', label:'Order Date', type:'text', placeholder:'e.g. 15/04/2026 12:43:07' },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. R21566839' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  saintlaurent: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'sku', label:'Product ID (SKU)', type:'text' },
    { id:'color', label:'Color', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'shippingFee', label:'Shipping Fee', type:'number', isPrice:true },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. YSL2849291' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  pandora: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'sku', label:'Product ID (SKU)', type:'text' },
    { id:'color', label:'Color', type:'text' },
    { id:'metal', label:'Metal', type:'text', placeholder:'e.g. Gold' },
    { id:'size', label:'Size', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'shippingFee', label:'Shipping Fee', type:'number', isPrice:true },
    { id:'orderDate', label:'Order Date', type:'text', placeholder:'e.g. 15-04-2026' },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. PND71590418' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  sp5der: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'tax', label:'Tax', type:'number', isPrice:true },
    { id:'shippingFee', label:'Shipping Fee', type:'number', isPrice:true },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. SP18594025' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  tnf: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'color', label:'Color', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'tax', label:'Tax', type:'number', isPrice:true },
    { id:'orderDate', label:'Order Date', type:'text', placeholder:'e.g. 15/04/2026' },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. 51960259' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  gucci: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'sku', label:'Product ID (SKU)', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'color', label:'Color', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'tax', label:'VAT', type:'number', isPrice:true },
    { id:'deliveryDate', label:'Est. Delivery Date', type:'text', placeholder:'e.g. 10 Nov' },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. EU819503715' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  harrods: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'brandName', label:'Brand Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'deliveryDate', label:'Est. Delivery Date', type:'text', placeholder:'e.g. 29/04/2026' },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. 1500819503' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  bestbuy: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'sku', label:'Product ID (SKU)', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'tax', label:'Tax', type:'number', isPrice:true },
    { id:'deliveryDate', label:'Est. Delivery Date', type:'text', placeholder:'e.g. Tuesday, March 10' },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. BB12-58494955839' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'storeName', label:'Store Name', type:'text', placeholder:'e.g. Best Buy Downtown' },
    { id:'storeStreetAddress', label:'Store Street', type:'text' },
    { id:'city', label:'Store City', type:'text' },
    { id:'zipCode', label:'Store ZIP', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  prada: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'sku', label:'Product ID (SKU)', type:'text' },
    { id:'color', label:'Color', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'tax', label:'Tax', type:'number', isPrice:true },
    { id:'shippingFee', label:'Shipping Fee', type:'number', isPrice:true },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. EU1758950257' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  canadagoose: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'color', label:'Color', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'vatRate', label:'VAT Rate (%)', type:'number' },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. CGEU_A17598329' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  burberry: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'sku', label:'Product ID (SKU)', type:'text' },
    { id:'color', label:'Color', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'deliveryDate', label:'Date of Delivery', type:'text', placeholder:'e.g. Monday, 16 March 2026' },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. 71940582' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  yzygap: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'sku', label:'Product ID (SKU)', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. HB79261503463' },
    { id:'trackingNumber', label:'Tracking Number', type:'text', placeholder:'e.g. 74015947155' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  stussy: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'color', label:'Color', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'tax', label:'Tax', type:'number', isPrice:true },
    { id:'shippingFee', label:'Shipping Fee', type:'number', isPrice:true },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. 6917309371' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  ssense: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'brandName', label:'Brand Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'sku', label:'Product ID (SKU)', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'tax', label:'Tax', type:'number', isPrice:true },
    { id:'shippingFee', label:'Shipping Fee', type:'number', isPrice:true },
    { id:'orderDate', label:'Order Date', type:'text', placeholder:'e.g. April 13, 2026' },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. 9284971061133' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  brokenplanet: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'color', label:'Color', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'tax', label:'Tax', type:'number', isPrice:true },
    { id:'shippingFee', label:'Shipping Fee', type:'number', isPrice:true },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. 683720' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  arcteryx: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'color', label:'Color', type:'text' },
    { id:'orderDate', label:'Order Date', type:'text', placeholder:'e.g. January 10, 2026' },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. 683720' },
    { id:'trackingNumber', label:'Tracking Number', type:'text', placeholder:'e.g. 1Z76419764137012' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  bape: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'color', label:'Color', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'tax', label:'Tax', type:'number', isPrice:true },
    { id:'shippingFee', label:'Shipping Fee', type:'number', isPrice:true },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. LE305-57-32469' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  flightclub: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'color', label:'Color', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'shippingFee', label:'Shipping Fee', type:'number', isPrice:true },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. 91752047' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  trapstar: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'color', label:'Color', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'tax', label:'Tax', type:'number', isPrice:true },
    { id:'shippingFee', label:'Shipping Fee', type:'number', isPrice:true },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. TS910041859' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  bstn: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'brandName', label:'Brand Name', type:'text' },
    { id:'sku', label:'Product ID (SKU)', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'tax', label:'Tax', type:'number', isPrice:true },
    { id:'shippingFee', label:'Shipping Fee', type:'number', isPrice:true },
    { id:'orderDate', label:'Order Date', type:'text', placeholder:'e.g. 23.04.2026, 16:29' },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. 120058185940' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'phoneNo', label:'Phone Number', type:'text', placeholder:'e.g. 505-000-1234' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  notino: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'size', label:'Size', type:'text', placeholder:'e.g. 100ml' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. 5819404510' },
    { id:'storeName', label:'Store Name', type:'text', placeholder:'e.g. Notino Warszawa' },
    { id:'storeStreetAddress', label:'Store Street', type:'text' },
    { id:'zipCode', label:'Store ZIP Code', type:'text' },
    { id:'city', label:'Store City', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  bayern: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'sku', label:'Product ID (SKU)', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'shippingFee', label:'Shipping Fee', type:'number', isPrice:true },
    { id:'orderDate', label:'Order Date', type:'text', placeholder:'e.g. 15.05.2026' },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. 5819404510' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  plug: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'tax', label:'Tax', type:'number', isPrice:true },
    { id:'shippingFee', label:'Shipping Fee', type:'number', isPrice:true },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. 141859' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  corteiz: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'tax', label:'Tax', type:'number', isPrice:true },
    { id:'shippingFee', label:'Shipping Fee', type:'number', isPrice:true },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. 15709602' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  stanley: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'color', label:'Color', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'tax', label:'Tax', type:'number', isPrice:true },
    { id:'shippingFee', label:'Shipping Fee', type:'number', isPrice:true },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. 15709602' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  legitapp: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'orderDate', label:'Submit Date & Time', type:'text', placeholder:'e.g. 2026-05-01 10:20 AM UTC' },
    { id:'deliveryDate', label:'Completion Date & Time', type:'text', placeholder:'e.g. 2026-05-01 11:14 AM UTC' },
    { id:'orderNumber', label:'Authentication Number', type:'text', placeholder:'e.g. 1826742500435949' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ],
  footshop: [
    { id:'productName', label:'Product Name', type:'text' },
    { id:'productImage', label:'Product Image URL', type:'text' },
    { id:'size', label:'Size', type:'text' },
    { id:'color', label:'Color', type:'text' },
    { id:'purchasePrice', label:'Purchase Price', type:'number' },
    { id:'shippingFee', label:'Shipping Fee', type:'number', isPrice:true },
    { id:'orderNumber', label:'Order Number', type:'text', placeholder:'e.g. 15709602' },
    { id:'fullName', label:'Full Name', type:'text' },
    { id:'streetAddress', label:'Street Address', type:'text' },
    { id:'city', label:'City', type:'text' },
    { id:'zipCode', label:'ZIP Code', type:'text' },
    { id:'country', label:'Country', type:'text' },
    { id:'phoneNo', label:'Phone Number', type:'text', placeholder:'e.g. 505-000-1234' },
    { id:'customerEmail', label:'Delivery Email', type:'email' }
  ]
};

// ---- Display name map ----
const brandNames = {
  louisvuitton:'Louis Vuitton', farfetch:'FARFETCH', kickgame:'Kick Game',
  viviennewestwood:'Vivienne Westwood', stockx:'StockX', ebay:'eBay',
  saintlaurent:'Saint Laurent', rickowens:'Rick Owens', goat:'GOAT',
  dior:'DIOR', sp5der:'SP5DER', mrporter:'MR PORTER', bestbuy:'Best Buy',
  tnf:'The North Face', canadagoose:'Canada Goose', yzygap:'YZY GAP',
  ssense:'SSENSE', brokenplanet:'Broken Planet', arcteryx:"Arc'Teryx",
  bape:'BAPE', flightclub:'Flight Club', bstn:'BSTN', bayern:'FC Bayern',
  plug:'No Sauce The Plug', legitapp:'Legit App', selfridges:'Selfridges'
};

function getBrandName(brand) {
  return brandNames[brand] || (brand.charAt(0).toUpperCase() + brand.slice(1));
}

// ---- CSS for currency addon (inject once) ----
const addonStyle = document.createElement('style');
addonStyle.textContent = `
  .currency-addon {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-right: none;
    border-radius: 8px 0 0 8px;
    color: #aaa;
    padding: 0 12px;
    display: flex;
    align-items: center;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
  }
  .price-row { display: flex; }
  .price-row input { border-radius: 0 8px 8px 0; }
  .success-modal {
    display: none; position: fixed; top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0,0,0,0.7); backdrop-filter: blur(5px);
    z-index: 3000; justify-content: center; align-items: center;
  }
  .success-box {
    background: rgba(20,20,25,0.95);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 24px; padding: 40px 32px;
    text-align: center; max-width: 400px; width: 90%;
    color: #fff;
  }
  .success-icon {
    width: 56px; height: 56px; border-radius: 50%;
    background: rgba(0,255,136,0.1);
    border: 1px solid rgba(0,255,136,0.3);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px; font-size: 26px;
  }
  .error-toast {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    background: rgba(30,30,30,0.95); border: 1px solid rgba(255,80,80,0.4);
    color: #fff; padding: 14px 24px; border-radius: 12px;
    font-size: 14px; z-index: 9999; opacity: 0;
    transition: opacity 0.3s; pointer-events: none;
  }
  .error-toast.show { opacity: 1; }
`;
document.head.appendChild(addonStyle);

// ---- Inject success modal ----
const successModal = document.createElement('div');
successModal.id = 'successModal';
successModal.className = 'success-modal';
successModal.innerHTML = `
  <div class="success-box">
    <div class="success-icon">✓</div>
    <h2 style="margin:0 0 10px;font-size:22px;font-weight:700;">Receipt Sent!</h2>
    <p style="color:#aaa;margin:0 0 24px;font-size:14px;line-height:1.6;">
      Your receipt has been sent to<br>
      <strong style="color:#fff;" id="successEmailDisplay">your inbox</strong>.
    </p>
    <p style="color:#666;font-size:12px;margin:0 0 24px;">
      Check your spam folder if it doesn't arrive shortly.
    </p>
    <button onclick="closeSuccessModal()" style="width:100%;padding:14px;background:#fff;color:#000;border:none;border-radius:8px;font-weight:600;font-size:14px;cursor:pointer;">
      Done
    </button>
  </div>
`;
document.body.appendChild(successModal);

// ---- Inject error toast ----
const errorToast = document.createElement('div');
errorToast.id = 'errorToast';
errorToast.className = 'error-toast';
document.body.appendChild(errorToast);

function showToast(msg, isError = true) {
  const t = document.getElementById('errorToast');
  t.textContent = msg;
  t.style.borderColor = isError ? 'rgba(255,80,80,0.4)' : 'rgba(0,255,136,0.4)';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

function closeSuccessModal() {
  document.getElementById('successModal').style.display = 'none';
}

// ---- renderFields ----
function renderFields(brand) {
  const fields = brandFields[brand];
  if (!fields) { document.getElementById('dynamicFields').innerHTML = '<p style="color:#888">No fields found for this brand.</p>'; return; }

  const container = document.getElementById('dynamicFields');
  container.innerHTML = '';
  let currentCurrency = 'USD';

  fields.forEach(field => {
    const group = document.createElement('div');
    group.className = 'form-group';
    group.id = 'group-' + field.id;
    if (field.specificTo) group.style.display = 'none';

    const label = document.createElement('label');
    label.textContent = field.label;
    group.appendChild(label);

    if (field.type === 'select') {
      const sel = document.createElement('select');
      sel.id = field.id;
      sel.required = true;
      field.options.forEach(opt => {
        const o = document.createElement('option');
        o.value = opt; o.textContent = opt;
        sel.appendChild(o);
      });
      if (field.id === 'goatCategory') sel.addEventListener('change', handleGoatCategoryChange);
      group.appendChild(sel);

    } else if (field.id === 'purchasePrice') {
      const row = document.createElement('div');
      row.className = 'input-row';
      const inp = document.createElement('input');
      inp.type = 'number'; inp.id = field.id; inp.step = '0.01'; inp.required = true; inp.min = '0';
      const sel = document.createElement('select');
      sel.id = 'receiptCurrency';
      CURRENCIES.forEach(c => {
        const o = document.createElement('option');
        o.value = c; o.textContent = c;
        if (c === currentCurrency) o.selected = true;
        sel.appendChild(o);
      });
      sel.addEventListener('change', () => {
        document.querySelectorAll('.currency-addon').forEach(a => a.textContent = sel.value);
      });
      row.appendChild(inp); row.appendChild(sel);
      group.appendChild(row);

    } else if (field.isPrice) {
      const row = document.createElement('div');
      row.className = 'price-row';
      const addon = document.createElement('span');
      addon.className = 'currency-addon';
      addon.textContent = currentCurrency;
      const inp = document.createElement('input');
      inp.type = 'number'; inp.id = field.id; inp.step = '0.01'; inp.required = true; inp.min = '0';
      row.appendChild(addon); row.appendChild(inp);
      group.appendChild(row);

    } else {
      const inp = document.createElement('input');
      inp.type = field.type; inp.id = field.id; inp.required = true;
      if (field.placeholder) inp.placeholder = field.placeholder;
      group.appendChild(inp);
    }

    container.appendChild(group);
  });
}

function handleGoatCategoryChange() {
  const cat = document.getElementById('goatCategory') ? document.getElementById('goatCategory').value : null;
  if (!cat) return;
  const shoeGrp = document.getElementById('group-shoeCondition');
  const boxGrp = document.getElementById('group-boxCondition');
  const colorGrp = document.getElementById('group-color');
  if (cat === 'Sneakers') {
    if (shoeGrp) { shoeGrp.style.display = 'block'; document.getElementById('shoeCondition').required = true; }
    if (boxGrp)  { boxGrp.style.display = 'block';  document.getElementById('boxCondition').required = true; }
    if (colorGrp){ colorGrp.style.display = 'none'; document.getElementById('color').required = false; }
  } else {
    if (shoeGrp) { shoeGrp.style.display = 'none';  document.getElementById('shoeCondition').required = false; }
    if (boxGrp)  { boxGrp.style.display = 'none';   document.getElementById('boxCondition').required = false; }
    if (colorGrp){ colorGrp.style.display = 'block'; document.getElementById('color').required = true; }
  }
}

// ---- Modal open / close ----
function openModal(brand) {
  if (!isUnlocked) {
    document.getElementById('upsellModalOverlay').style.display = 'flex';
    return;
  }
  document.getElementById('modalTitle').innerText = getBrandName(brand) + ' Receipt';
  document.getElementById('selectedBrand').value = brand;
  renderFields(brand);
  const overlay = document.getElementById('modalOverlay');
  overlay.style.display = 'flex';
  overlay.querySelector('.modal-box').scrollTop = 0;
}

function closeModal() {
  document.getElementById('modalOverlay').style.display = 'none';
}

function closeUpsell() {
  document.getElementById('upsellModalOverlay').style.display = 'none';
}

function openLicenseInput() {
  if (isUnlocked) {
    alert('✓ Already unlocked!');
    return;
  }
  const key = prompt('Enter your license key:');
  if (!key) return;
  KeyAuthApp.init().then(() => {
    KeyAuthApp.license(key).then(result => {
      if (result) {
        isUnlocked = true;
        localStorage.setItem('theden_key', key);
        alert('✓ Access granted!');
      } else {
        alert('Invalid key.');
        document.getElementById('upsellModalOverlay').style.display = 'flex';
      }
    });
  }).catch(() => alert('Invalid or expired key.'));
}

// ---- Form submit ----
document.getElementById('receiptForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  if (window._generating) return;
  window._generating = true;

  const btn = this.querySelector('button[type="submit"]');
  const origText = btn.textContent;
  btn.textContent = 'Sending...';
  btn.disabled = true;

  const formData = { brand: document.getElementById('selectedBrand').value };
  const currency = document.getElementById('receiptCurrency');
  formData.currency = currency ? currency.value : 'USD';

  this.querySelectorAll('input, select').forEach(el => {
    if (el.id && el.id !== 'receiptCurrency' && el.offsetParent !== null) {
      formData[el.id] = el.value;
    }
  });

  formData.randomCode = Math.floor(100000 + Math.random() * 900000).toString();
  formData.cardDigits = Math.floor(1000 + Math.random() * 9000).toString();

  try {
    const res = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      closeModal();
      document.getElementById('successEmailDisplay').textContent = formData.customerEmail || 'your inbox';
      document.getElementById('successModal').style.display = 'flex';
    } else {
      const err = await res.json().catch(() => ({}));
      showToast(err.message || 'Something went wrong. Please try again.');
    }
  } catch (err) {
    showToast('Could not reach the server. Check your connection.');
  }

  btn.textContent = origText;
  btn.disabled = false;
  window._generating = false;
});

// ---- Live canvas (paper receipts) ----
function openLiveCanvas(brand) {
  if (!isUnlocked) {
    document.getElementById('upsellModalOverlay').style.display = 'flex';
    return;
  }
  document.getElementById('selectedBrand').value = brand;

  const container = document.getElementById('receiptContainer');
  const layers = ['sephora','apple','stockx_thermal','chromehearts','louisvuitton_thermal','harrods','prada'];

  // Background + dimension map
  const config = {
    sephora:             { bg:'https://res.cloudinary.com/dtwidxp58/image/upload/v1778269780/Sephora_Paper_tfkjlw.png', w:'576px', h:'2160px' },
    prada:               { bg:'https://res.cloudinary.com/dtwidxp58/image/upload/v1778380748/Prada_Paper_msxtwg.png', w:'576px', h:'2160px' },
    harrods:             { bg:'https://res.cloudinary.com/dtwidxp58/image/upload/v1778386641/Harrods_Paper_levs6o.png', w:'576px', h:'1660px' },
    apple:               { bg:'https://res.cloudinary.com/dtwidxp58/image/upload/v1778393987/Apple_Paper_ldfbti.png', w:'576px', h:'1530px' },
    chromehearts:        { bg:'https://res.cloudinary.com/dtwidxp58/image/upload/v1778398218/Chrome_Hearts_Paper_pvqszh.png', w:'576px', h:'1560px' },
    stockx_thermal:      { bg:'https://res.cloudinary.com/dtwidxp58/image/upload/v1778402187/StockX_Paper_-_Sales_Tax_pw02km.png', w:'1240px', h:'1759px' },
    louisvuitton_thermal:{ bg:'https://res.cloudinary.com/dtwidxp58/image/upload/v1778476191/LV_swkwuf.png', w:'1753px', h:'2480px' }
  };

  const cfg = config[brand];
  if (!cfg) return;

  container.style.backgroundImage = `url('${cfg.bg}')`;
  container.style.width = cfg.w;
  container.style.height = cfg.h;
  container.style.minWidth = cfg.w;
  container.style.maxWidth = cfg.w;
  container.style.minHeight = cfg.h;
  container.style.maxHeight = cfg.h;

  // Show the right layer
  layers.forEach(l => {
    const el = document.getElementById(l + '-layer');
    if (el) el.style.display = (l === brand) ? 'block' : 'none';
  });

  // Auto-scale
  const wrapper = document.querySelector('.receipt-canvas-wrapper');
  const availW = wrapper.clientWidth - 20;
  const canvW = parseInt(cfg.w);
  const canvH = parseInt(cfg.h);

  wrapper.style.display = 'block';

  if (canvW > availW) {
    const scale = availW / canvW;
    container.style.transform = `scale(${scale})`;
    container.style.transformOrigin = 'top left';
    container.style.marginBottom = `-${canvH - canvH * scale}px`;
    container.style.marginLeft = '10px';
  } else {
    container.style.transform = 'none';
    container.style.marginBottom = '0';
    container.style.marginLeft = `${(availW - canvW) / 2}px`;
  }

  const printTxt = document.getElementById('printInstructions');
  if (printTxt) {
    const msgs = {
      stockx_thermal: '4x6 Thermal Label Printer recommended (300 DPI).',
      louisvuitton_thermal: 'A4 Thermal Document Printer recommended (203–300 DPI).',
    };
    printTxt.textContent = msgs[brand] || '80mm POS Receipt Printer recommended (203 DPI).';
    printTxt.style.display = 'block';
  }

  document.getElementById('liveCanvasModalOverlay').style.display = 'flex';
}

function closeLiveCanvas() {
  document.getElementById('liveCanvasModalOverlay').style.display = 'none';
}

// ---- PNG export ----
async function processThermalExport() {
  const btn = document.getElementById('primaryGenBtn');
  btn.textContent = 'Generating...';
  btn.disabled = true;

  const brand = document.getElementById('selectedBrand').value;
  const container = document.getElementById('receiptContainer');
  const canvW = parseInt(container.style.width);
  const canvH = parseInt(container.style.height);

  const bgUrl = container.style.backgroundImage.replace(/url\(['"]?(.+?)['"]?\)/, '$1');

  try {
    await document.fonts.ready;

    const canvas = document.createElement('canvas');
    canvas.width = canvW;
    canvas.height = canvH;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = bgUrl;
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
    ctx.drawImage(img, 0, 0, canvW, canvH);

    // Watermark
    ctx.save();
    ctx.font = '900 22px sans-serif';
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let y = 0; y <= canvH; y += 150) {
      for (let x = 0; x <= canvW; x += 150) {
        ctx.save();
        ctx.translate(x + 75, y + 75);
        ctx.rotate(-45 * Math.PI / 180);
        ctx.fillText('THEDEN', 0, 0);
        ctx.restore();
      }
    }
    ctx.restore();

    // Draw text elements
    const activeLayer = document.getElementById(brand + '-layer');
    if (activeLayer) {
      activeLayer.querySelectorAll('.live-text').forEach(el => {
        const text = el.innerText || '';
        if (!text.trim()) return;

        const cs = window.getComputedStyle(el);
        ctx.font = `${cs.fontSize} ${cs.fontFamily}`;
        ctx.fillStyle = '#000';
        ctx.textBaseline = 'hanging';
        ctx.letterSpacing = cs.letterSpacing !== 'normal' ? cs.letterSpacing : '0px';

        const align = cs.textAlign;
        let x;
        if (align === 'right') {
          ctx.textAlign = 'right';
          x = canvW - parseInt(cs.right);
        } else if (align === 'center') {
          ctx.textAlign = 'center';
          x = canvW / 2;
        } else {
          ctx.textAlign = 'left';
          x = parseInt(cs.left);
        }

        const y = parseInt(cs.top);
        const lh = isNaN(parseInt(cs.lineHeight)) ? parseInt(cs.fontSize) : parseInt(cs.lineHeight);

        text.split('\n').forEach((line, i) => ctx.fillText(line, x, y + i * lh));
      });
    }

    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `theden-receipt-${brand}.png`;
      document.body.appendChild(a); a.click();
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);
    }, 'image/png', 1.0);

  } catch (err) {
    showToast('Export failed. Please try again.');
    console.error(err);
  }

  btn.textContent = 'Generate Receipt';
  btn.disabled = false;
}

// ---- Close on overlay click ----
window.addEventListener('click', e => {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
  if (e.target === document.getElementById('upsellModalOverlay')) closeUpsell();
  if (e.target === document.getElementById('successModal')) closeSuccessModal();
  if (e.target === document.getElementById('liveCanvasModalOverlay')) closeLiveCanvas();
});

// ---- Paste plain text only in canvas ----
document.addEventListener('paste', e => {
  if (e.target && e.target.classList.contains('live-text')) {
    e.preventDefault();
    const text = (e.originalEvent || e).clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }
});

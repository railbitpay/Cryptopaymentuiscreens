# How QR Codes Work for Crypto Payments

## Overview

QR codes in crypto payments encode payment information that wallets can scan and interpret. The format and content differ significantly between cryptocurrencies.

---

## 1. Bitcoin Lightning Network (BTC)

### What's in the QR Code:
A **Lightning Invoice** (BOLT11 format) that looks like:
```
lnbc4550n1p3xyzabc...verylongstring...xyz
```

### Format Breakdown:
- `lnbc` = Lightning Network Bitcoin
- `4550` = Amount in millisatoshis (0.00004550 BTC)
- `n1` = Network (mainnet)
- `p3xyz...` = Payment hash and other encoded data

### How It Works:
1. **Merchant generates invoice** from their Lightning node
2. **QR code encodes the invoice string**
3. **Customer scans QR** with Lightning wallet (Phoenix, Wallet of Satoshi, etc.)
4. **Wallet decodes invoice** and shows amount/merchant
5. **Customer confirms** → Payment sent instantly via Lightning Network
6. **Merchant's node detects payment** automatically

### In Our Implementation:
```typescript
// Currently: Mock invoice string
const invoice = payment.address; // e.g., "lnbc4550n1p3xyz..."

// QR Code encodes this string
<QRCodeSVG value={invoice} />
```

### Real Implementation Would:
- Connect to a Lightning node (LND, CLN, etc.)
- Generate actual BOLT11 invoices via API
- Include payment hash, expiry, routing hints
- Monitor node for payment completion

---

## 2. Ethereum (ETH)

### What's in the QR Code:
An **Ethereum address** (0x format) + optional amount:
```
0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0
```

Or using **EIP-681 URI format**:
```
ethereum:0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0?value=0.0012e18
```

### Format Breakdown:
- `0x` prefix = Ethereum address
- 40 hex characters = 20-byte address
- Optional `?value=` = Amount in wei (smallest ETH unit)

### How It Works:
1. **Merchant generates unique deposit address** (or uses their wallet address)
2. **QR code encodes the address** (with optional amount)
3. **Customer scans QR** with Ethereum wallet (MetaMask, Coinbase Wallet, etc.)
4. **Wallet opens** with address pre-filled
5. **Customer enters exact amount** and sends transaction
6. **Merchant monitors blockchain** for incoming transaction to that address
7. **After confirmations** (12 blocks), payment is confirmed

### In Our Implementation:
```typescript
// Currently: Mock Ethereum address
const address = payment.address; // e.g., "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0"

// QR Code encodes this address
<QRCodeSVG value={address} />

// Could also use EIP-681 format:
const uri = `ethereum:${address}?value=${amountInWei}`;
<QRCodeSVG value={uri} />
```

### Real Implementation Would:
- Generate unique deposit addresses per payment (HD wallet)
- Use EIP-681 URI format for better wallet compatibility
- Monitor Ethereum blockchain for transactions
- Check transaction amount matches expected amount
- Wait for required confirmations (12 blocks)

---

## 3. Solana (SOL)

### What's in the QR Code:
A **Solana wallet address** (base58 format):
```
7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
```

Or using **Solana Pay URI format**:
```
solana:7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU?amount=1.5&reference=abc123
```

### Format Breakdown:
- Base58 encoded = 32-44 character string
- Optional `?amount=` = Amount in SOL
- Optional `?reference=` = Payment reference/ID

### How It Works:
1. **Merchant generates unique deposit address** (or uses their wallet)
2. **QR code encodes the address** (with optional amount)
3. **Customer scans QR** with Solana wallet (Phantom, Solflare, etc.)
4. **Wallet opens** with address and amount pre-filled
5. **Customer confirms** → Transaction sent
6. **Payment confirmed in ~400ms** (Solana's fast finality)
7. **Merchant monitors blockchain** for transaction

### In Our Implementation:
```typescript
// Currently: Mock Solana address
const address = payment.address; // e.g., "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"

// QR Code encodes this address
<QRCodeSVG value={address} />

// Could use Solana Pay format:
const uri = `solana:${address}?amount=${solAmount}&reference=${paymentId}`;
<QRCodeSVG value={uri} />
```

### Real Implementation Would:
- Generate unique deposit addresses per payment
- Use Solana Pay URI format for better UX
- Monitor Solana blockchain via RPC
- Verify transaction signature
- Confirm payment in under 1 second

---

## How QR Code Libraries Work

### What We're Using: `qrcode.react`

```typescript
import { QRCodeSVG } from 'qrcode.react';

<QRCodeSVG 
  value="any-string-here"  // What to encode
  size={256}                // Size in pixels
  level="H"                 // Error correction level (L, M, Q, H)
  includeMargin={false}     // White border
/>
```

### What Happens:
1. **Library takes the string** (invoice, address, URI)
2. **Encodes it as QR code** using Reed-Solomon error correction
3. **Renders as SVG** (scalable, works in browsers)
4. **Wallet scans QR** → Decodes string → Interprets format

### Error Correction Levels:
- **L (Low)**: ~7% error correction
- **M (Medium)**: ~15% error correction
- **Q (Quartile)**: ~25% error correction
- **H (High)**: ~30% error correction (we use this for reliability)

---

## Payment URL QR Codes

### In CreatePaymentView:
We encode the **payment URL** in the QR code:
```typescript
const paymentUrl = payment.payment_url; 
// e.g., "http://localhost:5173/payment/pay_1234567890_abc123"

<QRCodeSVG value={paymentUrl} />
```

### Why This Works:
1. Customer scans QR → Opens payment page in browser
2. Payment page loads → Shows asset selector
3. Customer selects crypto → Sees crypto-specific QR code
4. Customer scans crypto QR → Opens wallet with payment details

This is a **two-step process**:
- **Step 1**: QR code → Payment page (web URL)
- **Step 2**: Payment page → Crypto wallet (invoice/address)

---

## Real-World Implementation Differences

### What We Have (Mock):
```typescript
// Backend generates random strings
const addresses = {
  btc: `lnbc${Math.random().toString(36).substr(2, 20)}...`,
  eth: `0x${Math.random().toString(16).substr(2, 40)}`,
  sol: `${Math.random().toString(36).substr(2, 32)}`
};
```

### What Real Implementation Needs:

#### Bitcoin Lightning:
```javascript
// Connect to Lightning node
const lnd = new LndClient({
  host: 'lightning-node.example.com',
  cert: fs.readFileSync('tls.cert'),
  macaroon: fs.readFileSync('admin.macaroon')
});

// Generate real invoice
const invoice = await lnd.addInvoice({
  value: amountInSatoshis,
  memo: description,
  expiry: 900 // 15 minutes
});

// invoice.payment_request = "lnbc4550n1p3xyz..." (real invoice)
```

#### Ethereum:
```javascript
// Generate unique address from HD wallet
const wallet = ethers.Wallet.fromMnemonic(mnemonic);
const depositAddress = wallet.derivePath(`m/44'/60'/0'/0/${paymentIndex}`).address;

// Monitor blockchain
const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/...');
provider.on(depositAddress, (tx) => {
  if (tx.value.eq(expectedAmount)) {
    // Payment received!
  }
});
```

#### Solana:
```javascript
// Generate unique address
const keypair = Keypair.fromSeed(deriveSeed(paymentId));
const depositAddress = keypair.publicKey.toBase58();

// Monitor blockchain
const connection = new Connection('https://api.mainnet-beta.solana.com');
connection.onAccountChange(depositAddress, (accountInfo) => {
  // Check if payment received
});
```

---

## Summary

| Crypto | QR Contains | Format | Confirmation Time |
|--------|------------|--------|-------------------|
| **Lightning** | Invoice (BOLT11) | `lnbc...` | Instant (~1 second) |
| **Ethereum** | Address + Amount | `0x...` or `ethereum:0x...?value=...` | ~3-5 minutes (12 blocks) |
| **Solana** | Address + Amount | Base58 or `solana:...?amount=...` | ~400ms (1 block) |

### Key Points:
1. **QR codes are just encoded strings** - wallets interpret the format
2. **Different formats** for different cryptos
3. **Our QR codes work** - they encode valid-looking strings
4. **Real implementation** needs blockchain integration for:
   - Generating real addresses/invoices
   - Monitoring for payments
   - Verifying amounts match

The QR code generation itself is working correctly - we're just using mock data instead of real blockchain addresses/invoices!


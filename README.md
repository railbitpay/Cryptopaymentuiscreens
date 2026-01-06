# RailBit - Crypto Payment Platform

A full-stack cryptocurrency payment platform for merchants to accept Bitcoin Lightning, Ethereum, and Solana payments.

## Features

- 🚀 **Full Backend Integration** - Express.js API server with SQLite database
- 💳 **Payment Processing** - Create and manage crypto payment requests
- 🔐 **Authentication** - JWT-based auth with secure registration/login
- 📊 **Dashboard** - Real-time stats and payment tracking
- ⚡ **Real-time Updates** - WebSocket support for payment status updates
- 🎨 **Modern UI** - Built with React, TypeScript, and Tailwind CSS

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Radix UI components
- React Hook Form

### Backend
- Node.js + Express
- SQLite database
- JWT authentication
- Socket.io for WebSockets
- bcryptjs for password hashing

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Cryptopaymentuiscreens
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

### Running the Application

You need to run both the frontend and backend servers:

1. **Start the backend server** (in one terminal):
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:3001`

2. **Start the frontend development server** (in another terminal):
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Open your browser**
   Navigate to `http://localhost:5173`

## Usage

### First Time Setup

1. **Create an Account**
   - Click "Get Started" on the entry page
   - Complete the onboarding flow:
     - Step 1: Create account (email & password)
     - Step 2: Business information (business name required)
     - Step 3-5: Additional setup (KYC, settlement, etc.)

2. **Login**
   - Use your registered email and password
   - You'll be redirected to the dashboard

### Creating Payments

1. Navigate to **Dashboard** → **Create Payment**
2. Enter the amount in CAD
3. Select cryptocurrency (BTC Lightning, ETH, or SOL)
4. Add optional description
5. Click "Generate Payment Request"
6. Share the payment link or QR code with your customer

### Viewing Payments

- **Dashboard Overview**: See recent payments and stats
- **Payments View**: View all payments with filtering options
- **Payment Details**: Click on any payment to view details

### Testing Payment Flow

1. Create a payment from the merchant dashboard
2. Copy the payment URL (e.g., `http://localhost:5173/payment/pay_xxx`)
3. Open in a new tab/window (simulating customer view)
4. Select a cryptocurrency
5. The payment will automatically poll for status updates
6. To simulate payment completion, you can call the verify endpoint:
   ```bash
   curl -X POST http://localhost:3001/api/payments/{payment_id}/verify
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new merchant
- `POST /api/auth/login` - Login merchant
- `GET /api/auth/me` - Get current user (requires auth)

### Payments
- `POST /api/payments` - Create new payment (requires auth)
- `GET /api/payments` - List all payments (requires auth)
- `GET /api/payments/:id` - Get payment details
- `POST /api/payments/:id/verify` - Verify/simulate payment completion

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (requires auth)
- `GET /api/transactions` - Get transaction history (requires auth)

## Database

The application uses SQLite for local development. The database file (`railbit.db`) is automatically created in the `backend` directory on first run.

### Database Schema
- `merchants` - Merchant accounts
- `payments` - Payment requests
- `transactions` - Transaction records
- `api_keys` - API key management

## Environment Variables

Create a `.env` file in the `backend` directory (optional):
```
JWT_SECRET=your-secret-key-here
PORT=3001
```

## Development

### Frontend Development
- Hot reload is enabled
- TypeScript type checking
- ESLint for code quality

### Backend Development
- Auto-restart on file changes (with `--watch`)
- SQLite database for easy local testing
- CORS enabled for localhost development

## Project Structure

```
Cryptopaymentuiscreens/
├── backend/
│   ├── server.js          # Express server
│   ├── package.json       # Backend dependencies
│   └── railbit.db         # SQLite database (auto-generated)
├── src/
│   ├── components/        # React components
│   │   ├── customer/      # Customer payment flow
│   │   ├── dashboard/     # Merchant dashboard
│   │   ├── onboarding/    # Onboarding flow
│   │   └── ui/            # UI components
│   ├── contexts/          # React contexts (Auth)
│   ├── services/          # API service layer
│   └── App.tsx            # Main app component
├── package.json           # Frontend dependencies
└── vite.config.ts         # Vite configuration
```

## Notes

- This is a development/demo version. For production:
  - Use a production database (PostgreSQL, MySQL)
  - Implement proper crypto payment integration
  - Add rate limiting and security measures
  - Use environment variables for secrets
  - Enable HTTPS
  - Add comprehensive error handling and logging

## License

Private - All rights reserved

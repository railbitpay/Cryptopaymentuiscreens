import { useState } from 'react';
import { Code, Book, Key, Webhook, CreditCard, FileText, Terminal } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import type { AppView } from '../../App';

interface APIDocsProps {
  onNavigate: (view: AppView) => void;
}

export function APIDocs({ onNavigate }: APIDocsProps) {
  const [selectedEndpoint, setSelectedEndpoint] = useState('create-payment');

  const navigation = [
    { id: 'getting-started', label: 'Getting Started', icon: Book },
    { id: 'authentication', label: 'Authentication', icon: Key },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'webhooks', label: 'Webhooks', icon: Webhook },
    { id: 'errors', label: 'Errors', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <button 
            onClick={() => onNavigate('entry')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-gray-900">RailBit API</h2>
              <p className="text-xs text-gray-500">Developer Documentation</p>
            </div>
          </button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onNavigate('dashboard')}>
              Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedEndpoint(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedEndpoint === item.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-8">
          {selectedEndpoint === 'getting-started' && <GettingStarted />}
          {selectedEndpoint === 'authentication' && <Authentication />}
          {selectedEndpoint === 'payments' && <PaymentsAPI />}
          {selectedEndpoint === 'webhooks' && <WebhooksAPI />}
          {selectedEndpoint === 'errors' && <ErrorsAPI />}
        </div>
      </div>
    </div>
  );
}

function GettingStarted() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Getting Started</h1>
        <p className="text-gray-600">
          Welcome to the RailBit API. Accept Bitcoin Lightning, Ethereum, and Solana payments in your application.
        </p>
      </div>

      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="text-gray-900 mb-2">Base URL</h3>
        <code className="block bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
          https://api.railbit.com/v1
        </code>
      </Card>

      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">Quick Start</h3>
        <ol className="space-y-4">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
            <div>
              <p className="text-gray-900">Create an account at railbit.com</p>
              <p className="text-sm text-gray-600">Complete KYC verification to get approved</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
            <div>
              <p className="text-gray-900">Get your API keys from the dashboard</p>
              <p className="text-sm text-gray-600">Use test keys for development, live keys for production</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">3</span>
            <div>
              <p className="text-gray-900">Make your first API call</p>
              <p className="text-sm text-gray-600">Create a payment request and start accepting crypto</p>
            </div>
          </li>
        </ol>
      </Card>

      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">Supported Assets</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
            <Badge className="bg-orange-100 text-orange-800 border-orange-200">BTC</Badge>
            <span className="text-sm text-gray-900">Bitcoin Lightning Network - Instant, low-fee payments</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <Badge className="bg-purple-100 text-purple-800 border-purple-200">ETH</Badge>
            <span className="text-sm text-gray-900">Ethereum - Smart contract compatible</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <Badge className="bg-green-100 text-green-800 border-green-200">SOL</Badge>
            <span className="text-sm text-gray-900">Solana - Ultra-fast confirmations</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Authentication() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Authentication</h1>
        <p className="text-gray-600">
          All API requests require authentication using your API key in the Authorization header.
        </p>
      </div>

      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">API Keys</h3>
        <p className="text-sm text-gray-600 mb-4">
          Your API keys can be found in your dashboard under Settings → API Keys.
        </p>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-700">Test Key</label>
            <code className="block bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mt-1">
              pk_test_51234567890abcdef
            </code>
          </div>
          <div>
            <label className="text-sm text-gray-700">Live Key</label>
            <code className="block bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mt-1">
              pk_live_51234567890abcdef
            </code>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">Example Request</h3>
        <Tabs defaultValue="curl">
          <TabsList>
            <TabsTrigger value="curl">cURL</TabsTrigger>
            <TabsTrigger value="node">Node.js</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
          </TabsList>
          
          <TabsContent value="curl">
            <pre className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
{`curl https://api.railbit.com/v1/payments \\
  -H "Authorization: Bearer pk_test_51234567890abcdef" \\
  -H "Content-Type: application/json"`}
            </pre>
          </TabsContent>

          <TabsContent value="node">
            <pre className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
{`const axios = require('axios');

const response = await axios.get(
  'https://api.railbit.com/v1/payments',
  {
    headers: {
      'Authorization': 'Bearer pk_test_51234567890abcdef',
      'Content-Type': 'application/json'
    }
  }
);`}
            </pre>
          </TabsContent>

          <TabsContent value="python">
            <pre className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
{`import requests

response = requests.get(
    'https://api.railbit.com/v1/payments',
    headers={
        'Authorization': 'Bearer pk_test_51234567890abcdef',
        'Content-Type': 'application/json'
    }
)`}
            </pre>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

function PaymentsAPI() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Payments API</h1>
        <p className="text-gray-600">
          Create and manage crypto payment requests.
        </p>
      </div>

      {/* Create Payment */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Create Payment</h3>
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">POST</Badge>
        </div>
        <code className="block bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-4">
          POST /v1/payments
        </code>
        
        <h4 className="text-sm text-gray-900 mb-2">Request Body</h4>
        <pre className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto mb-4">
{`{
  "amount": 45.50,
  "currency": "CAD",
  "asset": "BTC",
  "description": "Order #12345",
  "metadata": {
    "order_id": "12345",
    "customer_email": "customer@example.com"
  }
}`}
        </pre>

        <h4 className="text-sm text-gray-900 mb-2">Response</h4>
        <pre className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
{`{
  "id": "pay_abc123",
  "status": "pending",
  "amount_cad": 45.50,
  "amount_crypto": 0.00068250,
  "asset": "BTC",
  "payment_url": "https://pay.railbit.com/pay_abc123",
  "invoice": "lnbc4550n1p3xyz...",
  "expires_at": "2025-11-21T15:45:00Z",
  "created_at": "2025-11-21T15:30:00Z"
}`}
        </pre>
      </Card>

      {/* Get Payment */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Get Payment</h3>
          <Badge className="bg-green-100 text-green-800 border-green-200">GET</Badge>
        </div>
        <code className="block bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-4">
          GET /v1/payments/:id
        </code>
        
        <h4 className="text-sm text-gray-900 mb-2">Response</h4>
        <pre className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
{`{
  "id": "pay_abc123",
  "status": "completed",
  "amount_cad": 45.50,
  "amount_crypto": 0.00068250,
  "asset": "BTC",
  "transaction_id": "tx_def456",
  "completed_at": "2025-11-21T15:35:12Z",
  "created_at": "2025-11-21T15:30:00Z"
}`}
        </pre>
      </Card>

      {/* List Payments */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">List Payments</h3>
          <Badge className="bg-green-100 text-green-800 border-green-200">GET</Badge>
        </div>
        <code className="block bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-4">
          GET /v1/payments?limit=10&status=completed
        </code>
        
        <h4 className="text-sm text-gray-900 mb-2">Query Parameters</h4>
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-3">
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">limit</code>
            <span className="text-sm text-gray-600">Number of results (default: 10, max: 100)</span>
          </div>
          <div className="flex items-start gap-3">
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">status</code>
            <span className="text-sm text-gray-600">Filter by status: pending, completed, failed, expired</span>
          </div>
          <div className="flex items-start gap-3">
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">asset</code>
            <span className="text-sm text-gray-600">Filter by crypto asset: BTC, ETH, SOL</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function WebhooksAPI() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Webhooks</h1>
        <p className="text-gray-600">
          Receive real-time notifications when payment events occur.
        </p>
      </div>

      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">Available Events</h3>
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <code className="text-sm text-gray-900">payment.created</code>
            <p className="text-xs text-gray-600 mt-1">Payment request was created</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <code className="text-sm text-gray-900">payment.pending</code>
            <p className="text-xs text-gray-600 mt-1">Transaction detected, awaiting confirmations</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <code className="text-sm text-gray-900">payment.completed</code>
            <p className="text-xs text-gray-600 mt-1">Payment confirmed on blockchain</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <code className="text-sm text-gray-900">payment.failed</code>
            <p className="text-xs text-gray-600 mt-1">Payment failed or was rejected</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <code className="text-sm text-gray-900">payment.expired</code>
            <p className="text-xs text-gray-600 mt-1">Payment request expired without payment</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">Webhook Payload</h3>
        <pre className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
{`{
  "event": "payment.completed",
  "data": {
    "id": "pay_abc123",
    "status": "completed",
    "amount_cad": 45.50,
    "amount_crypto": 0.00068250,
    "asset": "BTC",
    "transaction_id": "tx_def456",
    "metadata": {
      "order_id": "12345",
      "customer_email": "customer@example.com"
    },
    "completed_at": "2025-11-21T15:35:12Z"
  },
  "created_at": "2025-11-21T15:35:12Z"
}`}
        </pre>
      </Card>

      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">Verifying Webhooks</h3>
        <p className="text-sm text-gray-600 mb-4">
          Verify webhook signatures to ensure requests are from RailBit.
        </p>
        <pre className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
{`const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(hmac)
  );
}`}
        </pre>
      </Card>
    </div>
  );
}

function ErrorsAPI() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Error Handling</h1>
        <p className="text-gray-600">
          The API uses standard HTTP response codes and returns JSON error objects.
        </p>
      </div>

      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">HTTP Status Codes</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Badge className="bg-green-100 text-green-800 border-green-200">200</Badge>
            <div>
              <p className="text-sm text-gray-900">OK</p>
              <p className="text-xs text-gray-600">Request succeeded</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">400</Badge>
            <div>
              <p className="text-sm text-gray-900">Bad Request</p>
              <p className="text-xs text-gray-600">Invalid request parameters</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="bg-red-100 text-red-800 border-red-200">401</Badge>
            <div>
              <p className="text-sm text-gray-900">Unauthorized</p>
              <p className="text-xs text-gray-600">Invalid or missing API key</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="bg-red-100 text-red-800 border-red-200">404</Badge>
            <div>
              <p className="text-sm text-gray-900">Not Found</p>
              <p className="text-xs text-gray-600">Resource doesn't exist</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge className="bg-red-100 text-red-800 border-red-200">500</Badge>
            <div>
              <p className="text-sm text-gray-900">Internal Server Error</p>
              <p className="text-xs text-gray-600">Something went wrong on our end</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">Error Response Format</h3>
        <pre className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
{`{
  "error": {
    "type": "invalid_request_error",
    "message": "Invalid amount: must be greater than 0",
    "param": "amount",
    "code": "invalid_amount"
  }
}`}
        </pre>
      </Card>

      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">Common Error Codes</h3>
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">invalid_api_key</code>
            <span className="text-sm text-gray-600">The provided API key is invalid</span>
          </div>
          <div className="flex items-start gap-3">
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">invalid_amount</code>
            <span className="text-sm text-gray-600">Amount must be a positive number</span>
          </div>
          <div className="flex items-start gap-3">
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">unsupported_asset</code>
            <span className="text-sm text-gray-600">Asset not supported or not enabled</span>
          </div>
          <div className="flex items-start gap-3">
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">payment_not_found</code>
            <span className="text-sm text-gray-600">Payment ID doesn't exist</span>
          </div>
          <div className="flex items-start gap-3">
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">rate_limit_exceeded</code>
            <span className="text-sm text-gray-600">Too many requests, try again later</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

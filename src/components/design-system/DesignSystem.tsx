import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, Bitcoin, Wallet } from 'lucide-react';

export function DesignSystem() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <div>
        <h1 className="text-gray-900 mb-2">RailBit Design System</h1>
        <p className="text-gray-600">Complete UI component library and design tokens</p>
      </div>

      {/* Colors */}
      <section className="space-y-4">
        <h2 className="text-gray-900">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="w-full h-20 bg-gray-900 rounded mb-2"></div>
            <p className="text-sm text-gray-900">Charcoal</p>
            <p className="text-xs text-gray-500">#111827</p>
          </Card>
          <Card className="p-4">
            <div className="w-full h-20 bg-blue-600 rounded mb-2"></div>
            <p className="text-sm text-gray-900">Navy Blue</p>
            <p className="text-xs text-gray-500">#2563EB</p>
          </Card>
          <Card className="p-4">
            <div className="w-full h-20 bg-orange-500 rounded mb-2"></div>
            <p className="text-sm text-gray-900">BTC Orange</p>
            <p className="text-xs text-gray-500">#F97316</p>
          </Card>
          <Card className="p-4">
            <div className="w-full h-20 bg-purple-600 rounded mb-2"></div>
            <p className="text-sm text-gray-900">ETH Purple</p>
            <p className="text-xs text-gray-500">#9333EA</p>
          </Card>
          <Card className="p-4">
            <div className="w-full h-20 bg-green-500 rounded mb-2"></div>
            <p className="text-sm text-gray-900">SOL Green</p>
            <p className="text-xs text-gray-500">#22C55E</p>
          </Card>
          <Card className="p-4">
            <div className="w-full h-20 bg-gray-50 border-2 border-gray-200 rounded mb-2"></div>
            <p className="text-sm text-gray-900">Background</p>
            <p className="text-xs text-gray-500">#F9FAFB</p>
          </Card>
        </div>
      </section>

      {/* Buttons */}
      <section className="space-y-4">
        <h2 className="text-gray-900">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Primary Button</Button>
          <Button variant="outline">Secondary Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button disabled>Disabled Button</Button>
        </div>
      </section>

      {/* Alerts */}
      <section className="space-y-4">
        <h2 className="text-gray-900">Alerts</h2>
        <div className="space-y-3">
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-900">
              Payment received successfully. Transaction confirmed on blockchain.
            </AlertDescription>
          </Alert>
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-900">
              KYC verification is pending. Your account has limited functionality.
            </AlertDescription>
          </Alert>
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-900">
              Payment failed. Transaction was not detected on the network.
            </AlertDescription>
          </Alert>
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              New regulatory requirements. Please update your business information.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Status Badges */}
      <section className="space-y-4">
        <h2 className="text-gray-900">Status Badges</h2>
        <div className="flex flex-wrap gap-3">
          <Badge className="bg-green-100 text-green-800 border-green-200">PAID</Badge>
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">PENDING</Badge>
          <Badge className="bg-red-100 text-red-800 border-red-200">FAILED</Badge>
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">IN REVIEW</Badge>
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">APPROVED</Badge>
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">EXPIRED</Badge>
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">NOT STARTED</Badge>
        </div>
      </section>

      {/* Form Inputs */}
      <section className="space-y-4">
        <h2 className="text-gray-900">Form Components</h2>
        <div className="grid gap-4 max-w-md">
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Text Input</label>
            <Input placeholder="Enter business name" />
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Disabled Input</label>
            <Input placeholder="Disabled field" disabled />
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Error State</label>
            <Input placeholder="Invalid input" className="border-red-300 focus:border-red-500" />
            <p className="text-sm text-red-600 mt-1">This field is required</p>
          </div>
        </div>
      </section>

      {/* Asset Icons */}
      <section className="space-y-4">
        <h2 className="text-gray-900">Crypto Asset Icons</h2>
        <div className="flex gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Bitcoin className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm text-gray-600">BTC Lightning</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-600">Ethereum</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-600">Solana</span>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="space-y-4">
        <h2 className="text-gray-900">Cards</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-2">Standard Card</h3>
            <p className="text-gray-600 text-sm">Clean card with subtle shadow and rounded corners.</p>
          </Card>
          <Card className="p-6 border-blue-200 bg-blue-50">
            <h3 className="text-gray-900 mb-2">Highlighted Card</h3>
            <p className="text-gray-600 text-sm">Card with colored background for emphasis.</p>
          </Card>
          <Card className="p-6 border-2 border-blue-600">
            <h3 className="text-gray-900 mb-2">Selected Card</h3>
            <p className="text-gray-600 text-sm">Active state with bold border.</p>
          </Card>
        </div>
      </section>
    </div>
  );
}

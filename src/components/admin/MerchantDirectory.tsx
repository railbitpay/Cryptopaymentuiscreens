import { Search, Filter, Download } from 'lucide-react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface MerchantDirectoryProps {
  onSelectMerchant: (merchantId: string) => void;
}

export function MerchantDirectory({ onSelectMerchant }: MerchantDirectoryProps) {
  const merchants = [
    {
      id: '1',
      businessName: 'My Coffee Shop',
      email: 'contact@mycoffeeshop.ca',
      craNumber: '123456789RC0001',
      kycStatus: 'approved',
      volumeCAD: 45678.90,
      transactionCount: 234,
      joinDate: '2025-10-15',
      amlFlags: 0
    },
    {
      id: '2',
      businessName: 'Tech Solutions Inc',
      email: 'billing@techsolutions.ca',
      craNumber: '987654321RC0001',
      kycStatus: 'in-review',
      volumeCAD: 123456.78,
      transactionCount: 567,
      joinDate: '2025-11-01',
      amlFlags: 1
    },
    {
      id: '3',
      businessName: 'Downtown Boutique',
      email: 'info@downtownboutique.ca',
      craNumber: '456789123RC0001',
      kycStatus: 'approved',
      volumeCAD: 23456.50,
      transactionCount: 123,
      joinDate: '2025-09-20',
      amlFlags: 0
    },
    {
      id: '4',
      businessName: 'Maple Consulting',
      email: 'admin@mapleconsulting.ca',
      craNumber: '321654987RC0001',
      kycStatus: 'rejected',
      volumeCAD: 0,
      transactionCount: 0,
      joinDate: '2025-11-10',
      amlFlags: 2
    }
  ];

  const getKYCBadge = (status: string) => {
    const variants = {
      approved: 'bg-green-100 text-green-800 border-green-200',
      'in-review': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      pending: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900">Merchant Directory</h1>
            <p className="text-gray-600 mt-1">Manage and review merchant accounts</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6">
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-1">Total Merchants</p>
            <p className="text-2xl text-gray-900">{merchants.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-1">Approved</p>
            <p className="text-2xl text-green-600">
              {merchants.filter(m => m.kycStatus === 'approved').length}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-1">In Review</p>
            <p className="text-2xl text-yellow-600">
              {merchants.filter(m => m.kycStatus === 'in-review').length}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-1">With AML Flags</p>
            <p className="text-2xl text-red-600">
              {merchants.filter(m => m.amlFlags > 0).length}
            </p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by business name, email, or CRA number..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </Card>

        {/* Merchants Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Business Name</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">CRA Number</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">KYC Status</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Volume (CAD)</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Transactions</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">AML Flags</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600"></th>
                </tr>
              </thead>
              <tbody>
                {merchants.map((merchant) => (
                  <tr 
                    key={merchant.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => onSelectMerchant(merchant.id)}
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm text-gray-900">{merchant.businessName}</p>
                        <p className="text-xs text-gray-500">Joined {merchant.joinDate}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{merchant.email}</td>
                    <td className="py-4 px-4 text-sm text-gray-600 font-mono">{merchant.craNumber}</td>
                    <td className="py-4 px-4">
                      {getKYCBadge(merchant.kycStatus)}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      ${merchant.volumeCAD.toLocaleString('en-CA', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {merchant.transactionCount}
                    </td>
                    <td className="py-4 px-4">
                      {merchant.amlFlags > 0 ? (
                        <Badge className="bg-red-100 text-red-800 border-red-200">
                          {merchant.amlFlags}
                        </Badge>
                      ) : (
                        <span className="text-sm text-gray-500">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

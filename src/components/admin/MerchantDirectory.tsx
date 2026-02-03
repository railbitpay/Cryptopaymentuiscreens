import { useState, useEffect } from 'react';
import { Search, Filter, Download, Loader2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { api } from '../../services/api';

interface MerchantDirectoryProps {
  onSelectMerchant: (merchantId: string) => void;
}

export function MerchantDirectory({ onSelectMerchant }: MerchantDirectoryProps) {
  const [merchants, setMerchants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        setLoading(true);
        const data = await api.getMerchants();
        setMerchants(data);
      } catch (error) {
        console.error('Failed to fetch merchants:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMerchants();
  }, []);

  const filteredMerchants = merchants.filter(merchant => {
    const matchesSearch = 
      merchant.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      merchant.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || merchant.kyc_status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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
    <div className="p-4 sm:p-6 lg:p-8">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-1">Total Merchants</p>
            <p className="text-2xl text-gray-900">{merchants.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-1">Approved</p>
            <p className="text-2xl text-green-600">
              {merchants.filter(m => m.kyc_status === 'approved').length}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-1">In Review</p>
            <p className="text-2xl text-yellow-600">
              {merchants.filter(m => m.kyc_status === 'in-review').length}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-1">With AML Flags</p>
            <p className="text-2xl text-red-600">0</p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by business name, email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                    </td>
                  </tr>
                ) : filteredMerchants.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-600">
                      No merchants found
                    </td>
                  </tr>
                ) : (
                  filteredMerchants.map((merchant) => (
                    <tr 
                      key={merchant.id} 
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => onSelectMerchant(merchant.id)}
                    >
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm text-gray-900">{merchant.business_name || 'N/A'}</p>
                          <p className="text-xs text-gray-500">Joined {new Date(merchant.created_at).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{merchant.email}</td>
                      <td className="py-4 px-4 text-sm text-gray-600 font-mono">—</td>
                      <td className="py-4 px-4">
                        {getKYCBadge(merchant.kyc_status)}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">
                        ${(merchant.total_volume || 0).toLocaleString('en-CA', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-900">
                        {merchant.transaction_count || 0}
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-500">—</span>
                      </td>
                      <td className="py-4 px-4">
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

import { Shield, FileText, Download } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export function ComplianceEvents() {
  const events = [
    {
      id: '1',
      type: 'Large Virtual Currency Transaction Report',
      date: '2025-11-21',
      merchant: 'Tech Solutions Inc',
      amount: 15000,
      status: 'submitted',
      reportId: 'LVCTR-2025-11-001'
    },
    {
      id: '2',
      type: 'Suspicious Transaction Report',
      date: '2025-11-20',
      merchant: 'Maple Consulting',
      amount: null,
      status: 'under-review',
      reportId: 'STR-2025-11-002'
    },
    {
      id: '3',
      type: 'Large Virtual Currency Transaction Report',
      date: '2025-11-19',
      merchant: 'Downtown Boutique',
      amount: 12400,
      status: 'submitted',
      reportId: 'LVCTR-2025-11-003'
    }
  ];

  const stats = {
    totalReports: 45,
    thisMonth: 8,
    pending: 2,
    submitted: 43
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-gray-900">Compliance Event Logs</h1>
          <p className="text-gray-600 mt-1">FINTRAC reporting and compliance tracking</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6">
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-1">Total Reports</p>
            <p className="text-2xl text-gray-900">{stats.totalReports}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-1">This Month</p>
            <p className="text-2xl text-blue-600">{stats.thisMonth}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-1">Pending Review</p>
            <p className="text-2xl text-yellow-600">{stats.pending}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-1">Submitted</p>
            <p className="text-2xl text-green-600">{stats.submitted}</p>
          </Card>
        </div>

        {/* Events Table */}
        <Card>
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-gray-900">Recent Compliance Events</h3>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Report Type</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Merchant</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Amount (CAD)</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Report ID</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600"></th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm text-gray-900">{event.date}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{event.type}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">{event.merchant}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {event.amount ? `$${event.amount.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600 font-mono">{event.reportId}</td>
                    <td className="py-4 px-4">
                      <Badge className={
                        event.status === 'submitted'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }>
                        {event.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* FINTRAC Info */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="text-gray-900 mb-2">FINTRAC Compliance</h4>
              <p className="text-sm text-gray-600 mb-4">
                Canadian Crypto Pay is registered as a Money Services Business (MSB) with FINTRAC.
                All large transactions over $10,000 CAD are automatically reported as required by law.
              </p>
              <div className="flex gap-2">
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  MSB Registration: M12345678
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  RPAA Compliant
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

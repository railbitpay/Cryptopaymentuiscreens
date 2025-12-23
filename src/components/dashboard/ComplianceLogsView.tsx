import { Shield, FileText, AlertTriangle, CheckCircle2, Clock, Download } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';

export function ComplianceLogsView() {
  const kycStatus = {
    status: 'approved',
    lastReview: '2025-10-15',
    nextReview: '2026-10-15',
    documents: [
      { name: 'Business Incorporation', status: 'approved', uploadDate: '2025-10-10' },
      { name: 'Beneficial Owner ID', status: 'approved', uploadDate: '2025-10-10' },
      { name: 'Proof of Address', status: 'approved', uploadDate: '2025-10-12' }
    ]
  };

  const transactionMonitoring = [
    {
      id: '1',
      date: '2025-11-20',
      type: 'Large Transaction',
      amount: 12500,
      asset: 'BTC',
      description: 'Transaction exceeds $10,000 CAD threshold',
      status: 'logged',
      action: 'Reported to FINTRAC'
    },
    {
      id: '2',
      date: '2025-11-18',
      type: 'Velocity Check',
      amount: 8500,
      asset: 'ETH',
      description: 'Multiple transactions in short timeframe',
      status: 'reviewed',
      action: 'No action required'
    }
  ];

  const amlAlerts = [
    {
      id: '1',
      date: '2025-11-19',
      severity: 'medium',
      type: 'Unusual Pattern',
      description: 'Higher than normal transaction frequency detected',
      status: 'under-review',
      assignedTo: 'Compliance Team'
    }
  ];

  const fintracReports = [
    {
      id: '1',
      type: 'Large Virtual Currency Transaction Report',
      date: '2025-11-20',
      amount: 12500,
      status: 'submitted',
      reportId: 'LVCTR-2025-001'
    },
    {
      id: '2',
      type: 'Monthly Compliance Report',
      date: '2025-11-01',
      amount: null,
      status: 'submitted',
      reportId: 'MCR-2025-11'
    }
  ];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-gray-900">Compliance & Monitoring</h1>
          <p className="text-gray-600 mt-1">FINTRAC MSB compliance logs and transaction monitoring</p>
        </div>

        {/* Compliance Status */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                APPROVED
              </Badge>
            </div>
            <h3 className="text-gray-900 mb-1">KYC Status</h3>
            <p className="text-sm text-gray-600">Last reviewed: {kycStatus.lastReview}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                ACTIVE
              </Badge>
            </div>
            <h3 className="text-gray-900 mb-1">FINTRAC MSB</h3>
            <p className="text-sm text-gray-600">Registration: M12345678</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                READY
              </Badge>
            </div>
            <h3 className="text-gray-900 mb-1">RPAA Compliance</h3>
            <p className="text-sm text-gray-600">Travel Rule ready</p>
          </Card>
        </div>

        {/* Active Alerts */}
        {amlAlerts.length > 0 && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-900">
              You have {amlAlerts.length} active compliance alert(s) that require review
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="kyc">
          <TabsList>
            <TabsTrigger value="kyc">KYC Documents</TabsTrigger>
            <TabsTrigger value="monitoring">Transaction Monitoring</TabsTrigger>
            <TabsTrigger value="aml">AML Alerts</TabsTrigger>
            <TabsTrigger value="fintrac">FINTRAC Reports</TabsTrigger>
          </TabsList>

          {/* KYC Documents */}
          <TabsContent value="kyc" className="mt-6">
            <Card>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-900">KYC Verification Documents</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Next review scheduled: {kycStatus.nextReview}
                    </p>
                  </div>
                  <Button variant="outline">Upload New Document</Button>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {kycStatus.documents.map((doc, index) => (
                  <div key={index} className="p-6 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-600">Uploaded: {doc.uploadDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        {doc.status.toUpperCase()}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Transaction Monitoring */}
          <TabsContent value="monitoring" className="mt-6">
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm text-gray-600">Date</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600">Type</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600">Amount (CAD)</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600">Asset</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600">Description</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600">Action Taken</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionMonitoring.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 text-sm text-gray-900">{item.date}</td>
                        <td className="py-4 px-4">
                          <Badge variant="outline">{item.type}</Badge>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-900">
                          ${item.amount.toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                            {item.asset}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">{item.description}</td>
                        <td className="py-4 px-4 text-sm text-gray-600">{item.action}</td>
                        <td className="py-4 px-4">
                          <Badge className={
                            item.status === 'logged' 
                              ? 'bg-blue-100 text-blue-800 border-blue-200'
                              : 'bg-green-100 text-green-800 border-green-200'
                          }>
                            {item.status.toUpperCase()}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* AML Alerts */}
          <TabsContent value="aml" className="mt-6">
            <Card>
              <div className="divide-y divide-gray-200">
                {amlAlerts.map((alert) => (
                  <div key={alert.id} className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="text-gray-900">{alert.type}</h4>
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                              {alert.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Created: {alert.date}</span>
                            <span>•</span>
                            <span>Assigned to: {alert.assignedTo}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        {alert.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm">Review Alert</Button>
                      <Button size="sm" variant="outline">Dismiss</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* FINTRAC Reports */}
          <TabsContent value="fintrac" className="mt-6">
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm text-gray-600">Report Type</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600">Date</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600">Report ID</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600">Amount</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {fintracReports.map((report) => (
                      <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 text-sm text-gray-900">{report.type}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">{report.date}</td>
                        <td className="py-4 px-4 text-sm text-gray-600">{report.reportId}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">
                          {report.amount ? `$${report.amount.toLocaleString()}` : '—'}
                        </td>
                        <td className="py-4 px-4">
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            {report.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

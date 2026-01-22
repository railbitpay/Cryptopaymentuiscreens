import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Download, CheckCircle2, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { api } from '../../services/api';

interface MerchantDetailProps {
  merchantId: string;
  onBack: () => void;
}

export function MerchantDetail({ merchantId, onBack }: MerchantDetailProps) {
  const [merchant, setMerchant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [noteSubmitting, setNoteSubmitting] = useState(false);
  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api';

  useEffect(() => {
    const fetchMerchant = async () => {
      try {
        setLoading(true);
        const data = await api.getMerchant(merchantId);
        setMerchant(data);
      } catch (error) {
        console.error('Failed to fetch merchant:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMerchant();
  }, [merchantId]);

  const handleApprove = async () => {
    if (!merchant) return;
    try {
      setUpdating(true);
      await api.updateMerchantKycStatus(merchantId, 'approved');
      setMerchant({ ...merchant, kyc_status: 'approved' });
    } catch (error) {
      console.error('Failed to update KYC status:', error);
      alert('Failed to update KYC status');
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async () => {
    if (!merchant) return;
    if (!confirm('Are you sure you want to reject this merchant?')) return;
    try {
      setUpdating(true);
      await api.updateMerchantKycStatus(merchantId, 'rejected');
      setMerchant({ ...merchant, kyc_status: 'rejected' });
    } catch (error) {
      console.error('Failed to update KYC status:', error);
      alert('Failed to update KYC status');
    } finally {
      setUpdating(false);
    }
  };

  const handleRequestMoreInfo = async () => {
    if (!merchant) return;
    try {
      setUpdating(true);
      await api.updateMerchantKycStatus(merchantId, 'in-review');
      setMerchant({ ...merchant, kyc_status: 'in-review' });
    } catch (error) {
      console.error('Failed to update KYC status:', error);
      alert('Failed to update KYC status');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!merchant) return;
    const text = prompt('Enter admin note');
    if (!text) return;
    try {
      setNoteSubmitting(true);
      const newNote = await api.addMerchantNote(merchantId, text);
      setMerchant({ ...merchant, notes: [newNote, ...(merchant.notes || [])] });
    } catch (error) {
      console.error('Failed to add note:', error);
      alert('Failed to add note');
    } finally {
      setNoteSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!merchant) {
    return (
      <div className="p-8">
        <Alert>
          <AlertDescription>Merchant not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Merchants
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-gray-900">{merchant.business_name || 'N/A'}</h1>
              <p className="text-gray-600 mt-1">Merchant ID: {merchant.id}</p>
            </div>
            <Badge className={
              merchant.kyc_status === 'approved'
                ? 'bg-green-100 text-green-800 border-green-200'
                : merchant.kyc_status === 'in-review'
                ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                : 'bg-red-100 text-red-800 border-red-200'
            }>
              {merchant.kyc_status.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-6">
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-1">Total Volume</p>
            <p className="text-2xl text-gray-900">
              ${(merchant.total_volume || 0).toLocaleString('en-CA', { minimumFractionDigits: 2 })}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-1">Transactions</p>
            <p className="text-2xl text-gray-900">{merchant.transaction_count || 0}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-1">Member Since</p>
            <p className="text-2xl text-gray-900">{new Date(merchant.created_at).toLocaleDateString()}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-1">Status</p>
            <p className="text-2xl text-gray-900">{merchant.kyc_status}</p>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="info">
          <TabsList>
            <TabsTrigger value="info">Business Information</TabsTrigger>
            <TabsTrigger value="kyc">KYC Documents</TabsTrigger>
            <TabsTrigger value="activity">Transaction Activity</TabsTrigger>
            <TabsTrigger value="notes">Admin Notes</TabsTrigger>
          </TabsList>

          {/* Business Info */}
          <TabsContent value="info" className="mt-6">
            <Card className="p-6">
              <h3 className="text-gray-900 mb-6">Business Details</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-600">Business Name</label>
                  <p className="text-gray-900 mt-1">{merchant.business_name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">CRA Business Number</label>
                  <p className="text-gray-900 mt-1 font-mono">{merchant.business_number || '—'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <p className="text-gray-900 mt-1">{merchant.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Phone</label>
                  <p className="text-gray-900 mt-1">{merchant.phone || '—'}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-600">Address</label>
                  <p className="text-gray-900 mt-1">
                    {merchant.address_line1 || '—'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Industry</label>
                  <p className="text-gray-900 mt-1">{merchant.industry || '—'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Join Date</label>
                  <p className="text-gray-900 mt-1">{new Date(merchant.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 mt-6">
              <h3 className="text-gray-900 mb-6">Beneficial Owners</h3>
              <div className="space-y-4">
                {(merchant.beneficialOwners || []).map((owner, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-gray-900">{owner.name}</p>
                      <p className="text-sm text-gray-600">{owner.role} • {owner.ownership} ownership</p>
                    </div>
                    {owner.verified && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* KYC Documents */}
          <TabsContent value="kyc" className="mt-6">
            <Card>
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-gray-900">Uploaded Documents</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {(merchant.documents || []).map((doc, index) => (
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
                      <Badge className={
                        doc.status === 'approved'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : doc.status === 'rejected'
                          ? 'bg-red-100 text-red-800 border-red-200'
                          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }>
                        {doc.status.toUpperCase()}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`${apiBase}/admin/kyc/documents/${doc.id}/download`, '_blank')}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Actions */}
            {merchant.kyc_status === 'in-review' && (
              <div className="mt-6 flex gap-3">
                <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Approve Merchant
                </Button>
                <Button onClick={handleReject} variant="destructive">
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button onClick={handleRequestMoreInfo} variant="outline">
                  Request More Information
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Transaction Activity */}
          <TabsContent value="activity" className="mt-6">
            <Card className="p-8 text-center text-gray-600">
              Transaction activity details would appear here
            </Card>
          </TabsContent>

          {/* Admin Notes */}
          <TabsContent value="notes" className="mt-6">
            <Card>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-900">Admin Notes & Activity Log</h3>
                  <Button variant="outline" size="sm" onClick={handleAddNote} disabled={noteSubmitting}>
                    {noteSubmitting ? 'Saving...' : 'Add Note'}
                  </Button>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {(merchant.notes || []).map((note, index) => (
                  <div key={index} className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">{note.author}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{note.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{note.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

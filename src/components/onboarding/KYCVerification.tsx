import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { api, KycDocument } from '../../services/api';

interface KYCVerificationProps {
  onNext: () => void;
  onBack: () => void;
}
// NOT STARTED

type DocumentStatus = 'not-started' | 'uploaded' | 'in-review' | 'approved';

export function KYCVerification({ onNext, onBack }: KYCVerificationProps) {
  const [documents, setDocuments] = useState<Record<string, KycDocument | null>>({
    incorporation: null,
    owner_id: null,
    proof_of_address: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true);
        const docs = await api.getKycDocuments();
        const map: Record<string, KycDocument | null> = {
          incorporation: docs.find(d => d.document_type === 'incorporation') || null,
          owner_id: docs.find(d => d.document_type === 'owner_id') || null,
          proof_of_address: docs.find(d => d.document_type === 'proof_of_address') || null
        };
        setDocuments(map);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load KYC documents');
      } finally {
        setLoading(false);
      }
    };
    loadDocuments();
  }, []);

  const documentCards = [
    {
      title: 'Incorporation Documents',
      description: 'Articles of Incorporation or Business Registration',
      status: documents.incorporation?.status || 'not-started',
      type: 'incorporation'
    },
    {
      title: 'Beneficial Owner ID',
      description: 'Government-issued photo ID of business owners',
      status: documents.owner_id?.status || 'not-started',
      type: 'owner_id'
    },
    {
      title: 'Proof of Address',
      description: 'Utility bill or bank statement (last 3 months)',
      status: documents.proof_of_address?.status || 'not-started',
      type: 'proof_of_address'
    }
  ];

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'not-started':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">NOT STARTED</Badge>;
      case 'uploaded':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">UPLOADED</Badge>;
      case 'in-review':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">IN REVIEW</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">APPROVED</Badge>;
    }
  };

  const allUploaded = documentCards.every((doc) => doc.status !== 'not-started');

  const handleUpload = async (type: string, title: string, file?: File | null) => {
    if (!file) return;
    try {
      setError(null);
      setLoading(true);
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });
      const base64 = dataUrl.split(',')[1];
      const doc = await api.uploadKycDocument({
        documentType: type,
        name: title,
        fileName: file.name,
        mimeType: file.type || 'application/octet-stream',
        data: base64
      });
      setDocuments(prev => ({ ...prev, [type]: doc }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-8">
        <div className="mb-8">
          <h2 className="text-gray-900 mb-2">KYC Verification</h2>
          <p className="text-gray-600 mb-4">
            FINTRAC requires identity verification for all merchants
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              All documents are encrypted and stored securely. We're compliant with PIPEDA and FINTRAC requirements.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {documentCards.map((doc, index) => (
            <Card key={index} className="p-6 border-2">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">{doc.title}</h3>
                  <p className="text-sm text-gray-600">{doc.description}</p>
                </div>
                {getStatusBadge(doc.status)}
              </div>

              {doc.status === 'not-started' ? (
                <div>
                  <input
                    type="file"
                    id={`kyc-${doc.type}`}
                    className="hidden"
                    onChange={(e) => handleUpload(doc.type, doc.title, e.target.files?.[0])}
                  />
                  <Button
                    onClick={() => document.getElementById(`kyc-${doc.type}`)?.click()}
                    variant="outline"
                    className="w-full"
                    disabled={loading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              ) : doc.status === 'uploaded' || doc.status === 'in-review' || doc.status === 'approved' ? (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{documents[doc.type as keyof typeof documents]?.name || 'document'}</p>
                    <p className="text-xs text-gray-500">
                      {doc.status === 'approved' ? 'Approved' : doc.status === 'in-review' ? 'In review' : 'Uploaded'}
                    </p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      </Card>

      {error && (
        <Card className="p-4 border-red-200 bg-red-50">
          <p className="text-sm text-red-800">{error}</p>
        </Card>
      )}

      <Card className="p-6 bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-gray-900 mb-1">Verification Timeline</h3>
            <p className="text-sm text-gray-700">
              Document review typically takes 1-2 business days. You'll receive an email notification 
              when your verification is complete. You can start using limited features immediately.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!allUploaded}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface KYCVerificationProps {
  onNext: () => void;
  onBack: () => void;
}

type DocumentStatus = 'not-started' | 'uploaded' | 'in-review' | 'approved';

export function KYCVerification({ onNext, onBack }: KYCVerificationProps) {
  const [incorporationDoc, setIncorporationDoc] = useState<DocumentStatus>('not-started');
  const [ownerID, setOwnerID] = useState<DocumentStatus>('not-started');
  const [proofOfAddress, setProofOfAddress] = useState<DocumentStatus>('not-started');

  const documents = [
    {
      title: 'Incorporation Documents',
      description: 'Articles of Incorporation or Business Registration',
      status: incorporationDoc,
      onUpload: () => setIncorporationDoc('uploaded')
    },
    {
      title: 'Beneficial Owner ID',
      description: 'Government-issued photo ID of business owners',
      status: ownerID,
      onUpload: () => setOwnerID('uploaded')
    },
    {
      title: 'Proof of Address',
      description: 'Utility bill or bank statement (last 3 months)',
      status: proofOfAddress,
      onUpload: () => setProofOfAddress('uploaded')
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

  const allUploaded = incorporationDoc !== 'not-started' && 
                       ownerID !== 'not-started' && 
                       proofOfAddress !== 'not-started';

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
          {documents.map((doc, index) => (
            <Card key={index} className="p-6 border-2">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">{doc.title}</h3>
                  <p className="text-sm text-gray-600">{doc.description}</p>
                </div>
                {getStatusBadge(doc.status)}
              </div>

              {doc.status === 'not-started' ? (
                <Button
                  onClick={doc.onUpload}
                  variant="outline"
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              ) : doc.status === 'uploaded' ? (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">document.pdf</p>
                    <p className="text-xs text-gray-500">Uploaded successfully</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      </Card>

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

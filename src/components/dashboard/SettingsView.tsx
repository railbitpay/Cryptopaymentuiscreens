import { useState, useEffect } from 'react';
import { User, Key, Webhook, Users, Shield, Bell, Loader2, Copy, CheckCircle2, Trash2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

export function SettingsView() {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createKeyDialogOpen, setCreateKeyDialogOpen] = useState(false);
  const [newKeyType, setNewKeyType] = useState<'test' | 'live'>('test');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        setLoading(true);
        const keys = await api.getApiKeys();
        setApiKeys(keys);
      } catch (error) {
        console.error('Failed to fetch API keys:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApiKeys();
  }, []);

  const handleCreateKey = async () => {
    try {
      const newKey = await api.createApiKey(newKeyType);
      setApiKeys([newKey, ...apiKeys]);
      setRevealedKeys(new Set([...revealedKeys, newKey.id]));
      setCreateKeyDialogOpen(false);
    } catch (error) {
      console.error('Failed to create API key:', error);
      alert('Failed to create API key');
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }
    try {
      await api.deleteApiKey(keyId);
      setApiKeys(apiKeys.filter(k => k.id !== keyId));
      setRevealedKeys(new Set([...revealedKeys].filter(id => id !== keyId)));
    } catch (error) {
      console.error('Failed to delete API key:', error);
      alert('Failed to delete API key');
    }
  };

  const handleCopyKey = (keyValue: string, keyId: string) => {
    navigator.clipboard.writeText(keyValue);
    setCopiedKeyId(keyId);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const toggleRevealKey = (keyId: string) => {
    const newRevealed = new Set(revealedKeys);
    if (newRevealed.has(keyId)) {
      newRevealed.delete(keyId);
    } else {
      newRevealed.add(keyId);
    }
    setRevealedKeys(newRevealed);
  };

  const webhooks = [
    {
      id: '1',
      url: 'https://example.com/webhook',
      events: ['payment.completed', 'payment.failed'],
      status: 'active',
      lastDelivery: '2025-11-20'
    }
  ];

  const teamMembers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Owner',
      status: 'active'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Admin',
      status: 'active'
    }
  ];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account and integration settings</p>
        </div>

        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="mt-6 space-y-6">
            <Card className="p-6">
              <h3 className="text-gray-900 mb-4">Business Information</h3>
              <div className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Business Name</Label>
                  <Input defaultValue={user?.business_name || ''} className="mt-1" />
                </div>
                <div>
                  <Label>CRA Business Number</Label>
                  <Input defaultValue="" className="mt-1" disabled />
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" defaultValue={user?.email || ''} className="mt-1" />
              </div>
                <div>
                  <Label>Business Address</Label>
                  <Input defaultValue="123 Main St, Toronto, ON M5V 1A1" className="mt-1" />
                </div>
                <Button>Save Changes</Button>
              </div>
            </Card>
          </TabsContent>

          {/* API Keys */}
          <TabsContent value="api" className="mt-6 space-y-6">
            <Card>
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-gray-900">API Keys</h3>
                  <p className="text-sm text-gray-600 mt-1">Manage your API credentials for integration</p>
                </div>
                <Button onClick={() => setCreateKeyDialogOpen(true)}>Create New Key</Button>
              </div>
              {loading ? (
                <div className="p-12 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : apiKeys.length === 0 ? (
                <div className="p-12 text-center text-gray-600">
                  <Key className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No API keys created yet</p>
                  <p className="text-sm mt-2">Create your first API key to start integrating</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {apiKeys.map((key) => (
                    <div key={key.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-gray-900">
                              {key.key_type === 'live' ? 'Production API Key' : 'Test API Key'}
                            </h4>
                            <Badge variant={key.key_type === 'live' ? 'default' : 'secondary'}>
                              {key.key_type === 'live' ? 'Production' : 'Test'}
                            </Badge>
                          </div>
                          <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-2 font-mono text-sm flex items-center justify-between">
                            <span>
                              {revealedKeys.has(key.id) ? key.key_value : `${key.key_value.substring(0, 20)}••••••••••••••••`}
                            </span>
                            {revealedKeys.has(key.id) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopyKey(key.key_value, key.id)}
                                className="ml-2 h-6 px-2"
                              >
                                {copiedKeyId === key.id ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            )}
                          </div>
                          <div className="flex gap-4 text-xs text-gray-600">
                            <span>Created: {new Date(key.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleRevealKey(key.id)}
                          >
                            {revealedKeys.has(key.id) ? 'Hide' : 'Reveal'}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteKey(key.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Dialog open={createKeyDialogOpen} onOpenChange={setCreateKeyDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New API Key</DialogTitle>
                  <DialogDescription>
                    Choose the type of API key you want to create
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Key Type</Label>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="keyType"
                          value="test"
                          checked={newKeyType === 'test'}
                          onChange={() => setNewKeyType('test')}
                          className="w-4 h-4"
                        />
                        <span>Test Key (for development)</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="keyType"
                          value="live"
                          checked={newKeyType === 'live'}
                          onChange={() => setNewKeyType('live')}
                          className="w-4 h-4"
                        />
                        <span>Live Key (for production)</span>
                      </label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateKeyDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateKey}>Create Key</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <h4 className="text-gray-900 mb-2">API Documentation</h4>
              <p className="text-sm text-gray-600 mb-4">
                Learn how to integrate RailBit into your application
              </p>
              <Button variant="outline">View API Docs</Button>
            </Card>
          </TabsContent>

          {/* Webhooks */}
          <TabsContent value="webhooks" className="mt-6 space-y-6">
            <Card>
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-gray-900">Webhook Endpoints</h3>
                  <p className="text-sm text-gray-600 mt-1">Receive real-time events via HTTP callbacks</p>
                </div>
                <Button>Add Endpoint</Button>
              </div>
              <div className="divide-y divide-gray-200">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-sm text-gray-900 font-mono">{webhook.url}</h4>
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            {webhook.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {webhook.events.map((event) => (
                            <Badge key={event} variant="outline" className="text-xs">
                              {event}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-gray-600">
                          Last delivery: {webhook.lastDelivery}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">Test</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Team */}
          <TabsContent value="team" className="mt-6 space-y-6">
            <Card>
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-gray-900">Team Members</h3>
                  <p className="text-sm text-gray-600 mt-1">Manage who has access to your account</p>
                </div>
                <Button>Invite Member</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm text-gray-600">Name</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600">Email</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600">Role</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-600"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((member) => (
                      <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 text-sm text-gray-900">{member.name}</td>
                        <td className="py-4 px-4 text-sm text-gray-600">{member.email}</td>
                        <td className="py-4 px-4">
                          <Badge variant={member.role === 'Owner' ? 'default' : 'outline'}>
                            {member.role}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            {member.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          {member.role !== 'Owner' && (
                            <Button variant="ghost" size="sm">Remove</Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="mt-6 space-y-6">
            <Card className="p-6">
              <h3 className="text-gray-900 mb-4">Two-Factor Authentication</h3>
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">2FA is enabled</p>
                    <p className="text-xs text-gray-600">Your account is protected with authenticator app</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-gray-900 mb-4">Change Password</h3>
              <div className="space-y-4 max-w-md">
                <div>
                  <Label>Current Password</Label>
                  <Input type="password" className="mt-1" />
                </div>
                <div>
                  <Label>New Password</Label>
                  <Input type="password" className="mt-1" />
                </div>
                <div>
                  <Label>Confirm New Password</Label>
                  <Input type="password" className="mt-1" />
                </div>
                <Button>Update Password</Button>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="mt-6 space-y-6">
            <Card className="p-6">
              <h3 className="text-gray-900 mb-6">Email Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <p className="text-sm text-gray-900">Payment Received</p>
                    <p className="text-xs text-gray-600">Get notified when a payment is completed</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <p className="text-sm text-gray-900">Payment Failed</p>
                    <p className="text-xs text-gray-600">Get notified when a payment fails</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <p className="text-sm text-gray-900">Weekly Summary</p>
                    <p className="text-xs text-gray-600">Receive weekly transaction summaries</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <p className="text-sm text-gray-900">Compliance Alerts</p>
                    <p className="text-xs text-gray-600">Important regulatory and KYC updates</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm text-gray-900">Marketing Updates</p>
                    <p className="text-xs text-gray-600">News and product announcements</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Key, Shield, Loader2, Copy, CheckCircle2, Trash2, Plus } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { api, NotificationSettings, Webhook as WebhookType, TeamMember } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const webhookEventOptions = [
  'payment.completed',
  'payment.failed',
  'payment.pending'
];

export function SettingsView() {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createKeyDialogOpen, setCreateKeyDialogOpen] = useState(false);
  const [newKeyType, setNewKeyType] = useState<'test' | 'live'>('test');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());

  const [profile, setProfile] = useState({
    businessName: '',
    businessNumber: '',
    industry: '',
    email: '',
    phone: '',
    addressLine1: '',
    city: '',
    province: '',
    postalCode: ''
  });
  const [profileSaving, setProfileSaving] = useState(false);

  const [webhooks, setWebhooks] = useState<WebhookType[]>([]);
  const [webhookDialogOpen, setWebhookDialogOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookEvents, setWebhookEvents] = useState<string[]>([]);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Member');

  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(!!user?.two_factor_enabled);
  const [passwordCurrent, setPasswordCurrent] = useState('');
  const [passwordNew, setPasswordNew] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [notifications, setNotifications] = useState<NotificationSettings>({
    payment_received: true,
    payment_failed: true,
    weekly_summary: true,
    compliance_alerts: true,
    marketing_updates: false
  });
  const [notificationsSaving, setNotificationsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const [keys, me, hookList, team, notif] = await Promise.all([
          api.getApiKeys(),
          api.getMe(),
          api.getWebhooks(),
          api.getTeamMembers(),
          api.getNotifications()
        ]);
        setApiKeys(keys);
        setWebhooks(hookList);
        setTeamMembers(team);
        setNotifications(notif);
        setTwoFactorEnabled(!!me.merchant.two_factor_enabled);
        setProfile({
          businessName: me.merchant.business_name || '',
          businessNumber: me.merchant.business_number || '',
          industry: me.merchant.industry || '',
          email: me.merchant.email || '',
          phone: me.merchant.phone || '',
          addressLine1: me.merchant.address_line1 || '',
          city: me.merchant.city || '',
          province: me.merchant.province || '',
          postalCode: me.merchant.postal_code || ''
        });
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [user?.two_factor_enabled]);

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

  const handleSaveProfile = async () => {
    try {
      setProfileSaving(true);
      const result = await api.updateProfile({
        businessName: profile.businessName,
        businessNumber: profile.businessNumber,
        industry: profile.industry,
        phone: profile.phone,
        addressLine1: profile.addressLine1,
        city: profile.city,
        province: profile.province,
        postalCode: profile.postalCode
      });
      setProfile(prev => ({ ...prev, businessName: result.merchant.business_name || prev.businessName }));
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleCreateWebhook = async () => {
    try {
      const webhook = await api.createWebhook(webhookUrl, webhookEvents);
      setWebhooks([webhook, ...webhooks]);
      setWebhookDialogOpen(false);
      setWebhookUrl('');
      setWebhookEvents([]);
    } catch (error) {
      console.error('Failed to create webhook:', error);
      alert('Failed to create webhook');
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    if (!confirm('Delete this webhook endpoint?')) return;
    try {
      await api.deleteWebhook(id);
      setWebhooks(webhooks.filter(h => h.id !== id));
    } catch (error) {
      console.error('Failed to delete webhook:', error);
      alert('Failed to delete webhook');
    }
  };

  const handleTestWebhook = async (id: string) => {
    try {
      await api.testWebhook(id);
      alert('Test delivery queued');
    } catch (error) {
      console.error('Failed to test webhook:', error);
      alert('Failed to test webhook');
    }
  };

  const handleInviteMember = async () => {
    try {
      const member = await api.inviteTeamMember(inviteName || undefined, inviteEmail, inviteRole);
      setTeamMembers([member, ...teamMembers]);
      setInviteDialogOpen(false);
      setInviteName('');
      setInviteEmail('');
      setInviteRole('Member');
    } catch (error) {
      console.error('Failed to invite team member:', error);
      alert('Failed to invite team member');
    }
  };

  const handleRemoveMember = async (id: string) => {
    if (!confirm('Remove this team member?')) return;
    try {
      await api.removeTeamMember(id);
      setTeamMembers(teamMembers.filter(m => m.id !== id));
    } catch (error) {
      console.error('Failed to remove team member:', error);
      alert('Failed to remove team member');
    }
  };

  const handlePasswordUpdate = async () => {
    setPasswordError(null);
    if (!passwordCurrent || !passwordNew) {
      setPasswordError('Please fill out all password fields');
      return;
    }
    if (passwordNew !== passwordConfirm) {
      setPasswordError('New passwords do not match');
      return;
    }
    try {
      setPasswordSaving(true);
      await api.updatePassword(passwordCurrent, passwordNew);
      setPasswordCurrent('');
      setPasswordNew('');
      setPasswordConfirm('');
    } catch (error) {
      console.error('Failed to update password:', error);
      setPasswordError(error instanceof Error ? error.message : 'Failed to update password');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleToggle2FA = async (enabled: boolean) => {
    try {
      setTwoFactorEnabled(enabled);
      await api.updateTwoFactor(enabled);
    } catch (error) {
      console.error('Failed to update 2FA:', error);
      setTwoFactorEnabled(!enabled);
    }
  };

  const handleNotificationsSave = async () => {
    try {
      setNotificationsSaving(true);
      await api.updateNotifications(notifications);
    } catch (error) {
      console.error('Failed to update notifications:', error);
      alert('Failed to update notifications');
    } finally {
      setNotificationsSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account and integration settings</p>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="flex flex-wrap gap-2">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Business Name</Label>
                    <Input value={profile.businessName} className="mt-1" onChange={(e) => setProfile({ ...profile, businessName: e.target.value })} />
                  </div>
                  <div>
                    <Label>CRA Business Number</Label>
                    <Input value={profile.businessNumber} className="mt-1" onChange={(e) => setProfile({ ...profile, businessNumber: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={profile.email} className="mt-1" disabled />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={profile.phone} className="mt-1" onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                </div>
                <div>
                  <Label>Industry</Label>
                  <Input value={profile.industry} className="mt-1" onChange={(e) => setProfile({ ...profile, industry: e.target.value })} />
                </div>
                <div>
                  <Label>Business Address</Label>
                  <Input value={profile.addressLine1} className="mt-1" onChange={(e) => setProfile({ ...profile, addressLine1: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label>City</Label>
                    <Input value={profile.city} className="mt-1" onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
                  </div>
                  <div>
                    <Label>Province</Label>
                    <Input value={profile.province} className="mt-1" onChange={(e) => setProfile({ ...profile, province: e.target.value })} />
                  </div>
                  <div>
                    <Label>Postal Code</Label>
                    <Input value={profile.postalCode} className="mt-1" onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })} />
                  </div>
                </div>
                <Button onClick={handleSaveProfile} disabled={profileSaving}>{profileSaving ? 'Saving...' : 'Save Changes'}</Button>
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
                <Button onClick={() => setWebhookDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Endpoint
                </Button>
              </div>
              <div className="divide-y divide-gray-200">
                {webhooks.length === 0 ? (
                  <div className="p-6 text-sm text-gray-600">No webhooks configured</div>
                ) : (
                  webhooks.map((webhook) => (
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
                            Last delivery: {webhook.last_delivery ? new Date(webhook.last_delivery).toLocaleString() : '—'}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button variant="outline" size="sm" onClick={() => handleTestWebhook(webhook.id)}>Test</Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteWebhook(webhook.id)}>Delete</Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Dialog open={webhookDialogOpen} onOpenChange={setWebhookDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Webhook Endpoint</DialogTitle>
                  <DialogDescription>
                    Configure an endpoint to receive event notifications
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div>
                    <Label>Webhook URL</Label>
                    <Input value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="https://example.com/webhook" className="mt-1" />
                  </div>
                  <div>
                    <Label>Events</Label>
                    <div className="mt-2 space-y-2">
                      {webhookEventOptions.map((event) => (
                        <label key={event} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={webhookEvents.includes(event)}
                            onChange={(e) => {
                              setWebhookEvents(prev => e.target.checked ? [...prev, event] : prev.filter(v => v !== event));
                            }}
                          />
                          <span>{event}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setWebhookDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateWebhook} disabled={!webhookUrl || webhookEvents.length === 0}>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Team */}
          <TabsContent value="team" className="mt-6 space-y-6">
            <Card>
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-gray-900">Team Members</h3>
                  <p className="text-sm text-gray-600 mt-1">Manage who has access to your account</p>
                </div>
                <Button onClick={() => setInviteDialogOpen(true)}>Invite Member</Button>
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
                    {teamMembers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-600">No team members yet</td>
                      </tr>
                    ) : (
                      teamMembers.map((member) => (
                        <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 text-sm text-gray-900">{member.name || '—'}</td>
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
                              <Button variant="ghost" size="sm" onClick={() => handleRemoveMember(member.id)}>Remove</Button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Team Member</DialogTitle>
                  <DialogDescription>
                    Send an invitation to join your organization
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div>
                    <Label>Name</Label>
                    <Input value={inviteName} onChange={(e) => setInviteName(e.target.value)} placeholder="Jane Doe" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="jane@company.com" />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Input value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} placeholder="Admin" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleInviteMember} disabled={!inviteEmail}>Send Invite</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                    <p className="text-sm text-gray-900">2FA is {twoFactorEnabled ? 'enabled' : 'disabled'}</p>
                    <p className="text-xs text-gray-600">Toggle to update your security settings</p>
                  </div>
                </div>
                <Switch checked={twoFactorEnabled} onCheckedChange={handleToggle2FA} />
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-gray-900 mb-4">Change Password</h3>
              <div className="space-y-4 max-w-md">
                <div>
                  <Label>Current Password</Label>
                  <Input type="password" className="mt-1" value={passwordCurrent} onChange={(e) => setPasswordCurrent(e.target.value)} />
                </div>
                <div>
                  <Label>New Password</Label>
                  <Input type="password" className="mt-1" value={passwordNew} onChange={(e) => setPasswordNew(e.target.value)} />
                </div>
                <div>
                  <Label>Confirm New Password</Label>
                  <Input type="password" className="mt-1" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
                </div>
                {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
                <Button onClick={handlePasswordUpdate} disabled={passwordSaving}>{passwordSaving ? 'Updating...' : 'Update Password'}</Button>
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
                  <Switch
                    checked={notifications.payment_received}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, payment_received: checked })}
                  />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <p className="text-sm text-gray-900">Payment Failed</p>
                    <p className="text-xs text-gray-600">Get notified when a payment fails</p>
                  </div>
                  <Switch
                    checked={notifications.payment_failed}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, payment_failed: checked })}
                  />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <p className="text-sm text-gray-900">Weekly Summary</p>
                    <p className="text-xs text-gray-600">Receive weekly transaction summaries</p>
                  </div>
                  <Switch
                    checked={notifications.weekly_summary}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, weekly_summary: checked })}
                  />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <p className="text-sm text-gray-900">Compliance Alerts</p>
                    <p className="text-xs text-gray-600">Important regulatory and KYC updates</p>
                  </div>
                  <Switch
                    checked={notifications.compliance_alerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, compliance_alerts: checked })}
                  />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm text-gray-900">Marketing Updates</p>
                    <p className="text-xs text-gray-600">News and product announcements</p>
                  </div>
                  <Switch
                    checked={notifications.marketing_updates}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, marketing_updates: checked })}
                  />
                </div>
              </div>
              <div className="mt-6">
                <Button onClick={handleNotificationsSave} disabled={notificationsSaving}>
                  {notificationsSaving ? 'Saving...' : 'Save Notification Settings'}
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

import { User, Key, Webhook, Users, Shield, Bell } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';

export function SettingsView() {
  const apiKeys = [
    {
      id: '1',
      name: 'Production API Key',
      key: 'pk_live_51234567890abcdef',
      created: '2025-10-15',
      lastUsed: '2025-11-20'
    },
    {
      id: '2',
      name: 'Test API Key',
      key: 'pk_test_51234567890abcdef',
      created: '2025-10-15',
      lastUsed: '2025-11-19'
    }
  ];

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
                    <Input defaultValue="My Coffee Shop" className="mt-1" />
                  </div>
                  <div>
                    <Label>CRA Business Number</Label>
                    <Input defaultValue="123456789RC0001" className="mt-1" disabled />
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" defaultValue="contact@mycoffeeshop.ca" className="mt-1" />
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
                <Button>Create New Key</Button>
              </div>
              <div className="divide-y divide-gray-200">
                {apiKeys.map((key) => (
                  <div key={key.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-gray-900">{key.name}</h4>
                          <Badge variant={key.key.startsWith('pk_live') ? 'default' : 'secondary'}>
                            {key.key.startsWith('pk_live') ? 'Production' : 'Test'}
                          </Badge>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-2 font-mono text-sm">
                          {key.key}••••••••••••••••
                        </div>
                        <div className="flex gap-4 text-xs text-gray-600">
                          <span>Created: {key.created}</span>
                          <span>•</span>
                          <span>Last used: {key.lastUsed}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">Reveal</Button>
                        <Button variant="destructive" size="sm">Revoke</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <h4 className="text-gray-900 mb-2">API Documentation</h4>
              <p className="text-sm text-gray-600 mb-4">
                Learn how to integrate Canadian Crypto Pay into your application
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

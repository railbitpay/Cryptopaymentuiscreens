import { Server, Zap, Wifi, Database, CheckCircle2, AlertCircle, Activity } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

export function SystemHealth() {
  const services = [
    {
      name: 'Lightning Network Node',
      status: 'operational',
      uptime: '99.98%',
      lastCheck: '2 minutes ago',
      icon: Zap,
      color: 'orange',
      details: {
        channels: 45,
        capacity: '5.2 BTC',
        peers: 23
      }
    },
    {
      name: 'Ethereum RPC',
      status: 'operational',
      uptime: '99.95%',
      lastCheck: '1 minute ago',
      icon: Server,
      color: 'purple',
      details: {
        blockHeight: 18500234,
        syncStatus: 'synced',
        gasPrice: '25 gwei'
      }
    },
    {
      name: 'Solana RPC',
      status: 'operational',
      uptime: '99.92%',
      lastCheck: '3 minutes ago',
      icon: Server,
      color: 'green',
      details: {
        slot: 245123456,
        tps: 2847,
        health: 'ok'
      }
    },
    {
      name: 'Database (PostgreSQL)',
      status: 'operational',
      uptime: '100%',
      lastCheck: '30 seconds ago',
      icon: Database,
      color: 'blue',
      details: {
        connections: 45,
        size: '2.3 GB',
        queries: '1,234/sec'
      }
    },
    {
      name: 'Webhook Service',
      status: 'degraded',
      uptime: '98.5%',
      lastCheck: '1 minute ago',
      icon: Wifi,
      color: 'yellow',
      details: {
        queued: 12,
        processing: 3,
        failed: 2
      }
    }
  ];

  const webhookLogs = [
    {
      id: '1',
      url: 'https://merchant1.com/webhook',
      event: 'payment.completed',
      status: 'success',
      timestamp: '2025-11-21 14:35:22',
      responseTime: '245ms'
    },
    {
      id: '2',
      url: 'https://merchant2.com/webhook',
      event: 'payment.completed',
      status: 'failed',
      timestamp: '2025-11-21 14:34:15',
      responseTime: 'timeout'
    },
    {
      id: '3',
      url: 'https://merchant3.com/webhook',
      event: 'payment.pending',
      status: 'success',
      timestamp: '2025-11-21 14:32:08',
      responseTime: '187ms'
    }
  ];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-gray-900">System Health</h1>
          <p className="text-gray-600 mt-1">Monitor infrastructure and service status</p>
        </div>

        {/* Overall Status */}
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-gray-900">All Systems Operational</h3>
              <p className="text-sm text-gray-600 mt-1">
                4 of 5 services running normally • 1 degraded performance
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              99.96% Uptime
            </Badge>
          </div>
        </Card>

        {/* Services */}
        <div>
          <h2 className="text-gray-900 mb-4">Service Status</h2>
          <div className="space-y-4">
            {services.map((service) => {
              const Icon = service.icon;
              const isOperational = service.status === 'operational';
              
              return (
                <Card key={service.name} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-${service.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 text-${service.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-gray-900">{service.name}</h3>
                          <Badge className={
                            isOperational
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          }>
                            {service.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Uptime</p>
                          <p className="text-sm text-gray-900">{service.uptime}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Last checked: {service.lastCheck}
                      </p>
                      <div className="grid grid-cols-3 gap-4">
                        {Object.entries(service.details).map(([key, value]) => (
                          <div key={key}>
                            <p className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                            <p className="text-sm text-gray-900">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Webhook Logs */}
        <div>
          <h2 className="text-gray-900 mb-4">Recent Webhook Deliveries</h2>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm text-gray-600">Timestamp</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-600">URL</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-600">Event</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-600">Response Time</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {webhookLogs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 text-sm text-gray-600">{log.timestamp}</td>
                      <td className="py-4 px-4 text-sm text-gray-900 font-mono text-xs">{log.url}</td>
                      <td className="py-4 px-4">
                        <Badge variant="outline">{log.event}</Badge>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{log.responseTime}</td>
                      <td className="py-4 px-4">
                        <Badge className={
                          log.status === 'success'
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : 'bg-red-100 text-red-800 border-red-200'
                        }>
                          {log.status.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">API Response Time</p>
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl text-gray-900">245ms</p>
            <p className="text-xs text-gray-500 mt-1">Average last hour</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">Active Connections</p>
              <Wifi className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl text-gray-900">342</p>
            <p className="text-xs text-gray-500 mt-1">Current</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">Error Rate</p>
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-2xl text-gray-900">0.02%</p>
            <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

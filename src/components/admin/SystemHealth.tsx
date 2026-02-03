import { useEffect, useState } from 'react';
import { Server, Wifi, Database, CheckCircle2, AlertCircle, Activity, Loader2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { api, SystemHealth as SystemHealthType, WebhookDelivery } from '../../services/api';

const serviceIconMap: Record<string, any> = {
  Database,
  'API Server': Server,
  Webhooks: Wifi
};

export function SystemHealth() {
  const [health, setHealth] = useState<SystemHealthType | null>(null);
  const [logs, setLogs] = useState<WebhookDelivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [healthData, deliveries] = await Promise.all([
          api.getAdminSystemHealth(),
          api.getAdminWebhookDeliveries()
        ]);
        setHealth(healthData);
        setLogs(deliveries);
      } catch (error) {
        console.error('Failed to fetch system health:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading || !health) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-gray-900">System Health</h1>
          <p className="text-gray-600 mt-1">Monitor infrastructure and service status</p>
        </div>

        {/* Overall Status */}
        <Card className={`p-6 ${health.overall === 'operational' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 ${health.overall === 'operational' ? 'bg-green-100' : 'bg-yellow-100'} rounded-full flex items-center justify-center`}>
              {health.overall === 'operational' ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-gray-900">{health.overall === 'operational' ? 'All Systems Operational' : 'Degraded Performance'}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {health.services.length} services monitored
              </p>
            </div>
            <Badge className={health.overall === 'operational' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}>
              {health.overall.toUpperCase()}
            </Badge>
          </div>
        </Card>

        {/* Services */}
        <div>
          <h2 className="text-gray-900 mb-4">Service Status</h2>
          <div className="space-y-4">
            {health.services.map((service) => {
              const Icon = serviceIconMap[service.name] || Server;
              const isOperational = service.status === 'operational';
              return (
                <Card key={service.name} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${isOperational ? 'bg-green-100' : 'bg-yellow-100'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${isOperational ? 'text-green-600' : 'text-yellow-600'}`} />
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
                        Last checked: {new Date(service.lastCheck).toLocaleString()}
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
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-600">No deliveries yet</td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 text-sm text-gray-600">{new Date(log.created_at).toLocaleString()}</td>
                        <td className="py-4 px-4 text-sm text-gray-900 font-mono text-xs">{log.url}</td>
                        <td className="py-4 px-4">
                          <Badge variant="outline">{log.event}</Badge>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">{log.response_time}</td>
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">API Response Time</p>
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl text-gray-900">—</p>
            <p className="text-xs text-gray-500 mt-1">Real-time metrics not configured</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">Active Connections</p>
              <Wifi className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl text-gray-900">—</p>
            <p className="text-xs text-gray-500 mt-1">Real-time metrics not configured</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">Error Rate</p>
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-2xl text-gray-900">—</p>
            <p className="text-xs text-gray-500 mt-1">Real-time metrics not configured</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

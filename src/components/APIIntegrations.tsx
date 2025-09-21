import { useState } from 'react';
import { Plus, Settings, Trash2, Eye, EyeOff, Copy, CheckCircle, AlertCircle, X, ExternalLink, Smartphone, Calendar, Bell, Zap, XCircle, RefreshCw } from 'lucide-react';
import { mockAPIIntegrations } from '../data/mockData';
import { APIIntegration } from '../types';

export function APIIntegrations() {
  const [integrations, setIntegrations] = useState(mockAPIIntegrations);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showApiKey, setShowApiKey] = useState<{ [key: string]: boolean }>({});
  const [testingConnection, setTestingConnection] = useState<string | null>(null);
  const [smsSettings, setSmsSettings] = useState({
    enabled: true,
    phone: '+46701234567',
    reportDay: 'friday',
    metrics: ['revenue', 'customers', 'orders']
  });

  const [newIntegration, setNewIntegration] = useState({
    name: '',
    type: 'shopify' as const,
    apiKey: '',
    webhookUrl: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600';
      case 'disconnected': return 'text-gray-500';
      case 'error': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-5 w-5" />;
      case 'disconnected': return <XCircle className="h-5 w-5" />;
      case 'error': return <XCircle className="h-5 w-5" />;
      default: return <XCircle className="h-5 w-5" />;
    }
  };

  const getIntegrationIcon = (type: string) => {
    return <Zap className="h-8 w-8 text-blue-600" />;
  };

  const toggleApiKeyVisibility = (integrationId: string) => {
    setShowApiKey(prev => ({
      ...prev,
      [integrationId]: !prev[integrationId]
    }));
  };

  const copyApiKey = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey);
    // You could add a toast notification here
  };

  const testConnection = async (integrationId: string) => {
    setTestingConnection(integrationId);
    
    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Randomly succeed or fail for demo
    const success = Math.random() > 0.3;
    
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { 
            ...integration, 
            status: success ? 'connected' : 'error',
            lastSync: new Date().toISOString()
          }
        : integration
    ));
    
    setTestingConnection(null);
  };

  const toggleConnection = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { 
            ...integration, 
            status: integration.status === 'connected' ? 'disconnected' : 'connected'
          }
        : integration
    ));
  };

  const removeIntegration = (integrationId: string) => {
    if (window.confirm('Är du säker på att du vill ta bort denna integration?')) {
      setIntegrations(prev => prev.filter(integration => integration.id !== integrationId));
    }
  };

  const addIntegration = () => {
    const integration: APIIntegration = {
      id: Math.random().toString(36).substr(2, 9),
      name: newIntegration.name,
      type: newIntegration.type,
      status: 'disconnected',
      lastSync: new Date().toISOString(),
      apiKey: newIntegration.apiKey,
      webhookUrl: `https://api.salesiq.se/webhook/${Math.random().toString(36).substr(2, 9)}`
    };

    setIntegrations(prev => [...prev, integration]);
    setNewIntegration({ name: '', type: 'shopify', apiKey: '', webhookUrl: '' });
    setShowAddModal(false);
  };

  const generateWebhookUrl = () => {
    return `https://api.salesiq.se/webhook/${Math.random().toString(36).substr(2, 9)}`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Integrationer</h1>
          <p className="text-gray-600 mt-2">Anslut dina försäljningskanaler och automatisera dataimporten</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Lägg till integration</span>
        </button>
      </div>

      {/* SMS Notifications Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Smartphone className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">SMS Rapporter</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="sms-enabled"
                checked={smsSettings.enabled}
                onChange={(e) => setSmsSettings({...smsSettings, enabled: e.target.checked})}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="sms-enabled" className="text-sm font-medium text-gray-900">
                Aktivera veckorapporter via SMS
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefonnummer
              </label>
              <input
                type="tel"
                value={smsSettings.phone}
                onChange={(e) => setSmsSettings({...smsSettings, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+46701234567"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rapportdag
              </label>
              <select
                value={smsSettings.reportDay}
                onChange={(e) => setSmsSettings({...smsSettings, reportDay: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="monday">Måndag</option>
                <option value="tuesday">Tisdag</option>
                <option value="wednesday">Onsdag</option>
                <option value="thursday">Torsdag</option>
                <option value="friday">Fredag</option>
                <option value="saturday">Lördag</option>
                <option value="sunday">Söndag</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              KPI:er att inkludera
            </label>
            <div className="space-y-2">
              {[
                { id: 'revenue', label: 'Omsättning' },
                { id: 'customers', label: 'Nya kunder' },
                { id: 'orders', label: 'Antal beställningar' },
                { id: 'conversion', label: 'Konverteringsgrad' },
                { id: 'aov', label: 'Genomsnittligt ordervärde' }
              ].map(metric => (
                <div key={metric.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={metric.id}
                    checked={smsSettings.metrics.includes(metric.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSmsSettings({
                          ...smsSettings,
                          metrics: [...smsSettings.metrics, metric.id]
                        });
                      } else {
                        setSmsSettings({
                          ...smsSettings,
                          metrics: smsSettings.metrics.filter(m => m !== metric.id)
                        });
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={metric.id} className="text-sm text-gray-700">
                    {metric.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Spara SMS-inställningar
          </button>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-700">
            <strong>Exempel SMS:</strong> "Veckorapport: Omsättning +12% (125,000 kr), Nya kunder: 23, Beställningar: 156. Bra vecka! 📈"
          </p>
        </div>
      </div>

      {/* Integration Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aktiva integrationer</p>
              <p className="text-2xl font-bold text-gray-900">
                {integrations.filter(i => i.status === 'connected').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Totala integrationer</p>
              <p className="text-2xl font-bold text-gray-900">{integrations.length}</p>
            </div>
            <Zap className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Senaste synk</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <RefreshCw className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Current Integrations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Dina integrationer</h3>
        </div>
        
        <div className="divide-y divide-gray-100">
          {integrations.map(integration => (
            <div key={integration.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {getIntegrationIcon(integration.type)}
                  <div>
                    <h4 className="font-medium text-gray-900">{integration.name}</h4>
                    <p className="text-sm text-gray-500 capitalize">{integration.type}</p>
                    <p className="text-xs text-gray-400">
                      Senaste synk: {new Date(integration.lastSync).toLocaleString('sv-SE')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center space-x-2 ${getStatusColor(integration.status)}`}>
                    {getStatusIcon(integration.status)}
                    <span className="text-sm font-medium capitalize">
                      {integration.status === 'connected' ? 'Ansluten' : 
                       integration.status === 'disconnected' ? 'Frånkopplad' : 'Fel'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => testConnection(integration.id)}
                      disabled={testingConnection === integration.id}
                      className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors disabled:opacity-50"
                    >
                      {testingConnection === integration.id ? 'Testar...' : 'Testa'}
                    </button>
                    <button
                      onClick={() => toggleConnection(integration.id)}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        integration.status === 'connected' 
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {integration.status === 'connected' ? 'Koppla från' : 'Anslut'}
                    </button>
                    <button
                      onClick={() => removeIntegration(integration.id)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                      title="Ta bort integration"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* API Key Management */}
              {integration.apiKey && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type={showApiKey[integration.id] ? 'text' : 'password'}
                        value={integration.apiKey}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                      />
                      <button
                        onClick={() => toggleApiKeyVisibility(integration.id)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                        title={showApiKey[integration.id] ? 'Dölj' : 'Visa'}
                      >
                        {showApiKey[integration.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => copyApiKey(integration.apiKey!)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                        title="Kopiera"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {integration.webhookUrl && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={integration.webhookUrl}
                          readOnly
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                        />
                        <button
                          onClick={() => copyApiKey(integration.webhookUrl!)}
                          className="p-2 text-gray-400 hover:text-gray-600"
                          title="Kopiera"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Integration Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Lägg till integration</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Namn</label>
                <input
                  type="text"
                  value={newIntegration.name}
                  onChange={(e) => setNewIntegration({...newIntegration, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Min Shopify Butik"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Typ</label>
                <select
                  value={newIntegration.type}
                  onChange={(e) => setNewIntegration({...newIntegration, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="shopify">Shopify</option>
                  <option value="woocommerce">WooCommerce</option>
                  <option value="stripe">Stripe</option>
                  <option value="square">Square</option>
                  <option value="custom">Custom API</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                <input
                  type="password"
                  value={newIntegration.apiKey}
                  onChange={(e) => setNewIntegration({...newIntegration, apiKey: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="sk_live_..."
                />
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Webhook URL:</strong> {generateWebhookUrl()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Använd denna URL i din plattforms webhook-inställningar
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={addIntegration}
                disabled={!newIntegration.name || !newIntegration.apiKey}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Lägg till
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Available Integrations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tillgängliga integrationer</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Shopify', type: 'E-commerce', description: 'Synka produkter och beställningar' },
            { name: 'WooCommerce', type: 'E-commerce', description: 'WordPress e-handelsplattform' },
            { name: 'Stripe', type: 'Betalningar', description: 'Betalningsdata och transaktioner' },
            { name: 'Square', type: 'POS', description: 'Kassasystem och fysisk försäljning' },
            { name: 'Klarna', type: 'Betalningar', description: 'Köp nu, betala senare' },
            { name: 'Fortnox', type: 'Ekonomi', description: 'Ekonomisystem och fakturering' }
          ].map((integration, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3 mb-2">
                {getIntegrationIcon(integration.name.toLowerCase())}
                <div>
                  <h4 className="font-medium text-gray-900">{integration.name}</h4>
                  <p className="text-xs text-gray-500">{integration.type}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{integration.description}</p>
              <button 
                onClick={() => setShowAddModal(true)}
                className="w-full px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                Anslut
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Plus, Zap, CheckCircle, XCircle, RefreshCw, Settings, Smartphone, Eye, EyeOff, Copy, Check, X } from 'lucide-react';
import { mockAPIIntegrations } from '../data/mockData';

interface IntegrationForm {
  name: string;
  type: string;
  apiKey: string;
  apiSecret?: string;
  webhookUrl?: string;
  testMode: boolean;
}

export function APIIntegrations() {
  const [integrations, setIntegrations] = useState(mockAPIIntegrations);
  const [showAddIntegration, setShowAddIntegration] = useState(false);
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [newIntegration, setNewIntegration] = useState<IntegrationForm>({
    name: '',
    type: 'shopify',
    apiKey: '',
    apiSecret: '',
    webhookUrl: '',
    testMode: true
  });
  
  const [smsSettings, setSmsSettings] = useState({
    enabled: true,
    phone: '+46701234567',
    reportDay: 'friday',
    metrics: ['revenue', 'customers', 'orders']
  });

  const [testResults, setTestResults] = useState<Record<string, { status: 'testing' | 'success' | 'failed', message?: string }>>({});

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

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const syncIntegration = (id: string) => {
    setIntegrations(integrations.map(integration => 
      integration.id === id 
        ? { ...integration, lastSync: new Date().toISOString() }
        : integration
    ));
  };

  const testConnection = async (integrationId: string) => {
    setTestResults(prev => ({ ...prev, [integrationId]: { status: 'testing' } }));
    
    // Simulate API test
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for demo
      setTestResults(prev => ({
        ...prev,
        [integrationId]: {
          status: success ? 'success' : 'failed',
          message: success ? 'Connection successful' : 'Authentication failed'
        }
      }));
    }, 2000);
  };

  const addIntegration = () => {
    if (!newIntegration.name || !newIntegration.apiKey) {
      alert('Please fill in all required fields');
      return;
    }

    const integration = {
      id: Math.random().toString(36).substr(2, 9),
      name: newIntegration.name,
      type: newIntegration.type as any,
      status: 'disconnected' as const,
      lastSync: new Date().toISOString(),
      apiKey: newIntegration.apiKey,
      webhookUrl: newIntegration.webhookUrl
    };

    setIntegrations([...integrations, integration]);
    setNewIntegration({
      name: '',
      type: 'shopify',
      apiKey: '',
      apiSecret: '',
      webhookUrl: '',
      testMode: true
    });
    setShowAddIntegration(false);
  };

  const removeIntegration = (id: string) => {
    if (confirm('Are you sure you want to remove this integration?')) {
      setIntegrations(integrations.filter(i => i.id !== id));
    }
  };

  const toggleConnection = (id: string) => {
    setIntegrations(integrations.map(integration => 
      integration.id === id 
        ? { 
            ...integration, 
            status: integration.status === 'connected' ? 'disconnected' : 'connected',
            lastSync: new Date().toISOString()
          }
        : integration
    ));
  };

  const generateWebhookUrl = () => {
    const webhookId = Math.random().toString(36).substr(2, 9);
    return `https://api.salesiq.com/webhooks/${webhookId}`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Integrationer</h1>
          <p className="text-gray-600 mt-2">Anslut dina försäljningskanaler och automatisera dataimporten</p>
        </div>
        <button
          onClick={() => setShowAddIntegration(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Lägg till integration</span>
        </button>
      </div>

      {/* Add Integration Modal */}
      {showAddIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Add New Integration</h3>
                <button
                  onClick={() => setShowAddIntegration(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Integration Name
                </label>
                <input
                  type="text"
                  value={newIntegration.name}
                  onChange={(e) => setNewIntegration({...newIntegration, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="My Shopify Store"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform Type
                </label>
                <select
                  value={newIntegration.type}
                  onChange={(e) => setNewIntegration({...newIntegration, type: e.target.value})}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key *
                </label>
                <input
                  type="password"
                  value={newIntegration.apiKey}
                  onChange={(e) => setNewIntegration({...newIntegration, apiKey: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your API key"
                />
              </div>

              {newIntegration.type === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Secret
                  </label>
                  <input
                    type="password"
                    value={newIntegration.apiSecret}
                    onChange={(e) => setNewIntegration({...newIntegration, apiSecret: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your API secret"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Webhook URL (Optional)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={newIntegration.webhookUrl}
                    onChange={(e) => setNewIntegration({...newIntegration, webhookUrl: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://your-webhook-url.com"
                  />
                  <button
                    type="button"
                    onClick={() => setNewIntegration({...newIntegration, webhookUrl: generateWebhookUrl()})}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="testMode"
                  checked={newIntegration.testMode}
                  onChange={(e) => setNewIntegration({...newIntegration, testMode: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="testMode" className="text-sm text-gray-700">
                  Enable test mode (recommended for initial setup)
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddIntegration(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addIntegration}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Integration
              </button>
            </div>
          </div>
        </div>
      )}

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
          <button
            onClick={() => alert('SMS settings saved!')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save SMS Settings
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

      {/* Available Integrations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tillgängliga integrationer</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Shopify', type: 'E-commerce', description: 'Synka produkter och beställningar', popular: true },
            { name: 'WooCommerce', type: 'E-commerce', description: 'WordPress e-handelsplattform', popular: true },
            { name: 'Stripe', type: 'Betalningar', description: 'Betalningsdata och transaktioner', popular: true },
            { name: 'Square', type: 'POS', description: 'Kassasystem och fysisk försäljning', popular: false },
            { name: 'Klarna', type: 'Betalningar', description: 'Köp nu, betala senare', popular: false },
            { name: 'Fortnox', type: 'Ekonomi', description: 'Ekonomisystem och fakturering', popular: false }
          ].map((integration, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer relative">
              {integration.popular && (
                <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  Popular
                </div>
              )}
              <div className="flex items-center space-x-3 mb-2">
                {getIntegrationIcon(integration.name.toLowerCase())}
                <div>
                  <h4 className="font-medium text-gray-900">{integration.name}</h4>
                  <p className="text-xs text-gray-500">{integration.type}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{integration.description}</p>
              <button 
                onClick={() => {
                  setNewIntegration({...newIntegration, type: integration.name.toLowerCase()});
                  setShowAddIntegration(true);
                }}
                className="w-full px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                Anslut
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Current Integrations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Dina integrationer</h3>
        </div>
        
        <div className="divide-y divide-gray-100">
          {integrations.map(integration => (
            <div key={integration.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getIntegrationIcon(integration.type)}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{integration.name}</h4>
                    <p className="text-sm text-gray-500 capitalize">{integration.type}</p>
                    <p className="text-xs text-gray-400">
                      Senaste synk: {new Date(integration.lastSync).toLocaleString('sv-SE')}
                    </p>
                    
                    {/* API Key Display */}
                    {integration.apiKey && (
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-xs text-gray-500">API Key:</span>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {showApiKey[integration.id] ? integration.apiKey : '••••••••••••'}
                        </code>
                        <button
                          onClick={() => toggleApiKeyVisibility(integration.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {showApiKey[integration.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </button>
                        <button
                          onClick={() => copyToClipboard(integration.apiKey!, `${integration.id}-key`)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {copied === `${integration.id}-key` ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>
                    )}

                    {/* Test Results */}
                    {testResults[integration.id] && (
                      <div className="mt-2">
                        {testResults[integration.id].status === 'testing' && (
                          <div className="flex items-center space-x-2 text-xs text-blue-600">
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            <span>Testing connection...</span>
                          </div>
                        )}
                        {testResults[integration.id].status === 'success' && (
                          <div className="flex items-center space-x-2 text-xs text-green-600">
                            <CheckCircle className="h-3 w-3" />
                            <span>{testResults[integration.id].message}</span>
                          </div>
                        )}
                        {testResults[integration.id].status === 'failed' && (
                          <div className="flex items-center space-x-2 text-xs text-red-600">
                            <XCircle className="h-3 w-3" />
                            <span>{testResults[integration.id].message}</span>
                          </div>
                        )}
                      </div>
                    )}
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
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      disabled={testResults[integration.id]?.status === 'testing'}
                    >
                      Test
                    </button>
                    <button
                      onClick={() => toggleConnection(integration.id)}
                      className={`px-3 py-1 text-xs rounded transition-colors ${
                        integration.status === 'connected'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                    </button>
                    <button
                      onClick={() => syncIntegration(integration.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Synkronisera nu"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Inställningar"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeIntegration(integration.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove integration"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

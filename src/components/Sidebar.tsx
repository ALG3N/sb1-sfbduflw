import React from 'react';
import { 
  BarChart3, 
  Users, 
  Package, 
  TrendingUp, 
  MapPin, 
  Upload,
  Settings,
  Home,
  FileText,
  Zap,
  Shield
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: Home },
  { id: 'sales', name: 'Sales Analytics', icon: BarChart3 },
  { id: 'customers', name: 'Customers', icon: Users },
  { id: 'products', name: 'Products', icon: Package },
  { id: 'trends', name: 'Trends & Forecasts', icon: TrendingUp },
  { id: 'geography', name: 'Geographic', icon: MapPin },
  { id: 'reports', name: 'Reports', icon: FileText },
  { id: 'import', name: 'Import Data', icon: Upload },
  { id: 'integrations', name: 'API Integrations', icon: Zap },
  { id: 'users', name: 'User Management', icon: Shield },
  { id: 'settings', name: 'Settings', icon: Settings },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="bg-white border-r border-gray-200 w-64 min-h-screen p-4">
      <div className="mb-8">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-8 w-8 text-blue-400" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">SalesIQ</h1>
            <p className="text-xs text-gray-500">Analytics Platform</p>
          </div>
        </div>
      </div>
      
      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm">{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Quick Tip</h3>
        <p className="text-xs text-blue-700">
          Upload your sales data to get personalized insights and forecasts for your business.
        </p>
      </div>
    </div>
  );
}
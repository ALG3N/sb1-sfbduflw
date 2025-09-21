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
  Shield,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
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

export function Sidebar({ activeTab, onTabChange, isOpen, setIsOpen }: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden ${isOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsOpen(false)}
      />
      
      <aside 
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto transform z-20
                    lg:translate-x-0 transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">SalesIQ</h1>
              <p className="text-xs text-gray-500">Analytics Platform</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden">
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setIsOpen(false);
                }}
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
      </aside>
    </>
  );
}
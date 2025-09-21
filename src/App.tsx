import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CustomersView } from './components/CustomersView';
import { DataImport } from './components/DataImport';
import { UserManagement } from './components/UserManagement';
import { APIIntegrations } from './components/APIIntegrations';
import { Menu } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'customers':
        return <CustomersView />;
      case 'import':
        return <DataImport />;
      case 'users':
        return <UserManagement />;
      case 'integrations':
        return <APIIntegrations />;
      case 'sales':
      case 'products':
      case 'trends':
      case 'geography':
      case 'reports':
      case 'settings':
        return (
          <div className="p-6">
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Analytics
              </h2>
              <p className="text-gray-600 mb-6">
                This section is coming soon. We're working hard to bring you comprehensive {activeTab} analytics.
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
                <span className="text-sm font-medium">Feature in Development</span>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <main className="lg:ml-64">
        <div className="p-4 lg:hidden">
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
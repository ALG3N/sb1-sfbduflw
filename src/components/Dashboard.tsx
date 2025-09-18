import React, { useState } from 'react';
import { DollarSign, Users, ShoppingCart, TrendingUp, Package, Target, Download, Calendar, Filter, MoreVertical, RefreshCw, Upload, FileText, Bell, Zap } from 'lucide-react';
import { AnalyticsCard } from './AnalyticsCard';
import { SimpleChart } from './SimpleChart';
import { monthlyData, regionData } from '../data/mockData';

export function Dashboard() {
  const [dateRange, setDateRange] = useState('30d');
  const [selectedMetrics, setSelectedMetrics] = useState(['revenue', 'customers', 'orders']);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);

  const monthlyChartData = monthlyData.slice(-6).map(item => ({
    label: item.month,
    value: item.sales
  }));

  const regionChartData = regionData.map(item => ({
    label: item.region,
    value: item.sales,
    color: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'][regionData.indexOf(item)]
  }));

  const customerGrowthData = monthlyData.slice(-6).map(item => ({
    label: item.month,
    value: item.customers
  }));

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    // Create sample data for export
    const exportData = [
      ['Metric', 'Value', 'Change', 'Period'],
      ['Total Revenue', '$1,492,000', '+12.5%', dateRange],
      ['Total Customers', '2,389', '+8.2%', dateRange],
      ['Orders This Month', '745', '+15.3%', dateRange],
      ['Average Order Value', '$262', '-2.1%', dateRange],
      ['Products Sold', '1,850', '+23.7%', dateRange],
      ['Conversion Rate', '3.4%', '+0.8%', dateRange]
    ];

    if (format === 'csv') {
      const csvContent = exportData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else if (format === 'excel') {
      // For Excel export, you'd typically use a library like xlsx
      alert('Excel export functionality would be implemented with a library like xlsx');
    } else if (format === 'pdf') {
      // For PDF export, you'd use a library like jsPDF
      alert('PDF export functionality would be implemented with a library like jsPDF');
    }
    
    setShowExportOptions(false);
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const getDateRangeLabel = (range: string) => {
    switch (range) {
      case '7d': return 'Last 7 days';
      case '30d': return 'Last 30 days';
      case '90d': return 'Last 90 days';
      case '1y': return 'Last year';
      default: return 'Last 30 days';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
          <p className="text-gray-600 mt-2">Get insights into your business performance and growth trends</p>
        </div>
        
        {/* Dashboard Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>

          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>

            {showExportOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="py-2">
                  <button
                    onClick={() => handleExport('csv')}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                  >
                    Export as CSV
                  </button>
                  <button
                    onClick={() => handleExport('excel')}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                  >
                    Export as Excel
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                  >
                    Export as PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Date Range Indicator */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-700">
          <span className="font-medium">Current view:</span> {getDateRangeLabel(dateRange)} • 
          <span className="ml-1">Data last updated: {new Date().toLocaleString()}</span>
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="cursor-pointer" onClick={() => alert('Drill down into revenue details')}>
          <AnalyticsCard
            title="Total Revenue"
            value="$1,492,000"
            change="+12.5%"
            trend="up"
            icon={DollarSign}
          />
        </div>
        <div className="cursor-pointer" onClick={() => alert('View customer details')}>
          <AnalyticsCard
            title="Total Customers"
            value="2,389"
            change="+8.2%"
            trend="up"
            icon={Users}
          />
        </div>
        <div className="cursor-pointer" onClick={() => alert('View order details')}>
          <AnalyticsCard
            title="Orders This Month"
            value="745"
            change="+15.3%"
            trend="up"
            icon={ShoppingCart}
          />
        </div>
        <div className="cursor-pointer" onClick={() => alert('Analyze order values')}>
          <AnalyticsCard
            title="Average Order Value"
            value="$262"
            change="-2.1%"
            trend="down"
            icon={TrendingUp}
          />
        </div>
        <div className="cursor-pointer" onClick={() => alert('View product performance')}>
          <AnalyticsCard
            title="Products Sold"
            value="1,850"
            change="+23.7%"
            trend="up"
            icon={Package}
          />
        </div>
        <div className="cursor-pointer" onClick={() => alert('View conversion analysis')}>
          <AnalyticsCard
            title="Conversion Rate"
            value="3.4%"
            change="+0.8%"
            trend="up"
            icon={Target}
          />
        </div>
      </div>

      {/* Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative">
          <SimpleChart
            data={monthlyChartData}
            type="area"
            title="Monthly Sales Trend"
            height={250}
          />
          <button
            className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-sm border hover:bg-gray-50 transition-colors"
            onClick={() => alert('Expand chart view')}
            title="Expand chart"
          >
            <MoreVertical className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        
        <div className="relative">
          <SimpleChart
            data={regionChartData}
            type="bar"
            title="Sales by Region"
            height={250}
          />
          <button
            className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-sm border hover:bg-gray-50 transition-colors"
            onClick={() => alert('View regional breakdown')}
            title="View details"
          >
            <MoreVertical className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative">
          <SimpleChart
            data={customerGrowthData}
            type="line"
            title="Customer Growth"
            height={250}
          />
          <button
            className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-sm border hover:bg-gray-50 transition-colors"
            onClick={() => alert('Analyze customer acquisition')}
            title="Analyze growth"
          >
            <MoreVertical className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        
        {/* Enhanced Key Insights */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Key Insights</h3>
            <button
              onClick={() => alert('View detailed insights report')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors" onClick={() => alert('View Q4 performance details')}>
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Strong Q4 Performance</p>
                <p className="text-xs text-gray-600">Revenue increased by 15% compared to last quarter</p>
                <p className="text-xs text-green-700 mt-1">🎯 Target exceeded by 12%</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => alert('View regional analysis')}>
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">North Region Leading</p>
                <p className="text-xs text-gray-600">32.5% of total sales coming from northern territories</p>
                <p className="text-xs text-blue-700 mt-1">📈 +8% vs last period</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors" onClick={() => alert('View customer acquisition details')}>
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Customer Acquisition Up</p>
                <p className="text-xs text-gray-600">New customers increased by 23% this month</p>
                <p className="text-xs text-yellow-700 mt-1">🚀 Best performance in 6 months</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors" onClick={() => alert('View service category analysis')}>
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Service Products Performing</p>
                <p className="text-xs text-gray-600">Services category showing highest margins at 70%</p>
                <p className="text-xs text-purple-700 mt-1">💰 +15% margin improvement</p>
              </div>
            </div>
          </div>
          
          {/* Action Items */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Recommended Actions</h4>
            <div className="space-y-2">
              <button 
                onClick={() => alert('Opening customer retention analysis...')}
                className="w-full text-left px-3 py-2 bg-orange-50 text-orange-800 rounded-lg hover:bg-orange-100 transition-colors text-xs"
              >
                ⚠️ Focus on customer retention - churn rate increased by 3%
              </button>
              <button 
                onClick={() => alert('Opening inventory optimization...')}
                className="w-full text-left px-3 py-2 bg-blue-50 text-blue-800 rounded-lg hover:bg-blue-100 transition-colors text-xs"
              >
                📦 Optimize inventory for top-performing regions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => alert('Opening data import...')}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
          >
            <Upload className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">Import Data</span>
          </button>
          
          <button 
            onClick={() => alert('Generating custom report...')}
            className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-center"
          >
            <FileText className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <span className="text-sm font-medium text-gray-900">Custom Report</span>
          </button>
          
          <button 
            onClick={() => alert('Setting up alerts...')}
            className="p-4 border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-colors text-center"
          >
            <Bell className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
            <span className="text-sm font-medium text-gray-900">Set Alerts</span>
          </button>
          
          <button 
            onClick={() => alert('Opening integrations...')}
            className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-center"
          >
            <Zap className="h-6 w-6 mx-auto mb-2 text-purple-600" />
            <span className="text-sm font-medium text-gray-900">Integrations</span>
          </button>
        </div>
      </div>

      {/* Performance Alerts */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Alert</h3>
            <p className="text-sm text-gray-700 mb-4">
              Your sales velocity is 23% higher than the same period last month. Consider increasing inventory for high-demand products.
            </p>
            <div className="flex space-x-3">
              <button 
                onClick={() => alert('Viewing detailed alert...')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                View Details
              </button>
              <button 
                onClick={() => alert('Dismissing alert...')}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
          <TrendingUp className="h-8 w-8 text-blue-600 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}

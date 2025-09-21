import React, { useState } from 'react';
import { DollarSign, Users, ShoppingCart, TrendingUp, Package, Target, Download, Calendar, RefreshCw, AlertTriangle, ChevronRight, Upload } from 'lucide-react';
import { AnalyticsCard } from './AnalyticsCard';
import { InteractiveChart } from './InteractiveChart';
import { 
  enhancedMonthlyData, 
  enhancedRegionData, 
  enhancedProductData, 
  enhancedCustomerSegmentData,
  enhancedChannelData 
} from '../data/enhancedMockData';
import { DateRange } from '../types';
import { format, subDays } from 'date-fns';

export function Dashboard() {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });
  const [refreshing, setRefreshing] = useState(false);
  const [expandedChart, setExpandedChart] = useState<string | null>(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    // Simulate export functionality
    console.log(`Exporting dashboard data as ${format}`);
    // In a real app, you would generate and download the file
  };

  const handleCardClick = (cardType: string) => {
    // Navigate to detailed view or show drill-down modal
    console.log(`Clicked on ${cardType} card`);
  };

  const handleChartExpand = (chartType: string) => {
    setExpandedChart(expandedChart === chartType ? null : chartType);
  };

  const alerts = [
    {
      id: '1',
      type: 'warning',
      title: 'Låg lagernivå',
      message: 'Premium Widget har endast 5 enheter kvar i lager',
      action: 'Beställ mer'
    },
    {
      id: '2',
      type: 'success',
      title: 'Målet uppnått',
      message: 'Månadsmålet för försäljning har uppnåtts med 12% marginal',
      action: 'Se detaljer'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
          <p className="text-gray-600 mt-2">Get insights into your business performance and growth trends</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          {/* Date Range Picker */}
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-gray-500">-</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Uppdaterar...' : 'Uppdatera'}</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative group">
            <button className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="h-4 w-4" />
              <span>Exportera</span>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="py-2">
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Exportera som CSV
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Exportera som Excel
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Exportera som PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Alerts */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aviseringar</h3>
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className={`flex items-center justify-between p-3 rounded-lg ${
                alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <AlertTriangle className={`h-5 w-5 ${
                    alert.type === 'warning' ? 'text-yellow-600' : 'text-green-600'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">{alert.title}</p>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                  </div>
                </div>
                <button className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  alert.type === 'warning' 
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}>
                  {alert.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div onClick={() => handleCardClick('revenue')} className="cursor-pointer">
          <AnalyticsCard
            title="Total Revenue"
            value="$1,492,000"
            change="+12.5%"
            trend="up"
            icon={DollarSign}
          />
        </div>
        <div onClick={() => handleCardClick('customers')} className="cursor-pointer">
          <AnalyticsCard
            title="Total Customers"
            value="2,389"
            change="+8.2%"
            trend="up"
            icon={Users}
          />
        </div>
        <div onClick={() => handleCardClick('orders')} className="cursor-pointer">
          <AnalyticsCard
            title="Orders This Month"
            value="745"
            change="+15.3%"
            trend="up"
            icon={ShoppingCart}
          />
        </div>
        <div onClick={() => handleCardClick('aov')} className="cursor-pointer">
          <AnalyticsCard
            title="Average Order Value"
            value="$262"
            change="-2.1%"
            trend="down"
            icon={TrendingUp}
          />
        </div>
        <div onClick={() => handleCardClick('products')} className="cursor-pointer">
          <AnalyticsCard
            title="Products Sold"
            value="1,850"
            change="+23.7%"
            trend="up"
            icon={Package}
          />
        </div>
        <div onClick={() => handleCardClick('conversion')} className="cursor-pointer">
          <AnalyticsCard
            title="Conversion Rate"
            value="3.4%"
            change="+0.8%"
            trend="up"
            icon={Target}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="relative">
          <InteractiveChart
            data={enhancedMonthlyData}
            type="area"
            title="Månatlig försäljningstrend"
            height={expandedChart === 'sales' ? 400 : 250}
            currency={true}
            animated={true}
          />
          <button
            onClick={() => handleChartExpand('sales')}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-white rounded-lg shadow-sm"
            title={expandedChart === 'sales' ? 'Förminska' : 'Expandera'}
          >
            <ChevronRight className={`h-4 w-4 transition-transform ${expandedChart === 'sales' ? 'rotate-90' : ''}`} />
          </button>
        </div>
        
        <div className="relative">
          <InteractiveChart
            data={enhancedRegionData}
            type="bar"
            title="Försäljning per region"
            height={expandedChart === 'regions' ? 400 : 250}
            currency={true}
            animated={true}
          />
          <button
            onClick={() => handleChartExpand('regions')}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-white rounded-lg shadow-sm"
            title={expandedChart === 'regions' ? 'Förminska' : 'Expandera'}
          >
            <ChevronRight className={`h-4 w-4 transition-transform ${expandedChart === 'regions' ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="relative">
          <InteractiveChart
            data={enhancedProductData}
            type="line"
            title="Produktprestanda"
            height={expandedChart === 'products' ? 400 : 250}
            currency={true}
            animated={true}
          />
          <button
            onClick={() => handleChartExpand('products')}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-white rounded-lg shadow-sm"
            title={expandedChart === 'products' ? 'Förminska' : 'Expandera'}
          >
            <ChevronRight className={`h-4 w-4 transition-transform ${expandedChart === 'products' ? 'rotate-90' : ''}`} />
          </button>
        </div>
        
        <div className="relative">
          <InteractiveChart
            data={enhancedCustomerSegmentData}
            type="pie"
            title="Kundsegment"
            height={expandedChart === 'customers' ? 400 : 250}
            animated={true}
          />
          <button
            onClick={() => handleChartExpand('customers')}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-white rounded-lg shadow-sm"
            title={expandedChart === 'customers' ? 'Förminska' : 'Expandera'}
          >
            <ChevronRight className={`h-4 w-4 transition-transform ${expandedChart === 'customers' ? 'rotate-90' : ''}`} />
          </button>
        </div>
        
        <div className="relative">
          <InteractiveChart
            data={enhancedChannelData}
            type="bar"
            title="Försäljningskanaler"
            height={expandedChart === 'channels' ? 400 : 250}
            currency={true}
            animated={true}
          />
          <button
            onClick={() => handleChartExpand('channels')}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-white rounded-lg shadow-sm"
            title={expandedChart === 'channels' ? 'Förminska' : 'Expandera'}
          >
            <ChevronRight className={`h-4 w-4 transition-transform ${expandedChart === 'channels' ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Realtidsstatistik</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">127</p>
              <p className="text-sm text-blue-800">Aktiva sessioner</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">23</p>
              <p className="text-sm text-green-800">Beställningar idag</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">1,456 kr</p>
              <p className="text-sm text-purple-800">Genomsnitt idag</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">3.4%</p>
              <p className="text-sm text-yellow-800">Konvertering</p>
            </div>
          </div>
        </div>
        
        {/* Enhanced Insights */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div 
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => console.log('Navigate to Q4 performance details')}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Strong Q4 Performance</p>
                <p className="text-xs text-gray-600">Revenue increased by 15% compared to last quarter</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
            
            <div 
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => console.log('Navigate to regional analysis')}
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">North Region Leading</p>
                <p className="text-xs text-gray-600">32.5% of total sales coming from northern territories</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
            
            <div 
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => console.log('Navigate to customer acquisition details')}
            >
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Customer Acquisition Up</p>
                <p className="text-xs text-gray-600">New customers increased by 23% this month</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
            
            <div 
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => console.log('Navigate to service products analysis')}
            >
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Service Products Performing</p>
                <p className="text-xs text-gray-600">Services category showing highest margins at 70%</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Snabbåtgärder</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
            <Upload className="h-6 w-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Importera data</span>
          </button>
          
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
            <Users className="h-6 w-6 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Lägg till kund</span>
          </button>
          
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors">
            <Package className="h-6 w-6 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Hantera produkter</span>
          </button>
          
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-colors">
            <Download className="h-6 w-6 text-yellow-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Generera rapport</span>
          </button>
        </div>
      </div>
    </div>
  );
}
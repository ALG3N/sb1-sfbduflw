import React from 'react';
import { DollarSign, Users, ShoppingCart, TrendingUp, Package, Target } from 'lucide-react';
import { AnalyticsCard } from './AnalyticsCard';
import { SimpleChart } from './SimpleChart';
import { monthlyData, regionData } from '../data/mockData';

export function Dashboard() {
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

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
        <p className="text-gray-600 mt-2">Get insights into your business performance and growth trends</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnalyticsCard
          title="Total Revenue"
          value="$1,492,000"
          change="+12.5%"
          trend="up"
          icon={DollarSign}
        />
        <AnalyticsCard
          title="Total Customers"
          value="2,389"
          change="+8.2%"
          trend="up"
          icon={Users}
        />
        <AnalyticsCard
          title="Orders This Month"
          value="745"
          change="+15.3%"
          trend="up"
          icon={ShoppingCart}
        />
        <AnalyticsCard
          title="Average Order Value"
          value="$262"
          change="-2.1%"
          trend="down"
          icon={TrendingUp}
        />
        <AnalyticsCard
          title="Products Sold"
          value="1,850"
          change="+23.7%"
          trend="up"
          icon={Package}
        />
        <AnalyticsCard
          title="Conversion Rate"
          value="3.4%"
          change="+0.8%"
          trend="up"
          icon={Target}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleChart
          data={monthlyChartData}
          type="area"
          title="Monthly Sales Trend"
          height={250}
        />
        <SimpleChart
          data={regionChartData}
          type="bar"
          title="Sales by Region"
          height={250}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleChart
          data={customerGrowthData}
          type="line"
          title="Customer Growth"
          height={250}
        />
        
        {/* Top Insights */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Strong Q4 Performance</p>
                <p className="text-xs text-gray-600">Revenue increased by 15% compared to last quarter</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">North Region Leading</p>
                <p className="text-xs text-gray-600">32.5% of total sales coming from northern territories</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Customer Acquisition Up</p>
                <p className="text-xs text-gray-600">New customers increased by 23% this month</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Service Products Performing</p>
                <p className="text-xs text-gray-600">Services category showing highest margins at 70%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Search, Mail, Calendar, DollarSign, ShoppingBag, Filter, Download, Plus, Edit, Eye, MessageCircle, Phone, X, TrendingUp, Users, Target } from 'lucide-react';
import { mockCustomers } from '../data/mockData';
import { Customer } from '../types';

export function CustomersView() {
  const [customers, setCustomers] = useState(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'totalSpent' | 'lastOrder' | 'orderCount'>('totalSpent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    segment: 'New' as const,
    notes: ''
  });

  const segments = ['All', 'High Value', 'Regular', 'New', 'At Risk'];

  const filteredCustomers = customers
    .filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSegment = selectedSegment === 'All' || customer.segment === selectedSegment;
      return matchesSearch && matchesSegment;
    })
    .sort((a, b) => {
      const aValue = sortBy === 'name' ? a.name :
                     sortBy === 'totalSpent' ? a.totalSpent :
                     sortBy === 'lastOrder' ? new Date(a.lastOrderDate).getTime() :
                     a.orderCount;
      
      const bValue = sortBy === 'name' ? b.name :
                     sortBy === 'totalSpent' ? b.totalSpent :
                     sortBy === 'lastOrder' ? new Date(b.lastOrderDate).getTime() :
                     b.orderCount;

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'High Value': return 'bg-green-100 text-green-800';
      case 'Regular': return 'bg-blue-100 text-blue-800';
      case 'New': return 'bg-purple-100 text-purple-800';
      case 'At Risk': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSegmentIcon = (segment: string) => {
    switch (segment) {
      case 'High Value': return <DollarSign className="h-4 w-4" />;
      case 'Regular': return <Users className="h-4 w-4" />;
      case 'New': return <Plus className="h-4 w-4" />;
      case 'At Risk': return <TrendingUp className="h-4 w-4 rotate-180" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const totalCustomers = customers.length;
  const highValueCustomers = customers.filter(c => c.segment === 'High Value').length;
  const averageOrderValue = customers.reduce((acc, c) => acc + (c.totalSpent / c.orderCount), 0) / totalCustomers;
  const totalRevenue = customers.reduce((acc, c) => acc + c.totalSpent, 0);
  const atRiskCustomers = customers.filter(c => c.segment === 'At Risk').length;

  const viewCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

  const exportCustomers = () => {
    const csvData = [
      ['Name', 'Email', 'Segment', 'Total Spent', 'Order Count', 'Last Order Date'],
      ...filteredCustomers.map(customer => [
        customer.name,
        customer.email,
        customer.segment,
        customer.totalSpent.toString(),
        customer.orderCount.toString(),
        customer.lastOrderDate
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const addCustomer = () => {
    if (!newCustomer.name || !newCustomer.email) {
      alert('Please fill in required fields');
      return;
    }

    const customer: Customer = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCustomer.name,
      email: newCustomer.email,
      totalSpent: 0,
      orderCount: 0,
      lastOrderDate: new Date().toISOString(),
      segment: newCustomer.segment
    };

    setCustomers([...customers, customer]);
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      segment: 'New',
      notes: ''
    });
    setShowAddCustomer(false);
  };

  const sendEmail = (customer: Customer) => {
    alert(`Opening email to ${customer.name} (${customer.email})`);
  };

  const callCustomer = (customer: Customer) => {
    alert(`Calling ${customer.name} - feature would integrate with phone system`);
  };

  const changeSegment = (customerId: string, newSegment: string) => {
    setCustomers(customers.map(customer => 
      customer.id === customerId 
        ? { ...customer, segment: newSegment as any }
        : customer
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Analytics</h1>
          <p className="text-gray-600 mt-2">Understand your customers and their purchasing behavior</p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={exportCustomers}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowAddCustomer(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Customer Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Value</p>
              <p className="text-2xl font-bold text-gray-900">{highValueCustomers}</p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Order Value</p>
              <p className="text-2xl font-bold text-gray-900">${averageOrderValue.toFixed(0)}</p>
            </div>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">At Risk</p>
              <p className="text-2xl font-bold text-gray-900">{atRiskCustomers}</p>
            </div>
            <div className="p-2 bg-red-50 rounded-lg">
              <Target className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {segments.map(segment => (
              <option key={segment} value={segment}>{segment}</option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="totalSpent">Total Spent</option>
            <option value="name">Name</option>
            <option value="orderCount">Order Count</option>
            <option value="lastOrder">Last Order</option>
          </select>
          
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Add New Customer</h3>
                <button
                  onClick={() => setShowAddCustomer(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+46701234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Segment
                </label>
                <select
                  value={newCustomer.segment}
                  onChange={(e) => setNewCustomer({...newCustomer, segment: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="New">New</option>
                  <option value="Regular">Regular</option>
                  <option value="High Value">High Value</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Any additional notes..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddCustomer(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addCustomer}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Details Modal */}
      {showCustomerModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{selectedCustomer.orderCount}</p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">${(selectedCustomer.totalSpent / selectedCustomer.orderCount).toFixed(0)}</p>
                  <p className="text-sm text-gray-600">Avg Order Value</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{selectedCustomer.email}</span>
                    <button
                      onClick={() => sendEmail(selectedCustomer)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Send Email
                    </button>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">Last order: {new Date(selectedCustomer.lastOrderDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Quick Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => sendEmail(selectedCustomer)}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Send Email
                  </button>
                  <button
                    onClick={() => callCustomer(selectedCustomer)}
                    className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    Call Customer
                  </button>
                  <button
                    onClick={() => alert('Opening order history...')}
                    className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    View Orders
                  </button>
                </div>
              </div>

              {/* Change Segment */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Customer Segment</h4>
                <div className="flex flex-wrap gap-2">
                  {segments.filter(s => s !== 'All').map(segment => (
                    <button
                      key={segment}
                      onClick={() => changeSegment(selectedCustomer.id, segment)}
                      className={`inline-flex items-center px-3 py-1 rounded-lg transition-colors ${
                        selectedCustomer.segment === segment
                          ? getSegmentColor(segment)
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {getSegmentIcon(segment)}
                      <span className="ml-1">{segment}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Recent Activity</h4>
                <div className="space-y-2">
                  {[
                    { action: 'Placed order #1234', date: '2024-01-15', amount: '$299.99' },
                    { action: 'Updated profile information', date: '2024-01-10', amount: null },
                    { action: 'Placed order #1233', date: '2024-01-05', amount: '$159.99' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.date}</p>
                      </div>
                      {activity.amount && (
                        <span className="text-sm font-medium text-gray-900">{activity.amount}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Customers ({filteredCustomers.length})
            </h3>
            <div className="text-sm text-gray-500">
              Showing {filteredCustomers.length} of {customers.length} customers
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Customer</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Segment</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Total Spent</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Orders</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Last Order</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map(customer => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Mail className="h-4 w-4" />
                        <span>{customer.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSegmentColor(customer.segment)}`}>
                        {getSegmentIcon(customer.segment)}
                        <span className="ml-1">{customer.segment}</span>
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-900">
                    ${customer.totalSpent.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-900">{customer.orderCount}</span>
                      <span className="text-xs text-gray-500">orders</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(customer.lastOrderDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => viewCustomerDetails(customer)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => sendEmail(customer)}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Send email"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => alert('Edit customer functionality')}
                        className="text-gray-600 hover:text-gray-800 p-1"
                        title="Edit customer"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedSegment !== 'All'
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first customer'
              }
            </p>
            {(!searchTerm && selectedSegment === 'All') && (
              <button
                onClick={() => setShowAddCustomer(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Customer
              </button>
            )}
          </div>
        )}
      </div>

      {/* Customer Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Segment Distribution</h3>
          <div className="space-y-3">
            {segments.filter(s => s !== 'All').map(segment => {
              const count = customers.filter(c => c.segment === segment).length;
              const percentage = (count / customers.length) * 100;
              return (
                <div key={segment} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded ${
                      segment === 'High Value' ? 'bg-green-500' :
                      segment === 'Regular' ? 'bg-blue-500' :
                      segment === 'New' ? 'bg-purple-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm text-gray-700">{segment}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                    <span className="text-xs text-gray-500">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => alert('Bulk email campaign functionality')}
              className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Send Campaign</p>
                <p className="text-sm text-gray-500">Email marketing to selected segments</p>
              </div>
            </button>

            <button
              onClick={() => alert('Customer analysis report')}
              className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Analyze Trends</p>
                <p className="text-sm text-gray-500">Customer behavior analysis</p>
              </div>
            </button>

            <button
              onClick={() => alert('Customer retention strategy')}
              className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-colors"
            >
              <Target className="h-5 w-5 text-yellow-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Retention Plan</p>
                <p className="text-sm text-gray-500">Engage at-risk customers</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedCustomer.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSegmentColor(selectedCustomer.segment)}`}>
                    {selectedCustomer.segment}
                  </span>
                </div>
                <button
                  onClick={() => setShowCustomerModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">${selectedCustomer.totalSpent.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Spent</p>
                </div>
                <div className

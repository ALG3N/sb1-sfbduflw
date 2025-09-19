import React, { useState } from 'react';
import { Search, Mail, Calendar, DollarSign, ShoppingBag, Phone, Plus, Eye, Edit, Trash2, Download, Filter, X } from 'lucide-react';
import { mockCustomers } from '../data/mockData';
import { Customer, CustomerDetail } from '../types';

export function CustomersView() {
  const [customers, setCustomers] = useState(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showCustomerDetail, setShowCustomerDetail] = useState<CustomerDetail | null>(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    segment: 'New' as const,
    notes: ''
  });

  const segments = ['All', 'High Value', 'Regular', 'New', 'At Risk'];

  const filteredAndSortedCustomers = customers
    .filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSegment = selectedSegment === 'All' || customer.segment === selectedSegment;
      return matchesSearch && matchesSegment;
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof Customer];
      let bValue = b[sortBy as keyof Customer];
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
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

  const totalCustomers = customers.length;
  const highValueCustomers = customers.filter(c => c.segment === 'High Value').length;
  const averageOrderValue = customers.reduce((acc, c) => acc + (c.totalSpent / c.orderCount), 0) / totalCustomers;
  const totalRevenue = customers.reduce((acc, c) => acc + c.totalSpent, 0);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const viewCustomerDetail = (customer: Customer) => {
    // Mock detailed customer data
    const customerDetail: CustomerDetail = {
      ...customer,
      address: '123 Business Street, City, State 12345',
      phone: '+1 (555) 123-4567',
      notes: 'Preferred customer, always pays on time.',
      orders: [
        { id: '1', date: '2024-01-15', amount: 1499.95, status: 'Completed' },
        { id: '2', date: '2024-01-10', amount: 899.50, status: 'Completed' },
        { id: '3', date: '2024-01-05', amount: 2199.99, status: 'Processing' }
      ],
      activityLog: [
        { id: '1', date: '2024-01-15', action: 'Order Placed', details: 'Order #1001 for $1,499.95' },
        { id: '2', date: '2024-01-10', action: 'Email Sent', details: 'Marketing newsletter delivered' },
        { id: '3', date: '2024-01-05', action: 'Profile Updated', details: 'Contact information updated' }
      ]
    };
    setShowCustomerDetail(customerDetail);
  };

  const addCustomer = () => {
    const customer: Customer = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCustomer.name,
      email: newCustomer.email,
      totalSpent: 0,
      orderCount: 0,
      lastOrderDate: new Date().toISOString().split('T')[0],
      segment: newCustomer.segment
    };

    setCustomers([...customers, customer]);
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      address: '',
      segment: 'New',
      notes: ''
    });
    setShowAddCustomer(false);
  };

  const deleteCustomer = (customerId: string) => {
    if (window.confirm('Är du säker på att du vill ta bort denna kund?')) {
      setCustomers(customers.filter(c => c.id !== customerId));
    }
  };

  const changeCustomerSegment = (customerId: string, newSegment: string) => {
    setCustomers(customers.map(c => 
      c.id === customerId ? { ...c, segment: newSegment as any } : c
    ));
  };

  const exportCustomers = () => {
    const csvContent = [
      ['Name', 'Email', 'Total Spent', 'Orders', 'Segment', 'Last Order'],
      ...filteredAndSortedCustomers.map(customer => [
        customer.name,
        customer.email,
        customer.totalSpent.toString(),
        customer.orderCount.toString(),
        customer.segment,
        customer.lastOrderDate
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const toggleCustomerSelection = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const selectAllCustomers = () => {
    if (selectedCustomers.length === filteredAndSortedCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredAndSortedCustomers.map(c => c.id));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Analytics</h1>
          <p className="text-gray-600 mt-2">Understand your customers and their purchasing behavior</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportCustomers}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <p className="text-sm text-gray-600">High Value Customers</p>
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
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search customers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            {segments.map(segment => (
              <button
                key={segment}
                onClick={() => setSelectedSegment(segment)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedSegment === segment
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {segment}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCustomers.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedCustomers.length} customers selected
              </span>
              <div className="flex space-x-2">
                <select
                  onChange={(e) => {
                    selectedCustomers.forEach(id => 
                      changeCustomerSegment(id, e.target.value)
                    );
                    setSelectedCustomers([]);
                  }}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded border-0"
                >
                  <option value="">Change Segment</option>
                  <option value="High Value">High Value</option>
                  <option value="Regular">Regular</option>
                  <option value="New">New</option>
                  <option value="At Risk">At Risk</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Customer Details</h3>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedCustomers.length === filteredAndSortedCustomers.length && filteredAndSortedCustomers.length > 0}
                onChange={selectAllCustomers}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Select all</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Select</th>
                <th 
                  className="text-left py-3 px-6 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  Customer {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Segment</th>
                <th 
                  className="text-left py-3 px-6 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('totalSpent')}
                >
                  Total Spent {sortBy === 'totalSpent' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="text-left py-3 px-6 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('orderCount')}
                >
                  Orders {sortBy === 'orderCount' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Last Order</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAndSortedCustomers.map(customer => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => toggleCustomerSelection(customer.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
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
                    <select
                      value={customer.segment}
                      onChange={(e) => changeCustomerSegment(customer.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getSegmentColor(customer.segment)}`}
                    >
                      <option value="High Value">High Value</option>
                      <option value="Regular">Regular</option>
                      <option value="New">New</option>
                      <option value="At Risk">At Risk</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-900">
                    ${customer.totalSpent.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-gray-900">{customer.orderCount}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(customer.lastOrderDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => viewCustomerDetail(customer)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Send Email"
                      >
                        <Mail className="h-4 w-4" />
                      </button>
                      <button
                        className="text-purple-600 hover:text-purple-800 p-1"
                        title="Call Customer"
                      >
                        <Phone className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteCustomer(customer.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete Customer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {showCustomerDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Customer Details: {showCustomerDetail.name}</h3>
              <button
                onClick={() => setShowCustomerDetail(null)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Email:</strong> {showCustomerDetail.email}</p>
                    <p><strong>Phone:</strong> {showCustomerDetail.phone}</p>
                    <p><strong>Address:</strong> {showCustomerDetail.address}</p>
                    <p><strong>Segment:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getSegmentColor(showCustomerDetail.segment)}`}>
                        {showCustomerDetail.segment}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Purchase Summary</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Total Spent:</strong> ${showCustomerDetail.totalSpent.toLocaleString()}</p>
                    <p><strong>Total Orders:</strong> {showCustomerDetail.orderCount}</p>
                    <p><strong>Average Order Value:</strong> ${(showCustomerDetail.totalSpent / showCustomerDetail.orderCount).toFixed(2)}</p>
                    <p><strong>Last Order:</strong> {new Date(showCustomerDetail.lastOrderDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Recent Orders</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-2 px-3">Order ID</th>
                        <th className="text-left py-2 px-3">Date</th>
                        <th className="text-left py-2 px-3">Amount</th>
                        <th className="text-left py-2 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {showCustomerDetail.orders.map(order => (
                        <tr key={order.id}>
                          <td className="py-2 px-3">#{order.id}</td>
                          <td className="py-2 px-3">{new Date(order.date).toLocaleDateString()}</td>
                          <td className="py-2 px-3">${order.amount.toLocaleString()}</td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              order.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Activity Log</h4>
                <div className="space-y-2">
                  {showCustomerDetail.activityLog.map(activity => (
                    <div key={activity.id} className="flex items-start space-x-3 p-2 bg-gray-50 rounded">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-600">{activity.details}</p>
                        <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Notes</h4>
                <p className="text-sm text-gray-600">{showCustomerDetail.notes}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add New Customer</h3>
              <button
                onClick={() => setShowAddCustomer(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Segment</label>
                <select
                  value={newCustomer.segment}
                  onChange={(e) => setNewCustomer({...newCustomer, segment: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="New">New</option>
                  <option value="Regular">Regular</option>
                  <option value="High Value">High Value</option>
                  <option value="At Risk">At Risk</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowAddCustomer(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addCustomer}
                disabled={!newCustomer.name || !newCustomer.email}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Add Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
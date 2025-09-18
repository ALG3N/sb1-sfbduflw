import React, { useState } from 'react';
import { Plus, Edit, Trash2, Shield, Mail, Phone, Calendar, CheckCircle, XCircle, X, Search, Filter, Download, UserPlus, Key } from 'lucide-react';
import { mockUsers } from '../data/mockData';
import { User } from '../types';

export function UserManagement() {
  const [users, setUsers] = useState(mockUsers);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'viewer' as const,
    department: '',
    password: '',
    confirmPassword: ''
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.isActive) ||
                         (statusFilter === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'manager': return 'Manager';
      case 'viewer': return 'Viewer';
      default: return role;
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
  };

  const deleteUser = (userId: string) => {
    if (window.confirm('Är du säker på att du vill ta bort denna användare?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const addUser = () => {
    if (!newUser.name || !newUser.email || !newUser.phone || !newUser.department) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (newUser.password !== newUser.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (users.some(user => user.email === newUser.email)) {
      alert('A user with this email already exists');
      return;
    }

    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      department: newUser.department,
      lastLogin: new Date().toISOString(),
      isActive: true,
      permissions: {
        viewDashboard: true,
        viewCustomers: newUser.role !== 'viewer',
        viewReports: true,
        manageUsers: newUser.role === 'admin',
        exportData: newUser.role !== 'viewer',
        importData: newUser.role !== 'viewer',
      }
    };

    setUsers([...users, user]);
    setNewUser({
      name: '',
      email: '',
      phone: '',
      role: 'viewer',
      department: '',
      password: '',
      confirmPassword: ''
    });
    setShowAddUser(false);
  };

  const updateUser = () => {
    if (!editingUser) return;

    setUsers(users.map(user => 
      user.id === editingUser.id ? editingUser : user
    ));
    setEditingUser(null);
  };

  const exportUsers = () => {
    const csvData = [
      ['Name', 'Email', 'Phone', 'Role', 'Department', 'Status', 'Last Login'],
      ...users.map(user => [
        user.name,
        user.email,
        user.phone,
        getRoleLabel(user.role),
        user.department,
        user.isActive ? 'Active' : 'Inactive',
        new Date(user.lastLogin).toLocaleDateString('sv-SE')
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const resetPassword = (userId: string, userName: string) => {
    if (confirm(`Reset password for ${userName}? A new password will be generated and sent to their email.`)) {
      alert(`Password reset email sent to ${userName}`);
    }
  };

  const bulkAction = (action: string, selectedIds: string[]) => {
    if (selectedIds.length === 0) {
      alert('Please select users first');
      return;
    }

    switch (action) {
      case 'activate':
        setUsers(users.map(user => 
          selectedIds.includes(user.id) ? { ...user, isActive: true } : user
        ));
        break;
      case 'deactivate':
        setUsers(users.map(user => 
          selectedIds.includes(user.id) ? { ...user, isActive: false } : user
        ));
        break;
      case 'delete':
        if (confirm(`Delete ${selectedIds.length} selected users?`)) {
          setUsers(users.filter(user => !selectedIds.includes(user.id)));
        }
        break;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Användarhantering</h1>
          <p className="text-gray-600 mt-2">Hantera användare och deras behörigheter</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportUsers}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowAddUser(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Lägg till användare</span>
          </button>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Totalt användare</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Administratörer</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
            <Shield className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aktiva användare</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.isActive).length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inaktiva användare</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => !u.isActive).length}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="admin">Administrator</option>
            <option value="manager">Manager</option>
            <option value="viewer">Viewer</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('all');
                setStatusFilter('all');
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {(showAddUser || editingUser) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddUser(false);
                    setEditingUser(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={editingUser ? editingUser.name : newUser.name}
                    onChange={(e) => {
                      if (editingUser) {
                        setEditingUser({...editingUser, name: e.target.value});
                      } else {
                        setNewUser({...newUser, name: e.target.value});
                      }
                    }}
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
                    value={editingUser ? editingUser.email : newUser.email}
                    onChange={(e) => {
                      if (editingUser) {
                        setEditingUser({...editingUser, email: e.target.value});
                      } else {
                        setNewUser({...newUser, email: e.target.value});
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={editingUser ? editingUser.phone : newUser.phone}
                    onChange={(e) => {
                      if (editingUser) {
                        setEditingUser({...editingUser, phone: e.target.value});
                      } else {
                        setNewUser({...newUser, phone: e.target.value});
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+46701234567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    value={editingUser ? editingUser.role : newUser.role}
                    onChange={(e) => {
                      if (editingUser) {
                        setEditingUser({...editingUser, role: e.target.value as any});
                      } else {
                        setNewUser({...newUser, role: e.target.value as any});
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <input
                    type="text"
                    value={editingUser ? editingUser.department : newUser.department}
                    onChange={(e) => {
                      if (editingUser) {
                        setEditingUser({...editingUser, department: e.target.value});
                      } else {
                        setNewUser({...newUser, department: e.target.value});
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Sales, Marketing, IT, etc."
                  />
                </div>

                {!editingUser && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password *
                      </label>
                      <input
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        value={newUser.confirmPassword}
                        onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="••••••••"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddUser(false);
                  setEditingUser(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingUser ? updateUser : addUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingUser ? 'Update User' : 'Add User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Users ({filteredUsers.length})
            </h3>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Roll</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Avdelning</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Senaste inloggning</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Åtgärder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="h-4 w-4" />
                          <span>{user.phone}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-900">{user.department}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span className={`text-sm ${user.isActive ? 'text-green-700' : 'text-gray-500'}`}>
                        {user.isActive ? 'Aktiv' : 'Inaktiv'}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(user.lastLogin).toLocaleDateString('sv-SE')}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Redigera användare"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => resetPassword(user.id, user.name)}
                        className="text-orange-600 hover:text-orange-800 p-1"
                        title="Reset password"
                      >
                        <Key className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`p-1 ${user.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                        title={user.isActive ? 'Inaktivera användare' : 'Aktivera användare'}
                      >
                        {user.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Ta bort användare"
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

        {filteredUsers.length === 0 && (
          <div className="p-12 text-center">
            <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first user'
              }
            </p>
            {(!searchTerm && roleFilter === 'all' && statusFilter === 'all') && (
              <button
                onClick={() => setShowAddUser(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First User
              </button>
            )}
          </div>
        )}
      </div>

      {/* Permissions Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Behörighetsöversikt</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-red-600" />
              <h4 className="font-medium text-gray-900">Administrator</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 ml-7">
              <li>• Full åtkomst till alla funktioner</li>
              <li>• Kan hantera användare</li>
              <li>• Kan exportera all data</li>
              <li>• Kan konfigurera API-integrationer</li>
              <li>• Kan se alla rapporter och analytics</li>
            </ul>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <h4 className="font-medium text-gray-900">Manager</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 ml-7">
              <li>• Kan se dashboard och rapporter</li>
              <li>• Kan hantera kunder</li>
              <li>• Kan exportera data</li>
              <li>• Kan importera data</li>
              <li>• Begränsad användarhantering</li>
            </ul>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-gray-600" />
              <h4 className="font-medium text-gray-900">Viewer</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 ml-7">
              <li>• Kan se dashboard</li>
              <li>• Kan se rapporter</li>
              <li>• Begränsad dataåtkomst</li>
              <li>• Kan inte exportera data</li>
              <li>• Ingen administrativ åtkomst</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent User Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'User Login', user: 'Anna Andersson', time: '2 minutes ago', type: 'info' },
            { action: 'Password Reset', user: 'Erik Eriksson', time: '1 hour ago', type: 'warning' },
            { action: 'User Created', user: 'Maria Nilsson', time: '2 hours ago', type: 'success' },
            { action: 'Permission Changed', user: 'Anna Andersson', time: '3 hours ago', type: 'info' },
            { action: 'User Deactivated', user: 'Former Employee', time: '1 day ago', type: 'error' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' :
                  activity.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.user}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <button 
            onClick={() => alert('Opening full activity log...')}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View Full Activity Log
          </button>
        </div>
      </div>
    </div>
  );
}">Användare</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600

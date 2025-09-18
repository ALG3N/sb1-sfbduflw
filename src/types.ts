export interface SalesData {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  product: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  region: string;
  salesRep: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
  orderCount: number;
  lastOrderDate: string;
  segment: 'High Value' | 'Regular' | 'New' | 'At Risk';
}

export interface Product {
  id: string;
  name: string;
  category: string;
  totalSales: number;
  unitsSold: number;
  avgPrice: number;
  margin: number;
}

export interface AnalyticsCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'viewer';
  department: string;
  lastLogin: string;
  isActive: boolean;
  permissions: {
    viewDashboard: boolean;
    viewCustomers: boolean;
    viewReports: boolean;
    manageUsers: boolean;
    exportData: boolean;
    importData: boolean;
  };
}

export interface APIIntegration {
  id: string;
  name: string;
  type: 'shopify' | 'woocommerce' | 'stripe' | 'square' | 'custom';
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  apiKey?: string;
  webhookUrl?: string;
}

export interface NotificationSettings {
  id: string;
  userId: string;
  weeklyReports: boolean;
  smsNotifications: boolean;
  emailNotifications: boolean;
  phone: string;
  reportDay: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  metrics: string[];
}
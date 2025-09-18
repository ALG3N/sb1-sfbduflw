import { SalesData, Customer, Product } from '../types';

export const mockSalesData: SalesData[] = [
  {
    id: '1',
    date: '2024-01-15',
    customerName: 'Acme Corp',
    customerEmail: 'contact@acme.com',
    product: 'Premium Widget',
    category: 'Electronics',
    quantity: 5,
    unitPrice: 299.99,
    totalAmount: 1499.95,
    region: 'North',
    salesRep: 'John Smith'
  },
  {
    id: '2',
    date: '2024-01-16',
    customerName: 'Tech Solutions Inc',
    customerEmail: 'info@techsolutions.com',
    product: 'Standard Widget',
    category: 'Electronics',
    quantity: 10,
    unitPrice: 199.99,
    totalAmount: 1999.90,
    region: 'South',
    salesRep: 'Sarah Johnson'
  },
  {
    id: '3',
    date: '2024-01-17',
    customerName: 'Global Enterprises',
    customerEmail: 'sales@global.com',
    product: 'Pro Service',
    category: 'Services',
    quantity: 1,
    unitPrice: 2499.99,
    totalAmount: 2499.99,
    region: 'East',
    salesRep: 'Mike Wilson'
  },
  {
    id: '4',
    date: '2024-01-18',
    customerName: 'StartupXYZ',
    customerEmail: 'hello@startupxyz.com',
    product: 'Basic Widget',
    category: 'Electronics',
    quantity: 20,
    unitPrice: 99.99,
    totalAmount: 1999.80,
    region: 'West',
    salesRep: 'John Smith'
  },
  {
    id: '5',
    date: '2024-01-19',
    customerName: 'Enterprise Plus',
    customerEmail: 'orders@enterpriseplus.com',
    product: 'Premium Service',
    category: 'Services',
    quantity: 3,
    unitPrice: 1899.99,
    totalAmount: 5699.97,
    region: 'North',
    salesRep: 'Sarah Johnson'
  }
];

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Acme Corp',
    email: 'contact@acme.com',
    totalSpent: 15499.50,
    orderCount: 12,
    lastOrderDate: '2024-01-15',
    segment: 'High Value'
  },
  {
    id: '2',
    name: 'Tech Solutions Inc',
    email: 'info@techsolutions.com',
    totalSpent: 8999.70,
    orderCount: 8,
    lastOrderDate: '2024-01-16',
    segment: 'Regular'
  },
  {
    id: '3',
    name: 'Global Enterprises',
    email: 'sales@global.com',
    totalSpent: 25999.89,
    orderCount: 18,
    lastOrderDate: '2024-01-17',
    segment: 'High Value'
  },
  {
    id: '4',
    name: 'StartupXYZ',
    email: 'hello@startupxyz.com',
    totalSpent: 2999.60,
    orderCount: 3,
    lastOrderDate: '2024-01-18',
    segment: 'New'
  },
  {
    id: '5',
    name: 'Enterprise Plus',
    email: 'orders@enterpriseplus.com',
    totalSpent: 45699.85,
    orderCount: 25,
    lastOrderDate: '2024-01-19',
    segment: 'High Value'
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Widget',
    category: 'Electronics',
    totalSales: 89997.50,
    unitsSold: 300,
    avgPrice: 299.99,
    margin: 35.5
  },
  {
    id: '2',
    name: 'Standard Widget',
    category: 'Electronics',
    totalSales: 119994.00,
    unitsSold: 600,
    avgPrice: 199.99,
    margin: 28.2
  },
  {
    id: '3',
    name: 'Basic Widget',
    category: 'Electronics',
    totalSales: 49999.50,
    unitsSold: 500,
    avgPrice: 99.99,
    margin: 22.1
  },
  {
    id: '4',
    name: 'Pro Service',
    category: 'Services',
    totalSales: 174999.30,
    unitsSold: 70,
    avgPrice: 2499.99,
    margin: 68.7
  },
  {
    id: '5',
    name: 'Premium Service',
    category: 'Services',
    totalSales: 151999.20,
    unitsSold: 80,
    avgPrice: 1899.99,
    margin: 72.3
  }
];

// Generate monthly sales data for charts
export const monthlyData = [
  { month: 'Jan', sales: 65000, customers: 120, orders: 245 },
  { month: 'Feb', sales: 78000, customers: 135, orders: 289 },
  { month: 'Mar', sales: 92000, customers: 158, orders: 334 },
  { month: 'Apr', sales: 85000, customers: 142, orders: 298 },
  { month: 'May', sales: 101000, customers: 172, orders: 387 },
  { month: 'Jun', sales: 118000, customers: 198, orders: 445 },
  { month: 'Jul', sales: 125000, customers: 215, orders: 478 },
  { month: 'Aug', sales: 135000, customers: 234, orders: 521 },
  { month: 'Sep', sales: 142000, customers: 248, orders: 556 },
  { month: 'Oct', sales: 158000, customers: 267, orders: 612 },
  { month: 'Nov', sales: 171000, customers: 289, orders: 665 },
  { month: 'Dec', sales: 195000, customers: 312, orders: 745 }
];

export const regionData = [
  { region: 'North', sales: 485000, percentage: 32.5 },
  { region: 'South', sales: 412000, percentage: 27.6 },
  { region: 'East', sales: 358000, percentage: 24.0 },
  { region: 'West', sales: 237000, percentage: 15.9 }
];

export const mockUsers = [
  {
    id: '1',
    name: 'Anna Andersson',
    email: 'anna@företag.se',
    phone: '+46701234567',
    role: 'admin' as const,
    department: 'Management',
    lastLogin: '2024-01-20',
    isActive: true,
    permissions: {
      viewDashboard: true,
      viewCustomers: true,
      viewReports: true,
      manageUsers: true,
      exportData: true,
      importData: true,
    }
  },
  {
    id: '2',
    name: 'Erik Eriksson',
    email: 'erik@företag.se',
    phone: '+46709876543',
    role: 'manager' as const,
    department: 'Sales',
    lastLogin: '2024-01-19',
    isActive: true,
    permissions: {
      viewDashboard: true,
      viewCustomers: true,
      viewReports: true,
      manageUsers: false,
      exportData: true,
      importData: true,
    }
  },
  {
    id: '3',
    name: 'Maria Nilsson',
    email: 'maria@företag.se',
    phone: '+46705555555',
    role: 'viewer' as const,
    department: 'Marketing',
    lastLogin: '2024-01-18',
    isActive: true,
    permissions: {
      viewDashboard: true,
      viewCustomers: false,
      viewReports: true,
      manageUsers: false,
      exportData: false,
      importData: false,
    }
  }
];

export const mockAPIIntegrations = [
  {
    id: '1',
    name: 'Shopify Store',
    type: 'shopify' as const,
    status: 'connected' as const,
    lastSync: '2024-01-20T10:30:00Z',
    apiKey: 'sk_live_***************'
  },
  {
    id: '2',
    name: 'Stripe Payments',
    type: 'stripe' as const,
    status: 'connected' as const,
    lastSync: '2024-01-20T09:15:00Z',
    apiKey: 'pk_live_***************'
  },
  {
    id: '3',
    name: 'WooCommerce',
    type: 'woocommerce' as const,
    status: 'disconnected' as const,
    lastSync: '2024-01-15T14:20:00Z'
  }
]
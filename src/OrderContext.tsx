import { createContext, useContext, useState, type ReactNode } from 'react';

export type OrderItem = {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type Order = {
  id: string;
  shopName: string;
  status: 'Pending' | 'Delivered' | 'Cancelled';
  orderDate: string;
  deliveryDate: string | null;
  totalAmount: number;
  items: OrderItem[];
};

type OrderContextType = {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderDate' | 'status' | 'deliveryDate'>) => void;
  updateOrder: (id: string, updatedOrder: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  markAsDelivered: (id: string) => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Initial Mock Data to show the system working
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-1001',
    shopName: 'Al-Madina Super Store',
    status: 'Pending',
    orderDate: new Date().toISOString(),
    deliveryDate: null,
    totalAmount: 12500,
    items: [
      { id: '1', productName: 'Lays French Cheese', quantity: 50, unitPrice: 100, subtotal: 5000 },
      { id: '2', productName: 'Pepsi 1.5L', quantity: 30, unitPrice: 250, subtotal: 7500 },
    ],
  },
  {
    id: 'ORD-0998',
    shopName: 'Khan Traders',
    status: 'Delivered',
    orderDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    deliveryDate: new Date(Date.now() - 86400000).toISOString(),
    totalAmount: 9500,
    items: [
      { id: '4', productName: 'Surf Excel 1kg', quantity: 10, unitPrice: 950, subtotal: 9500 },
    ],
  },
  {
    id: 'ORD-0950',
    shopName: 'Bismillah General Store',
    status: 'Delivered',
    orderDate: new Date(Date.now() - 40 * 86400000).toISOString(), // 40 days ago
    deliveryDate: new Date(Date.now() - 39 * 86400000).toISOString(),
    totalAmount: 25000,
    items: [
      { id: '5', productName: 'Flour 20kg', quantity: 5, unitPrice: 5000, subtotal: 25000 },
    ],
  },
];

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  const addOrder = (orderData: Omit<Order, 'id' | 'orderDate' | 'status' | 'deliveryDate'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`, // Generate random ID
      status: 'Pending',
      orderDate: new Date().toISOString(),
      deliveryDate: null,
    };
    // Add to beginning of list
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrder = (orderId: string, updatedOrderData: Partial<Order>) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, ...updatedOrderData } : order
    ));
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  const markAsDelivered = (orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: 'Delivered',
          deliveryDate: new Date().toISOString(),
        };
      }
      return order;
    }));
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrder, deleteOrder, markAsDelivered }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}

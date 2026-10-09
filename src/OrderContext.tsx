import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

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

export function OrderProvider({ children }: { children: ReactNode }) {
  // Load initial state from browser storage or default to an empty array
  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem('bismillah_orders');
    if (savedOrders) {
      try {
        return JSON.parse(savedOrders);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Sync state to browser storage every time an order changes
  useEffect(() => {
    localStorage.setItem('bismillah_orders', JSON.stringify(orders));
  }, [orders]);

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

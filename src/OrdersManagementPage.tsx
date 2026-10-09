import { useState, useMemo } from 'react';
import { useOrders, type Order, type OrderItem } from './OrderContext';

export default function OrdersManagementPage() {
  const { orders, markAsDelivered, updateOrder, deleteOrder } = useOrders();
  const [activeTab, setActiveTab] = useState<'Pending' | 'Delivered'>('Pending');
  const [dateFilter, setDateFilter] = useState<'All' | 'Today' | 'Yesterday'>('All');
  
  // Modal State
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // Derived State
  const filteredOrders = useMemo(() => {
    let filtered = orders.filter(order => order.status === activeTab);
    
    if (dateFilter !== 'All') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.orderDate);
        orderDate.setHours(0, 0, 0, 0);
        
        if (dateFilter === 'Today') {
          return orderDate.getTime() === today.getTime();
        } else if (dateFilter === 'Yesterday') {
          return orderDate.getTime() === yesterday.getTime();
        }
        return true;
      });
    }
    
    return filtered.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }, [orders, activeTab, dateFilter]);

  const handleDelete = (orderId: string) => {
    if (window.confirm("Are you sure you want to permanently delete this order?")) {
      deleteOrder(orderId);
    }
  };

  const handleEditItemChange = (itemId: string, field: keyof OrderItem, value: any) => {
    if (!editingOrder) return;
    
    const newItems = editingOrder.items.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        // Recalculate subtotal instantly
        updatedItem.subtotal = (Number(updatedItem.quantity) || 0) * (Number(updatedItem.unitPrice) || 0);
        return updatedItem;
      }
      return item;
    });

    // Recalculate grand total instantly
    const newTotal = newItems.reduce((acc, curr) => acc + curr.subtotal, 0);

    setEditingOrder({
      ...editingOrder,
      items: newItems,
      totalAmount: newTotal
    });
  };

  const handleAddNewItemToEdit = () => {
    if (!editingOrder) return;
    const newItem: OrderItem = { id: crypto.randomUUID(), productName: '', quantity: 1, unitPrice: 0, subtotal: 0 };
    setEditingOrder({
      ...editingOrder,
      items: [...editingOrder.items, newItem]
    });
  };

  const handleRemoveItemFromEdit = (itemId: string) => {
    if (!editingOrder || editingOrder.items.length <= 1) return;
    
    const newItems = editingOrder.items.filter(i => i.id !== itemId);
    const newTotal = newItems.reduce((acc, curr) => acc + curr.subtotal, 0);
    
    setEditingOrder({
      ...editingOrder,
      items: newItems,
      totalAmount: newTotal
    });
  };

  const saveEditedOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    
    updateOrder(editingOrder.id, {
      shopName: editingOrder.shopName,
      items: editingOrder.items,
      totalAmount: editingOrder.totalAmount
    });
    
    setEditingOrder(null);
  };

  return (
    <div className="max-w-4xl mx-auto min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 relative">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Delivery Management</h1>
        <p className="text-gray-500 text-sm">Track and update order statuses</p>
      </header>

      {/* Controls: Tabs & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex bg-gray-200 p-1 rounded-lg w-full sm:w-auto">
          {(['Pending', 'Delivered'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <select 
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value as any)}
          className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5 outline-none w-full sm:w-auto"
        >
          <option value="All">All Dates</option>
          <option value="Today">Today</option>
          <option value="Yesterday">Yesterday</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
            <p className="text-gray-500">No {activeTab.toLowerCase()} orders found for this date range.</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <h3 className="font-bold text-gray-900">{order.shopName}</h3>
                  <p className="text-xs text-gray-500">ID: {order.id}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Booked: {new Date(order.orderDate).toLocaleDateString()} {new Date(order.orderDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {order.status}
                  </span>
                  
                  {/* Action Icons (Only for Pending) */}
                  {order.status === 'Pending' && (
                    <div className="flex gap-1 border-l pl-3 ml-1 border-gray-300">
                      <button onClick={() => setEditingOrder(order)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded" title="Edit Order">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(order.id)} className="p-1.5 text-red-600 hover:bg-red-100 rounded" title="Delete Order">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500 mb-4 whitespace-nowrap">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th className="px-2 py-2 rounded-l-lg">Item</th>
                        <th className="px-2 py-2 text-center">Qty</th>
                        <th className="px-2 py-2 text-right">Price</th>
                        <th className="px-2 py-2 text-right rounded-r-lg">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map(item => (
                        <tr key={item.id} className="border-b border-gray-50 last:border-0">
                          <td className="px-2 py-2 font-medium text-gray-900">{item.productName}</td>
                          <td className="px-2 py-2 text-center">{item.quantity}</td>
                          <td className="px-2 py-2 text-right">Rs {item.unitPrice}</td>
                          <td className="px-2 py-2 text-right font-medium">Rs {item.subtotal.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center pt-2 border-t border-gray-100 gap-4 mt-4">
                  <div className="text-lg font-bold text-gray-900">
                    Grand Total: <span className="text-brand-600">Rs {order.totalAmount.toLocaleString()}</span>
                  </div>
                  
                  {order.status === 'Pending' && (
                    <button onClick={() => markAsDelivered(order.id)} className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Confirm Delivery
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 animate-fade-in-down">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <header className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">Edit Order: {editingOrder.id}</h2>
              <button onClick={() => setEditingOrder(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </header>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Shop Name</label>
                <input 
                  type="text" 
                  value={editingOrder.shopName}
                  onChange={e => setEditingOrder({...editingOrder, shopName: e.target.value})}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-brand-500 outline-none"
                />
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-gray-700">Order Items</h3>
                  <button type="button" onClick={handleAddNewItemToEdit} className="text-xs text-brand-600 font-medium hover:underline">+ Add Item</button>
                </div>
                
                <div className="space-y-3">
                  {editingOrder.items.map(item => (
                    <div key={item.id} className="flex flex-col sm:flex-row gap-2 sm:items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <input 
                        type="text" 
                        value={item.productName}
                        onChange={e => handleEditItemChange(item.id, 'productName', e.target.value)}
                        className="w-full sm:flex-1 rounded-md border border-gray-300 p-2 text-sm"
                        placeholder="Item Name"
                      />
                      <div className="flex gap-2 items-center w-full sm:w-auto">
                        <input 
                          type="number" 
                          value={item.quantity}
                          onChange={e => handleEditItemChange(item.id, 'quantity', e.target.value)}
                          className="w-20 rounded-md border border-gray-300 p-2 text-sm text-center"
                          placeholder="Qty"
                        />
                        <input 
                          type="number" 
                          value={item.unitPrice}
                          onChange={e => handleEditItemChange(item.id, 'unitPrice', e.target.value)}
                          className="flex-1 sm:w-28 rounded-md border border-gray-300 p-2 text-sm text-right"
                          placeholder="Price"
                        />
                        <button onClick={() => handleRemoveItemFromEdit(item.id)} className="text-red-500 bg-white border border-gray-300 hover:bg-red-100 p-2 rounded disabled:opacity-50" disabled={editingOrder.items.length <= 1}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <footer className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
              <div className="text-lg font-bold">
                Total: <span className="text-brand-600">Rs {editingOrder.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setEditingOrder(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium text-sm transition-colors">
                  Cancel
                </button>
                <button type="button" onClick={saveEditedOrder} className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium text-sm shadow-md transition-colors">
                  Save Changes
                </button>
              </div>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

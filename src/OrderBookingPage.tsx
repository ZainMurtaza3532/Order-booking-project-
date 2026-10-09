import { useState, useMemo } from 'react';
import { useOrders } from './OrderContext';

// Type definitions based on the requirements
type OrderItemInput = {
  id: string;
  productName: string;
  unitPrice: number | '';
  quantity: number | '';
};

export default function OrderBookingPage() {
  const { addOrder } = useOrders();
  const [shopName, setShopName] = useState('');
  const [phone, setPhone] = useState('');
  const [locationNotes, setLocationNotes] = useState('');
  
  const [items, setItems] = useState<OrderItemInput[]>([
    { id: crypto.randomUUID(), productName: '', unitPrice: '', quantity: 1 }
  ]);
  
  const [showToast, setShowToast] = useState(false);

  const addItemRow = () => {
    setItems([
      ...items,
      { id: crypto.randomUUID(), productName: '', unitPrice: '', quantity: 1 }
    ]);
  };

  const removeItemRow = (id: string) => {
    if (items.length === 1) return; // Keep at least one row
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof OrderItemInput, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Calculate Subtotals and Grand Total
  const { totalItems, grandTotal } = useMemo(() => {
    let totalItemsCount = 0;
    let totalAmount = 0;
    
    items.forEach(item => {
      const qty = typeof item.quantity === 'number' ? item.quantity : 0;
      const price = typeof item.unitPrice === 'number' ? item.unitPrice : 0;
      
      if (qty > 0 && price >= 0) {
        totalItemsCount += qty;
        totalAmount += qty * price;
      }
    });
    
    return { totalItems: totalItemsCount, grandTotal: totalAmount };
  }, [items]);

  const handleBookOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shopName.trim()) {
      alert("Please enter a shop name");
      return;
    }
    
    // Add to global state
    addOrder({
      shopName,
      totalAmount: grandTotal,
      items: items
        .filter(i => i.productName.trim() !== '')
        .map(i => ({
          id: i.id,
          productName: i.productName,
          quantity: Number(i.quantity) || 0,
          unitPrice: Number(i.unitPrice) || 0,
          subtotal: (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0)
        }))
    });
    
    // Show Toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    
    // Reset Form for next shop
    setShopName('');
    setPhone('');
    setLocationNotes('');
    setItems([{ id: crypto.randomUUID(), productName: '', unitPrice: '', quantity: 1 }]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-screen pb-32 flex flex-col pt-4 px-2 sm:px-4">
      
      {/* Header */}
      <header className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">New Booking</h1>
          <p className="text-gray-500 text-sm mt-1">Enter shop details and add products to the invoice.</p>
        </div>
        <div className="hidden sm:flex h-12 w-12 bg-brand-50 text-brand-600 rounded-full items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
        </div>
      </header>

      {/* Main Form */}
      <form onSubmit={handleBookOrder} className="flex-1 space-y-6">
        
        {/* Customer Details Section */}
        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Shop Details</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name *</label>
            <input 
              type="text" 
              required
              value={shopName}
              onChange={e => setShopName(e.target.value)}
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              placeholder="e.g. Al-Madina Super Store"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
              <input 
                type="tel" 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                placeholder="03xx-xxxxxxx"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location / Notes</label>
              <input 
                type="text"
                value={locationNotes}
                onChange={e => setLocationNotes(e.target.value)}
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                placeholder="Street 5, Near Mosque..."
              />
            </div>
          </div>
        </section>

        {/* Order Items Section */}
        <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Order Items</h2>
            <button 
              type="button" 
              onClick={addItemRow}
              className="text-brand-600 font-medium text-sm hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              + Add Item
            </button>
          </div>
          
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="relative bg-gray-50 p-3 rounded-lg border border-gray-100 pb-4">
                
                {/* Remove button (only if > 1 item) */}
                {items.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeItemRow(item.id)}
                    className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-sm hover:bg-red-200 transition-colors"
                  >
                    ×
                  </button>
                )}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                  <div className="sm:col-span-5">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Item Name</label>
                    <input 
                      type="text" 
                      required
                      value={item.productName}
                      onChange={e => updateItem(item.id, 'productName', e.target.value)}
                      className="w-full rounded-md border-gray-300 border p-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white"
                      placeholder="e.g. Lays French Cheese"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 sm:col-span-7">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Unit Price (Rs)</label>
                      <input 
                        type="number" 
                        min="0"
                        required
                        value={item.unitPrice}
                        onChange={e => updateItem(item.id, 'unitPrice', e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full rounded-md border-gray-300 border p-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
                      <div className="flex items-center rounded-md border border-gray-300 bg-white overflow-hidden">
                        <button 
                          type="button"
                          onClick={() => updateItem(item.id, 'quantity', Math.max(1, (Number(item.quantity) || 1) - 1))}
                          className="px-2 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200"
                        >
                          -
                        </button>
                        <input 
                          type="number" 
                          min="1"
                          required
                          value={item.quantity}
                          onChange={e => updateItem(item.id, 'quantity', e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full text-center p-2 text-sm outline-none bg-transparent border-x border-gray-300"
                        />
                        <button 
                          type="button"
                          onClick={() => updateItem(item.id, 'quantity', (Number(item.quantity) || 0) + 1)}
                          className="px-2 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Real-time Subtotal */}
                <div className="mt-3 text-right text-sm font-medium text-gray-700">
                  Subtotal: <span className="text-brand-600 font-bold">Rs {(Number(item.unitPrice) * Number(item.quantity) || 0).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </form>

      {/* Live Summary Card (Pinned to Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-20 transition-all">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mb-1">Items: {totalItems}</p>
            <p className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Total: <span className="text-brand-600">Rs {grandTotal.toLocaleString()}</span>
            </p>
          </div>
          <button 
            onClick={handleBookOrder}
            className="bg-gray-900 hover:bg-black text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
          >
            <span className="hidden sm:inline">Confirm & Book</span>
            <span className="sm:hidden">Book</span>
            <svg className="w-5 h-5 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-2 z-50 animate-fade-in-down">
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          <span className="font-medium text-sm">Order Booked Successfully!</span>
        </div>
      )}
      
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translate(-50%, -10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

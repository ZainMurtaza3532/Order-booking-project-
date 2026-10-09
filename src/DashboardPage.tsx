import React, { useMemo, useState } from 'react';
import { useOrders } from './OrderContext';

type LedgerDay = {
  date: string;
  bookedCount: number;
  deliveredCount: number;
  dailyDeliveredRevenue: number;
  deliveredOrdersList: {
    id: string;
    shopName: string;
    totalAmount: number;
    bookedOn: string;
    deliveredOn: string;
  }[];
};

export default function DashboardPage() {
  const { orders } = useOrders();
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  // Month Selection State (Defaults to Current Month)
  const currentMonthDate = new Date();
  currentMonthDate.setDate(1);
  currentMonthDate.setHours(0, 0, 0, 0);
  
  const [selectedMonthStr, setSelectedMonthStr] = useState<string>(currentMonthDate.toISOString());

  const activeMonth = new Date(selectedMonthStr);
  const nextMonth = new Date(activeMonth);
  nextMonth.setMonth(activeMonth.getMonth() + 1);

  // Generate options for the dropdown (Current Month + Past 3 Months)
  const monthOptions = useMemo(() => {
    const options = [];
    for (let i = 0; i < 4; i++) {
      const d = new Date();
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      d.setMonth(d.getMonth() - i);
      options.push({
        label: d.toLocaleString('default', { month: 'long', year: 'numeric' }) + (i === 0 ? ' (Current)' : ''),
        value: d.toISOString()
      });
    }
    return options;
  }, []);

  // --- 1. Top KPI Summary Cards (Monthly Analytics) ---
  const { currentRevenue, deliveredCount, pendingCount } = useMemo(() => {
    let revenue = 0;
    let delivered = 0;
    let pending = 0;

    orders.forEach(order => {
      // Pending Count: Across the entire system
      if (order.status === 'Pending') {
        pending++;
      }
      
      // Revenue & Delivered Count: strictly ACTIVE month and DELIVERED status
      if (order.status === 'Delivered' && order.deliveryDate) {
        const devDate = new Date(order.deliveryDate);
        if (devDate >= activeMonth && devDate < nextMonth) {
          revenue += order.totalAmount;
          delivered++;
        }
      }
    });

    return { currentRevenue: revenue, deliveredCount: delivered, pendingCount: pending };
  }, [orders, activeMonth, nextMonth]);

  // --- 2. Daily Ledger Generation ---
  const dailyLedger = useMemo(() => {
    const ledgerMap = new Map<string, LedgerDay>();

    orders.forEach(order => {
      const bDate = new Date(order.orderDate);
      
      // Process Bookings for Active Month
      if (bDate >= activeMonth && bDate < nextMonth) {
        const bDateStr = bDate.toISOString().split('T')[0];
        if (!ledgerMap.has(bDateStr)) {
          ledgerMap.set(bDateStr, { date: bDateStr, bookedCount: 0, deliveredCount: 0, dailyDeliveredRevenue: 0, deliveredOrdersList: [] });
        }
        ledgerMap.get(bDateStr)!.bookedCount++;
      }

      // Process Deliveries for Active Month
      if (order.status === 'Delivered' && order.deliveryDate) {
        const dDate = new Date(order.deliveryDate);
        if (dDate >= activeMonth && dDate < nextMonth) {
          const dDateStr = dDate.toISOString().split('T')[0];
          if (!ledgerMap.has(dDateStr)) {
            ledgerMap.set(dDateStr, { date: dDateStr, bookedCount: 0, deliveredCount: 0, dailyDeliveredRevenue: 0, deliveredOrdersList: [] });
          }
          
          const dayData = ledgerMap.get(dDateStr)!;
          dayData.deliveredCount++;
          dayData.dailyDeliveredRevenue += order.totalAmount;
          
          dayData.deliveredOrdersList.push({
            id: order.id,
            shopName: order.shopName,
            totalAmount: order.totalAmount,
            bookedOn: bDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
            deliveredOn: dDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
          });
        }
      }
    });

    return Array.from(ledgerMap.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [orders, activeMonth, nextMonth]);

  return (
    <div className="w-full max-w-6xl mx-auto min-h-screen p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* Header with Month Selector */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Financial Analytics</h1>
          <p className="text-gray-500 font-medium mt-1">
            Track your earnings and deliveries
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <label htmlFor="month-select" className="text-sm font-semibold text-gray-600">Select Month:</label>
          <select 
            id="month-select"
            value={selectedMonthStr}
            onChange={(e) => setSelectedMonthStr(e.target.value)}
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5 font-medium shadow-sm"
          >
            {monthOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Revenue Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Revenue ({activeMonth.toLocaleString('default', { month: 'short' })})</p>
          <p className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">Rs {currentRevenue.toLocaleString()}</p>
          <p className="text-xs font-medium text-green-600 mt-2 bg-green-50 self-start px-2 py-1 rounded-md">
            (Only Completed Deliveries)
          </p>
        </div>
        
        {/* Delivered Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Delivered ({activeMonth.toLocaleString('default', { month: 'short' })})</p>
          <p className="text-3xl sm:text-4xl font-black text-brand-600 mt-2">{deliveredCount}</p>
          <p className="text-xs font-medium text-gray-400 mt-2">Successfully closed</p>
        </div>

        {/* Pending Orders Alert */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-red-100 flex flex-col justify-center">
          <p className="text-sm font-semibold text-red-500 uppercase tracking-wide flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            Orders Awaiting Delivery
          </p>
          <p className="text-3xl sm:text-4xl font-black text-red-600 mt-2">{pendingCount}</p>
          <p className="text-xs font-medium text-red-400 mt-2">System-wide active backlog</p>
        </div>
      </div>

      {/* Daily Ledger Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">{activeMonth.toLocaleString('default', { month: 'long', year: 'numeric' })} Ledger</h2>
        </div>
        
        {dailyLedger.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No active data for this month.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 text-center font-bold">Orders Booked</th>
                  <th className="px-6 py-4 text-center font-bold text-brand-600">Orders Delivered</th>
                  <th className="px-6 py-4 text-right font-bold text-green-600">Daily Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dailyLedger.map((day) => (
                  <React.Fragment key={day.date}>
                    <tr 
                      className={`hover:bg-gray-50 transition-colors cursor-pointer ${expandedDate === day.date ? 'bg-gray-50' : ''}`}
                      onClick={() => setExpandedDate(expandedDate === day.date ? null : day.date)}
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {new Date(day.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-gray-600">{day.bookedCount}</td>
                      <td className="px-6 py-4 text-center font-bold text-brand-600">{day.deliveredCount}</td>
                      <td className="px-6 py-4 text-right font-black text-gray-900">
                        Rs {day.dailyDeliveredRevenue.toLocaleString()}
                      </td>
                    </tr>
                    
                    {/* Expandable Row for Delivery Breakdown */}
                    {expandedDate === day.date && day.deliveredOrdersList.length > 0 && (
                      <tr>
                        <td colSpan={4} className="p-0 border-0 bg-gray-50">
                          <div className="px-6 py-4 inset-shadow-sm space-y-2">
                            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Delivery Breakdown for this day:</p>
                            {day.deliveredOrdersList.map(item => (
                              <div key={item.id} className="bg-white p-3 rounded-lg border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 shadow-sm">
                                <div>
                                  <p className="font-bold text-gray-900">{item.shopName}</p>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    Delivered today, originally booked on: <span className="font-medium text-gray-700">{item.bookedOn}</span>
                                  </p>
                                </div>
                                <div className="text-right font-bold text-green-600 bg-green-50 px-3 py-1 rounded-md">
                                  + Rs {item.totalAmount.toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

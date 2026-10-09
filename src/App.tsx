import { useState } from 'react';
import OrderBookingPage from './OrderBookingPage';
import OrdersManagementPage from './OrdersManagementPage';
import DashboardPage from './DashboardPage';
import { OrderProvider } from './OrderContext';
import { AuthProvider, useAuth } from './AuthContext';
import LoginPage from './LoginPage';

function ProtectedAppContent() {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<'booking' | 'management' | 'dashboard'>('booking');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col font-sans">
      {/* Global Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo/Brand (Optional left side) */}
            <div className="flex-shrink-0 flex items-center hidden md:flex mr-8">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-2 shadow-sm">B</div>
              <span className="font-bold text-gray-900 tracking-tight text-lg">Bismillah<span className="text-brand-600">Traders</span></span>
            </div>

            {/* Desktop & Tablet Navigation */}
            <div className="flex flex-1 justify-start gap-2 overflow-x-auto no-scrollbar py-2">
              <button 
                onClick={() => setCurrentPage('booking')}
                className={`whitespace-nowrap px-4 py-2 rounded-xl font-medium transition-all text-sm ${currentPage === 'booking' ? 'bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-200' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                New Booking
              </button>
              <button 
                onClick={() => setCurrentPage('management')}
                className={`whitespace-nowrap px-4 py-2 rounded-xl font-medium transition-all text-sm ${currentPage === 'management' ? 'bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-200' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                Deliveries
              </button>
              
              {/* RBAC: Only Admins can view the Dashboard */}
              {user?.role === 'Admin' && (
                <button 
                  onClick={() => setCurrentPage('dashboard')}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl font-medium transition-all text-sm ${currentPage === 'dashboard' ? 'bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-200' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  Dashboard
                </button>
              )}
            </div>
            
            {/* User Profile & Logout */}
            <div className="flex items-center gap-4 pl-4 border-l border-gray-200 ml-4">
              <div className="text-xs text-right hidden sm:block">
                <p className="text-gray-900 font-bold">{user?.name}</p>
                <p className="text-brand-600 font-medium">{user?.role}</p>
              </div>
              <button 
                onClick={logout}
                className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-full transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto">
        <div className="animate-fade-in-up">
          {currentPage === 'booking' && <OrderBookingPage />}
          {currentPage === 'management' && <OrdersManagementPage />}
          {currentPage === 'dashboard' && user?.role === 'Admin' && <DashboardPage />}
        </div>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

function AuthGuard() {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  
  return <ProtectedAppContent />;
}

export default function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <AuthGuard />
      </OrderProvider>
    </AuthProvider>
  );
}

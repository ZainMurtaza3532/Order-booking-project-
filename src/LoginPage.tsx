import { useState } from 'react';
import { useAuth } from './AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-4xl shadow-lg ring-4 ring-brand-100">B</div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Bismillah Traders
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 font-medium">
          Secure Order Management Gateway
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100 relative overflow-hidden">
          {/* Security Banner */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-400 to-brand-600"></div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Email Address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-brand-500 focus:border-brand-500 sm:text-sm font-medium transition-colors bg-gray-50 focus:bg-white" 
                  placeholder="admin@bismillah.com" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Strong Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-brand-500 focus:border-brand-500 sm:text-sm font-medium transition-colors bg-gray-50 focus:bg-white tracking-widest" 
                  placeholder="••••••••••••" 
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-4 border border-red-100 animate-fade-in-up">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-bold text-red-800">Authentication Failed</h3>
                    <div className="mt-1 text-xs text-red-700 font-medium">
                      Invalid email or password provided. Access denied.
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button 
                type="submit" 
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
              >
                Secure Login
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500 font-medium">
            <p>End-to-End Encrypted Login</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import AgentDashboard from './components/AgentDashboard';
import CitizenDashboard from './components/CitizenDashboard';
import './index.css';

function App() {
  // Default to authenticated agent for instant zero-friction portal access
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('auth_token');
    return saved !== 'logged_out';
  });
  const [role, setRole] = useState(() => {
    return localStorage.getItem('user_role') || 'agent';
  });
  const [mobile, setMobile] = useState('9876543210');
  const [otp, setOtp] = useState('1234');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check URL parameters for explicit role or reset
    const params = new URLSearchParams(window.location.search);
    if (params.get('role') === 'citizen') {
      setRole('citizen');
      setIsAuthenticated(true);
    } else if (params.get('role') === 'agent' || !localStorage.getItem('user_role')) {
      setRole('agent');
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Agent Authentication Logic (Hardcoded specific number as requested)
    if (mobile === '9876543210' && otp === '1234') {
      localStorage.setItem('auth_token', 'agent-demo-token');
      localStorage.setItem('user_role', 'agent');
      setIsAuthenticated(true);
      setRole('agent');
      setError('');
    } 
    // Citizen Authentication Logic (Any other number with demo OTP 1234)
    else if (mobile.length === 10 && otp === '1234') {
      localStorage.setItem('auth_token', 'citizen-demo-token');
      localStorage.setItem('user_role', 'citizen');
      setIsAuthenticated(true);
      setRole('citizen');
      setError('');
    } else {
      setError('Invalid Mobile Number or OTP. (Use 1234 for OTP)');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    setIsAuthenticated(false);
    setRole(null);
    setMobile('');
    setOtp('');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-10 rounded-[16px] w-[450px] max-w-full shadow-2xl border border-gray-200 relative overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#3B1F6E] to-[#FF7A00]"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                 <div className="w-16 h-16 rounded-full bg-[#3B1F6E]/10 flex items-center justify-center border-2 border-[#3B1F6E]/20">
                    <svg className="w-8 h-8 text-[#3B1F6E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                 </div>
              </div>
              <h1 className="text-3xl font-extrabold text-[#3B1F6E] mb-1">
                Swaraj Saathi
              </h1>
              <p className="text-gray-500 font-semibold tracking-wide uppercase text-sm">e-Seva Kendra Portal</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Registered Mobile Number</label>
                <input
                  type="text"
                  placeholder="Enter 10-digit mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-[12px] bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent transition-all font-medium"
                  maxLength={10}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">OTP / Access Code</label>
                <input
                  type="password"
                  placeholder="Enter OTP (Use 1234)"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-[12px] bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent transition-all font-medium"
                />
              </div>
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md text-sm font-medium">
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="w-full py-3.5 mt-2 bg-[#3B1F6E] hover:bg-[#2A164E] text-white rounded-[12px] font-bold text-lg transition-all shadow-md hover:shadow-lg"
              >
                Login Securely
              </button>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem('auth_token', 'agent-demo-token');
                    localStorage.setItem('user_role', 'agent');
                    setIsAuthenticated(true);
                    setRole('agent');
                  }}
                  className="py-2.5 px-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-[10px] font-bold text-xs shadow transition-all flex items-center justify-center gap-1.5"
                >
                  ⚡ Agent Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem('auth_token', 'citizen-demo-token');
                    localStorage.setItem('user_role', 'citizen');
                    setIsAuthenticated(true);
                    setRole('citizen');
                  }}
                  className="py-2.5 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-[10px] font-bold text-xs shadow transition-all flex items-center justify-center gap-1.5"
                >
                  👤 Citizen Portal
                </button>
              </div>
            </form>

            <div className="mt-8 p-4 bg-[#FF7A00]/5 rounded-[12px] border border-[#FF7A00]/20 text-sm text-gray-700">
              <p className="font-bold text-[#FF7A00] mb-2 uppercase tracking-wide text-xs">Demo Credentials</p>
              <ul className="space-y-2">
                <li className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="font-semibold text-gray-600">Kendra Operator</span>
                  <span className="font-mono bg-white px-2 py-1 rounded border border-gray-200 font-bold">9876543210</span>
                </li>
                <li className="flex justify-between items-center pt-1">
                  <span className="font-semibold text-gray-600">Citizen Access</span>
                  <span className="font-mono bg-white px-2 py-1 rounded border border-gray-200 font-bold">Any Number</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Routing to the correct platform based on role
  if (role === 'agent') {
    return <AgentDashboard handleLogout={handleLogout} />;
  }
  
  return <CitizenDashboard handleLogout={handleLogout} />;
}

export default App;

import React from 'react';
import { LogOut, Home, FileText, Bell, User } from 'lucide-react';

export default function CitizenDashboard({ handleLogout }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            S
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Swaraj Saathi</h1>
            <p className="text-xs text-slate-500">Citizen Portal (General Theme)</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6">
        
        <div className="bg-blue-600 rounded-2xl p-8 text-white mb-8 shadow-lg shadow-blue-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Welcome to Swaraj Saathi!</h2>
            <p className="text-blue-100 mb-6 max-w-lg">Track your government scheme applications, explore new schemes you are eligible for, and securely store your documents in one place.</p>
            <button className="bg-white text-blue-600 px-6 py-2.5 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-sm">
              Find Schemes for Me
            </button>
          </div>
          {/* Decorative shapes */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute right-10 bottom-0 w-32 h-32 bg-blue-400 opacity-20 rounded-full translate-y-1/3"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 mb-1">My Applications</h3>
              <p className="text-sm text-slate-500">Track status of Ladki Bahin Yojana and 2 others.</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <User size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 mb-1">My Digital Vault</h3>
              <p className="text-sm text-slate-500">Securely stored Aadhaar, PAN, and Income Certificate.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <Home size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 mb-1">Find E-Seva Kendra</h3>
              <p className="text-sm text-slate-500">Locate the nearest agent to help you apply for schemes.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Recent Updates</h3>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50">
              <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full shrink-0"></div>
              <div>
                <p className="font-medium text-slate-800">Your Ladki Bahin Scheme application has been submitted to Govt.</p>
                <p className="text-sm text-slate-500 mt-1">Today at 10:30 AM • Processed by Shree Ganesh Cyber Cafe</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
              <div className="w-2 h-2 mt-2 bg-green-500 rounded-full shrink-0"></div>
              <div>
                <p className="font-medium text-slate-800">New Scheme Alert: PM-Kisan installment date announced.</p>
                <p className="text-sm text-slate-500 mt-1">Yesterday at 4:15 PM</p>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

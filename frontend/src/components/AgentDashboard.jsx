import React, { useState, useEffect, useRef } from 'react';

import { 
  CheckCircle, Plus, Search, ChevronDown, CheckCircle2, AlertCircle, FileText,
  Clock, CreditCard, LayoutDashboard, Users, User, ArrowUpRight, FileSpreadsheet, Bot, LogOut,
  MessageCircle, ScanText, Wrench, Globe, Zap
} from 'lucide-react';
import AgentAIAssistant from './AgentAIAssistant';
import { AadhaarOCR, PhotoResizer } from './DocumentTools';
import WhatsAppBannerGenerator from './WhatsAppBannerGenerator';
import RevenueWallet from './RevenueWallet';
import GovtPortalBrowser from './GovtPortalBrowser';


export default function AgentDashboard({ handleLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // -- STATE MANAGEMENT FOR INTERACTIVITY --
  const [revenue, setRevenue] = useState(4250.00); // From screenshot
  const [totalCommission, setTotalCommission] = useState(12450); // From screenshot
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  // bannerRef and banner state now live inside WhatsAppBannerGenerator
  
  const [kanbanData, setKanbanData] = useState({
    pending: [
      { id: 'APP1001', name: 'Ramesh Kumar', scheme: 'PM Awas Yojana', date: '12 Aug 2026' },
      { id: 'APP1002', name: 'Sunita Devi', scheme: 'PM Kisan', date: '11 Aug 2026' }
    ],
    submitted: [
      { id: 'APP1003', name: 'Priya Jadhav', scheme: 'Ladki Bahin', date: '10 Aug 2026' }
    ],
    approved: [
      { id: 'APP1004', name: 'Amit Patil', scheme: 'Crop Insurance', date: '08 Aug 2026' }
    ]
  });

  // Banner state now managed inside WhatsAppBannerGenerator component

  // Client Data for Table
  const [clients, setClients] = useState([
    { id: 1, name: 'Ramesh Kumar', phone: '9876543210', aadhar: 'XXXX-XXXX-1234', schemes: 2, status: 'Active', applicationStatus: 'Pending Docs' },
    { id: 2, name: 'Sunita Devi', phone: '9123456789', aadhar: 'XXXX-XXXX-5678', schemes: 1, status: 'Active', applicationStatus: 'Submitted' },
    { id: 3, name: 'Amit Singh', phone: '9988776655', aadhar: 'XXXX-XXXX-9012', schemes: 3, status: 'Active', applicationStatus: 'Approved' },
  ]);
  
  const [newCitizen, setNewCitizen] = useState({ name: '', phone: '', aadhar: '' });

  // Dummy Ledger Data
  const ledgerData = [
    { id: 1, txn: 'PM-KISAN Application Fee', txnId: 'TXN8912', date: 'Today, 10:45 AM', citizen: 'Ramesh Kumar', amount: -50 },
    { id: 2, txn: 'Wallet Recharge - UPI', txnId: 'TXN8911', date: 'Today, 09:00 AM', citizen: '-', amount: 1000 },
    { id: 3, txn: 'Ladki Bahin Commission', txnId: 'TXN8910', date: 'Yesterday', citizen: 'Sita Devi', amount: 150 },
    { id: 4, txn: 'CMEGP Application Fee', txnId: 'TXN8989', date: 'Yesterday', citizen: 'Amit Singh', amount: -200 },
  ];

  // DRAG AND DROP HANDLERS for Kanban
  const handleDragStart = (e, item, sourceCol) => {
    e.dataTransfer.setData('item', JSON.stringify(item));
    e.dataTransfer.setData('sourceCol', sourceCol);
  };

  const handleDrop = (e, targetCol) => {
    e.preventDefault();
    const itemStr = e.dataTransfer.getData('item');
    if (!itemStr) return;
    const item = JSON.parse(itemStr);
    const sourceCol = e.dataTransfer.getData('sourceCol');
    
    if (sourceCol === targetCol) return;

    setKanbanData(prev => {
      const newData = { ...prev };
      newData[sourceCol] = newData[sourceCol].filter(i => i.id !== item.id);
      newData[targetCol] = [...newData[targetCol], item];
      return newData;
    });
    
    if (targetCol === 'approved' && sourceCol !== 'approved') {
      // Simulate revenue addition
      setTotalCommission(prev => prev + 150);
    }
  };

  const handleRegisterCitizen = () => {
    if (!newCitizen.name) {
      alert("Please enter a name.");
      return;
    }
    const newId = clients.length + 1;
    setClients([{ 
      id: newId, 
      name: newCitizen.name, 
      phone: newCitizen.phone || '-', 
      aadhar: newCitizen.aadhar ? 'XXXX-XXXX-' + newCitizen.aadhar.slice(-4) : '-', 
      schemes: 0, 
      status: 'Active', 
      applicationStatus: 'No Applications' 
    }, ...clients]);
    
    alert("Citizen registered successfully! A new profile vault has been created.");
    setIsRegisterModalOpen(false);
    setNewCitizen({ name: '', phone: '', aadhar: '' });
  };

  // handleDownloadBanner is now inside WhatsAppBannerGenerator

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            {/* Sponsored Advertisement Portal */}
            <div className="w-full bg-gradient-to-r from-slate-900 to-[#0F172A] rounded-2xl p-6 mb-6 shadow-lg flex items-center justify-between relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.01]">
              <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-[#FF1A4A]/20 to-transparent"></div>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#FF1A4A] rounded-full blur-[80px] opacity-30"></div>
              
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-14 h-14 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 flex items-center justify-center text-yellow-400 shrink-0">
                  <CreditCard size={28} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-yellow-400 text-yellow-900 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-sm">Sponsored</span>
                    <h3 className="text-white font-bold text-lg leading-none tracking-tight">Kisan Premium Crop Insurance</h3>
                  </div>
                  <p className="text-slate-300 text-sm font-medium">Protect your farmers against unseasonal rain. Instant approval.</p>
                </div>
              </div>
              
              <div className="relative z-10 flex flex-col items-end">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Agent Commission</p>
                <div className="bg-[#FF1A4A] text-white px-5 py-2.5 rounded-xl font-black shadow-md flex items-center gap-2 group-hover:bg-[#E80B3B] transition-colors">
                  Earn ₹350 / Policy <ArrowUpRight size={16} />
                </div>
              </div>
            </div>

            {/* Dashboard Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {/* Stat Cards */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                    <Users size={18} />
                  </div>
                  <span className="text-slate-500 font-medium text-sm">Total Clients</span>
                </div>
                <div className="text-3xl font-bold text-slate-800 ml-11">{clients.length}</div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                    <FileText size={18} />
                  </div>
                  <span className="text-slate-500 font-medium text-sm">Pending</span>
                </div>
                <div className="text-3xl font-bold text-slate-800 ml-11">{kanbanData.pending.length}</div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                    <CheckCircle2 size={18} />
                  </div>
                  <span className="text-slate-500 font-medium text-sm">Approved</span>
                </div>
                <div className="text-3xl font-bold text-slate-800 ml-11">{kanbanData.approved.length}</div>
              </div>
              <div className="bg-[#F0FDF4] rounded-2xl p-6 border border-emerald-100 shadow-sm flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <span className="font-bold">₹</span>
                  </div>
                  <span className="text-slate-600 font-medium text-sm">Est. Revenue</span>
                </div>
                <div className="text-3xl font-bold text-emerald-700 ml-11">₹{(kanbanData.pending.length + kanbanData.submitted.length) * 150}</div>
              </div>
            </div>

            {/* Quick Overview Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-1">Quick Overview</h3>
              <p className="text-sm text-slate-500 mb-6">Recent clients added to your Kendra.</p>
              
              <div className="w-full">
                <div className="flex text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-3">
                  <div className="flex-[2]">CITIZEN NAME</div>
                  <div className="flex-[2]">PHONE</div>
                  <div className="flex-[1] text-right">STATUS</div>
                </div>
                
                {clients.map(client => (
                  <div key={client.id} className="flex items-center text-sm text-slate-800 py-3 border-b border-slate-50 mb-4">
                    <div className="flex-[2] font-semibold">{client.name}</div>
                    <div className="flex-[2]">{client.phone}</div>
                    <div className="flex-[1] text-right">
                      <span className="text-orange-500 font-medium">{client.status}</span>
                    </div>
                  </div>
                ))}

                <button className="w-full mt-2 py-3 bg-[#FFF4ED] text-[#F97316] rounded-xl font-bold hover:bg-orange-100 transition-colors">
                  View All Clients
                </button>
              </div>
            </div>
          </>
        );

      case 'clients':
        return (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-[calc(100vh-140px)]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-slate-800">Citizen CRM</h3>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search name, phone, Aadhar..." 
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-[300px] focus:outline-none focus:border-slate-300"
                />
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-8">Click the Document icon to open the Citizen Vault.</p>
            
            <div className="w-full">
              <div className="flex text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-4 bg-slate-50 p-4 rounded-lg">
                <div className="flex-[2]">CITIZEN NAME</div>
                <div className="flex-[1.5]">PHONE</div>
                <div className="flex-[1.5]">AADHAR</div>
                <div className="flex-[1] text-center">SCHEMES</div>
                <div className="flex-[2] text-center">STATUS</div>
                <div className="flex-[1.5] text-right">VAULT</div>
              </div>
              
              {clients.map(client => (
                <div key={client.id} className="flex items-center text-sm text-slate-800 p-4 border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <div className="flex-[2] font-bold text-slate-900">{client.name}</div>
                  <div className="flex-[1.5]">{client.phone}</div>
                  <div className="flex-[1.5]">{client.aadhar}</div>
                  <div className="flex-[1] flex justify-center">
                    <span className="bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-full text-xs">
                      {client.schemes}
                    </span>
                  </div>
                  <div className="flex-[2] flex justify-center">
                    <span className="bg-slate-100 text-slate-600 font-medium px-4 py-1.5 rounded-full text-xs border border-slate-200">
                      {client.applicationStatus}
                    </span>
                  </div>
                  <div className="flex-[1.5] flex justify-end">
                    <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-xs font-semibold">
                      <FileSpreadsheet size={14} /> Open Vault
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'applications':
        return (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-[calc(100vh-140px)] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">Application Pipeline Tracker</h3>
              <span className="bg-slate-100 px-4 py-1.5 rounded-full text-xs text-slate-500 font-medium">Drag and Drop to update status</span>
            </div>
            
            <div className="flex gap-6 flex-1 overflow-x-auto overflow-y-hidden pb-4">
              {/* Column: Pending Documents */}
              <div 
                className="flex-1 min-w-[320px] bg-slate-50 rounded-xl p-4 flex flex-col border border-slate-100"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'pending')}
              >
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-2 text-orange-500 font-bold text-sm">
                    <AlertCircle size={16} /> Pending Documents
                  </div>
                  <span className="text-slate-400 font-bold text-sm">{kanbanData.pending.length}</span>
                </div>
                {kanbanData.pending.length === 0 ? (
                  <div className="border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center h-24 mt-2">
                    <p className="text-slate-400 text-sm">Drop applications here</p>
                  </div>
                ) : (
                  <div className="space-y-3 overflow-y-auto flex-1">
                    {kanbanData.pending.map(item => (
                      <KanbanCard key={item.id} item={item} colKey="pending" onDragStart={handleDragStart} />
                    ))}
                  </div>
                )}
              </div>

              {/* Column: Submitted to Govt */}
              <div 
                className="flex-1 min-w-[320px] bg-slate-50 rounded-xl p-4 flex flex-col border border-slate-100"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'submitted')}
              >
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-2 text-blue-500 font-bold text-sm">
                    <Clock size={16} /> Submitted to Govt
                  </div>
                  <span className="text-slate-400 font-bold text-sm">{kanbanData.submitted.length}</span>
                </div>
                {kanbanData.submitted.length === 0 ? (
                  <div className="border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center h-24 mt-2">
                    <p className="text-slate-400 text-sm">Drop applications here</p>
                  </div>
                ) : (
                  <div className="space-y-3 overflow-y-auto flex-1">
                    {kanbanData.submitted.map(item => (
                      <KanbanCard key={item.id} item={item} colKey="submitted" onDragStart={handleDragStart} />
                    ))}
                  </div>
                )}
              </div>

              {/* Column: Approved / Disbursed */}
              <div 
                className="flex-1 min-w-[320px] bg-slate-50 rounded-xl p-4 flex flex-col border border-slate-100"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'approved')}
              >
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                    <CheckCircle2 size={16} /> Approved / Disbursed
                  </div>
                  <span className="text-slate-400 font-bold text-sm">{kanbanData.approved.length}</span>
                </div>
                {kanbanData.approved.length === 0 ? (
                  <div className="border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center h-24 mt-2">
                    <p className="text-slate-400 text-sm">Drop applications here</p>
                  </div>
                ) : (
                  <div className="space-y-3 overflow-y-auto flex-1">
                    {kanbanData.approved.map(item => (
                      <KanbanCard key={item.id} item={item} colKey="approved" onDragStart={handleDragStart} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'revenue':
        return <RevenueWallet />;

      case 'portals':
        return <GovtPortalBrowser />;

      case 'ai':
        return <AgentAIAssistant />;


      case 'tools':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800">E-Seva Utility Toolkit</h3>
            <p className="text-sm text-slate-500 mb-6">Automate data entry and create marketing materials to grow your Kendra.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Document Utilities */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <ScanText size={18} className="text-[#FF7A00]" /> Document Utilities
                </h4>
                <div className="space-y-4">
                  <AadhaarOCR />
                  <PhotoResizer />
                </div>
              </div>

              {/* Marketing Banner Generator – Premium */}
              <WhatsAppBannerGenerator agentName="Isevak Agent Kendra" agentPhone="9876543210" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'portals': return 'Govt Portals & Fast Form-Filler';
      case 'clients': return 'My Clients';
      case 'applications': return 'Applications';
      case 'revenue': return 'Revenue & Wallet';
      case 'ai': return 'AI Assistant';
      case 'tools': return 'E-Seva Tools & Marketing';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex font-sans overflow-hidden">
      {/* ---------------- SIDEBAR ---------------- */}
      <aside className="w-[260px] bg-white border-r border-slate-100 flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-8 pb-10 flex flex-col items-start border-b border-slate-50">
          <div className="flex items-center gap-1">
            <h1 className="text-[22px] font-black tracking-tight text-[#0F172A]">
              Swaraj <span className="text-[#FF7A00]">Saathi</span>
            </h1>
          </div>
          <p className="text-[#9CA3AF] text-sm font-medium mt-1 tracking-wide uppercase">E-SEVA KENDRA</p>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          <SidebarItem icon={<CheckCircle size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={<Globe size={20} />} label="Govt Portals & Browser" active={activeTab === 'portals'} onClick={() => setActiveTab('portals')} />
          <SidebarItem icon={<Users size={20} />} label="My Clients" active={activeTab === 'clients'} onClick={() => setActiveTab('clients')} />
          <SidebarItem icon={<FileText size={20} />} label="Applications" active={activeTab === 'applications'} onClick={() => setActiveTab('applications')} />
          <SidebarItem icon={<ArrowUpRight size={20} />} label="Revenue & Wallet" active={activeTab === 'revenue'} onClick={() => setActiveTab('revenue')} />
          <SidebarItem icon={<Bot size={20} />} label="AI Assistant" active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} />
          <SidebarItem icon={<Wrench size={20} />} label="E-Seva Tools" active={activeTab === 'tools'} onClick={() => setActiveTab('tools')} />
        </nav>

        {/* Agent Profile & Settings */}
        <div className="p-6">
          <div className="bg-[#F8FAFC] border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center text-center relative group overflow-hidden">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={handleLogout} className="p-1.5 bg-white rounded-md text-red-500 shadow-sm hover:bg-red-50" title="Logout">
                <LogOut size={14} />
              </button>
            </div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#FF7A00] font-bold text-lg shadow-sm mb-3">
              IS
            </div>
            <p className="font-bold text-[#0F172A]">Isevak Agent</p>
            <p className="text-xs text-[#9CA3AF] font-medium mt-0.5">Kendra ID: #4492</p>
          </div>
        </div>
      </aside>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* Top Header */}
        <header className="px-10 py-8 flex items-center justify-between bg-[#F9FAFB] sticky top-0 z-10">
          <div>
            <h1 className="text-[28px] font-black text-[#0F172A] tracking-tight">{getPageTitle()}</h1>
            <p className="text-[#64748B] text-sm mt-1">Manage your E-Seva operations efficiently</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('portals')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                activeTab === 'portals' 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20' 
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
              }`}
              title="Open Government Portals & Fast-Fill Browser"
            >
              <Globe size={16} className={activeTab === 'portals' ? 'text-white' : 'text-blue-600'} />
              <span>Govt Portals Browser</span>
            </button>

            <button 
              onClick={() => setActiveTab('revenue')}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                activeTab === 'revenue' 
                  ? 'bg-[#FF7A00] text-white border-[#FF7A00] shadow-md shadow-orange-500/20' 
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
              }`}
              title="Open Revenue & Wallet"
            >
              <CreditCard size={16} className={activeTab === 'revenue' ? 'text-white' : 'text-[#FF7A00]'} />
              <span>Prepaid Wallet: <strong className={activeTab === 'revenue' ? 'text-white' : 'text-slate-900'}>₹4,250.00</strong></span>
            </button>

            <button 
              onClick={() => setIsRegisterModalOpen(true)}
              className="bg-[#0F172A] hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              <Plus size={16} /> Register New Citizen
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="px-10 pb-10 flex-1">
          {renderContent()}
        </div>
      </main>

      {/* ---------------- MODALS (INTERACTIVITY) ---------------- */}

      {/* Register New Citizen Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-[500px] p-8 rounded-2xl relative shadow-2xl animate-in fade-in zoom-in duration-200 border border-slate-100">
            <button onClick={() => setIsRegisterModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">✕</button>
            <h3 className="text-xl font-bold text-slate-800 mb-6">Register New Citizen</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Citizen Full Name</label>
                <input 
                  type="text" 
                  value={newCitizen.name}
                  onChange={(e) => setNewCitizen({...newCitizen, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 mt-1.5 text-slate-800 focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] focus:outline-none transition-all" 
                  placeholder="e.g. Ramesh Kumar" 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile Number</label>
                <input 
                  type="text" 
                  value={newCitizen.phone}
                  onChange={(e) => setNewCitizen({...newCitizen, phone: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 mt-1.5 text-slate-800 focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] focus:outline-none transition-all" 
                  placeholder="10-digit mobile number" 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aadhar Number</label>
                <input 
                  type="text" 
                  value={newCitizen.aadhar}
                  onChange={(e) => setNewCitizen({...newCitizen, aadhar: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 mt-1.5 text-slate-800 focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] focus:outline-none transition-all" 
                  placeholder="12-digit Aadhar number" 
                />
              </div>
              <button 
                onClick={handleRegisterCitizen} 
                className="w-full bg-[#FF7A00] hover:bg-[#E86D00] text-white font-bold py-3.5 rounded-xl transition-colors mt-6 shadow-md"
              >
                Create Citizen Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------- SUB-COMPONENTS ----------------

function KanbanCard({ item, colKey, onDragStart }) {
  const getBadgeColor = () => {
    switch (colKey) {
      case 'pending': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'submitted': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'approved': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, item, colKey)}
      className="bg-white border border-slate-200 rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-slate-300 hover:shadow-md transition-all group"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs border border-slate-200">
          {item.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800 leading-tight">{item.name}</p>
          <p className="text-[11px] text-slate-500 font-medium">ID: {item.id}</p>
        </div>
      </div>
      
      <div className="mb-3 flex items-center justify-between">
        <span className={`px-2.5 py-1 text-[11px] font-bold rounded-md border ${getBadgeColor()}`}>
          {item.scheme}
        </span>
        {colKey === 'pending' && (
          <button 
            onClick={(e) => { e.stopPropagation(); alert(`WhatsApp reminder sent to ${item.name}!`); }}
            title="Send WhatsApp Reminder"
            className="p-1.5 bg-green-50 text-green-600 rounded-full hover:bg-green-500 hover:text-white transition-colors"
          >
            <MessageCircle size={14} />
          </button>
        )}
      </div>
      
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>Added: {item.date}</span>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all font-semibold text-[15px]
        ${active 
          ? 'bg-[#FFF4ED] text-[#F97316]' 
          : 'text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A]'
        }
      `}
    >
      <span className={active ? 'text-[#F97316]' : 'text-[#94A3B8]'}>
        {icon}
      </span>
      {label}
    </button>
  );
}

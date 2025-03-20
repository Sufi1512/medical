// components/doctor/DoctorDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { 
  Users, Calendar, Activity, Brain, AlertTriangle, Star, Menu, X, ChevronDown, 
  DollarSign, Bot, Settings, Bell, Search
} from 'lucide-react';
import { DemographicAnalytics } from './analytics/DemographicAnalytics';
import { ConsultationAnalytics } from './analytics/ConsultationAnalytics';
import { AIAssistantAnalytics } from './analytics/AIAssistantAnalytics';
import { FeeManagement } from './FeeManagement';
import { ChatbotSetup } from './ChatbotSetup';
import { DoctorSettings } from './Settings'; // Add this import

type TabType = 'demographics' | 'consultations' | 'ai-assistant' | 'fees' | 'chatbot' | 'settings';

export const DoctorDashboard: React.FC = () => {
  const { user, signOut, updateProfile } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('demographics');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    // Simulate fetching notifications
    setNotifications(['New patient appointment request', 'System update available']);
  }, []);

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateProfile({
      full_name: formData.get('fullName') as string,
      phone: formData.get('phone') as string,
    });
    setShowProfileModal(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'demographics': return <DemographicAnalytics searchQuery={searchQuery} />;
      case 'consultations': return <ConsultationAnalytics />;
      case 'ai-assistant': return <AIAssistantAnalytics />;
      case 'fees': return <FeeManagement />;
      case 'chatbot': return <ChatbotSetup />;
      case 'settings': return <DoctorSettings />;
      default: return <DemographicAnalytics searchQuery={searchQuery} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-xl rounded-r-2xl ${isSidebarOpen ? 'w-72' : 'w-20'} transition-all duration-300 fixed h-screen z-10`}>
        <div className="p-6 flex items-center justify-between border-b">
          <h2 className={`font-bold text-2xl text-gray-800 ${!isSidebarOpen && 'hidden'}`}>
            <span className="text-blue-600">Medi</span>Connect
          </h2>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <nav className="mt-6">
          {[
            { icon: Users, label: 'Demographics', value: 'demographics' as TabType },
            { icon: Calendar, label: 'Consultations', value: 'consultations' as TabType },
            { icon: Brain, label: 'AI Assistant', value: 'ai-assistant' as TabType },
            { icon: DollarSign, label: 'Fee Management', value: 'fees' as TabType },
            { icon: Bot, label: 'Chatbot Setup', value: 'chatbot' as TabType },
            { icon: Settings, label: 'Settings', value: 'settings' as TabType },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.value)}
              className={`w-full flex items-center p-4 hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors ${
                !isSidebarOpen ? 'justify-center' : 'justify-start'
              } ${activeTab === item.value ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : ''}`}
            >
              <item.icon size={24} />
              {isSidebarOpen && <span className="ml-4 font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 overflow-auto ${isSidebarOpen ? 'ml-72' : 'ml-20'} transition-all duration-300`}>
        <header className="bg-white shadow-lg sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900 capitalize">
                  {activeTab.replace('-', ' ')}
                </h1>
                {activeTab === 'demographics' && (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search patients..."
                      className="pl-10 pr-4 py-2 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Bell size={24} />
                  </button>
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </div>
                <div className="flex items-center group relative">
                  <img
                    src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop"
                    alt="Profile"
                    className="w-12 h-12 rounded-full border-2 border-blue-100 cursor-pointer"
                    onClick={() => setShowProfileModal(true)}
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">Dr. {user?.full_name}</p>
                    <p className="text-xs text-gray-500">{user?.specialty || 'Specialist'}</p>
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full hover:from-red-600 hover:to-red-700 transition-all"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {renderContent()}
        </main>

        {/* Profile Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Edit Profile</h3>
                <button onClick={() => setShowProfileModal(false)}>
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    name="fullName"
                    defaultValue={user?.full_name}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    name="phone"
                    defaultValue={user?.phone}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Specialty</label>
                  <input
                    name="specialty"
                    defaultValue={user?.specialty}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-full hover:from-blue-600 hover:to-blue-700"
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
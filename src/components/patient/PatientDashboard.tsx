// components/patient/PatientDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { 
  User, FileText, Calendar, MessageSquare, Camera, X, Menu, Bell, Search, Activity 
} from 'lucide-react';
import { AppointmentAnalytics } from './analytics/AppointmentAnalytics';
import { MedicalRecordsAnalytics } from './analytics/MedicalRecordsAnalytics';
import { VisualDiagnosis } from './analytics/VisualDiagnosis';
import { AIChat } from './analytics/AIChat';

type TabType = 'profile' | 'records' | 'appointments' | 'chat' | 'visual';

interface RecentActivity {
  id: string;
  action: string;
  timestamp: string;
}

export const PatientDashboard: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved ? JSON.parse(saved) : true;
  });
  const [notifications, setNotifications] = useState<string[]>([
    'Upcoming appointment tomorrow at 10:00 AM',
    'New test results available for review',
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentActivities] = useState<RecentActivity[]>([
    { id: '1', action: 'Booked an appointment with Dr. Smith', timestamp: '2025-03-20 09:00' },
    { id: '2', action: 'Viewed blood work results', timestamp: '2025-03-19 15:30' },
  ]);

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
    const tabMap: { [key: string]: TabType } = {
      profile: 'profile',
      records: 'records',
      medical: 'records',
      appointments: 'appointments',
      chat: 'chat',
      ai: 'chat',
      visual: 'visual',
      diagnosis: 'visual',
    };
    const matchedTab = Object.keys(tabMap).find(key => key.includes(query.toLowerCase()));
    if (matchedTab) {
      setActiveTab(tabMap[matchedTab]);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-blue-100 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                <User className="mr-2 text-blue-600" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-gray-600 font-medium">Name</p>
                  <p className="font-medium text-gray-800 text-lg">{user?.full_name}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-gray-600 font-medium">Email</p>
                  <p className="font-medium text-gray-800 text-lg">{user?.email}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-gray-600 font-medium">Phone</p>
                  <p className="font-medium text-gray-800 text-lg">{user?.phone || 'Not set'}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-gray-600 font-medium">Date of Birth</p>
                  <p className="font-medium text-gray-800 text-lg">{user?.dob || 'Not set'}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-blue-100 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                <Activity className="mr-2 text-blue-600" /> Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-400">
                    <p className="font-medium text-gray-800">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'records':
        return <MedicalRecordsAnalytics />;
      case 'appointments':
        return <AppointmentAnalytics />;
      case 'chat':
        return <AIChat />;
      case 'visual':
        return <VisualDiagnosis />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-xl rounded-r-2xl ${isSidebarOpen ? 'w-72' : 'w-20'} transition-all duration-300 fixed h-screen z-10`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="p-6 flex items-center justify-between border-b">
          <h2 className={`font-bold text-2xl text-gray-800 ${!isSidebarOpen && 'hidden'}`}>
            <span className="text-blue-600">Medi</span>Connect
          </h2>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-full hover:bg-gray-100 text-blue-600"
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <nav className="mt-6">
          {[
            { icon: User, label: 'Profile', value: 'profile' as TabType },
            { icon: FileText, label: 'Medical Records', value: 'records' as TabType },
            { icon: Calendar, label: 'Appointments', value: 'appointments' as TabType },
            { icon: MessageSquare, label: 'AI Chat', value: 'chat' as TabType },
            { icon: Camera, label: 'Visual Diagnosis', value: 'visual' as TabType },
          ].map((item) => (
            <div key={item.label} className="relative group">
              <button
                onClick={() => setActiveTab(item.value)}
                className={`w-full flex items-center p-4 hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors ${
                  !isSidebarOpen ? 'justify-center' : 'justify-start'
                } ${activeTab === item.value ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 font-medium' : ''}`}
                aria-label={item.label}
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && setActiveTab(item.value)}
              >
                <item.icon size={24} />
                {isSidebarOpen && <span className="ml-4 font-medium">{item.label}</span>}
              </button>
              {!isSidebarOpen && (
                <span className="absolute left-20 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white text-sm rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg">
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 overflow-auto ${isSidebarOpen ? 'ml-72' : 'ml-20'} transition-all duration-300`}>
        <header className="bg-white shadow-lg sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-900 capitalize">
                {activeTab === 'profile' ? `Welcome, ${user?.full_name || 'User'}!` : activeTab}
              </h1>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search (e.g., records, appointments...)"
                  className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-800 shadow-sm"
                  aria-label="Search dashboard sections"
                />
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-gray-100 rounded-full relative"
                  aria-label="View notifications"
                >
                  <Bell size={24} className="text-blue-600" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                      {notifications.length}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl p-4 z-30 border border-blue-100">
                    <h4 className="font-semibold text-gray-800 mb-2">Notifications</h4>
                    {notifications.length === 0 ? (
                      <p className="text-gray-500">No new notifications.</p>
                    ) : (
                      notifications.map((notification, index) => (
                        <div key={index} className="p-2 border-b border-gray-100 last:border-b-0 hover:bg-blue-50 rounded-lg my-1">
                          <p className="text-sm text-gray-700">{notification}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium shadow-md">
                  {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <button
                  onClick={() => signOut()}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full hover:from-red-600 hover:to-red-700 transition-all shadow-md"
                  aria-label="Sign out"
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
      </div>

      <style>{`
        @media (max-width: 768px) {
          .ml-72 {
            margin-left: 0 !important;
          }
          .ml-20 {
            margin-left: 0 !important;
          }
          .w-72 {
            width: 0 !important;
            overflow: hidden;
          }
          .w-20 {
            width: 0 !important;
            overflow: hidden;
          }
        }
      `}</style>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { 
  User, FileText, Calendar, MessageSquare, Camera, X, Menu, Bell, Search, Activity, MapPin
} from 'lucide-react';
import { AppointmentAnalytics } from './analytics/AppointmentAnalytics';
import { MedicalRecordsAnalytics } from './analytics/MedicalRecordsAnalytics';
import { VisualDiagnosis } from './analytics/VisualDiagnosis';
import { AIChat } from './analytics/AIChat';
import { NearbyDoctors } from './NearbyDoctors';

type TabType = 'profile' | 'records' | 'appointments' | 'chat' | 'visual' | 'nearby';

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
    return saved ? JSON.parse(saved) : window.innerWidth >= 1024; // Default to open on desktop, closed on mobile
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

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNotifications && !(event.target as HTMLElement).closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

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
      nearby: 'nearby',
      doctors: 'nearby',
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
          <div className="p-4 sm:p-6 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Patient Profile</h2>
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-blue-100 backdrop-blur-sm bg-opacity-90">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 flex justify-center">
                  <div className="bg-blue-50 rounded-xl p-6 flex flex-col items-center w-full max-w-xs">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg">
                      <User className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">{user?.full_name || 'Patient Name'}</h3>
                    <p className="text-gray-500 text-center">{user?.email || 'patient@example.com'}</p>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center text-gray-800">
                    <Activity className="mr-2 text-blue-600" size={20} /> Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {recentActivities.map(activity => (
                      <div key={activity.id} className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-400">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <p className="font-medium text-gray-800">{activity.action}</p>
                          <p className="text-sm text-gray-500">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'records':
        return <MedicalRecordsAnalytics searchQuery={searchQuery} />;
      case 'appointments':
        return <AppointmentAnalytics searchQuery={searchQuery} />;
      case 'chat':
        return <AIChat />;
      case 'visual':
        return <VisualDiagnosis />;
      case 'nearby':
        return <NearbyDoctors searchQuery={searchQuery} />;
      default:
        return <div className="p-6 text-gray-600">Select a tab</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-100 rounded-full opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Mobile menu toggle */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isSidebarOpen ? <X className="text-blue-600" size={24} /> : <Menu className="text-blue-600" size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl rounded-r-2xl transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:z-auto backdrop-blur-sm bg-opacity-90`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="p-4">
          <div className="flex items-center justify-center p-4 border-b border-blue-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-blue-900 tracking-tight">MediConnect AI</h1>
            </div>
          </div>
          <nav className="mt-8 space-y-1">
            {[
              { icon: User, label: 'My Profile', value: 'profile' as TabType },
              { icon: FileText, label: 'Medical Records', value: 'records' as TabType },
              { icon: Calendar, label: 'Appointments', value: 'appointments' as TabType },
              { icon: MapPin, label: 'Nearby Doctors', value: 'nearby' as TabType },
              { icon: MessageSquare, label: 'AI Chat', value: 'chat' as TabType },
              { icon: Camera, label: 'Visual Diagnosis', value: 'visual' as TabType },
            ].map((item) => (
              <div key={item.label} className="relative group">
                <button
                  onClick={() => {
                    setActiveTab(item.value);
                    if (window.innerWidth < 1024) setIsSidebarOpen(false); // Close sidebar on mobile after selection
                  }}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-300 ${
                    activeTab === item.value
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                  aria-label={item.label}
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 'Enter' && setActiveTab(item.value)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="ml-3 font-medium">{item.label}</span>
                </button>
              </div>
            ))}
          </nav>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={signOut}
            className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300"
            aria-label="Sign out"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen && window.innerWidth < 1024 ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-lg sticky top-0 z-20">
          <div className="flex items-center justify-between p-4 max-w-7xl mx-auto flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                {activeTab === 'profile'
                  ? `Welcome, ${user?.full_name || 'User'}!`
                  : activeTab === 'records'
                  ? 'Medical Records'
                  : activeTab === 'appointments'
                  ? 'Appointments'
                  : activeTab === 'chat'
                  ? 'AI Chat Assistant'
                  : activeTab === 'visual'
                  ? 'Visual Diagnosis'
                  : activeTab === 'nearby'
                  ? 'Nearby Doctors'
                  : ''}
              </h2>
              <div className="relative flex-1 max-w-xs">
                <input
                  type="text"
                  placeholder="Search (e.g., records, appointments...)"
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-gray-50/50 backdrop-blur-sm text-gray-800 shadow-md transition-all duration-300"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  aria-label="Search dashboard sections"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative notification-dropdown">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full hover:bg-blue-50 relative transition-all duration-300"
                  aria-label="View notifications"
                >
                  <Bell className="h-6 w-6 text-blue-600" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 max-h-64 overflow-y-auto bg-white rounded-xl shadow-xl p-4 z-30 border border-blue-100 backdrop-blur-sm bg-opacity-90">
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
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium shadow-lg">
                {user?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 backdrop-blur-sm">{renderContent()}</main>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        @keyframes blob {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @media (max-width: 640px) {
          .max-w-xs {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
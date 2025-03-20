// components/patient/PatientDashboard.tsx
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

// Update the TabType to include the new 'nearby' option
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
    setSearchQuery(query);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Patient Profile</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <div className="bg-gray-100 rounded-lg p-6 flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-blue-200 flex items-center justify-center mb-4">
                      <User className="w-16 h-16 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-semibold">{user?.name || 'Patient Name'}</h3>
                    <p className="text-gray-500">{user?.email || 'patient@example.com'}</p>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivities.map(activity => (
                      <div key={activity.id} className="border-b pb-3">
                        <div className="flex justify-between">
                          <p>{activity.action}</p>
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
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile menu toggle */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-md shadow-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:z-auto`}
      >
        <div className="p-4">
          <div className="flex items-center justify-center p-4">
            <h1 className="text-2xl font-bold text-blue-600">MediConnect</h1>
          </div>
          <nav className="mt-8 space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center px-4 py-3 text-left rounded-md ${
                activeTab === 'profile'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <User className="mr-3 h-5 w-5" />
              <span>My Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`w-full flex items-center px-4 py-3 text-left rounded-md ${
                activeTab === 'records'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FileText className="mr-3 h-5 w-5" />
              <span>Medical Records</span>
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center px-4 py-3 text-left rounded-md ${
                activeTab === 'appointments'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Calendar className="mr-3 h-5 w-5" />
              <span>Appointments</span>
            </button>
            <button
              onClick={() => setActiveTab('nearby')}
              className={`w-full flex items-center px-4 py-3 text-left rounded-md ${
                activeTab === 'nearby'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <MapPin className="mr-3 h-5 w-5" />
              <span>Nearby Doctors</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center px-4 py-3 text-left rounded-md ${
                activeTab === 'chat'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <MessageSquare className="mr-3 h-5 w-5" />
              <span>AI Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('visual')}
              className={`w-full flex items-center px-4 py-3 text-left rounded-md ${
                activeTab === 'visual'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Camera className="mr-3 h-5 w-5" />
              <span>Visual Diagnosis</span>
            </button>
          </nav>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={signOut}
            className="w-full px-4 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                {activeTab === 'profile'
                  ? 'My Profile'
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
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-9 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-1 rounded-full hover:bg-gray-100 relative"
                >
                  <Bell className="h-6 w-6 text-gray-500" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
                    <div className="p-3 border-b">
                      <h3 className="text-sm font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification, index) => (
                        <div
                          key={index}
                          className="p-3 border-b hover:bg-gray-50 cursor-pointer"
                        >
                          <p className="text-sm">{notification}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center">
                <User className="h-4 w-4 text-blue-700" />
              </div>
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">{renderContent()}</main>
      </div>
    </div>
  );
};
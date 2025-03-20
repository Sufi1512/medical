// components/doctor/Settings.tsx
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { 
  Settings, User, Bell, Calendar, Lock, Save, X, ChevronDown, 
  ChevronUp, Clock, Trash2, Plus, Mail, Phone 
} from 'lucide-react';

interface AvailabilitySlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
}

interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  appointmentReminders: boolean;
  systemUpdates: boolean;
  patientMessages: boolean;
}

export const DoctorSettings: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const [activeSection, setActiveSection] = useState<'profile' | 'notifications' | 'availability' | 'security'>('profile');
  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    specialty: user?.specialty || '',
    bio: '',
  });
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
    email: true,
    sms: false,
    appointmentReminders: true,
    systemUpdates: true,
    patientMessages: true,
  });
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([
    { id: '1', day: 'Monday', startTime: '09:00', endTime: '17:00' },
    { id: '2', day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
  ]);
  const [newSlot, setNewSlot] = useState({ day: 'Monday', startTime: '09:00', endTime: '17:00' });
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching existing settings
    setProfileForm({
      full_name: user?.full_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      specialty: user?.specialty || '',
      bio: 'Experienced physician specializing in internal medicine.',
    });
  }, [user]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      updateProfile({
        full_name: profileForm.full_name,
        phone: profileForm.phone,
        specialty: profileForm.specialty,
      });
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      console.log('Notification preferences saved:', notificationPrefs);
      setSuccess('Notification preferences updated successfully');
    } catch (err) {
      setError('Failed to update notification preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const addAvailabilitySlot = () => {
    setAvailabilitySlots([...availabilitySlots, {
      id: Math.random().toString(36).substring(2),
      ...newSlot,
    }]);
    setNewSlot({ day: 'Monday', startTime: '09:00', endTime: '17:00' });
  };

  const removeAvailabilitySlot = (id: string) => {
    setAvailabilitySlots(slots => slots.filter(slot => slot.id !== id));
  };

  const handleSecuritySave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    if (securityForm.newPassword !== securityForm.confirmPassword) {
      setError('New passwords do not match');
      setIsSaving(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSuccess('Password updated successfully');
      setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError('Failed to update password');
    } finally {
      setIsSaving(false);
    }
  };

  const renderProfileSettings = () => (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <User className="mr-2 text-blue-600" /> Profile Settings
      </h3>
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">{success}</div>}
      <form onSubmit={handleProfileSave} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={profileForm.full_name}
            onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <div className="mt-1 relative">
            <input
              type="email"
              value={profileForm.email}
              disabled
              className="block w-full rounded-lg border-gray-300 bg-gray-100 shadow-sm"
            />
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <div className="mt-1 relative">
            <input
              type="tel"
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Specialty</label>
          <input
            type="text"
            value={profileForm.specialty}
            onChange={(e) => setProfileForm({ ...profileForm, specialty: e.target.value })}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            value={profileForm.bio}
            onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            maxLength={500}
          />
          <p className="mt-1 text-sm text-gray-500">{profileForm.bio.length}/500 characters</p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
        >
          <Save className="mr-2" /> {isSaving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <Bell className="mr-2 text-blue-600" /> Notification Preferences
      </h3>
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">{success}</div>}
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-medium mb-4">Notification Methods</h4>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notificationPrefs.email}
                onChange={(e) => setNotificationPrefs({ ...notificationPrefs, email: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">Email Notifications</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notificationPrefs.sms}
                onChange={(e) => setNotificationPrefs({ ...notificationPrefs, sms: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">SMS Notifications</span>
            </label>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-medium mb-4">Notification Types</h4>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notificationPrefs.appointmentReminders}
                onChange={(e) => setNotificationPrefs({ ...notificationPrefs, appointmentReminders: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">Appointment Reminders</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notificationPrefs.systemUpdates}
                onChange={(e) => setNotificationPrefs({ ...notificationPrefs, systemUpdates: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">System Updates</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notificationPrefs.patientMessages}
                onChange={(e) => setNotificationPrefs({ ...notificationPrefs, patientMessages: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">Patient Messages</span>
            </label>
          </div>
        </div>
        <button
          onClick={handleNotificationSave}
          disabled={isSaving}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
        >
          <Save className="mr-2" /> {isSaving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );

  const renderAvailabilitySettings = () => (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <Calendar className="mr-2 text-blue-600" /> Availability Settings
      </h3>
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-medium mb-4">Current Availability</h4>
          <div className="space-y-4">
            {availabilitySlots.map(slot => (
              <div key={slot.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <Calendar className="text-blue-600" size={20} />
                  <div>
                    <p className="font-medium">{slot.day}</p>
                    <p className="text-gray-600">{slot.startTime} - {slot.endTime}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeAvailabilitySlot(slot.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-lg font-medium mb-4">Add New Slot</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Day</label>
              <select
                value={newSlot.day}
                onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                type="time"
                value={newSlot.startTime}
                onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <input
                type="time"
                value={newSlot.endTime}
                onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <button
            onClick={addAvailabilitySlot}
            className="mt-4 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
          >
            <Plus size={20} /> Add Slot
          </button>
        </div>
        <button
          onClick={() => console.log('Saving availability:', availabilitySlots)}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-blue-700"
        >
          <Save className="mr-2" /> Save Availability
        </button>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <Lock className="mr-2 text-blue-600" /> Account Security
      </h3>
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">{success}</div>}
      <form onSubmit={handleSecuritySave} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Current Password</label>
          <input
            type="password"
            value={securityForm.currentPassword}
            onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            value={securityForm.newPassword}
            onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
            minLength={8}
          />
          <p className="mt-1 text-sm text-gray-500">Minimum 8 characters</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
          <input
            type="password"
            value={securityForm.confirmPassword}
            onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
        >
          <Save className="mr-2" /> {isSaving ? 'Saving...' : 'Change Password'}
        </button>
      </form>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveSection('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${activeSection === 'profile' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
        >
          <User size={20} /> Profile
        </button>
        <button
          onClick={() => setActiveSection('notifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${activeSection === 'notifications' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
        >
          <Bell size={20} /> Notifications
        </button>
        <button
          onClick={() => setActiveSection('availability')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${activeSection === 'availability' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
        >
          <Calendar size={20} /> Availability
        </button>
        <button
          onClick={() => setActiveSection('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${activeSection === 'security' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
        >
          <Lock size={20} /> Security
        </button>
      </div>

      {/* Content */}
      {activeSection === 'profile' && renderProfileSettings()}
      {activeSection === 'notifications' && renderNotificationSettings()}
      {activeSection === 'availability' && renderAvailabilitySettings()}
      {activeSection === 'security' && renderSecuritySettings()}
    </div>
  );
};
// components/doctor/analytics/ConsultationAnalytics.tsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line 
} from 'recharts';
import { 
  Clock, Users, RefreshCcw, Download, Plus, Calendar, DollarSign, Save, 
  Trash2, Edit, Check, X, Search 
} from 'lucide-react';

interface Consultation {
  id: string;
  patientId: string;
  date: string;
  time: string;
  type: 'initial' | 'follow-up' | 'emergency';
  status: 'scheduled' | 'completed' | 'cancelled';
  duration: number; // in minutes
  fee: number;
  notes?: string;
}

interface FeeStructure {
  id: string;
  type: 'initial' | 'follow-up' | 'emergency';
  amount: number;
  duration: number;
  description: string;
}

const initialConsultations: Consultation[] = [
  { id: '1', patientId: 'P001', date: '2025-03-20', time: '10:00', type: 'initial', status: 'scheduled', duration: 30, fee: 50 },
  { id: '2', patientId: 'P002', date: '2025-03-21', time: '14:00', type: 'follow-up', status: 'completed', duration: 15, fee: 30 },
];

const initialFees: FeeStructure[] = [
  { id: '1', type: 'initial', amount: 50, duration: 30, description: 'Initial consultation with full examination' },
  { id: '2', type: 'follow-up', amount: 30, duration: 15, description: 'Follow-up visit for existing patients' },
  { id: '3', type: 'emergency', amount: 100, duration: 45, description: 'Emergency consultation' },
];

const analyticsData = [
  { week: 'Week 1', scheduled: 10, completed: 8, cancelled: 2 },
  { week: 'Week 2', scheduled: 12, completed: 10, cancelled: 2 },
  { week: 'Week 3', scheduled: 15, completed: 13, cancelled: 1 },
  { week: 'Week 4', scheduled: 14, completed: 11, cancelled: 3 },
];

export const ConsultationAnalytics: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>(initialConsultations);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(initialFees);
  const [viewMode, setViewMode] = useState<'analytics' | 'management' | 'fees'>('analytics');
  const [showNewConsultation, setShowNewConsultation] = useState(false);
  const [editingFee, setEditingFee] = useState<FeeStructure | null>(null);
  const [newConsultation, setNewConsultation] = useState({
    patientId: '',
    date: '',
    time: '',
    type: 'initial' as const,
    notes: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Analytics calculations
  const totalConsultations = consultations.length;
  const completedConsultations = consultations.filter(c => c.status === 'completed').length;
  const avgDuration = consultations.reduce((sum, c) => sum + c.duration, 0) / totalConsultations || 0;

  useEffect(() => {
    // Simulate API fetch
    const filtered = initialConsultations.filter(c => 
      c.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.date.includes(searchQuery)
    );
    setConsultations(filtered);
  }, [searchQuery]);

  const exportData = () => {
    const csvContent = [
      'ID,Patient ID,Date,Time,Type,Status,Duration,Fee,Notes',
      ...consultations.map(c => `${c.id},${c.patientId},${c.date},${c.time},${c.type},${c.status},${c.duration},${c.fee},${c.notes || ''}`).join('\n'),
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'consultations_export.csv';
    link.click();
  };

  const handleNewConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    
    try {
      const selectedFee = feeStructures.find(f => f.type === newConsultation.type);
      if (!selectedFee) throw new Error('Invalid consultation type');

      const newCons: Consultation = {
        id: Math.random().toString(36).substring(2),
        patientId: newConsultation.patientId,
        date: newConsultation.date,
        time: newConsultation.time,
        type: newConsultation.type,
        status: 'scheduled',
        duration: selectedFee.duration,
        fee: selectedFee.amount,
        notes: newConsultation.notes,
      };
      
      setConsultations([...consultations, newCons]);
      setNewConsultation({ patientId: '', date: '', time: '', type: 'initial', notes: '' });
      setShowNewConsultation(false);
    } catch (err) {
      setError('Failed to create consultation');
    } finally {
      setIsSaving(false);
    }
  };

  const updateFeeStructure = (fee: FeeStructure) => {
    setFeeStructures(prev => prev.map(f => f.id === fee.id ? fee : f));
    setEditingFee(null);
  };

  const deleteFeeStructure = (id: string) => {
    setFeeStructures(prev => prev.filter(f => f.id !== id));
  };

  const renderAnalytics = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold flex items-center">
            <Clock className="mr-2 text-blue-600" /> Avg Duration
          </h3>
          <p className="text-2xl font-bold mt-2">{avgDuration.toFixed(1)} mins</p>
          <p className="text-sm text-gray-500 mt-1">Based on completed consultations</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold flex items-center">
            <Users className="mr-2 text-blue-600" /> Total Consultations
          </h3>
          <p className="text-2xl font-bold mt-2">{totalConsultations}</p>
          <p className="text-sm text-gray-500 mt-1">All statuses</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold flex items-center">
            <RefreshCcw className="mr-2 text-blue-600" /> Completion Rate
          </h3>
          <p className="text-2xl font-bold mt-2">{((completedConsultations / totalConsultations) * 100 || 0).toFixed(1)}%</p>
          <p className="text-sm text-gray-500 mt-1">Completed vs Scheduled</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-4">Weekly Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analyticsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="scheduled" fill="#0088FE" name="Scheduled" />
            <Bar dataKey="completed" fill="#00C49F" name="Completed" />
            <Bar dataKey="cancelled" fill="#FF8042" name="Cancelled" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search consultations..."
            className="pl-10 pr-4 py-2 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={() => setShowNewConsultation(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
        >
          <Plus size={20} /> New Consultation
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">Patient ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Fee</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {consultations.map(c => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{c.patientId}</td>
                  <td className="px-4 py-3">{c.date}</td>
                  <td className="px-4 py-3">{c.time}</td>
                  <td className="px-4 py-3 capitalize">{c.type}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      c.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      c.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{c.duration} mins</td>
                  <td className="px-4 py-3">${c.fee}</td>
                  <td className="px-4 py-3">
                    <button className="text-blue-600 hover:text-blue-800 mr-2">
                      <Edit size={16} />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showNewConsultation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">New Consultation</h3>
              <button onClick={() => setShowNewConsultation(false)}>
                <X size={24} />
              </button>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
            )}
            <form onSubmit={handleNewConsultation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Patient ID</label>
                <input
                  type="text"
                  value={newConsultation.patientId}
                  onChange={(e) => setNewConsultation({ ...newConsultation, patientId: e.target.value })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={newConsultation.date}
                  onChange={(e) => setNewConsultation({ ...newConsultation, date: e.target.value })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <input
                  type="time"
                  value={newConsultation.time}
                  onChange={(e) => setNewConsultation({ ...newConsultation, time: e.target.value })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  value={newConsultation.type}
                  onChange={(e) => setNewConsultation({ ...newConsultation, type: e.target.value as 'initial' | 'follow-up' | 'emergency' })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  {feeStructures.map(fee => (
                    <option key={fee.id} value={fee.type}>{fee.type} (${fee.amount})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={newConsultation.notes}
                  onChange={(e) => setNewConsultation({ ...newConsultation, notes: e.target.value })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-full hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
              >
                {isSaving ? 'Creating...' : 'Create Consultation'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderFeeManagement = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <DollarSign className="mr-2 text-blue-600" /> Fee Structures
        </h3>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
        )}
        <div className="space-y-4">
          {feeStructures.map(fee => (
            <div key={fee.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              {editingFee?.id === fee.id ? (
                <div className="flex-1 flex items-center gap-4">
                  <input
                    type="text"
                    value={editingFee.description}
                    onChange={(e) => setEditingFee({ ...editingFee, description: e.target.value })}
                    className="flex-1 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    value={editingFee.amount}
                    onChange={(e) => setEditingFee({ ...editingFee, amount: Number(e.target.value) })}
                    className="w-20 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    value={editingFee.duration}
                    onChange={(e) => setEditingFee({ ...editingFee, duration: Number(e.target.value) })}
                    className="w-20 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={() => updateFeeStructure(editingFee)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Check size={20} />
                  </button>
                  <button
                    onClick={() => setEditingFee(null)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <p className="font-medium capitalize">{fee.type} Consultation</p>
                    <p className="text-gray-600">${fee.amount} / {fee.duration} mins</p>
                    <p className="text-sm text-gray-500">{fee.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingFee(fee)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => deleteFeeStructure(fee.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={newConsultation.type}
            onChange={(e) => setNewConsultation({ ...newConsultation, type: e.target.value as 'initial' | 'follow-up' | 'emergency' })}
            className="rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="initial">Initial</option>
            <option value="follow-up">Follow-up</option>
            <option value="emergency">Emergency</option>
          </select>
          <input
            type="number"
            placeholder="Amount ($)"
            onChange={(e) => setFeeStructures([...feeStructures, {
              id: Math.random().toString(36).substring(2),
              type: newConsultation.type,
              amount: Number(e.target.value),
              duration: 30,
              description: 'New consultation type',
            }])}
            className="rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="number"
            placeholder="Duration (mins)"
            onChange={(e) => {
              const lastFee = feeStructures[feeStructures.length - 1];
              if (lastFee) {
                lastFee.duration = Number(e.target.value);
                setFeeStructures([...feeStructures]);
              }
            }}
            className="rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={() => setFeeStructures([...feeStructures])}
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
          >
            Add Fee
          </button>
        </div>
      </div>

      <button
        onClick={() => console.log('Saving fees:', feeStructures)}
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full flex items-center hover:from-blue-600 hover:to-blue-700"
      >
        <Save className="mr-2" /> Save Fee Structures
      </button>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('analytics')}
            className={`px-4 py-2 rounded-lg ${viewMode === 'analytics' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          >
            Analytics
          </button>
          <button
            onClick={() => setViewMode('management')}
            className={`px-4 py-2 rounded-lg ${viewMode === 'management' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          >
            Management
          </button>
          <button
            onClick={() => setViewMode('fees')}
            className={`px-4 py-2 rounded-lg ${viewMode === 'fees' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          >
            Fee Management
          </button>
        </div>
        <button
          onClick={exportData}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          <Download size={20} /> Export
        </button>
      </div>

      {viewMode === 'analytics' && renderAnalytics()}
      {viewMode === 'management' && renderManagement()}
      {viewMode === 'fees' && renderFeeManagement()}
    </div>
  );
};
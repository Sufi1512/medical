// components/doctor/FeeManagement.tsx
import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, Save, Clock, Plus, Trash2 } from 'lucide-react';

interface FeeStructure {
  id: string;
  type: 'initial' | 'follow-up' | 'emergency';
  amount: number;
  duration: number; // in minutes
}

export const FeeManagement: React.FC = () => {
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([
    { id: '1', type: 'initial', amount: 50, duration: 30 },
    { id: '2', type: 'follow-up', amount: 30, duration: 15 },
  ]);
  const [newFee, setNewFee] = useState({ type: '', amount: 0, duration: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFeeStructure = () => {
    if (!newFee.type || !newFee.amount || !newFee.duration) {
      setError('All fields are required');
      return;
    }
    setFeeStructures([...feeStructures, {
      id: Math.random().toString(36).substring(2),
      type: newFee.type as 'initial' | 'follow-up' | 'emergency',
      amount: newFee.amount,
      duration: newFee.duration,
    }]);
    setNewFee({ type: '', amount: 0, duration: 0 });
    setError(null);
  };

  const removeFeeStructure = (id: string) => {
    setFeeStructures(feeStructures.filter(fee => fee.id !== id));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving fees:', feeStructures);
      setError(null);
    } catch (err) {
      setError('Failed to save fee structures');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <DollarSign className="mr-2 text-blue-600" /> Fee Structures
        </h3>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {feeStructures.map((fee) => (
            <div key={fee.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium capitalize">{fee.type} Consultation</p>
                <p className="text-gray-600">${fee.amount} / {fee.duration} mins</p>
              </div>
              <button
                onClick={() => removeFeeStructure(fee.id)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-full"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={newFee.type}
              onChange={(e) => setNewFee({ ...newFee, type: e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select type</option>
              <option value="initial">Initial</option>
              <option value="follow-up">Follow-up</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
            <input
              type="number"
              value={newFee.amount || ''}
              onChange={(e) => setNewFee({ ...newFee, amount: Number(e.target.value) })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration (mins)</label>
            <input
              type="number"
              value={newFee.duration || ''}
              onChange={(e) => setNewFee({ ...newFee, duration: Number(e.target.value) })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <button
          onClick={addFeeStructure}
          className="mt-4 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
        >
          <Plus size={20} /> Add Fee Structure
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <Clock className="mr-2 text-blue-600" /> Availability Settings
        </h3>
        {/* Add availability settings here */}
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full flex items-center hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50"
      >
        <Save className="mr-2" /> {isSaving ? 'Saving...' : 'Save All Changes'}
      </button>
    </div>
  );
};
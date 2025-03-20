// components/doctor/analytics/AIAssistantAnalytics.tsx
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Brain, Clock, CheckCircle, AlertTriangle, Download } from 'lucide-react';

const aiPerformanceData = [
  { day: 'Mon', handled: 85, escalated: 15, responseTime: 2.5 },
  { day: 'Tue', handled: 90, escalated: 10, responseTime: 2.2 },
  { day: 'Wed', handled: 88, escalated: 12, responseTime: 2.3 },
  { day: 'Thu', handled: 92, escalated: 8, responseTime: 2.1 },
  { day: 'Fri', handled: 87, escalated: 13, responseTime: 2.4 },
];

const accuracyData = [
  { category: 'Skin', accuracy: 92 },
  { category: 'Symptoms', accuracy: 85 },
  { category: 'Vitals', accuracy: 88 },
];

export const AIAssistantAnalytics: React.FC = () => {
  const [timeFrame, setTimeFrame] = useState('daily');

  const exportData = () => {
    const csvContent = [
      'Day,Handled,Escalated,Response Time',
      ...aiPerformanceData.map(item => `${item.day},${item.handled},${item.escalated},${item.responseTime}`).join('\n'),
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ai_performance_export.csv';
    link.click();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setTimeFrame('daily')}
            className={`px-4 py-2 rounded-lg ${timeFrame === 'daily' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          >
            Daily
          </button>
          <button
            onClick={() => setTimeFrame('weekly')}
            className={`px-4 py-2 rounded-lg ${timeFrame === 'weekly' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          >
            Weekly
          </button>
        </div>
        <button
          onClick={exportData}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          <Download size={20} /> Export
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center">
              <CheckCircle className="mr-2 text-blue-600" /> Resolution
            </h3>
            <span className="text-green-600 text-sm">+5%</span>
          </div>
          <p className="text-2xl font-bold mt-2">85%</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center">
              <Clock className="mr-2 text-blue-600" /> Response Time
            </h3>
            <span className="text-green-600 text-sm">-15%</span>
          </div>
          <p className="text-2xl font-bold mt-2">2.3 min</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center">
              <AlertTriangle className="mr-2 text-blue-600" /> Escalation
            </h3>
            <span className="text-green-600 text-sm">-3%</span>
          </div>
          <p className="text-2xl font-bold mt-2">15%</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Brain className="mr-2 text-blue-600" /> Performance Metrics
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={aiPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="handled" name="Cases Handled" stroke="#0088FE" />
            <Line yAxisId="left" type="monotone" dataKey="escalated" name="Cases Escalated" stroke="#FF8042" />
            <Line yAxisId="right" type="monotone" dataKey="responseTime" name="Response Time (min)" stroke="#00C49F" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Brain className="mr-2 text-blue-600" /> Diagnostic Accuracy
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={accuracyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="accuracy" name="Accuracy (%)" fill="#0088FE" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
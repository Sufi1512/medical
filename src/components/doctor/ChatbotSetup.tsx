// components/doctor/AI AgentSetup.tsx
import React, { useState } from 'react';
import { Bot, Copy, Zap, Settings, HelpCircle } from 'lucide-react';

interface BotConfig {
  name: string;
  greeting: string;
  language: string;
  responseTime: number;
  active: boolean;
}

export const ChatbotSetup: React.FC = () => {
  const [config, setConfig] = useState<BotConfig>({
    name: 'MediBot',
    greeting: 'Hello! How can I assist you today?',
    language: 'en',
    responseTime: 2,
    active: false,
  });
  const [apiKey, setApiKey] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const generateApiKey = () => {
    const newKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setApiKey(newKey);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const toggleBotStatus = () => {
    setConfig(prev => ({ ...prev, active: !prev.active }));
  };

  const handleSave = () => {
    console.log('Saving chatbot config:', { ...config, apiKey });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold flex items-center">
            <Bot className="mr-2 text-blue-600" /> AI Agent Configuration
          </h3>
          <button
            onClick={toggleBotStatus}
            className={`px-4 py-2 rounded-full ${config.active ? 'bg-green-500' : 'bg-gray-500'} text-white`}
          >
            {config.active ? 'Active' : 'Inactive'}
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Bot Name</label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Greeting Message</label>
            <textarea
              value={config.greeting}
              onChange={(e) => setConfig({ ...config, greeting: e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Language</label>
            <select
              value={config.language}
              onChange={(e) => setConfig({ ...config, language: e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <Settings size={20} /> Advanced Settings
          </button>

          {showAdvanced && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Response Time (seconds)</label>
                <input
                  type="number"
                  value={config.responseTime}
                  onChange={(e) => setConfig({ ...config, responseTime: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  min={1}
                  max={10}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <Zap className="mr-2 text-blue-600" /> API Integration
        </h3>
        <div className="space-y-4">
          <button
            onClick={generateApiKey}
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-all"
          >
            Generate API Key
          </button>
          
          {apiKey && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={apiKey}
                  readOnly
                  className="flex-1 rounded-lg border-gray-300 shadow-sm p-2"
                />
                <button
                  onClick={() => copyToClipboard(apiKey)}
                  className="bg-gray-100 p-2 rounded-full hover:bg-gray-200"
                >
                  <Copy size={20} />
                </button>
              </div>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <HelpCircle size={16} /> Keep this key secure and do not share publicly
              </p>
            </div>
          )}

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Webhook URL</h4>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={`https://api.mediconnect.com/webhook/${apiKey || 'your-api-key'}`}
                readOnly
                className="flex-1 rounded-lg border-gray-300 shadow-sm p-2"
              />
              <button
                onClick={() => copyToClipboard(`https://api.mediconnect.com/webhook/${apiKey || 'your-api-key'}`)}
                className="bg-gray-100 p-2 rounded-full hover:bg-gray-200"
              >
                <Copy size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full flex items-center hover:from-blue-600 hover:to-blue-700"
      >
        Save Configuration
      </button>
    </div>
  );
};
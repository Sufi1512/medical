// components/patient/analytics/AIChat.tsx
import React, { useState } from 'react';
import { MessageSquare, Send, Calendar, CheckCircle, X } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Use environment variable for API key
const GEMINI_API_KEY ='AIzaSyCKV1u1CyGTguFBbnbIbXHxVy2NHDuhnNM';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  doctorType?: string;
  checklist?: string[];
  userSymptoms?: string[];
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  purpose?: string;
  location?: string;
  notes?: string;
}

export const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingSymptoms, setIsSubmittingSymptoms] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [showChecklist, setShowChecklist] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mockDoctors = [
    { name: 'Dr. Sarah Johnson', specialty: 'Rheumatologist' },
    { name: 'Dr. Mark Lee', specialty: 'Anesthesiologist' },
    { name: 'Dr. Emily Brown', specialty: 'General Practitioner' },
  ];

  const covidSymptoms = [
    'Difficulty breathing',
    'Fever',
    'Cough',
    'Tiredness',
    'Loss of smell or taste',
    'Sore throat',
    'Headache',
    'Aches',
    'Diarrhea',
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substring(2),
      content: input,
      sender: 'user',
    };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);
    setErrorMessage(null);

    // Check if user mentions COVID
    if (input.toLowerCase().includes('covid')) {
      const checklistMessage: Message = {
        id: Math.random().toString(36).substring(2),
        content: 'Please, tell us if you have more than three symptoms from this list.',
        sender: 'ai',
        checklist: covidSymptoms,
      };
      setMessages(prev => [...prev, checklistMessage]);
      setShowChecklist(checklistMessage.id); // Set to checklistMessage.id
      setIsLoading(false);
      return;
    }

    // Otherwise, proceed with Gemini API
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        You are an AI medical assistant. Respond to the user's query: "${input}". 
        Provide a helpful response about their symptoms or question, including:
        - A brief explanation or preliminary advice.
        - First aid suggestions if applicable.
        - A recommendation to consult a specific type of doctor (e.g., rheumatologist, anesthesiologist, general practitioner) with conditions for consultation.
        Use plain text without bold markers like ** or asterisks. End with:
        "Note: This is not a substitute for professional medical advice."
      `;
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      const doctorTypeMatch = responseText.match(/(rheumatologist|anesthesiologist|general practitioner)/i);
      const doctorType = doctorTypeMatch ? doctorTypeMatch[0] : 'general practitioner';

      const aiMessage: Message = {
        id: Math.random().toString(36).substring(2),
        content: responseText,
        sender: 'ai',
        doctorType,
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      let errorContent = 'Sorry, I couldn’t process your request. Please try again.';
      if (error.message.includes('API key')) {
        errorContent = 'Authentication error: Please check the API key configuration.';
      } else if (error.message.includes('rate limit')) {
        errorContent = 'Rate limit exceeded. Please try again later.';
      }
      setErrorMessage(errorContent);
      const errorMessage: Message = {
        id: Math.random().toString(36).substring(2),
        content: errorContent,
        sender: 'ai',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSymptomSubmit = async (messageId: string) => {
    if (selectedSymptoms.length === 0) {
      const noSymptomsMessage: Message = {
        id: Math.random().toString(36).substring(2),
        content: 'Please select at least one symptom to proceed.',
        sender: 'ai',
      };
      setMessages(prev => [...prev, noSymptomsMessage]);
      return;
    }

    const userSymptomsMessage: Message = {
      id: Math.random().toString(36).substring(2),
      content: `I have the following symptoms: ${selectedSymptoms.join(', ')}.`,
      sender: 'user',
      userSymptoms: selectedSymptoms,
    };
    setMessages(prev => [...prev, userSymptomsMessage]);
    setShowChecklist(null);
    setIsSubmittingSymptoms(true);
    setErrorMessage(null);

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        The user suspects they have COVID and reported these symptoms: "${selectedSymptoms.join(', ')}".
        Analyze the symptoms:
        - If more than three symptoms are present, confirm a higher likelihood of COVID and suggest immediate steps.
        - Provide first aid advice for the symptoms.
        - Recommend a doctor type (e.g., rheumatologist, anesthesiologist, general practitioner) to consult.
        Use plain text without bold markers. End with:
        "Note: This is not a substitute for professional medical advice."
      `;
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      const doctorTypeMatch = responseText.match(/(rheumatologist|anesthesiologist|general practitioner)/i);
      const doctorType = doctorTypeMatch ? doctorTypeMatch[0] : 'general practitioner';

      const aiMessage: Message = {
        id: Math.random().toString(36).substring(2),
        content: responseText,
        sender: 'ai',
        doctorType,
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      let errorContent = 'Sorry, I couldn’t process your request. Please try again.';
      if (error.message.includes('API key')) {
        errorContent = 'Authentication error: Please check the API key configuration.';
      } else if (error.message.includes('rate limit')) {
        errorContent = 'Rate limit exceeded. Please try again later.';
      }
      setErrorMessage(errorContent);
      const errorMessage: Message = {
        id: Math.random().toString(36).substring(2),
        content: errorContent,
        sender: 'ai',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSubmittingSymptoms(false);
      setSelectedSymptoms([]);
    }
  };

  const handleCancelChecklist = () => {
    setShowChecklist(null);
    setSelectedSymptoms([]);
    const cancelMessage: Message = {
      id: Math.random().toString(36).substring(2),
      content: 'Checklist cancelled. Please describe your symptoms or ask another question.',
      sender: 'ai',
    };
    setMessages(prev => [...prev, cancelMessage]);
  };

  const handleBookAppointment = (doctorType: string) => {
    const doctor = mockDoctors.find(d => d.specialty.toLowerCase().includes(doctorType.toLowerCase())) || mockDoctors[2];
    const newAppointment: Appointment = {
      id: Math.random().toString(36).substring(2),
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
      time: '10:00',
      doctor: doctor.name,
      status: 'scheduled',
      purpose: `Consultation based on AI chat recommendation`,
      location: `https://meet.example.com/${Math.random().toString(36).substring(2)}`,
      notes: '',
    };

    const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const updatedAppointments = [...existingAppointments, newAppointment];
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

    const confirmationMessage: Message = {
      id: Math.random().toString(36).substring(2),
      content: `Appointment booked with ${doctor.name} for ${newAppointment.date} at ${newAppointment.time}. Check the Appointments tab for details.`,
      sender: 'ai',
    };
    setMessages(prev => [...prev, confirmationMessage]);
  };

  const formatMessageContent = (message: Message) => {
    const lines = message.content.split('\n').filter(line => line.trim());
    return (
      <div>
        {lines.map((line, index) => (
          <p key={index} className="mb-2">{line}</p>
        ))}
        {message.checklist && showChecklist === message.id && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-sm animate-fade-in">
            <div className="grid grid-cols-2 gap-2 mb-4">
              {message.checklist.map(symptom => (
                <label key={symptom} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedSymptoms.includes(symptom)}
                    onChange={() => {
                      setSelectedSymptoms(prev =>
                        prev.includes(symptom)
                          ? prev.filter(s => s !== symptom)
                          : [...prev, symptom]
                      );
                    }}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{symptom}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleSymptomSubmit(message.id)}
                disabled={isSubmittingSymptoms}
                className="flex-1 bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isSubmittingSymptoms ? (
                  <>
                    <span>Submitting...</span>
                    <div className="animate-spin h-5 w-5 border-2 border-t-white rounded-full"></div>
                  </>
                ) : (
                  'Submit Symptoms'
                )}
              </button>
              <button
                onClick={handleCancelChecklist}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-full hover:bg-gray-400 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <X size={18} /> Cancel
              </button>
            </div>
          </div>
        )}
        {message.doctorType && (
          <button
            onClick={() => handleBookAppointment(message.doctorType!)}
            className="mt-4 flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-all shadow-md"
          >
            <Calendar size={18} /> Book an Appointment with {message.doctorType}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
        <MessageSquare className="mr-2 text-blue-600" size={28} /> AI Medical Assistant
      </h3>
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg flex items-center gap-2">
          <CheckCircle size={20} className="text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}
      <div className="h-[600px] overflow-y-auto mb-6 p-4 bg-gray-50 rounded-lg shadow-inner">
        {messages.length === 0 && (
          <p className="text-gray-500 text-center py-4">Start by describing your symptoms...</p>
        )}
        {messages.map(message => (
          <div
            key={message.id}
            className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div
              className={`inline-block p-4 rounded-lg shadow-sm ${
                message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
              } max-w-[80%] transform transition-all duration-200 hover:scale-105`}
            >
              {formatMessageContent(message)}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        ))}
        {isLoading && (
          <div className="text-gray-500 text-center flex items-center justify-center gap-2">
            <span className="animate-pulse">AI is thinking...</span>
            <div className="animate-spin h-5 w-5 border-2 border-t-blue-500 rounded-full"></div>
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          className="flex-1 h-24 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 resize-none transition-all"
          placeholder="Describe your symptoms or ask a question..."
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="bg-blue-500 text-white p-4 rounded-full hover:bg-blue-600 disabled:opacity-50 transition-all shadow-md"
        >
          <Send size={20} />
        </button>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
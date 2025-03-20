// components/patient/analytics/VisualDiagnosis.tsx
import React, { useState, useEffect } from 'react';
import { Camera, Upload, Loader, RefreshCcw, Calendar, CheckCircle, Trash2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = 'AIzaSyAHgX6HKOrLYhZt1kZlwab9jwFWAkhNvYo'; // Ensure this is valid
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

interface QueryHistory {
  id: string;
  imageUrl: string;
  result: string;
  timestamp: string;
}

interface Doctor {
  name: string;
  specialty: string;
  experience: string;
  contact: string;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export const VisualDiagnosis: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<QueryHistory[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem('visualDiagnosisHistory');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const resetProcess = () => {
    setImage(null);
    setResult(null);
    setError(null);
    setIsLoading(false);
    setSelectedDoctor(null);
    setShowBookingConfirmation(false);
  };

  const saveToHistory = (imageFile: File, diagnosis: string) => {
    const newEntry: QueryHistory = {
      id: Math.random().toString(36).substring(2),
      imageUrl: URL.createObjectURL(imageFile),
      result: diagnosis,
      timestamp: new Date().toISOString(),
    };
    const updatedHistory = [newEntry, ...history].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem('visualDiagnosisHistory', JSON.stringify(updatedHistory));
  };

  const removeHistoryEntry = (id: string) => {
    const updatedHistory = history.filter(entry => entry.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('visualDiagnosisHistory', JSON.stringify(updatedHistory));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setResult(null);
      setError(null);
      setIsLoading(true);

      try {
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('Image size exceeds 5MB limit. Please upload a smaller image.');
        }

        const base64Image = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read image file'));
          reader.readAsDataURL(file);
        });

        console.log('Base64 Image Length:', base64Image.length);

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const prompt = `
          Analyze this medical image and provide a preliminary diagnosis or observations related to wounds, skin conditions, or visible medical issues. 
          If the image appears to be related to wounds or skin conditions, suggest appropriate first aid recommendations (e.g., clean the wound with water, apply a bandage) and always recommend a type of doctor to consult (e.g., dermatologist, general practitioner), even if the condition seems minor, with conditions under which consultation is necessary. Use plain text without bold markers like ** or asterisks for formatting. 
          If the image is not related to wounds, skin conditions, or any diagnosable medical issue (e.g., a random object or unrelated scene), respond with: "This image does not appear to be related to a medical condition. Please upload a relevant medical image."
          Note: This is not a substitute for professional medical advice.
        `;
        const imageParts = [
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: file.type,
            },
          },
        ];

        console.log('Sending request to Gemini API...');
        const response = await model.generateContent([prompt, ...imageParts]);
        console.log('API Response:', response);

        const diagnosis = response.response.text();
        console.log('Diagnosis:', diagnosis);

        setResult(diagnosis);
        saveToHistory(file, diagnosis);
      } catch (err: any) {
        console.error('Error Details:', err);
        let errorMessage = 'An error occurred while analyzing the image. Please re-upload a relevant medical image.';
        if (err.message) errorMessage += ` Details: ${err.message}`;
        if (err.response) errorMessage += ` API Response: ${JSON.stringify(err.response)}`;
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const mockDoctors: Doctor[] = [
    { name: 'Dr. Sarah Johnson', specialty: 'Dermatologist', experience: '10 years', contact: 'sarah.j@example.com' },
    { name: 'Dr. Mark Lee', specialty: 'General Practitioner', experience: '8 years', contact: 'mark.l@example.com' },
  ];

  const handleDoctorClick = (doctorType: string) => {
    const doctor = mockDoctors.find(d => d.specialty.toLowerCase().includes(doctorType.toLowerCase()));
    setSelectedDoctor(doctor || mockDoctors[0]);
  };

  const bookAppointment = (doctor: Doctor) => {
    const newAppointment: Appointment = {
      id: Math.random().toString(36).substring(2),
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
      time: '10:00',
      doctor: doctor.name,
      status: 'scheduled',
    };
    
    const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const updatedAppointments = [...existingAppointments, newAppointment];
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

    setShowBookingConfirmation(true);
    setTimeout(() => setShowBookingConfirmation(false), 3000);
  };

  const formatResult = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    let observation = '';
    const firstAid: string[] = [];
    const consult: string[] = [];
    let disclaimer = '';

    lines.forEach(line => {
      if (line.startsWith('The image shows')) observation = line;
      else if (line.match(/^\d+\./) || (firstAid.length > 0 && !line.startsWith('A ') && !line.includes('consult') && !line.startsWith('Note:'))) firstAid.push(line);
      else if (line.startsWith('A ') || line.includes('should be consulted')) consult.push(line);
      else if (line.startsWith('Note:')) disclaimer = line;
    });

    // Extract doctor type with fallback
    const doctorTypeMatch = text.match(/(dermatologist|general practitioner)/i);
    const doctorType = doctorTypeMatch ? doctorTypeMatch[0] : 'general practitioner';

    // If no consult section, add a default one
    if (consult.length === 0) {
      consult.push(`A ${doctorType} should be consulted if the condition worsens or does not improve within a few days.`);
    }

    return { observation, firstAid, consult, disclaimer, doctorType };
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 relative">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <Camera className="mr-2 text-blue-600" /> Visual Diagnosis
      </h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload an image of your medical condition
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
            disabled={isLoading}
          />
          <p className="mt-1 text-xs text-gray-500">
            Supported formats: JPG, PNG. Max size: 5MB
          </p>
        </div>

        {image && (
          <div className="space-y-4">
            <img
              src={URL.createObjectURL(image)}
              alt="Uploaded medical condition"
              className="max-w-md rounded-lg shadow-sm border border-gray-200"
            />
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-600 animate-pulse">
                <Loader className="animate-spin" size={20} /> Analyzing image...
              </div>
            )}
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center justify-between shadow-sm">
                <span>{error}</span>
                <button
                  onClick={resetProcess}
                  className="flex items-center gap-1 text-red-700 hover:text-red-900"
                >
                  <RefreshCcw size={16} /> Reset
                </button>
              </div>
            )}
            {result && (() => {
              const { observation, firstAid, consult, disclaimer, doctorType } = formatResult(result);
              return (
                <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                  <h4 className="font-semibold mb-3 text-lg text-gray-800">AI Analysis Result</h4>
                  {observation && (
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700">Observation:</h5>
                      <p className="text-gray-600 mt-1">{observation}</p>
                    </div>
                  )}
                  {firstAid.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700">First Aid Recommendations:</h5>
                      <ul className="list-disc pl-5 mt-1 text-gray-600">
                        {firstAid.map((item, index) => (
                          <li key={index}>{item.replace(/^\d+\.\s*/, '')}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {consult.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700">Consultation:</h5>
                      <p className="text-gray-600 mt-1">
                        {consult.join(' ')}{' '}
                        <button
                          onClick={() => handleDoctorClick(doctorType)}
                          className="text-blue-600 underline hover:text-blue-800 transition-colors"
                        >
                          {doctorType}
                        </button>
                      </p>
                    </div>
                  )}
                  {disclaimer && (
                    <p className="text-sm text-red-600 italic">{disclaimer}</p>
                  )}
                  {selectedDoctor && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg shadow-inner">
                      <h5 className="font-semibold text-blue-700">Doctor Details:</h5>
                      <p className="text-gray-700">Name: {selectedDoctor.name}</p>
                      <p className="text-gray-700">Specialty: {selectedDoctor.specialty}</p>
                      <p className="text-gray-700">Experience: {selectedDoctor.experience}</p>
                      <p className="text-gray-700">Contact: {selectedDoctor.contact}</p>
                      <button
                        onClick={() => bookAppointment(selectedDoctor)}
                        className="mt-3 flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-all shadow-md"
                      >
                        <Calendar size={20} /> Book Appointment
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}
            {!isLoading && (result || error) && (
              <button
                onClick={resetProcess}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-all shadow-md"
              >
                <Upload size={20} /> Upload Another Image
              </button>
            )}
          </div>
        )}

        {showBookingConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="text-green-500" size={32} />
                <h4 className="text-xl font-semibold text-gray-800">Appointment Booked!</h4>
              </div>
              <p className="text-gray-600">
                Your appointment has been successfully scheduled. Check the <span className="font-medium text-blue-600">Appointments</span> tab for details.
              </p>
              <button
                onClick={() => setShowBookingConfirmation(false)}
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition-all"
              >
                Got it
              </button>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-8">
            <h4 className="text-lg font-semibold mb-4 text-gray-800">Query History</h4>
            <div className="space-y-4">
              {history.map(entry => (
                <div
                  key={entry.id}
                  className="p-4 bg-gray-50 rounded-lg flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src={entry.imageUrl}
                    alt="History"
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{new Date(entry.timestamp).toLocaleString()}</p>
                    <p className="text-gray-700 whitespace-pre-wrap">{entry.result}</p>
                  </div>
                  <button
                    onClick={() => removeHistoryEntry(entry.id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors p-2 rounded-full hover:bg-red-50"
                    title="Remove this history entry"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { MapPin, Star, Clock, Calendar, Phone } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  distance: string;
  rating: number;
  image: string;
  availability: string[];
  consultationFee: number;
  address: string;
  phone: string;
  consultations: {
    date: string;
    status: 'completed' | 'upcoming' | 'cancelled';
    notes?: string;
  }[];
}

export const NearbyDoctors: React.FC<{ searchQuery: string }> = ({ searchQuery }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingStatus, setBookingStatus] = useState<{
    loading: boolean;
    success: boolean;
    error: string | null;
    consultationLink: string | null;
  }>({
    loading: false,
    success: false,
    error: null,
    consultationLink: null,
  });

  useEffect(() => {
    // In a real app, fetch data from an API
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        // Simulating API call
        setTimeout(() => {
          const mockDoctors: Doctor[] = [
            {
              id: '1',
              name: 'Dr. Priya Patel',
              specialty: 'Cardiologist',
              distance: '0.8 kms',
              rating: 4.8,
              image: 'https://static.vecteezy.com/system/resources/thumbnails/048/628/628/small/female-doctor-with-a-gentle-smile-demonstrating-warmth-and-professionalism-background-free-photo.jpg',
              availability: ['Mon 2-6 PM', 'Wed 10-2 PM', 'Fri 1-5 PM'],
              consultationFee: 120,
              address: '123 Medical Center, vashi',
              phone: '918766996609',
              consultations: [
                { date: '2025-02-15', status: 'completed', notes: 'Annual checkup' },
                { date: '2024-12-10', status: 'completed', notes: 'Follow-up visit' }
              ]
            },
            {
              id: '2',
              name: 'Dr. Shiv Kumar',
              specialty: 'Neurologist',
              distance: '1.2 kms',
              rating: 4.9,
              image: 'https://static3.bigstockphoto.com/1/5/2/large1500/251179828.jpg',
              availability: ['Tue 9-1 PM', 'Thu 2-6 PM', 'Sat 10-2 PM'],
              consultationFee: 150,
              address: '456 Health Plaza, nerul',
              phone: '918127889889',
              consultations: [
                { date: '2025-01-22', status: 'completed', notes: 'Initial consultation' }
              ]
            },
            {
              id: '3',
              name: 'Dr. Anjali Singh',
              specialty: 'Dermatologist',
              distance: '0.5 kms',
              rating: 4.7,
              image: 'https://thumbs.dreamstime.com/b/confident-young-adult-indian-female-doctor-gp-wear-white-coat-stethoscope-looking-camera-standing-arms-crossed-medical-191740547.jpg',
              availability: ['Mon 9-3 PM', 'Wed 1-5 PM', 'Fri 9-12 PM'],
              consultationFee: 110,
              address: '789 Wellness Blvd, panvel',
              phone: '918766996609',
              consultations: []
            },
          ];

          const filtered = searchQuery
            ? mockDoctors.filter(doc =>
                doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()))
            : mockDoctors;

          setDoctors(filtered);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [searchQuery]);

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor) return;
    
    setBookingStatus({
      loading: true,
      success: false,
      error: null,
      consultationLink: null,
    });

    try {
      // Generate unique consultation link with timestamp
      const timestamp = Date.now();
      const consultationLink = `https://a4a9-59-164-67-218.ngrok-free.app/consultation/room-${timestamp}`;
      
      // Get the current user ID (in a real app, this would come from auth context)
      const userId = "current-user-id"; // Replace with actual user ID from auth
      
      // Make API request to backend
      const response = await fetch('http://localhost:5000/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Your Consultation Link ${consultationLink}`,
          phoneNumber: selectedDoctor.phone  // Changed from 'phone' to 'phoneNumber'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to book appointment');
      }
      
      // Update booking status with success
      setBookingStatus({
        loading: false,
        success: true,
        error: null,
        consultationLink: consultationLink,
      });
      
      // Add the appointment to the doctor's consultations list
      const updatedDoctor = {
        ...selectedDoctor,
        consultations: [
          {
            date: new Date().toISOString().split('T')[0],
            status: 'upcoming' as 'upcoming',
            notes: 'New appointment'
          },
          ...selectedDoctor.consultations
        ]
      };
      
      setSelectedDoctor(updatedDoctor);
      
      // Also update the doctor in the main list
      setDoctors(doctors.map(doc => 
        doc.id === selectedDoctor.id ? updatedDoctor : doc
      ));
      
    } catch (error) {
      setBookingStatus({
        loading: false,
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        consultationLink: null,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">Nearby Doctors</h2>
      
      {selectedDoctor ? (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <button 
              onClick={() => setSelectedDoctor(null)}
              className="text-blue-500 hover:text-blue-700"
            >
              &larr; Back to list
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <img 
                src={selectedDoctor.image} 
                alt={selectedDoctor.name} 
                className="w-full h-auto rounded-lg object-cover shadow-md"
              />
              <div className="mt-4 flex items-center">
                {renderStars(selectedDoctor.rating)}
                <span className="ml-2 text-gray-600">{selectedDoctor.rating} / 5</span>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-lg">Contact</h3>
                <p className="flex items-center mt-2">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  {selectedDoctor.phone}
                </p>
                <p className="flex items-center mt-2">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  {selectedDoctor.address}
                </p>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-lg">Availability</h3>
                <ul className="mt-2 space-y-1">
                  {selectedDoctor.availability.map((slot, idx) => (
                    <li key={idx} className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      {slot}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold">{selectedDoctor.name}</h2>
              <p className="text-blue-600 font-medium">{selectedDoctor.specialty}</p>
              <p className="mt-2 flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1 text-gray-500" /> 
                {selectedDoctor.distance} away
              </p>
              <p className="mt-2 text-gray-700">
                Consultation Fee: <span className="font-semibold">${selectedDoctor.consultationFee}</span>
              </p>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Consultation History</h3>
                {selectedDoctor.consultations.length > 0 ? (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    {selectedDoctor.consultations.map((consult, idx) => (
                      <div key={idx} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span>
                              {new Date(consult.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            consult.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            consult.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {consult.status.charAt(0).toUpperCase() + consult.status.slice(1)}
                          </span>
                        </div>
                        {consult.notes && (
                          <p className="mt-2 text-gray-600 text-sm pl-6">{consult.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No previous consultations</p>
                )}
              </div>
              
              <div className="mt-8">
                {bookingStatus.success ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-green-800 mb-2">Appointment Booked Successfully!</h4>
                    <p className="text-green-700 mb-2">Your consultation link:</p>
                    <div className="bg-white p-3 rounded border border-green-200 break-all">
                      <a 
                        href={bookingStatus.consultationLink || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {bookingStatus.consultationLink}
                      </a>
                    </div>
                    <p className="text-sm text-green-700 mt-2">
                      Save this link to access your consultation at the scheduled time.
                    </p>
                    <button 
                      onClick={() => setBookingStatus(prev => ({ ...prev, success: false, consultationLink: null }))}
                      className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
                    >
                      Book Another Appointment
                    </button>
                  </div>
                ) : bookingStatus.error ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-red-800 mb-2">Booking Failed</h4>
                    <p className="text-red-700">{bookingStatus.error}</p>
                    <button 
                      onClick={() => setBookingStatus(prev => ({ ...prev, error: null }))}
                      className="mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <button 
                    className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-150 w-full ${bookingStatus.loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                    onClick={handleBookAppointment}
                    disabled={bookingStatus.loading}
                  >
                    {bookingStatus.loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Booking Appointment...
                      </span>
                    ) : (
                      'Book Appointment'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.length > 0 ? doctors.map(doctor => (
            <div 
              key={doctor.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => setSelectedDoctor(doctor)}
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name} 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{doctor.name}</h3>
                    <p className="text-blue-600">{doctor.specialty}</p>
                    <div className="flex items-center mt-1">
                      {renderStars(doctor.rating)}
                      <span className="ml-2 text-sm text-gray-600">{doctor.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{doctor.distance}</span>
                  </div>
                  <span className="text-gray-700 font-medium">${doctor.consultationFee}</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Available:</span> {doctor.availability[0]}
                    {doctor.availability.length > 1 && '...'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Past consultations:</span> {doctor.consultations.length}
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-50 px-4 py-3 flex justify-between items-center">
                <span className="text-blue-800 text-sm font-medium">View details</span>
                <span className="text-blue-800">&rarr;</span>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No doctors found matching your search criteria</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollReveal } from '../shared/ScrollReveal';
import type { Settings } from 'react-slick';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const testimonials = [
  {
    initial: 'P',
    name: 'Priya Sharma',
    role: 'Patient',
    quote: 'The AI assistant helped me understand my symptoms before my doctor\'s appointment. I felt much more prepared and less anxious!'
  },
  {
    initial: 'D',
    name: 'Dr. Rahul Mehta',
    role: 'Cardiologist',
    quote: 'The chatbot pre-screening has reduced my administrative workload by 40%. I can now focus on patients who truly need my expertise.'
  },
  {
    initial: 'A',
    name: 'Anita Patel',
    role: 'Patient',
    quote: 'Being able to access all my medical records in one place has been life-changing. I no longer have to carry folders of documents to each appointment.'
  },
  {
    initial: 'S',
    name: 'Dr. Sarah Johnson',
    role: 'Pediatrician',
    quote: 'The platform has transformed how I manage my practice. The AI integration is remarkable for initial patient assessments.'
  },
  {
    initial: 'M',
    name: 'Mike Chen',
    role: 'Patient',
    quote: 'Quick, efficient, and accurate. The AI suggestions were spot-on, and connecting with specialists was seamless.'
  }
];

export const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('patients');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    role: 'patient' as 'patient' | 'doctor',
    subject: '',
    description: '',
  });
  const [formErrors, setFormErrors] = useState<{ subject?: string; description?: string }>({});
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sliderSettings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors: { subject?: string; description?: string } = {};
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Simulate sending the issue to the admin panel
    console.log('Issue Reported:', formData);
    alert('Your issue has been submitted successfully! Our team will review it shortly.');
    setFormData({ role: 'patient', subject: '', description: '' });
    setIsContactModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white scroll-smooth">
      {/* Header Section */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-md transition-all duration-500">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 transform transition-transform duration-500 hover:scale-105">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:rotate-12" style={{ transform: 'perspective(500px)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-blue-900 transition-colors duration-300 hover:text-blue-600">MediConnect AI</span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-blue-600 transition-colors duration-300 transform hover:scale-110">Features</button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-gray-600 hover:text-blue-600 transition-colors duration-300 transform hover:scale-110">How It Works</button>
            <button onClick={() => scrollToSection('testimonials')} className="text-gray-600 hover:text-blue-600 transition-colors duration-300 transform hover:scale-110">Testimonials</button>
          </nav>
          
          <div className="flex space-x-4">
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <ScrollReveal variant="up">
          <section className="py-20 px-4 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent"></div>
            <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10 transform transition-all duration-700 animate-fadeInLeft">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Healthcare Reimagined with <span className="text-blue-600 animate-pulse">AI</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 transition-opacity duration-500 hover:opacity-80">
                  Instant medical insights, seamless doctor connections, and intelligent health management—all in one platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => navigate('/login')}
                    className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:-translate-y-1"
                  >
                    Get Started
                  </button>
                  <button className="px-8 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:-translate-y-1">
                    See Demo
                  </button>
                </div>
              </div>
              <div className="md:w-1/2 relative h-64 sm:h-80 md:h-96 transform transition-all duration-700 animate-fadeInRight">
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl transform transition-transform duration-500 hover:scale-105 hover:rotate-2" style={{ transform: 'perspective(1000px)' }}>
                  <img 
                    src="/images/image.png" 
                    alt="AI-powered healthcare" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent transition-opacity duration-500 hover:opacity-70"></div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Features Section */}
        <ScrollReveal variant="right">
          <section id="features" className="py-16 bg-white/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold gradient-text mb-4 animate-bounce">Powerful Features</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto transition-opacity duration-500 hover:opacity-80">
                  Our platform combines AI technology with healthcare expertise to create a seamless experience for both patients and doctors.
                </p>
              </div>
              
              <div className="flex justify-center mb-10">
                <div className="inline-flex p-1 bg-gray-100 rounded-lg shadow-lg">
                  <button 
                    onClick={() => setActiveTab('patients')}
                    className={`px-6 py-2 rounded-md transform transition-all duration-300 hover:scale-105 hover:shadow-md ${activeTab === 'patients' ? 'bg-white shadow-md text-blue-600' : 'text-gray-600'}`}
                  >
                    For Patients
                  </button>
                  <button 
                    onClick={() => setActiveTab('doctors')}
                    className={`px-6 py-2 rounded-md transform transition-all duration-300 hover:scale-105 hover:shadow-md ${activeTab === 'doctors' ? 'bg-white shadow-md text-blue-600' : 'text-gray-600'}`}
                  >
                    For Doctors
                  </button>
                </div>
              </div>
              
              {activeTab === 'patients' ? (
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="feature-card bg-blue-50/50 backdrop-blur-sm p-6 rounded-xl shadow-lg transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:rotate-1" style={{ transform: 'perspective(1000px)' }}>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 transform transition-transform duration-300 hover:rotate-12">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 transition-colors duration-300 hover:text-blue-600">Smart Medical Records</h3>
                    <p className="text-gray-600 transition-opacity duration-300 hover:opacity-80">
                      Store and access your complete medical history, reports, and past consultations in one secure place.
                    </p>
                  </div>
                  
                  <div className="feature-card bg-blue-50/50 backdrop-blur-sm p-6 rounded-xl shadow-lg transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:rotate-1" style={{ transform: 'perspective(1000px)' }}>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 transform transition-transform duration-300 hover:rotate-12">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 transition-colors duration-300 hover:text-blue-600">AI Medical Assistant</h3>
                    <p className="text-gray-600 transition-opacity duration-300 hover:opacity-80">
                      Get instant medical insights and preliminary diagnoses through our AI-powered assistant available 24/7.
                    </p>
                  </div>
                  
                  <div className="feature-card bg-blue-50/50 backdrop-blur-sm p-6 rounded-xl shadow-lg transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:rotate-1" style={{ transform: 'perspective(1000px)' }}>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 transform transition-transform duration-300 hover:rotate-12">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 transition-colors duration-300 hover:text-blue-600">Doctor Connection</h3>
                    <p className="text-gray-600 transition-opacity duration-300 hover:opacity-80">
                      Easily connect with qualified doctors for virtual consultations when you need expert medical advice.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="feature-card bg-blue-50/50 backdrop-blur-sm p-6 rounded-xl shadow-lg transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:rotate-1" style={{ transform: 'perspective(1000px)' }}>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 transform transition-transform duration-300 hover:rotate-12">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 transition-colors duration-300 hover:text-blue-600">Appointment Management</h3>
                    <p className="text-gray-600 transition-opacity duration-300 hover:opacity-80">
                      Set your availability, manage appointments, and organize your patient schedule efficiently.
                    </p>
                  </div>
                  
                  <div className="feature-card bg-blue-50/50 backdrop-blur-sm p-6 rounded-xl shadow-lg transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:rotate-1" style={{ transform: 'perspective(1000px)' }}>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 transform transition-transform duration-300 hover:rotate-12">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 transition-colors duration-300 hover:text-blue-600">AI Chatbot Creation</h3>
                    <p className="text-gray-600 transition-opacity duration-300 hover:opacity-80">
                      Create your own AI-powered WhatsApp chatbot to handle patient inquiries and pre-screen cases.
                    </p>
                  </div>
                  
                  <div className="feature-card bg-blue-50/50 backdrop-blur-sm p-6 rounded-xl shadow-lg transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:rotate-1" style={{ transform: 'perspective(1000px)' }}>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 transform transition-transform duration-300 hover:rotate-12">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 transition-colors duration-300 hover:text-blue-600">Fee Management</h3>
                    <p className="text-gray-600 transition-opacity duration-300 hover:opacity-80">
                      Set your consultation fees, manage payments, and track your earnings in one convenient dashboard.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </ScrollReveal>

        {/* How It Works Section */}
        <ScrollReveal variant="left">
          <section id="how-it-works" className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-pulse">How It Works</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto transition-opacity duration-500 hover:opacity-80">
                  Our platform simplifies healthcare by connecting patients with AI assistance and qualified doctors.
                </p>
              </div>
              
              <div className="grid md:grid-cols-4 gap-8 relative">
                {/* Step 1 */}
                <div className="text-center relative z-10 group">
                  <div className="mb-4 relative transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto relative z-20 shadow-lg transform transition-transform duration-300 group-hover:rotate-12" style={{ transform: 'perspective(500px)' }}>
                      1
                    </div>
                    <div className="hidden md:block absolute top-1/2 right-[-2rem] w-[calc(50%+2rem)] h-0.5 bg-blue-200 transform -translate-y-1/2 z-0 transition-all duration-500 group-hover:bg-blue-400">
                      <div className="absolute right-0 w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-blue-200 transform -translate-y-1/2 transition-all duration-500 group-hover:border-l-blue-400 animate-pulse"></div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 transition-colors duration-300 group-hover:text-blue-600">Create Profile</h3>
                  <p className="text-gray-600 transform transition-opacity duration-500 group-hover:opacity-80">
                    Sign up and create your health profile with medical history and concerns.
                  </p>
                </div>
                
                {/* Step 2 */}
                <div className="text-center relative z-10 group">
                  <div className="mb-4 relative transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto relative z-20 shadow-lg transform transition-transform duration-300 group-hover:rotate-12" style={{ transform: 'perspective(500px)' }}>
                      2
                    </div>
                    <div className="hidden md:block absolute top-1/2 left-[-2rem] w-[calc(50%+2rem)] h-0.5 bg-blue-200 transform -translate-y-1/2 z-0 transition-all duration-500 group-hover:bg-blue-400"></div>
                    <div className="hidden md:block absolute top-1/2 right-[-2rem] w-[calc(50%+2rem)] h-0.5 bg-blue-200 transform -translate-y-1/2 z-0 transition-all duration-500 group-hover:bg-blue-400">
                      <div className="absolute right-0 w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-blue-200 transform -translate-y-1/2 transition-all duration-500 group-hover:border-l-blue-400 animate-pulse"></div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 transition-colors duration-300 group-hover:text-blue-600">AI Consultation</h3>
                  <p className="text-gray-600 transform transition-opacity duration-500 group-hover:opacity-80">
                    Describe your symptoms to get initial insights from our AI medical assistant.
                  </p>
                </div>
                
                {/* Step 3 */}
                <div className="text-center relative z-10 group">
                  <div className="mb-4 relative transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto relative z-20 shadow-lg transform transition-transform duration-300 group-hover:rotate-12" style={{ transform: 'perspective(500px)' }}>
                      3
                    </div>
                    <div className="hidden md:block absolute top-1/2 left-[-2rem] w-[calc(50%+2rem)] h-0.5 bg-blue-200 transform -translate-y-1/2 z-0 transition-all duration-500 group-hover:bg-blue-400"></div>
                    <div className="hidden md:block absolute top-1/2 right-[-2rem] w-[calc(50%+2rem)] h-0.5 bg-blue-200 transform -translate-y-1/2 z-0 transition-all duration-500 group-hover:bg-blue-400">
                      <div className="absolute right-0 w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-blue-200 transform -translate-y-1/2 transition-all duration-500 group-hover:border-l-blue-400 animate-pulse"></div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 transition-colors duration-300 group-hover:text-blue-600">Doctor Connection</h3>
                  <p className="text-gray-600 transform transition-opacity duration-500 group-hover:opacity-80">
                    If needed, connect with a qualified doctor for a virtual consultation.
                  </p>
                </div>
                
                {/* Step 4 */}
                <div className="text-center relative z-10 group">
                  <div className="mb-4 relative transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto relative z-20 shadow-lg transform transition-transform duration-300 group-hover:rotate-12" style={{ transform: 'perspective(500px)' }}>
                      4
                    </div>
                    <div className="hidden md:block absolute top-1/2 left-[-2rem] w-[calc(50%+2rem)] h-0.5 bg-blue-200 transform -translate-y-1/2 z-0 transition-all duration-500 group-hover:bg-blue-400"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 transition-colors duration-300 group-hover:text-blue-600">Follow Up</h3>
                  <p className="text-gray-600 transform transition-opacity duration-500 group-hover:opacity-80">
                    Receive follow-up care and easy access to your medical records and treatment plans.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Testimonials Section */}
        <ScrollReveal variant="up">
          <section id="testimonials" className="py-16 bg-white/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold gradient-text mb-4 animate-bounce">What Our Users Say</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto transition-opacity duration-500 hover:opacity-80">
                  Healthcare professionals and patients alike trust our platform for reliable medical assistance.
                </p>
              </div>
              
              <div className="testimonials-slider px-4">
                <Slider {...sliderSettings}>
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="px-2">
                      <div className="testimonial-card bg-gray-50 p-6 rounded-xl h-full shadow-lg transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:rotate-1" style={{ transform: 'perspective(1000px)' }}>
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 transform transition-transform duration-300 hover:rotate-12">
                            <span className="text-blue-600 font-bold animate-pulse">{testimonial.initial}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold transition-colors duration-300 hover:text-blue-600">{testimonial.name}</h4>
                            <p className="text-gray-500 text-sm">{testimonial.role}</p>
                          </div>
                        </div>
                        <p className="text-gray-600 transition-opacity duration-300 hover:opacity-80">"{testimonial.quote}"</p>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </main>

      {/* Footer Section */}
      <ScrollReveal variant="up">
        <footer className="bg-gray-900/95 backdrop-blur-md text-white py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="transform transition-all duration-500 hover:scale-105">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:rotate-12" style={{ transform: 'perspective(500px)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-xl font-bold transition-colors duration-300 hover:text-blue-400">MediConnect AI</span>
                </div>
                <p className="text-gray-400 transition-opacity duration-300 hover:opacity-80">
                  Revolutionizing healthcare with AI technology.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4 transition-colors duration-300 hover:text-blue-400">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:translate-x-2">About Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:translate-x-2">Careers</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:translate-x-2">Blog</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4 transition-colors duration-300 hover:text-blue-400">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:translate-x-2">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:translate-x-2">Terms of Service</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:translate-x-2">Cookie Policy</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4 transition-colors duration-300 hover:text-blue-400">Contact Us</h4>
                <ul className="space-y-2">
                  <li className="text-gray-400 transition-opacity duration-300 hover:opacity-80">support@mediconnect.ai</li>
                  <li className="text-gray-400 transition-opacity duration-300 hover:opacity-80">+1 (555) 123-4567</li>
                  <li>
                    <button
                      onClick={() => setIsContactModalOpen(true)}
                      className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:translate-x-2"
                    >
                      Report an Issue
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p className="transition-opacity duration-300 hover:opacity-80">© {new Date().getFullYear()} MediConnect AI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </ScrollReveal>

      {/* Contact Us Modal */}
      {isContactModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md p-6 m-4 transform transition-all duration-500 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Report an Issue</h3>
        <button
          onClick={() => setIsContactModalOpen(false)}
          className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Role Selection */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            I am a
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleFormChange}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 backdrop-blur-sm appearance-none pl-4 pr-8 py-2"
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>

        {/* Email Field (for both roles) */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleFormChange}
            className={`mt-1 block w-full rounded-lg border-gray-300 shadow-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 backdrop-blur-sm pl-4 pr-4 py-2 ${
              formErrors.email ? 'border-red-500' : ''
            }`}
            aria-invalid={!!formErrors.email}
            aria-describedby={formErrors.email ? 'email-error' : undefined}
          />
          {formErrors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-500">
              {formErrors.email}
            </p>
          )}
        </div>

        {/* Doctor ID Field (only for doctors) */}
        {formData.role === 'doctor' && (
          <div>
            <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700">
              Doctor ID
            </label>
            <input
              id="doctorId"
              name="doctorId"
              type="text"
              value={formData.doctorId || ''}
              onChange={handleFormChange}
              className={`mt-1 block w-full rounded-lg border-gray-300 shadow-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 backdrop-blur-sm pl-4 pr-4 py-2 ${
                formErrors.doctorId ? 'border-red-500' : ''
              }`}
              aria-invalid={!!formErrors.doctorId}
              aria-describedby={formErrors.doctorId ? 'doctorId-error' : undefined}
            />
            {formErrors.doctorId && (
              <p id="doctorId-error" className="mt-1 text-sm text-red-500">
                {formErrors.doctorId}
              </p>
            )}
          </div>
        )}

        {/* Subject Field */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleFormChange}
            className={`mt-1 block w-full rounded-lg border-gray-300 shadow-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 backdrop-blur-sm pl-4 pr-4 py-2 ${
              formErrors.subject ? 'border-red-500' : ''
            }`}
            aria-invalid={!!formErrors.subject}
            aria-describedby={formErrors.subject ? 'subject-error' : undefined}
          />
          {formErrors.subject && (
            <p id="subject-error" className="mt-1 text-sm text-red-500">
              {formErrors.subject}
            </p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            rows={4}
            className={`mt-1 block w-full rounded-lg border-gray-300 shadow-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 backdrop-blur-sm pl-4 pr-4 py-2 ${
              formErrors.description ? 'border-red-500' : ''
            }`}
            aria-invalid={!!formErrors.description}
            aria-describedby={formErrors.description ? 'description-error' : undefined}
          />
          {formErrors.description && (
            <p id="description-error" className="mt-1 text-sm text-red-500">
              {formErrors.description}
            </p>
          )}
        </div>

        {/* Screenshot Upload Field (only for doctors) */}
        {formData.role === 'doctor' && (
          <div>
            <label htmlFor="screenshot" className="block text-sm font-medium text-gray-700">
              Upload Screenshot (Optional)
            </label>
            <input
              id="screenshot"
              name="screenshot"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setFormData((prev) => ({ ...prev, screenshot: file || null }));
              }}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-all duration-300"
            />
          </div>
        )}

        {/* Form Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsContactModalOpen(false)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};
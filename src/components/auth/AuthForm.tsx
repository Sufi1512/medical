import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Loader2, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

interface AuthFormProps {
  type: 'login' | 'register';
}

interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  role: 'doctor' | 'patient';
  specialty?: string;
  licenseId?: string;
  qualifications?: string;
  phone?: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'doctor' | 'patient'>('patient');
  const [specialty, setSpecialty] = useState('');
  const [licenseId, setLicenseId] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);
  const { signIn, register, isLoading, error, resetError } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    resetError();
    return () => resetError();
  }, [resetError]);

  // Real-time validation
  useEffect(() => {
    const newErrors: Record<string, string> = {};

    if (email && !email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (password) {
      if (password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long';
        setPasswordStrength('weak');
      } else if (password.length < 12 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        newErrors.password = 'Password should include uppercase letters and numbers for better strength';
        setPasswordStrength('medium');
      } else {
        setPasswordStrength('strong');
      }
    }

    if (type === 'register' && fullName && !fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (type === 'register' && role === 'doctor' && specialty && !specialty.trim()) {
      newErrors.specialty = 'Specialty is required for doctors';
    }

    if (type === 'register' && role === 'doctor' && licenseId && !licenseId.trim()) {
      newErrors.licenseId = 'License ID is required for doctors';
    }

    if (type === 'register' && role === 'doctor' && qualifications && !qualifications.trim()) {
      newErrors.qualifications = 'Qualifications are required for doctors';
    }

    if (type === 'register' && !agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
  }, [email, password, fullName, role, specialty, licenseId, qualifications, agreeTerms, type]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (type === 'register') {
      if (!fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }

      if (role === 'doctor') {
        if (!specialty.trim()) {
          newErrors.specialty = 'Specialty is required for doctors';
        }
        if (!licenseId.trim()) {
          newErrors.licenseId = 'License ID is required for doctors';
        }
        if (!qualifications.trim()) {
          newErrors.qualifications = 'Qualifications are required for doctors';
        }
      }

      if (!agreeTerms) {
        newErrors.agreeTerms = 'You must agree to the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (type === 'login') {
        await signIn(email, password);
      } else {
        const registerData: RegisterData = {
          full_name: fullName,
          email,
          password,
          role,
          specialty: role === 'doctor' ? specialty : undefined,
          licenseId: role === 'doctor' ? licenseId : undefined,
          qualifications: role === 'doctor' ? qualifications : undefined,
          phone,
        };
        await register(registerData);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-100 rounded-full opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md">
        {/* MediConnect AI Branding */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg transform transition-all duration-500 hover:shadow-xl hover:scale-105">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-md transform transition-transform duration-300 hover:rotate-12 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-blue-900 tracking-tight">MediConnect AI</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full animate-fade-in backdrop-blur-sm bg-opacity-90 transform transition-all duration-500 hover:shadow-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 animate-pulse">
            {type === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2 transform transition-all duration-300 hover:scale-105">
              <XCircle size={20} className="text-red-500" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {type === 'register' && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`mt-1 block w-full rounded-lg border-gray-300 shadow-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 transform hover:shadow-lg hover:-translate-y-1 ${
                      errors.fullName ? 'border-red-500' : ''
                    } pl-10 pr-4 py-3 bg-gray-50/50 backdrop-blur-sm`}
                    disabled={isLoading}
                    aria-invalid={!!errors.fullName}
                    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                </div>
                {errors.fullName && (
                  <p id="fullName-error" className="mt-1 text-sm text-red-500">
                    {errors.fullName}
                  </p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`mt-1 block w-full rounded-lg border-gray-300 shadow-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 transform hover:shadow-lg hover:-translate-y-1 ${
                    errors.email ? 'border-red-500' : ''
                  } pl-10 pr-4 py-3 bg-gray-50/50 backdrop-blur-sm`}
                  disabled={isLoading}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </span>
              </div>
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`mt-1 block w-full rounded-lg border-gray-300 shadow-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 transform hover:shadow-lg hover:-translate-y-1 ${
                    errors.password ? 'border-red-500' : ''
                  } pl-10 pr-12 py-3 bg-gray-50/50 backdrop-blur-sm`}
                  disabled={isLoading}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2v1H7v2h10v-2h-1v-1zm-2 0v1H9v-1c0-.552.448-1 1-1s1 .448 1 1zm2 5H7v2h10v-2h-5z" />
                  </svg>
                </span>
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-300"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {password && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-gray-600">Strength:</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden bg-gray-200">
                    <div
                      className={`h-full transition-all duration-500 ${
                        passwordStrength === 'weak'
                          ? 'w-1/3 bg-red-500'
                          : passwordStrength === 'medium'
                          ? 'w-2/3 bg-yellow-500'
                          : 'w-full bg-green-500'
                      }`}
                    />
                  </div>
                </div>
              )}
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            {type === 'register' && (
              <>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <div className="relative">
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value as 'doctor' | 'patient')}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 transform hover:shadow-lg hover:-translate-y-1 pl-10 pr-4 py-3 bg-gray-50/50 backdrop-blur-sm appearance-none"
                      disabled={isLoading}
                    >
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                    </select>
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </span>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </div>
                </div>

                {role === 'doctor' && (
                  <>
                    <div>
                      <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
                        Specialty
                      </label>
                      <div className="relative">
                        <input
                          id="specialty"
                          type="text"
                          value={specialty}
                          onChange={(e) => setSpecialty(e.target.value)}
                          className={`mt-1 block w-full rounded-lg border-gray-300 shadow-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 transform hover:shadow-lg hover:-translate-y-1 ${
                            errors.specialty ? 'border-red-500' : ''
                          } pl-10 pr-4 py-3 bg-gray-50/50 backdrop-blur-sm`}
                          disabled={isLoading}
                          aria-invalid={!!errors.specialty}
                          aria-describedby={errors.specialty ? 'specialty-error' : undefined}
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a2 2 0 012-2h2a2 2 0 012 2v5m-4 0h4" />
                          </svg>
                        </span>
                      </div>
                      {errors.specialty && (
                        <p id="specialty-error" className="mt-1 text-sm text-red-500">
                          {errors.specialty}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="licenseId" className="block text-sm font-medium text-gray-700">
                        License ID
                      </label>
                      <div className="relative">
                        <input
                          id="licenseId"
                          type="text"
                          value={licenseId}
                          onChange={(e) => setLicenseId(e.target.value)}
                          className={`mt-1 block w-full rounded-lg border-gray-300 shadow-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 transform hover:shadow-lg hover:-translate-y-1 ${
                            errors.licenseId ? 'border-red-500' : ''
                          } pl-10 pr-4 py-3 bg-gray-50/50 backdrop-blur-sm`}
                          disabled={isLoading}
                          aria-invalid={!!errors.licenseId}
                          aria-describedby={errors.licenseId ? 'licenseId-error' : undefined}
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        </span>
                      </div>
                      {errors.licenseId && (
                        <p id="licenseId-error" className="mt-1 text-sm text-red-500">
                          {errors.licenseId}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700">
                        Qualifications (e.g., MD, MBBS)
                      </label>
                      <div className="relative">
                        <input
                          id="qualifications"
                          type="text"
                          value={qualifications}
                          onChange={(e) => setQualifications(e.target.value)}
                          className={`mt-1 block w-full rounded-lg border-gray-300 shadow-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 transform hover:shadow-lg hover:-translate-y-1 ${
                            errors.qualifications ? 'border-red-500' : ''
                          } pl-10 pr-4 py-3 bg-gray-50/50 backdrop-blur-sm`}
                          disabled={isLoading}
                          aria-invalid={!!errors.qualifications}
                          aria-describedby={errors.qualifications ? 'qualifications-error' : undefined}
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </span>
                      </div>
                      {errors.qualifications && (
                        <p id="qualifications-error" className="mt-1 text-sm text-red-500">
                          {errors.qualifications}
                        </p>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone (Optional)
                  </label>
                  <div className="relative">
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-md focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 transform hover:shadow-lg hover:-translate-y-1 pl-10 pr-4 py-3 bg-gray-50/50 backdrop-blur-sm"
                      disabled={isLoading}
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="agreeTerms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 transform transition-all duration-300 hover:scale-110"
                    disabled={isLoading}
                    aria-invalid={!!errors.agreeTerms}
                    aria-describedby={errors.agreeTerms ? 'agreeTerms-error' : undefined}
                  />
                  <label htmlFor="agreeTerms" className="text-sm text-gray-700">
                    I agree to the{' '}
                    <a href="/terms" className="text-blue-600 hover:underline transition-colors duration-300">
                      Terms and Conditions
                    </a>
                  </label>
                </div>
                {errors.agreeTerms && (
                  <p id="agreeTerms-error" className="mt-1 text-sm text-red-500">
                    {errors.agreeTerms}
                  </p>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              aria-label={type === 'login' ? 'Sign in' : 'Register'}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Loading...
                </>
              ) : type === 'login' ? (
                'Sign In'
              ) : (
                'Register'
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {type === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <a
                href={type === 'login' ? '/register' : '/login'}
                className="text-blue-600 hover:underline transition-colors duration-300"
                aria-label={type === 'login' ? 'Go to register page' : 'Go to login page'}
              >
                {type === 'login' ? 'Register' : 'Login'}
              </a>
            </p>
            {type === 'login' && (
              <p className="mt-2 text-sm text-gray-600">
                <a href="/forgot-password" className="text-blue-600 hover:underline transition-colors duration-300" aria-label="Go to forgot password page">
                  Forgot Password?
                </a>
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        @keyframes blob {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};
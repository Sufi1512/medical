export type UserRole = 'doctor' | 'patient';

export interface User {
  id: string;
  email: string;
  password: string; // In a real app, this would be stored securely
  role: UserRole;
  full_name: string;
  created_at: string;
}

export interface Doctor extends User {
  specialization: string;
  experience_years: number;
  consultation_fee: number;
  available_slots: string[];
}

export interface Patient extends User {
  date_of_birth: string;
  medical_history: string[];
  allergies: string[];
}

export interface Appointment {
  id: string;
  doctor_id: string;
  patient_id: string;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  type: 'direct' | 'ai_assisted';
  notes?: string;
}
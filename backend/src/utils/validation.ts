import { AppError } from './errorHandler';

export const validateAppointmentData = (data: any) => {
  const { patientId, doctorId, dateTime, type } = data;

  if (!patientId) {
    throw new AppError('Patient ID is required', 400);
  }

  if (!doctorId) {
    throw new AppError('Doctor ID is required', 400);
  }

  if (!dateTime) {
    throw new AppError('Appointment date and time are required', 400);
  }

  if (type && !['regular', 'emergency', 'follow-up'].includes(type)) {
    throw new AppError('Invalid appointment type', 400);
  }

  // Validate that the appointment time is in the future
  if (new Date(dateTime) < new Date()) {
    throw new AppError('Appointment time must be in the future', 400);
  }

  return true;
};

export const validatePatientData = (data: any) => {
  const { name, email, phone } = data;

  if (!name) {
    throw new AppError('Name is required', 400);
  }

  if (!email) {
    throw new AppError('Email is required', 400);
  }

  if (!phone) {
    throw new AppError('Phone number is required', 400);
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError('Invalid email format', 400);
  }

  // Phone validation (basic)
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  if (!phoneRegex.test(phone)) {
    throw new AppError('Invalid phone number format', 400);
  }

  return true;
}; 
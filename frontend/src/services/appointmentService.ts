import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

interface AppointmentData {
  patientId: string;
  doctorId: string;
  dateTime: Date;
  type: 'regular' | 'emergency' | 'follow-up';
}

export const useAppointmentService = () => {
  const getAvailableSlots = async (doctorId: string, date: Date) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/appointments/available-slots`,
        { params: { doctorId, date: date.toISOString() } }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching available slots:', error);
      throw error;
    }
  };

  const bookAppointment = async (appointmentData: AppointmentData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/appointments`,
        appointmentData
      );
      return response.data;
    } catch (error) {
      console.error('Error booking appointment:', error);
      throw error;
    }
  };

  const getPatientAppointments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/appointments/patient`);
      return response.data;
    } catch (error) {
      console.error('Error fetching patient appointments:', error);
      throw error;
    }
  };

  return {
    getAvailableSlots,
    bookAppointment,
    getPatientAppointments,
  };
}; 
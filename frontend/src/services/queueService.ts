import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

export const useQueueService = () => {
  const getQueueStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/queue/status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching queue status:', error);
      throw error;
    }
  };

  const checkIn = async (appointmentId: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/queue/check-in`, {
        appointmentId,
      });
      return response.data;
    } catch (error) {
      console.error('Error checking in:', error);
      throw error;
    }
  };

  return {
    getQueueStatus,
    checkIn,
  };
}; 
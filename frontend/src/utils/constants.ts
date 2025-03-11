export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // This will work because we're serving frontend and backend from same domain
  : 'http://localhost:3000/api';

export const DATE_FORMAT = 'YYYY-MM-DD';
export const TIME_FORMAT = 'HH:mm';

export const QUEUE_REFRESH_INTERVAL = 30000; // 30 seconds 
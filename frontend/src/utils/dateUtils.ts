import { format, parseISO } from 'date-fns';
import { DATE_FORMAT, TIME_FORMAT } from './constants';

export const formatDate = (date: Date | string): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, DATE_FORMAT);
};

export const formatTime = (date: Date | string): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, TIME_FORMAT);
};

export const combineDateTime = (date: Date, timeString: string): Date => {
  const [hours, minutes] = timeString.split(':');
  const newDate = new Date(date);
  newDate.setHours(parseInt(hours), parseInt(minutes));
  return newDate;
}; 
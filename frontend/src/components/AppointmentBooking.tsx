import React, { useState, useEffect } from 'react';
import { useAppointmentService } from '../services/appointmentService';
import { DatePicker } from './DatePicker';
import { TimeSlotSelector } from './TimeSlotSelector';

interface AppointmentBookingProps {
  patientId: string;
}

export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ patientId }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const { getAvailableSlots, bookAppointment } = useAppointmentService();

  useEffect(() => {
    if (selectedDate && selectedDoctor) {
      loadAvailableSlots();
    }
  }, [selectedDate, selectedDoctor]);

  const loadAvailableSlots = async () => {
    if (!selectedDate || !selectedDoctor) return;
    const slots = await getAvailableSlots(selectedDoctor, selectedDate);
    setAvailableSlots(slots);
  };

  const handleBookAppointment = async (timeSlot: string) => {
    try {
      await bookAppointment({
        patientId,
        doctorId: selectedDoctor,
        dateTime: new Date(`${selectedDate?.toDateString()} ${timeSlot}`),
        type: 'regular'
      });
      // Show success message
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className="appointment-booking">
      <h2>Book an Appointment</h2>
      <DatePicker
        selected={selectedDate}
        onChange={date => setSelectedDate(date)}
      />
      <DoctorSelector
        value={selectedDoctor}
        onChange={doctor => setSelectedDoctor(doctor)}
      />
      <TimeSlotSelector
        slots={availableSlots}
        onSelect={handleBookAppointment}
      />
    </div>
  );
}; 
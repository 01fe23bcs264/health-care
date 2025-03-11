import React from 'react';
import { AppointmentBooking } from '../components/AppointmentBooking';
import { QueueManagement } from '../components/QueueManagement';

export const AppointmentPage: React.FC = () => {
  // In a real app, you'd get this from auth context or route params
  const patientId = "current-patient-id";

  return (
    <div className="appointment-page">
      <h1>Book Your Appointment</h1>
      <div className="appointment-container">
        <AppointmentBooking patientId={patientId} />
        <QueueManagement />
      </div>
    </div>
  );
}; 
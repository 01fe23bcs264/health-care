import React, { useState, useEffect } from 'react';
import { useAppointmentService } from '../services/appointmentService';
import { formatDate, formatTime } from '../utils/dateUtils';

interface AppointmentInfo {
  id: string;
  dateTime: string;
  doctorName: string;
  status: string;
  queueNumber: number;
  estimatedWaitTime: number;
}

export const DashboardPage: React.FC = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState<AppointmentInfo[]>([]);
  const [pastAppointments, setPastAppointments] = useState<AppointmentInfo[]>([]);
  const { getPatientAppointments } = useAppointmentService();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointments = await getPatientAppointments();
        const now = new Date();
        
        setUpcomingAppointments(
          appointments.filter(apt => new Date(apt.dateTime) > now)
        );
        setPastAppointments(
          appointments.filter(apt => new Date(apt.dateTime) <= now)
        );
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="dashboard-page">
      <h1>My Dashboard</h1>
      
      <section className="upcoming-appointments">
        <h2>Upcoming Appointments</h2>
        {upcomingAppointments.map(appointment => (
          <div key={appointment.id} className="appointment-card">
            <h3>Appointment with Dr. {appointment.doctorName}</h3>
            <p>Date: {formatDate(appointment.dateTime)}</p>
            <p>Time: {formatTime(appointment.dateTime)}</p>
            <p>Queue Number: {appointment.queueNumber}</p>
            <p>Estimated Wait: {appointment.estimatedWaitTime} minutes</p>
            <p>Status: {appointment.status}</p>
          </div>
        ))}
      </section>

      <section className="past-appointments">
        <h2>Past Appointments</h2>
        {pastAppointments.map(appointment => (
          <div key={appointment.id} className="appointment-card">
            <h3>Appointment with Dr. {appointment.doctorName}</h3>
            <p>Date: {formatDate(appointment.dateTime)}</p>
            <p>Time: {formatTime(appointment.dateTime)}</p>
            <p>Status: {appointment.status}</p>
          </div>
        ))}
      </section>
    </div>
  );
}; 
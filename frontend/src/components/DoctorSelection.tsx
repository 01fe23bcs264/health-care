import React, { useState, useEffect } from 'react';
import { useAppointmentService } from '../services/appointmentService';
import { formatDate, formatTime } from '../utils/dateUtils';

interface Doctor {
  _id: string;
  name: string;
  speciality: string;
  consultationFee: number;
  experience: number;
  isAvailable: boolean;
  availableSlots: number;
  consultationHours: {
    start: string;
    end: string;
  };
}

export const DoctorSelection: React.FC<{
  onDoctorSelect: (doctorId: string) => void;
  selectedDate: Date;
}> = ({ onDoctorSelect, selectedDate }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState('');
  const { getAvailableDoctors } = useAppointmentService();

  useEffect(() => {
    if (selectedSpeciality && selectedDate) {
      loadAvailableDoctors();
    }
  }, [selectedSpeciality, selectedDate]);

  const loadAvailableDoctors = async () => {
    try {
      const availableDoctors = await getAvailableDoctors(selectedSpeciality, selectedDate);
      setDoctors(availableDoctors);
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
  };

  return (
    <div className="doctor-selection">
      <div className="speciality-filter">
        <select
          value={selectedSpeciality}
          onChange={(e) => setSelectedSpeciality(e.target.value)}
        >
          <option value="">Select Speciality</option>
          <option value="General">General Physician</option>
          <option value="Cardiology">Cardiologist</option>
          <option value="Pediatrics">Pediatrician</option>
          {/* Add more specialities */}
        </select>
      </div>

      <div className="doctors-list">
        {doctors.map(doctor => (
          <div key={doctor._id} className="doctor-card">
            <h3>Dr. {doctor.name}</h3>
            <p>Speciality: {doctor.speciality}</p>
            <p>Experience: {doctor.experience} years</p>
            <p>Consultation Fee: ${doctor.consultationFee}</p>
            <p>Available Slots: {doctor.availableSlots}</p>
            <p>Consultation Hours: {doctor.consultationHours.start} - {doctor.consultationHours.end}</p>
            <button
              onClick={() => onDoctorSelect(doctor._id)}
              disabled={!doctor.isAvailable}
            >
              {doctor.isAvailable ? 'Select Doctor' : 'Not Available'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}; 
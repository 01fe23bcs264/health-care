import React, { useState, useEffect } from 'react';
import { formatDate } from '../utils/dateUtils';

interface PatientProfile {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  medicalHistory: {
    condition: string;
    diagnosis: string;
    treatment: string;
    date: string;
  }[];
}

export const PatientProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch patient profile
    const fetchProfile = async () => {
      try {
        // Implementation would go here
        const response = await fetch('/api/patient/profile');
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <h1>Patient Profile</h1>
      
      <section className="personal-info">
        <h2>Personal Information</h2>
        {isEditing ? (
          <form>
            {/* Edit form implementation */}
          </form>
        ) : (
          <div className="info-display">
            <p>Name: {profile.name}</p>
            <p>Email: {profile.email}</p>
            <p>Phone: {profile.phone}</p>
            <p>Date of Birth: {formatDate(profile.dateOfBirth)}</p>
          </div>
        )}
      </section>

      <section className="medical-history">
        <h2>Medical History</h2>
        {profile.medicalHistory.map((record, index) => (
          <div key={index} className="medical-record">
            <h3>{record.condition}</h3>
            <p>Diagnosis: {record.diagnosis}</p>
            <p>Treatment: {record.treatment}</p>
            <p>Date: {formatDate(record.date)}</p>
          </div>
        ))}
      </section>
    </div>
  );
}; 
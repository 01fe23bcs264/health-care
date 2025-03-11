import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppointmentPage } from './pages/AppointmentPage';
import { DashboardPage } from './pages/DashboardPage';
import { PatientProfilePage } from './pages/PatientProfilePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/appointments" element={<AppointmentPage />} />
          <Route path="/profile" element={<PatientProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 
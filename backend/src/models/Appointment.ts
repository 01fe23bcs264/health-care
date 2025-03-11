import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  dateTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  priority: {
    type: Number,
    default: 0 // Higher number means higher priority
  },
  queueNumber: Number,
  estimatedWaitTime: Number,
  consultationFee: Number,
  type: {
    type: String,
    enum: ['regular', 'emergency', 'follow-up'],
    default: 'regular'
  }
});

export const Appointment = mongoose.model('Appointment', appointmentSchema); 
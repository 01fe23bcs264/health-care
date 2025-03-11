import mongoose from 'mongoose';

const doctorScheduleSchema = new mongoose.Schema({
  dayOfWeek: {
    type: Number,
    required: true, // 0-6 (Sunday-Saturday)
  },
  startTime: String,
  endTime: String,
  isAvailable: {
    type: Boolean,
    default: true
  }
});

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  speciality: {
    type: String,
    required: true
  },
  consultationFee: {
    type: Number,
    required: true
  },
  experience: Number,
  schedule: [doctorScheduleSchema],
  currentlyAvailable: {
    type: Boolean,
    default: false
  },
  maxPatientsPerDay: {
    type: Number,
    default: 20
  }
});

export const Doctor = mongoose.model('Doctor', doctorSchema); 
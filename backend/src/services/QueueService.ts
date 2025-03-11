import { Types } from 'mongoose';
import { Appointment } from '../models/Appointment';
import { Patient } from '../models/Patient';

export class QueueService {
  async calculatePriority(patientId: string, appointmentType: string): Promise<number> {
    const patient = await Patient.findById(patientId);
    let priority = 0;

    // Base priority by appointment type
    switch (appointmentType) {
      case 'emergency':
        priority += 100;
        break;
      case 'follow-up':
        priority += 50;
        break;
      default:
        priority += 10;
    }

    // Add priority for elderly patients
    if (patient) {
      const age = this.calculateAge(patient.dateOfBirth);
      if (age > 65) priority += 20;
    }

    return priority;
  }

  async calculateWaitTime(doctorId: string, appointmentTime: Date): Promise<number> {
    const appointments = await Appointment.find({
      doctorId,
      dateTime: { $lt: appointmentTime },
      status: 'scheduled',
    }).sort({ dateTime: 1 });

    // Calculate estimated wait time based on previous appointments
    const averageConsultationTime = 15; // minutes
    return appointments.length * averageConsultationTime;
  }

  async getNextQueueNumber(doctorId: string, date: Date): Promise<number> {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const lastAppointment = await Appointment.findOne({
      doctorId,
      dateTime: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({ queueNumber: -1 });

    return (lastAppointment?.queueNumber || 0) + 1;
  }

  async recalculateQueueTimes(doctorId: Types.ObjectId): Promise<void> {
    const appointments = await Appointment.find({
      doctorId,
      status: 'scheduled',
    }).sort({ dateTime: 1 });

    for (const appointment of appointments) {
      appointment.estimatedWaitTime = await this.calculateWaitTime(
        doctorId.toString(),
        appointment.dateTime
      );
      await appointment.save();
    }
  }

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
} 
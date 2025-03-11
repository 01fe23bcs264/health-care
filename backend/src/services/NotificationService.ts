import { Appointment } from '../models/Appointment';
import { Patient } from '../models/Patient';
import { Doctor } from '../models/Doctor';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

export class NotificationService {
  private emailTransporter: any;
  private twilioClient: any;

  constructor() {
    // Initialize email and SMS services
    this.initializeServices();
  }

  async scheduleAppointmentReminders(appointment: any) {
    const patient = await Patient.findById(appointment.patientId);
    const doctor = await Doctor.findById(appointment.doctorId);
    
    // Schedule reminders at different intervals
    const appointmentDate = new Date(appointment.dateTime);
    const reminderTimes = [
      { hours: 24, message: '24 hours' },
      { hours: 2, message: '2 hours' },
      { minutes: 30, message: '30 minutes' }
    ];

    reminderTimes.forEach(time => {
      const reminderDate = new Date(appointmentDate);
      if (time.hours) {
        reminderDate.setHours(reminderDate.getHours() - time.hours);
      }
      if (time.minutes) {
        reminderDate.setMinutes(reminderDate.getMinutes() - time.minutes);
      }

      // Schedule the reminder
      this.scheduleReminder(
        patient,
        doctor,
        appointment,
        reminderDate,
        `Your appointment is in ${time.message}`
      );
    });
  }

  private async scheduleReminder(patient: any, doctor: any, appointment: any, reminderDate: Date, message: string) {
    const now = new Date();
    const delay = reminderDate.getTime() - now.getTime();

    if (delay > 0) {
      setTimeout(async () => {
        await this.sendEmail(
          patient.email,
          'Appointment Reminder',
          `${message} with Dr. ${doctor.name}`
        );

        await this.sendSMS(
          patient.phone,
          `${message} with Dr. ${doctor.name}. Queue number: ${appointment.queueNumber}`
        );
      }, delay);
    }
  }

  async sendAppointmentConfirmation(appointment: any): Promise<void> {
    const patient = await Patient.findById(appointment.patientId);
    
    // Send email notification
    await this.sendEmail(
      patient.email,
      'Appointment Confirmation',
      this.generateConfirmationEmail(appointment)
    );

    // Send SMS notification
    await this.sendSMS(
      patient.phone,
      this.generateConfirmationSMS(appointment)
    );
  }

  async notifyQueueUpdates(doctorId: string): Promise<void> {
    const appointments = await Appointment.find({
      doctorId,
      status: 'scheduled',
    }).populate('patientId');

    for (const appointment of appointments) {
      await this.sendQueueUpdate(appointment);
    }
  }

  private async sendEmail(to: string, subject: string, content: string): Promise<void> {
    // Implement email sending logic (e.g., using nodemailer)
    console.log(`Sending email to ${to}: ${subject}`);
  }

  private async sendSMS(to: string, message: string): Promise<void> {
    // Implement SMS sending logic (e.g., using Twilio)
    console.log(`Sending SMS to ${to}: ${message}`);
  }

  private generateConfirmationEmail(appointment: any): string {
    return `Your appointment has been confirmed for ${appointment.dateTime}`;
  }

  private generateConfirmationSMS(appointment: any): string {
    return `Appointment confirmed for ${appointment.dateTime}`;
  }

  private async sendQueueUpdate(appointment: any): Promise<void> {
    const message = `Your estimated wait time has been updated to ${appointment.estimatedWaitTime} minutes`;
    await this.sendSMS(appointment.patientId.phone, message);
  }
} 
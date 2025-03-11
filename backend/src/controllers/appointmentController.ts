import { Request, Response } from 'express';
import { Appointment } from '../models/Appointment';
import { Doctor } from '../models/Doctor';
import { Patient } from '../models/Patient';
import { QueueService } from '../services/QueueService';
import { NotificationService } from '../services/NotificationService';
import { validateAppointmentData } from '../utils/validation';

export class AppointmentController {
  private queueService: QueueService;
  private notificationService: NotificationService;

  constructor() {
    this.queueService = new QueueService();
    this.notificationService = new NotificationService();
  }

  async getAvailableDoctors(req: Request, res: Response) {
    try {
      const { speciality, date } = req.query;
      const dayOfWeek = new Date(date as string).getDay();

      const doctors = await Doctor.find({
        speciality: speciality,
        'schedule.dayOfWeek': dayOfWeek,
        'schedule.isAvailable': true
      });

      // Check each doctor's appointment count for the requested date
      const availableDoctors = await Promise.all(
        doctors.map(async (doctor) => {
          const appointmentCount = await Appointment.countDocuments({
            doctorId: doctor._id,
            dateTime: {
              $gte: new Date(date as string),
              $lt: new Date(new Date(date as string).setDate(new Date(date as string).getDate() + 1))
            }
          });

          const schedule = doctor.schedule.find(s => s.dayOfWeek === dayOfWeek);
          
          return {
            ...doctor.toObject(),
            isAvailable: appointmentCount < doctor.maxPatientsPerDay,
            availableSlots: doctor.maxPatientsPerDay - appointmentCount,
            consultationHours: {
              start: schedule?.startTime,
              end: schedule?.endTime
            }
          };
        })
      );

      res.status(200).json(availableDoctors);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch available doctors' });
    }
  }

  async createAppointment(req: Request, res: Response) {
    try {
      const { patientId, doctorId, dateTime, type } = req.body;
      validateAppointmentData(req.body);

      const patient = await Patient.findById(patientId);
      const doctor = await Doctor.findById(doctorId);

      if (!patient || !doctor) {
        return res.status(404).json({ error: 'Patient or Doctor not found' });
      }

      // Calculate priority based on age and appointment type
      const priority = await this.queueService.calculatePriority(patient, type);
      const estimatedWaitTime = await this.queueService.calculateWaitTime(doctorId, dateTime);

      const appointment = new Appointment({
        patientId,
        doctorId,
        dateTime,
        type,
        priority,
        estimatedWaitTime,
        consultationFee: doctor.consultationFee,
        queueNumber: await this.queueService.getNextQueueNumber(doctorId, dateTime)
      });

      await appointment.save();

      // Schedule notifications
      await this.notificationService.scheduleAppointmentReminders(appointment);

      res.status(201).json({
        appointment,
        consultationFee: doctor.consultationFee,
        estimatedWaitTime
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create appointment' });
    }
  }

  async updateQueueStatus(req: Request, res: Response) {
    try {
      const { appointmentId } = req.params;
      const appointment = await Appointment.findById(appointmentId);

      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      // Recalculate wait times for all affected appointments
      await this.queueService.recalculateQueueTimes(appointment.doctorId);
      
      // Notify affected patients
      await this.notificationService.notifyQueueUpdates(appointment.doctorId);

      res.status(200).json({ message: 'Queue updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update queue' });
    }
  }

  async getPatientAppointments(req: Request, res: Response) {
    try {
      // In a real app, you'd get the patient ID from the authenticated user
      const patientId = req.user?.id; // Assuming you have authentication middleware

      const appointments = await Appointment.find({
        patientId,
        status: { $in: ['scheduled', 'completed'] }
      })
      .populate('doctorId', 'name')
      .sort({ dateTime: 1 });

      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch appointments' });
    }
  }
} 
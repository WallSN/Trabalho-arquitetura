import type { Appointment } from './Appointment.js';

export interface AppointmentRepository {

  findAll(): Promise<Appointment[]>;

  findOverlapping(start: Date, end: Date): Promise<Appointment[]>;

  save(appointment: Omit<Appointment, 'id'>): Promise<Appointment>;
}
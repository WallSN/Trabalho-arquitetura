import type { Appointment } from '../domain/Appointment.js';
import type { AppointmentRepository } from '../domain/AppointmentRepository.js';

export class SchedulerService {
  private repository: AppointmentRepository;

  constructor(repository: AppointmentRepository) {
    this.repository = repository;
  }

  async listAppointments(): Promise<Appointment[]> {
    return this.repository.findAll();
  }

  async addAppointment(
    startDatetime: Date,
    endDatetime: Date,
    description: string
  ): Promise<Appointment> {
    const overlapping = await this.repository.findOverlapping(
      startDatetime,
      endDatetime
    );

    if (overlapping.length > 0) {
      throw new Error(
        'Conflito de horários: O novo compromisso se sobrepõe a um compromisso existente.'
      );
    }

    const newAppointment: Omit<Appointment, 'id'> = {
      startDatetime,
      endDatetime,
      description,
    };

    return this.repository.save(newAppointment);
  }
}
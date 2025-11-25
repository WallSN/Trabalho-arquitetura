import type { Appointment } from '../domain/Appointment.js';
import type { AppointmentRepository } from '../domain/AppointmentRepository.js';
export declare class SchedulerService {
    private repository;
    constructor(repository: AppointmentRepository);
    listAppointments(): Promise<Appointment[]>;
    addAppointment(startDatetime: Date, endDatetime: Date, description: string): Promise<Appointment>;
}
//# sourceMappingURL=SchedulerService.d.ts.map
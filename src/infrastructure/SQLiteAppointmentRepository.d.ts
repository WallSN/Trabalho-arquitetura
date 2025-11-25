import type { Appointment } from '../domain/Appointment.js';
import type { AppointmentRepository } from '../domain/AppointmentRepository.js';
export declare class SQLiteAppointmentRepository implements AppointmentRepository {
    private db;
    private getDb;
    private mapToAppointment;
    findAll(): Promise<Appointment[]>;
    findOverlapping(start: Date, end: Date): Promise<Appointment[]>;
    save(appointment: Omit<Appointment, 'id'>): Promise<Appointment>;
}
//# sourceMappingURL=SQLiteAppointmentRepository.d.ts.map
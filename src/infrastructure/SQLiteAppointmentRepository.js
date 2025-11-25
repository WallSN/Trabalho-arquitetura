import { initializeDatabase } from './db.js';
import { Database } from 'sqlite';
export class SQLiteAppointmentRepository {
    db = null;
    async getDb() {
        if (!this.db) {
            this.db = await initializeDatabase();
        }
        return this.db;
    }
    mapToAppointment(row) {
        return {
            id: row.id,
            startDatetime: new Date(row.startDatetime),
            endDatetime: new Date(row.endDatetime),
            description: row.description,
        };
    }
    async findAll() {
        const db = await this.getDb();
        const rows = await db.all('SELECT * FROM appointments');
        return rows.map(this.mapToAppointment);
    }
    async findOverlapping(start, end) {
        const db = await this.getDb();
        const startIso = start.toISOString();
        const endIso = end.toISOString();
        const sql = `
      SELECT * FROM appointments
      WHERE (:start < endDatetime) AND (:end > startDatetime)
    `;
        const rows = await db.all(sql, { ':start': startIso, ':end': endIso });
        return rows.map(this.mapToAppointment);
    }
    async save(appointment) {
        const db = await this.getDb();
        const startIso = appointment.startDatetime.toISOString();
        const endIso = appointment.endDatetime.toISOString();
        const result = await db.run('INSERT INTO appointments (startDatetime, endDatetime, description) VALUES (?, ?, ?)', startIso, endIso, appointment.description);
        const lastID = typeof result?.lastID === 'number' ? result.lastID : undefined;
        if (typeof lastID !== 'number') {
            throw new Error('Erro ao obter o id gerado pelo banco de dados.');
        }
        return {
            id: lastID,
            ...appointment,
        };
    }
}
//# sourceMappingURL=SQLiteAppointmentRepository.js.map
export class SchedulerService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async listAppointments() {
        return this.repository.findAll();
    }
    async addAppointment(startDatetime, endDatetime, description) {
        const overlapping = await this.repository.findOverlapping(startDatetime, endDatetime);
        if (overlapping.length > 0) {
            throw new Error('Conflito de horários: O novo compromisso se sobrepõe a um compromisso existente.');
        }
        const newAppointment = {
            startDatetime,
            endDatetime,
            description,
        };
        return this.repository.save(newAppointment);
    }
}
//# sourceMappingURL=SchedulerService.js.map
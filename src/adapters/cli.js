import { SQLiteAppointmentRepository } from '../infrastructure/SQLiteAppointmentRepository.js';
import { SchedulerService } from '../application/SchedulerService.js';
const repository = new SQLiteAppointmentRepository();
const schedulerService = new SchedulerService(repository);
const DATE_REGEX = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
/**
 * Valida o formato e converte a data/hora do formato CLI (dd/mm/aaaa hh:mm) para UTC Date.
 * Lançará erro se o formato for inválido ou se a data for inconsistente (ex: 30/Fev).
 * @param dateStr String da data no formato dd/mm/aaaa
 * @param timeStr String da hora no formato hh:mm
 * @returns Objeto Date em UTC.
 */
function parseDateTimeToUTC(dateStr, timeStr) {
    if (!DATE_REGEX.test(dateStr)) {
        throw new Error('Formato de data inválido. Use dd/mm/aaaa (ex: 25/12/2024).');
    }
    if (!TIME_REGEX.test(timeStr)) {
        throw new Error('Formato de hora inválido. Use hh:mm (00:00 - 23:59).');
    }
    const [day, month, year] = dateStr.split('/').map(Number);
    const [hour, minute] = timeStr.split(':').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day, hour, minute));
    if (isNaN(date.getTime()) ||
        date.getUTCDate() !== day ||
        date.getUTCMonth() !== (month - 1) ||
        date.getUTCFullYear() !== year) {
        throw new Error('Data ou hora inválida/inconsistente (ex: dia inexistente para o mês ou hora fora do limite).');
    }
    return date;
}
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    try {
        switch (command) {
            case 'listar_compromissos':
                await listAppointmentsHandler();
                break;
            case 'adicionar_compromisso':
                await addAppointmentHandler(args.slice(1));
                break;
            default:
                console.log('\nComando desconhecido. Use "listar_compromissos" ou "adicionar_compromisso".');
                console.log('Exemplo: adicionar_compromisso "25/12/2025" "14:00" "15:00" "Reunião de Natal"');
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`\nERRO: ${error.message}`);
        }
        else {
            console.error('\nERRO desconhecido:', String(error));
        }
    }
}
async function listAppointmentsHandler() {
    const appointments = await schedulerService.listAppointments();
    if (appointments.length === 0) {
        console.log('\nNenhum compromisso cadastrado.');
        return;
    }
    console.log('\n**Compromissos Agendados (Horários em UTC):**');
    const dataToDisplay = appointments.map((appt) => ({
        ID: appt.id,
        Início_UTC: appt.startDatetime.toISOString().slice(0, 19).replace('T', ' '),
        Fim_UTC: appt.endDatetime.toISOString().slice(0, 19).replace('T', ' '),
        Descrição: appt.description,
    }));
    console.table(dataToDisplay);
}
async function addAppointmentHandler(args) {
    if (args.length !== 4) {
        throw new Error('Uso incorreto. Formato: adicionar_compromisso "dd/mm/aaaa" "hh:mm_inicio" "hh:mm_fim" "descricao"');
    }
    const [dateStr, startTimeStr, endTimeStr, description] = args;
    if (typeof description !== 'string' || description.trim() === '') {
        throw new Error('Erro: a descrição é obrigatória e não pode ser vazia.');
    }
    const startDatetimeUTC = parseDateTimeToUTC(dateStr, startTimeStr);
    const endDatetimeUTC = parseDateTimeToUTC(dateStr, endTimeStr);
    if (endDatetimeUTC <= startDatetimeUTC) {
        throw new Error('A hora de fim deve ser posterior à hora de início.');
    }
    const newAppt = await schedulerService.addAppointment(startDatetimeUTC, endDatetimeUTC, description);
    console.log(`\nCompromisso cadastrado com sucesso!`);
    console.log(`   ID: ${newAppt.id}`);
    console.log(`   Descrição: ${newAppt.description}`);
    console.log(`   Início (UTC): ${newAppt.startDatetime.toISOString()}`);
    console.log(`   Fim (UTC): ${newAppt.endDatetime.toISOString()}`);
}
main();
//# sourceMappingURL=cli.js.map
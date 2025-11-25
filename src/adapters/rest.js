import express, {} from 'express';
import { SQLiteAppointmentRepository } from '../infrastructure/SQLiteAppointmentRepository.js';
import { SchedulerService } from '../application/SchedulerService.js';
const repository = new SQLiteAppointmentRepository();
const schedulerService = new SchedulerService(repository);
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
const DATE_REGEX = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/; // dd/mm/aaaa
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/; // hh:mm (00:00 - 23:59)
function parseDateTimeToUTC(dateStr, timeStr) {
    if (!DATE_REGEX.test(dateStr)) {
        throw new Error('Formato de data inválido. Use dd/mm/aaaa (ex: 25/12/2025).');
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
app.get('/compromissos', async (req, res) => {
    try {
        const appointments = await schedulerService.listAppointments();
        const responseData = appointments.map(appt => ({
            id: appt.id,
            start_datetime_utc: appt.startDatetime.toISOString().slice(0, 19) + 'Z',
            end_datetime_utc: appt.endDatetime.toISOString().slice(0, 19) + 'Z',
            descricao: appt.description,
        }));
        return res.json(responseData);
    }
    catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        console.error('Erro ao listar compromissos:', errMsg);
        return res.status(500).json({ error: 'Erro interno ao buscar dados.' });
    }
});
app.post('/compromissos', async (req, res) => {
    const { data, hora_inicio, hora_fim, descricao } = req.body;
    if (!data || !hora_inicio || !hora_fim || !descricao || typeof descricao !== 'string' || descricao.trim() === '') {
        return res.status(400).json({
            error: 'Todos os campos (data, hora_inicio, hora_fim) e uma descrição não vazia são obrigatórios.'
        });
    }
    let startDatetimeUTC;
    let endDatetimeUTC;
    try {
        startDatetimeUTC = parseDateTimeToUTC(data, hora_inicio);
        endDatetimeUTC = parseDateTimeToUTC(data, hora_fim);
        if (endDatetimeUTC <= startDatetimeUTC) {
            return res.status(400).json({ error: 'A hora de fim deve ser posterior à hora de início.' });
        }
    }
    catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        return res.status(400).json({ error: errMsg });
    }
    try {
        const newAppt = await schedulerService.addAppointment(startDatetimeUTC, endDatetimeUTC, descricao);
        return res.status(201).json({
            id: newAppt.id,
            message: 'Compromisso cadastrado com sucesso!',
            start_datetime_utc: newAppt.startDatetime.toISOString(),
            end_datetime_utc: newAppt.endDatetime.toISOString(),
            descricao: newAppt.description,
        });
    }
    catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        if (errMsg.includes('Conflito de horários')) {
            return res.status(409).json({ error: errMsg });
        }
        console.error('Erro desconhecido ao adicionar compromisso:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});
app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`Servidor REST rodando em http://localhost:${PORT}`);
    console.log(`GET  /compromissos`);
    console.log(`POST /compromissos { data, hora_inicio, hora_fim, descricao }`);
    console.log(`======================================================`);
});
//# sourceMappingURL=rest.js.map
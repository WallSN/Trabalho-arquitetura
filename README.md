npm run dev:cli listar_compromissos
npm run dev:cli adicionar_compromisso "25/12/2025" "14:00" "15:00" "Reunião de Natal"
npm run dev:rest
http://localhost:3000/
GET  /compromissos
POST /compromissos JSON { data, hora_inicio, hora_fim, descricao }

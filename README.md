Descrição
- Pequena API para gerenciar compromissos (listar e cadastrar).

Comandos
- npm run dev:cli listar_compromissos  
    -> Lista todos os compromissos via CLI.

- npm run dev:cli adicionar_compromisso "25/12/2025" "14:00" "15:00" "Reunião de Natal"  
    -> Adiciona um compromisso Parâmetros: data (DD/MM/YYYY), hora_inicio (HH:MM), hora_fim (HH:MM), descricao.

- npm run dev:rest  
    -> Inicia a API REST em http://localhost:3000/

API (REST)
- GET  /compromissos  
    -> Retorna a lista de compromissos.

- POST /compromissos  
    -> Cria um compromisso.
    Exemplo de body:
    {
        "data": "25/12/2025",
        "hora_inicio": "14:00",
        "hora_fim": "15:00",
        "descricao": "Reunião de Natal"
    }

Exemplos
- Listar:
    http://localhost:3000/compromissos

- Criar via POST usando query string:
    http://localhost:3000/compromissos?data=25/12/2025&hora_inicio=14:00&hora_fim=15:00&descricao=Reunião%20de%20Natal

- Criar via POST usando query string com valores codificados:
    http://localhost:3000/compromissos?data=25%2F12%2F2025&hora_inicio=14%3A00&hora_fim=15%3A00&descricao=Reuni%C3%A3o%20de%20Natal

Observações
- Formatos: data -> DD/MM/YYYY, horas -> HH:MM (24h).  
- Validação: garanta que hora_inicio < hora_fim e que os formatos estejam corretos antes de inserir.
- Porta padrão: 3000 (ajuste conforme configuração).
- Ao enviar parâmetros na URL, certifique-se de codificar caracteres especiais (espaços, acentos, barras, dois-pontos) quando necessário.

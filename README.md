Descrição
- Projeto em TypeScript para gerenciar compromissos (listar e cadastrar).

Como usar
- Clonar o repositório
- rodar o comando "npm install" para instalação das dependências
Comandos:
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

Listar compromissos (GET):
http://localhost:3000/compromissos

Criar compromisso (POST) via Postman (body JSON):
URL: http://localhost:3000/compromissos

Body:
{
"data": "25/12/2025",
"hora_inicio": "14:00",
"hora_fim": "15:00",
"descricao": "Reunião de Natal"
}

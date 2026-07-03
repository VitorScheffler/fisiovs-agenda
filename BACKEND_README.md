# FisioVS — Backend (Next.js API Routes + Prisma + SQLite)

## O que foi implementado

- **Banco de dados**: Prisma + SQLite (`prisma/schema.prisma`), com modelos
  `User`, `Patient`, `AppointmentHistoryEntry`, `TeamMember`, `Appointment`.
- **Autenticação**: login real com `bcryptjs` (hash de senha) e sessão via
  cookie httpOnly assinado com JWT (`jose`). Rotas:
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `GET /api/auth/me`
- **Middleware** (`middleware.ts`): protege `/home`, `/agenda`, `/pacientes`,
  `/equipe`, `/solicitacoes`, `/configuracoes` (somente staff) e `/agendar`
  (somente paciente), redirecionando para `/login` se não houver sessão.
- **CRUDs**:
  - `GET/POST /api/patients`, `GET/PATCH/DELETE /api/patients/[id]`
  - `GET/POST /api/appointments`, `PATCH/DELETE /api/appointments/[id]`
  - `POST /api/appointments/[id]/approve` e `/reject`
  - `GET/POST /api/team`, `PATCH/DELETE /api/team/[id]`
- **Frontend**: `AppContext` agora consome as APIs reais (sem mais
  `lib/mock-data` para dados de negócio — só restaram constantes de UI como
  dias da semana e horários). Páginas `agenda`, `pacientes`, `home`,
  `solicitacoes`, `equipe`, `configuracoes`, `login`, `agendar` foram
  atualizadas.

## Passos para rodar (ambiente com acesso à internet)

```bash
npm install

# Gera o Prisma Client (baixa engine binaries de binaries.prisma.sh)
npx prisma generate

# Cria o banco SQLite e aplica o schema
npx prisma db push

# Popula com dados de exemplo (usuários, pacientes, agendamentos)
npm run db:seed

npm run dev
```

> ⚠️ Os comandos `prisma generate` e `prisma db push` precisam baixar
> binários de `binaries.prisma.sh`. Em ambientes sandboxed sem acesso a esse
> domínio (como o usado para gerar este código), esses passos falham com
> `403 Forbidden`. Rode-os em um ambiente com rede irrestrita (sua máquina
> local, CI, ou produção).

## Usuários de teste (criados pelo seed)

| Papel              | E-mail                | Senha        |
|--------------------|-----------------------|--------------|
| Admin/Fisioterapeuta | vitoria@fisiovs.com | admin123     |
| Fisioterapeuta     | rafael@fisiovs.com    | fisio123     |
| Secretária         | larissa@fisiovs.com   | sec123       |
| Paciente           | camila@email.com      | paciente123  |

## Variáveis de ambiente (.env)

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="troque-este-segredo-em-producao-fisiovs-2026"
```

**Troque `JWT_SECRET` por um valor aleatório forte em produção.**

## Próximos passos sugeridos

- Adicionar formulário de "Novo agendamento" (atualmente o modal mostra
  placeholder) usando `POST /api/appointments`.
- Adicionar formulário de cadastro/edição de paciente usando
  `POST/PATCH /api/patients`.
- Adicionar página de gestão de equipe com criação/edição via
  `POST/PATCH /api/team`.
- Implementar troca de senha (`PATCH /api/auth/me` ou rota dedicada).
- Considerar paginação em `/api/patients` e `/api/appointments` conforme o
  volume de dados crescer.

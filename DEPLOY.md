# Deploy em produção (Docker)

## Pré-requisitos no host (VM/LXC no Proxmox)
- Docker + Docker Compose plugin instalados.
- Porta 3000 livre (ou ajuste o mapeamento em `docker-compose.yml`).

## 1. Preparar o `.env.production`
```bash
cp .env.production.example .env.production
```
Edite o arquivo e troque `JWT_SECRET` por um valor aleatório forte:
```bash
openssl rand -base64 48
```
Cole o resultado em `JWT_SECRET`. **Não reutilize o valor de exemplo.**

## 2. Build e subida
```bash
docker compose build
docker compose up -d
```
Isso builda a imagem (Next.js standalone + Prisma) e sobe o container.
No start, o `docker-entrypoint.sh` roda `prisma migrate deploy` automaticamente
— aplica as migrations existentes em `prisma/migrations/` no banco SQLite
persistido no volume `fisiovs_data` (montado em `/data` dentro do container).

## 3. Popular o banco (primeira vez)
O seed **não** roda automaticamente (ele apaga todos os dados antes de
recriar — não é algo pra rodar sozinho a cada restart). Rode manualmente
uma vez, depois do primeiro `up`:
```bash
docker compose exec fisiovs-agenda node_modules/.bin/tsx prisma/seed.ts
```
Isso apaga qualquer dado existente e recria só o usuário de TI
(`vitor.scheffler@hotmail.com`) — o mesmo `seed.ts` que já está no repo.

## 4. Conferir se subiu
```bash
docker compose logs -f fisiovs-agenda
curl -I http://localhost:3000
```

## 5. Backup do banco
O SQLite fica no volume nomeado `fisiovs_data`. Para copiar o arquivo pra
fora do Docker:
```bash
docker run --rm -v fisiovs-agenda_fisiovs_data:/data -v $(pwd):/backup alpine \
  cp /data/prod.db /backup/prod-$(date +%F).db
```
Automatize isso com um cron no host (ou uma stack de backup que você já
tenha rodando no Proxmox).

## 6. Atualizar para uma nova versão
```bash
git pull
docker compose build
docker compose up -d
```
As migrations novas (se houver) são aplicadas automaticamente no start.

## 7. Reverse proxy / HTTPS
Este compose só expõe a porta 3000 em HTTP. Coloque na frente um reverse
proxy (Nginx Proxy Manager, Traefik, Caddy — o que você já usa no homelab)
apontando para `http://<ip-do-host>:3000` e cuidando do TLS.

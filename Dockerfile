# syntax=docker/dockerfile:1

################################
# 1. deps — instala node_modules
################################
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
COPY package.json package-lock.json ./
RUN npm ci

################################
# 2. builder — gera Prisma Client e build do Next.js
################################
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Necessário só para o build conseguir importar @prisma/client tipado;
# não precisa de banco real neste estágio.
RUN npx prisma generate

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

################################
# 3. runner — imagem final, enxuta
################################
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl su-exec
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Output standalone do Next.js: server.js + node_modules mínimos já embutidos
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma CLI + schema/migrations + client gerado, necessários para rodar
# `prisma migrate deploy` no entrypoint antes de subir o servidor.
COPY --from=builder /app/node_modules/.bin/prisma ./node_modules/.bin/prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
# Binário do query engine — o file tracing do output standalone às vezes
# não copia esse diretório sozinho, então garantimos explicitamente aqui.
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# tsx só é usado para rodar `prisma/seed.ts` manualmente via `docker compose
# exec` (ver DEPLOY.md) — não faz parte do server em si.
COPY --from=builder /app/node_modules/.bin/tsx ./node_modules/.bin/tsx
COPY --from=builder /app/node_modules/tsx ./node_modules/tsx

COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]

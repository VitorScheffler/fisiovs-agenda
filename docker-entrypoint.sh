#!/bin/sh
set -e

# Os volumes nomeados do Docker são criados com dono root por padrão. Ajusta
# para o usuário não-root (nextjs, uid 1001) que vai rodar o processo do node.
if [ -d /data ]; then
  chown -R nextjs:nodejs /data
fi
if [ -d /app/public/uploads ]; then
  chown -R nextjs:nodejs /app/public/uploads
fi

echo "Aplicando migrations do Prisma em $DATABASE_URL..."
su-exec nextjs node_modules/.bin/prisma migrate deploy

echo "Iniciando servidor..."
exec su-exec nextjs "$@"

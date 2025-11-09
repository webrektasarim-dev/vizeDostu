#!/usr/bin/env bash
# Render start script

echo "Running database migrations..."
npx prisma migrate deploy

echo "Seeding database (FORCE)..."
npm run prisma:seed
SEED_EXIT=$?

if [ $SEED_EXIT -eq 0 ]; then
  echo "✅ Seed completed successfully"
else
  echo "⚠️ Seed failed with exit code $SEED_EXIT, but continuing..."
fi

echo "Starting application..."
npm run start:prod


#!/usr/bin/env bash
# Render start script

echo "Running database migrations..."
npx prisma migrate deploy

echo "Seeding database..."
npm run prisma:seed || echo "Seed already run or failed, continuing..."

echo "Starting application..."
npm run start:prod


#!/usr/bin/env bash
# Render start script

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting application..."
npm run start:prod


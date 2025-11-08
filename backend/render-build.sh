#!/usr/bin/env bash
# Render build script

echo "Installing dependencies..."
npm install

echo "Generating Prisma Client..."
npx prisma generate

echo "Building application..."
npm run build

echo "Build completed!"


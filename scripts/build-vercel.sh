#!/usr/bin/env bash
set -euo pipefail

echo "==> Preparing Node.js entry.server for Vercel build..."
cp app/entry.server.tsx app/entry.server.oxygen.tsx.bak
cp app/entry.server.node.tsx app/entry.server.tsx

echo "==> Building client + server with Node.js target..."
npx react-router typegen 2>/dev/null || true
npx vite build --config vite.config.vercel.ts
npx vite build --config vite.config.vercel.ts --ssr server.vercel.ts

echo "==> Restoring Oxygen entry.server..."
mv app/entry.server.oxygen.tsx.bak app/entry.server.tsx

echo "==> Build complete! Output:"
echo "    Client: dist/client/"
echo "    Server: dist/server/"

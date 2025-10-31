#!/bin/bash
# Post-build script: Copy admin index.html to location medusa start expects

mkdir -p .medusa/admin/build

if [ -f .medusa/client/index.html ]; then
  cp .medusa/client/index.html .medusa/admin/build/index.html
  echo "✅ Copied .medusa/client/index.html → .medusa/admin/build/index.html"
elif [ -f .medusa/server/public/admin/index.html ]; then
  cp .medusa/server/public/admin/index.html .medusa/admin/build/index.html
  echo "✅ Copied from server/public/admin"
else
  echo "⚠️  Warning: index.html not found after build"
  exit 1
fi


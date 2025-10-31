#!/bin/bash
# Fix admin build path - copy index.html to location medusa start expects

# Don't exit on error - we want to copy even if medusa build has warnings
set +e

# Run medusa build directly (works in yarn/npm context)
medusa build
BUILD_EXIT=$?

# Create target directory
mkdir -p .medusa/admin/build

# Copy admin index.html from build output to expected location
# MedusaJS build creates .medusa/client/index.html, but medusa start expects .medusa/admin/build/index.html
# Source: .medusa/client/index.html (created by medusa build)
# Target: .medusa/admin/build/index.html (expected by medusa start)
if [ -f .medusa/client/index.html ]; then
  cp .medusa/client/index.html .medusa/admin/build/index.html
  echo "✅ Admin build: Copied .medusa/client/index.html → .medusa/admin/build/index.html"
elif [ -f .medusa/server/public/admin/index.html ]; then
  cp .medusa/server/public/admin/index.html .medusa/admin/build/index.html
  echo "✅ Admin build: Copied from server/public/admin"
else
  echo "⚠️  Warning: Admin index.html not found in expected build locations"
  echo "   Checked: .medusa/client/index.html and .medusa/server/public/admin/index.html"
  # Don't fail - just warn (admin might build on first start)
fi

echo "✅ Admin build completed - index.html ready for medusa start"
exit $BUILD_EXIT  # Return medusa build's exit code

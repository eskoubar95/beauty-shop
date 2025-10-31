#!/usr/bin/env node

/**
 * Build script to create admin panel build directory structure
 * This is a workaround until MedusaJS 2.0 provides proper build command
 */

const fs = require('fs');
const path = require('path');

const adminBuildDir = path.join(process.cwd(), '.medusa', 'admin', 'build');

// Create directory structure
fs.mkdirSync(adminBuildDir, { recursive: true });

// Create minimal index.html
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Medusa Admin</title>
</head>
<body>
  <div id="root"></div>
  <script>
    console.log('Admin panel will be built on first start');
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(adminBuildDir, 'index.html'), indexHtml);

console.log('✅ Admin build directory created at:', adminBuildDir);
console.log('⚠️  Note: Admin panel builds fully on first medusa develop/start run');


#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

function analyzeBundle() {
  console.log('📊 Analyzing bundle sizes...\n')

  const packages = ['ui', 'types', 'config']
  let totalSize = 0

  packages.forEach(pkg => {
    const distPath = path.join(__dirname, '..', 'packages', pkg, 'dist')
    
    if (!fs.existsSync(distPath)) {
      console.log(`❌ ${pkg}: No dist folder found`)
      return
    }

    const files = fs.readdirSync(distPath)
    let pkgSize = 0

    console.log(`📦 @beauty-shop/${pkg}:`)
    
    files.forEach(file => {
      const filePath = path.join(distPath, file)
      const stats = fs.statSync(filePath)
      
      if (stats.isFile()) {
        const sizeKB = (stats.size / 1024).toFixed(2)
        pkgSize += stats.size
        console.log(`   ${file}: ${sizeKB} KB`)
      }
    })

    const pkgSizeKB = (pkgSize / 1024).toFixed(2)
    totalSize += pkgSize
    console.log(`   Total: ${pkgSizeKB} KB\n`)
  })

  const totalSizeKB = (totalSize / 1024).toFixed(2)
  console.log(`🎯 Total bundle size: ${totalSizeKB} KB`)

  // Check for large files
  if (totalSize > 100 * 1024) { // 100KB
    console.log('⚠️  Warning: Total bundle size is large (>100KB)')
    console.log('   Consider code splitting or tree shaking optimization')
  } else {
    console.log('✅ Bundle size is reasonable')
  }

  console.log('\n📈 Bundle analysis complete!')
}

try {
  analyzeBundle()
} catch (error) {
  console.error('💥 Bundle analysis failed:', error.message)
  process.exit(1)
}

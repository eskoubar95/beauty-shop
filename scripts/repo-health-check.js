#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

function checkFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description}: ${filePath}`)
    return true
  } else {
    console.log(`❌ ${description}: ${filePath} - MISSING`)
    return false
  }
}

function checkFileContent(filePath, requiredContent, description) {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ ${description}: File not found`)
    return false
  }
  
  const content = fs.readFileSync(filePath, 'utf8')
  const hasContent = requiredContent.some(text => content.includes(text))
  
  if (hasContent) {
    console.log(`✅ ${description}: Content verified`)
    return true
  } else {
    console.log(`❌ ${description}: Required content missing`)
    return false
  }
}

function repositoryHealthCheck() {
  console.log('🔍 Beauty Shop Repository Health Check\n')
  
  let allChecksPassed = true
  
  // Core repository files
  console.log('📁 Core Repository Files:')
  allChecksPassed &= checkFileExists('package.json', 'Package configuration')
  allChecksPassed &= checkFileExists('README.md', 'Project README')
  allChecksPassed &= checkFileExists('.gitignore', 'Git ignore file')
  allChecksPassed &= checkFileExists('LICENSE', 'License file')
  allChecksPassed &= checkFileExists('CONTRIBUTING.md', 'Contributing guide')
  
  console.log('\n🔧 GitHub Configuration:')
  allChecksPassed &= checkFileExists('.github/workflows/ci.yml', 'CI/CD pipeline')
  allChecksPassed &= checkFileExists('.github/pull_request_template.md', 'PR template')
  allChecksPassed &= checkFileExists('.github/ISSUE_TEMPLATE/bug_report.md', 'Bug report template')
  allChecksPassed &= checkFileExists('.github/ISSUE_TEMPLATE/feature_request.md', 'Feature request template')
  allChecksPassed &= checkFileExists('.github/ISSUE_TEMPLATE/config.yml', 'Issue template config')
  allChecksPassed &= checkFileExists('.github/BRANCH_PROTECTION_SETUP.md', 'Branch protection docs')
  
  console.log('\n📜 Project Documentation:')
  allChecksPassed &= checkFileExists('.project/01-Project_Brief.md', 'Project brief')
  allChecksPassed &= checkFileExists('.project/03-Tech_Stack.md', 'Tech stack documentation')
  allChecksPassed &= checkFileExists('.project/plans/2025-01-21-CORE-4-github-repository-setup.md', 'Implementation plan')
  
  console.log('\n🛠️ Scripts:')
  allChecksPassed &= checkFileExists('scripts/setup-env.js', 'Environment setup script')
  allChecksPassed &= checkFileExists('scripts/validate-env.js', 'Environment validation script')
  allChecksPassed &= checkFileExists('scripts/health-check.js', 'Health check script')
  allChecksPassed &= checkFileExists('scripts/security-audit.js', 'Security audit script')
  allChecksPassed &= checkFileExists('scripts/repo-health-check.js', 'Repository health check script')
  
  // Content validation
  console.log('\n📋 Content Validation:')
  
  // Check package.json has required scripts
  const packageJsonContent = fs.readFileSync('package.json', 'utf8')
  const requiredScripts = [
    'dev', 'build', 'start', 'lint', 'typecheck', 'test',
    'env:setup', 'env:validate', 'env:health', 'security:audit',
    'repo:health', 'repo:check'
  ]
  
  requiredScripts.forEach(script => {
    if (packageJsonContent.includes(`"${script}"`)) {
      console.log(`✅ Package script: ${script}`)
    } else {
      console.log(`❌ Package script: ${script} - MISSING`)
      allChecksPassed = false
    }
  })
  
  // Check README has required sections
  const readmeContent = fs.readFileSync('README.md', 'utf8')
  const requiredReadmeSections = [
    '# Beauty Shop',
    '## 🚀 Tech Stack',
    '## 📋 Prerequisites',
    '## 🛠️ Development Setup',
    '## 🧪 Available Scripts'
  ]
  
  requiredReadmeSections.forEach(section => {
    if (readmeContent.includes(section)) {
      console.log(`✅ README section: ${section}`)
    } else {
      console.log(`❌ README section: ${section} - MISSING`)
      allChecksPassed = false
    }
  })
  
  // Check CI workflow has required jobs
  const ciContent = fs.readFileSync('.github/workflows/ci.yml', 'utf8')
  const requiredCIJobs = ['check:', 'security:', 'build:']
  
  requiredCIJobs.forEach(job => {
    if (ciContent.includes(job)) {
      console.log(`✅ CI job: ${job}`)
    } else {
      console.log(`❌ CI job: ${job} - MISSING`)
      allChecksPassed = false
    }
  })
  
  // Check .gitignore has required patterns
  const gitignoreContent = fs.readFileSync('.gitignore', 'utf8')
  const requiredGitignorePatterns = [
    'node_modules/', '.env', '.next/', 'build/', 'coverage/'
  ]
  
  requiredGitignorePatterns.forEach(pattern => {
    if (gitignoreContent.includes(pattern)) {
      console.log(`✅ Gitignore pattern: ${pattern}`)
    } else {
      console.log(`❌ Gitignore pattern: ${pattern} - MISSING`)
      allChecksPassed = false
    }
  })
  
  // Summary
  console.log('\n📊 Health Check Summary:')
  if (allChecksPassed) {
    console.log('🎉 All repository health checks PASSED!')
    console.log('✅ Repository is ready for development')
    process.exit(0)
  } else {
    console.log('❌ Some repository health checks FAILED!')
    console.log('🔧 Please fix the issues above before proceeding')
    process.exit(1)
  }
}

// Run health check
repositoryHealthCheck()

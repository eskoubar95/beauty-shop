# Secrets Management Guide
**Beauty Shop - Environment Configuration & Security**

## Overview
Denne guide beskriver hvordan secrets og environment variables håndteres sikkert i Beauty Shop projektet.

## Security Principles
- Aldrig commit .env filer til git
- Brug environment-specific secret management
- Roter secrets regelmæssigt
- Minimal privilege access
- Audit trail for alle secret access

## Development Environment
1. Kopier .env.example til .env
2. Udfyld med test/development værdier
3. Brug test keys for alle tredjepartstjenester
4. Valider med `npm run secrets:check`

## Production Environment
1. Brug Vercel Environment Variables for frontend
2. Brug Render Environment Variables for backend
3. Brug AWS Secrets Manager for kritiske secrets
4. Implementer secret rotation

## Secret Rotation Schedule
- JWT secrets: Hver 90 dage
- API keys: Hver 180 dage
- Database passwords: Hver 365 dage

## Emergency Procedures
1. Roter kompromitterede secrets øjeblikkeligt
2. Revoke access til alle services
3. Genopret fra backup
4. Audit alle access logs

## Environment Setup

### Development
```bash
# 1. Copy environment templates
cp .env.example .env
cp .env.local.example .env.local

# 2. Fill in development values
# Use test keys for all third-party services

# 3. Validate environment
npm run env:check
```

### Staging
```bash
# 1. Use staging-specific secrets
# 2. Configure staging database
# 3. Use test keys (not live)
# 4. Validate with staging environment
```

### Production
```bash
# 1. Use secure secret management
# 2. Configure production database
# 3. Use live keys
# 4. Enable monitoring and alerting
```

## Secret Management Services

### Frontend (Vercel)
- Environment Variables in Vercel dashboard
- Automatic deployment on secret changes
- Encrypted at rest and in transit

### Backend (Render)
- Environment Variables in Render dashboard
- Secure secret injection
- No secrets in code or logs

### Critical Secrets (AWS Secrets Manager)
- JWT secrets
- Database passwords
- Master API keys
- Automatic rotation support

## Security Checklist

### Pre-Deployment
- [ ] No .env files in git history
- [ ] All secrets in secure management
- [ ] Production secrets are live keys (not test)
- [ ] CORS configuration is restrictive
- [ ] JWT secrets are cryptographically strong
- [ ] Database connections use SSL

### Post-Deployment
- [ ] Health check endpoints work
- [ ] Database connection established
- [ ] External services (Stripe, Clerk) respond
- [ ] Error tracking (Sentry) works
- [ ] Logs contain no PII

## Monitoring & Alerting

### Secret Access Monitoring
- Track all secret access
- Alert on unusual patterns
- Log all secret rotations
- Monitor for secret leakage

### Environment Health
- Database connectivity
- External service availability
- Secret validity checks
- Performance monitoring

## Incident Response

### Secret Compromise
1. **Immediate Actions**
   - Rotate compromised secrets
   - Revoke all access
   - Audit access logs
   - Notify security team

2. **Investigation**
   - Determine scope of compromise
   - Identify attack vector
   - Review access patterns
   - Document findings

3. **Recovery**
   - Generate new secrets
   - Update all systems
   - Verify security
   - Update procedures

### Environment Failure
1. **Immediate Actions**
   - Check health endpoints
   - Review logs
   - Identify root cause
   - Implement fix

2. **Communication**
   - Notify stakeholders
   - Provide status updates
   - Document resolution
   - Post-mortem review

## Best Practices

### Secret Generation
- Use cryptographically secure random generators
- Minimum 32 characters for JWT secrets
- Use different secrets per environment
- Store securely immediately after generation

### Access Control
- Principle of least privilege
- Regular access reviews
- MFA for all admin accounts
- Audit trail for all changes

### Documentation
- Keep this guide updated
- Document all secret locations
- Maintain emergency procedures
- Regular security training

## Tools & Commands

### Environment Validation
```bash
# Validate current environment
npm run env:validate

# Check for secrets in code
npm run secrets:check

# Health check all services
npm run env:health

# Complete environment check
npm run env:check
```

### Secret Management
```bash
# Generate secure random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Validate JWT secret strength
node scripts/validate-jwt-secret.js

# Rotate secrets (production only)
npm run secrets:rotate
```

## References
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Render Environment Variables](https://render.com/docs/environment-variables)
- [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/)
- [OWASP Secrets Management](https://owasp.org/www-project-secrets-management/)

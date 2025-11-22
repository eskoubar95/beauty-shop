# Railway Troubleshooting Guide

## OOM (Out of Memory) Errors

### Problem: Exit Code 137 - "Killed"

**Symptom:**
```
error Command failed with exit code 137.
Killed
```

**Cause:**
Exit code 137 = 128 + 9 (SIGKILL), which means the process was killed by the OOM (Out of Memory) killer. The MedusaJS worker is using too much memory.

**Solution:**

1. **Memory Limit in package.json** ✅
   - Added `NODE_OPTIONS='--max-old-space-size=400'` to worker start command
   - Limits Node.js heap to 400MB

2. **Railway Service Memory**
   - Check Railway service settings → Resources
   - Ensure service has at least 512MB memory allocated
   - Upgrade plan if needed (Hobby plan: 512MB, Pro plan: 1GB+)

3. **Optimize MedusaJS Configuration**
   - Reduce worker count if using multiple workers
   - Disable unnecessary plugins in production
   - Check for memory leaks in custom code

### Current Configuration

**Worker Start Command:**
```bash
cd .medusa/server && NODE_ENV=production NODE_OPTIONS='--max-old-space-size=400' yarn start --cluster --servers=0 --workers=1
```

**Memory Limit:** 400MB (adjust based on Railway plan)

### Monitoring

**Check Memory Usage in Railway:**
1. Go to Railway Dashboard → Service → Metrics
2. Monitor "Memory Usage" graph
3. If consistently near limit, increase `--max-old-space-size` or upgrade Railway plan

**Check Logs:**
```bash
# Railway CLI
railway logs --service guapo-server
```

### Alternative Solutions

**If 400MB is not enough:**

1. **Increase Memory Limit:**
   ```json
   "start:production:worker": "cd .medusa/server && NODE_ENV=production NODE_OPTIONS='--max-old-space-size=600' yarn start --cluster --servers=0 --workers=1"
   ```

2. **Upgrade Railway Plan:**
   - Hobby: 512MB per service
   - Pro: 1GB+ per service
   - Team: Custom limits

3. **Optimize Worker:**
   - Reduce worker count: `--workers=1` (already set)
   - Disable admin panel in worker: `DISABLE_ADMIN=true`
   - Use Redis for job queue (reduces memory usage)

### Related Files

- `beauty-shop/package.json` - Start commands with memory limits
- `beauty-shop/railway.toml` - Railway deployment configuration
- `beauty-shop/medusa-config.ts` - MedusaJS configuration


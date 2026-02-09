
---

## **n8n Workflow Server**

### **Tagline**
⚡ *Run your workflows anywhere, instantly — no server setup needed.*

---

### **Overview**

**n8n Workflow Server** eliminates the complexity of hosting workflow automation infrastructure. Deploy a complete n8n instance on Apify's platform in minutes — no Docker configuration, no server management, no hosting bills.

This isn't just a hosted dashboard. **n8n Workflow Server** offers three distinct execution modes:

- **🖥️ Interactive Mode**: Build workflows through the full n8n web interface with automatic data preservation
- **🔗 Webhook Mode**: Trigger workflows programmatically via API calls without opening the dashboard — perfect for CI/CD pipelines
- **⏱️ Standby Mode**: Run persistent HTTP endpoints for production workloads without timeout constraints

Your workflow data (credentials, configurations, execution history) survives between runs through automatic backup and restore. Start working immediately, stop when done, resume later — exactly where you left off.

---

### **Why Use n8n Workflow Server?**

**Traditional n8n hosting requires:**
- Purchasing a VPS or cloud instance
- Installing Docker and configuring containers
- Managing SSL certificates and reverse proxies
- Monitoring uptime and handling crashes
- Backing up databases manually
- Paying monthly hosting fees (even when idle)

**n8n Workflow Server simplifies this to:**
- Click "Start" in the Apify Console
- Receive your credentials and public HTTPS URL
- Build workflows or trigger webhooks
- Stop when finished (automatic backup created)
- Resume later from the exact same state

💰 You pay only for actual compute time. No infrastructure management. No monthly hosting commitments.

---

### **Key Features**

#### **🚀 Instant Deployment**
Launch a fully configured n8n server with public HTTPS access in under 2 minutes. No configuration files, no environment variables, no command-line tools.

#### **💾 Automatic Data Persistence**
Every shutdown creates a timestamped backup containing your workflows, credentials (encrypted), and execution history. Upload the backup file when starting a new session to restore your complete environment.

**⚠️ Important Security Notes:**
- **Never share your backup files** — they contain your encrypted credentials. Anyone who uploads your backup will have access to your n8n credentials and workflows.
- Backups are stored in your Actor's Key-Value Store — **you don't need to download them manually** unless you want an external copy.
- **Free tier users**: Apify removes storage after 7 days of inactivity. Download critical backups if you're on the free plan.

#### **⚡ Headless Webhook Execution**

#### **⚡ Headless Webhook Execution**
Run workflows programmatically without the web dashboard. Provide webhook URLs in the Actor input, and **n8n Workflow Server** executes them sequentially, collects results, and outputs downloadable response files. Ideal for automated testing, scheduled ETL jobs, and CI/CD integration.

#### **🎯 Flexible Execution Modes**

**Normal Mode**: Interactive dashboard with intelligent auto-shutdown
- Full n8n web interface
- Configurable idle timeout (30-360 seconds)
- Logout triggers immediate backup and shutdown
- Perfect for development and workflow building

**Webhook Mode**: API-only execution without dashboard access
- Restore backup → activate workflows → execute webhooks → shutdown
- No backup created (assumes read-only usage)
- Returns detailed execution results with download links
- Optimized for automation and testing

**Standby Mode**: Persistent HTTP server for production
- No automatic shutdown
- Continuous availability for incoming requests
- Manual stop creates backup
- Suitable for long-running webhook endpoints

#### **🔐 Secure Credential Handling**
Temporary login credentials generated per container. Public URLs expire when the server stops. Backups contain encrypted credentials following n8n's security model.

---

### **How It Works**

#### **Starting Fresh**
```json
{
  "runMode": "normal",
  "shutdownDelaySeconds": 120
}
```

**Result:**
- Public HTTPS URL (e.g., `https://xxxxx.runs.apify.net`)
- Temporary email and password
- List of active webhook endpoints
- Auto-shutdown after 120 seconds of inactivity

#### **Restoring Previous Session**
```json
{
  "runMode": "normal",
  "n8nDataBackup": "https://api.apify.com/.../n8n-data-2025-10-05.zip",
  "shutdownDelaySeconds": 180
}
```

**Result:**
- All previous workflows restored
- Credentials preserved
- Execution history intact
- Continue working exactly where you stopped

#### **Executing Webhooks Programmatically**
```json
{
  "runMode": "webhook",
  "n8nDataBackup": "https://api.apify.com/.../n8n-data-2025-10-05.zip",
  "startWebhooks": [
    {
      "url": "https://tawgesahnu/n8n/webhook/data-processor",
      "method": "POST",
      "payload": "{\"source\": \"api\", \"records\": 1000}",
      "headers": {"Content-Type": "application/json"}
    }
  ]
}
```

**Result:**
- Server starts without public dashboard
- Workflows activate automatically
- Webhooks execute sequentially
- Detailed results with download links
- Immediate shutdown (no backup created)

---

### **Output Format**

#### **Normal Mode - Server Started**
```json
{
  "mode-type": "production / server_started",
  "timestamp": "2025-10-05T14:30:00.000Z",
  "directUrl-backupUrl": "https://xxxxx.runs.apify.net",
  "email": "user@example.com",
  "password": "secure-password-123",
  "message": "n8n server is now running.",
  "workflows": [
    {
      "workflowName": "Customer Data Processor",
      "webhookUrl": "https://xxxxx.runs.apify.net/webhook/abc-123",
      "method": "POST"
    }
  ]
}
```

#### **Normal Mode - Backup Created**
```json
{
  "mode-type": "production / backup_created",
  "timestamp": "2025-10-05T15:45:00.000Z",
  "directUrl-backupUrl": "https://api.apify.com/.../n8n-data-2025-10-05-15-45-00.zip",
  "message": "Backup created successfully.",
  "workflows": [
    {
      "workflowName": "Customer Data Processor",
      "webhookUrl": "https://tawgesahnu/n8n/webhook/abc-123",
      "method": "POST"
    }
  ]
}
```

#### **Webhook Mode - Execution Results**
```json
{
  "mode": "webhook",
  "status": "completed",
  "timestamp": "2025-10-05T16:00:00.000Z",
  "message": "Executed 2 webhooks",
  "downloaderRunUrl": "https://console.apify.com/actors/.../runs/xyz",
  "results": [
    {
      "url": "https://xxxxx.runs.apify.net/webhook/abc-123",
      "status": "success",
      "fileName": "result-1.json",
      "fileSizeBytes": 157884,
      "downloadUrl": "https://api.apify.com/.../result-1.json"
    }
  ]
}
```

curl -X POST http://localhost:3000/webhook/Test-webhook   -H "Content-Type: application/json"   -d '{"test": "data"}'

curl -X POST http://localhost:5678/webhook/idealista-scraper-api -H "Content-Type: application/json" -d '{
    "Url": "https://www.idealista.com/en/inmueble/105296229/",
    "proxyConfig": {
        "useApifyProxy": true,
        "apifyProxyGroups": [
            "RESIDENTIAL"
        ]
    }
}'



---

### **Common Use Cases**

**🔧 Workflow Development**
Build and test workflows interactively. Auto-shutdown prevents unnecessary compute charges during idle time. Automatic backups ensure your work is never lost.

**🔄 CI/CD Integration**
Execute test workflows as part of your build pipeline. Webhook mode runs headless, returns structured results, and exits cleanly without manual intervention.

**📊 Scheduled ETL Jobs**
Trigger data processing workflows via API calls from cron jobs, Apify Schedules, or external automation tools. Download results programmatically for further processing.

**🌐 Long-Running Services**
Deploy persistent webhook endpoints using Standby mode. No timeout constraints, manual control over shutdown, automatic backup on stop.

**🧪 Multi-Environment Testing**
Maintain separate backup files for development, staging, and production configurations. Switch between environments by uploading different backup files.

---

### **Best Practices**

#### **Backup Management**
- Download backups after making workflow changes
- Keep multiple backup versions for rollback capability
- Test restored backups in webhook mode before production use
- Webhook mode doesn't create backups (design assumption: read-only execution)

#### **Security Considerations**
- Credentials are container-specific and temporary
- Public URLs expire when the server stops
- Backups contain encrypted credentials per n8n's encryption model
- Enable "Container web server" in Actor settings for HTTPS access

#### **Webhook URL Conventions**

**During Runtime (immediate use):**
```
https://xxxxx.runs.apify.net/webhook/your-workflow-id
```

**For Storage (webhook mode input):**
```
https://tawgesahnu/n8n/webhook/your-workflow-id
```

The branded domain format prevents URL expiration issues. **n8n Workflow Server** converts branded URLs to live URLs automatically when executing webhooks.

---

### **Advanced Configuration**

⚙️ Optional parameters for expert users who understand n8n internals:

- **DB_SQLITE_POOL_SIZE**: SQLite concurrent connection limit (default: 2)
- **N8N_BLOCK_ENV_ACCESS_IN_NODE**: Restrict workflow access to environment variables
- **HEALTHCHECK_TIMEOUT**: Startup validation timeout in milliseconds (default: 5000)
- **HEALTHCHECK_MAX_ATTEMPTS**: Retry count before failing startup (default: 60)
- **PROCESS_START_TIMEOUT**: n8n spawn timeout in milliseconds (default: 5000)
- **SHUTDOWN_TIMEOUT**: Graceful shutdown wait time before force-kill (default: 5000)

⚠️ **Warning**: Incorrect advanced settings may cause crashes, data corruption, or startup failures. Leave defaults unless you have specific performance requirements.

---

### **Requirements**

**Apify Platform Configuration**
- Enable "Container web server" in Actor settings (required for Normal and Standby modes)
- Provides public HTTPS URL for dashboard access

**Resource Allocation**
- Minimum: 512MB RAM
- Recommended: 1GB RAM or above for complex workflows
- Cold start time: ~1-2 minutes (Normal mode)
- Total execution time: ~1-3 minutes (Webhook mode)

---

## 📞 Support

### Get Help

- 🌐 **Website**: [flowextractapi.com](https://flowextractapi.com)
- 📧 **Email**: [flowextractapi@outlook.com](mailto:flowextractapi@outlook.com)
- 🙋 **Apify Profile**: [dz_omar](https://apify.com/dz_omar?fpr=smcx63)
- 💬 **GitHub Issues**: [FlowExtractAPI](https://github.com/FlowExtractAPI)

### Social Media

- 💼 **LinkedIn**: [flowextract-api](https://www.linkedin.com/in/flowextract-api/)
- 🐦 **Twitter**: [@FlowExtractAPI](https://x.com/@FlowExtractAPI)
- 📱 **Facebook**: [flowextractapi](https://www.facebook.com/flowextractapi)

---

### **License & Attribution**

- **Actor License**: MIT
- **n8n License**: Fair-code distribution model
- **Data Storage**: All workflow data stored in your Apify account
- **Privacy**: Backups contain your credentials and configurations

---

**Version 1.0** | Built with n8n (latest stable) | Powered by Apify Platform

---
import dotenv from 'dotenv';
import { HealthChecker } from './health-checker.js';

dotenv.config();

const PRIMARY_URL = process.env.PRIMARY_URL || 'http://localhost:3002';
const BACKUP_URL = process.env.BACKUP_URL || 'http://localhost:3003';
const CHECK_INTERVAL = process.env.CHECK_INTERVAL || 5000;

console.log("Starting Watchdog Service...");
console.log(`Monitoring Primary: ${PRIMARY_URL}`);
console.log(`Monitoring Backup: ${BACKUP_URL}`);

const primaryChecker = new HealthChecker('Primary Booking Server', PRIMARY_URL);
const backupChecker = new HealthChecker('Backup Booking Server', BACKUP_URL);

let currentActive = 'PRIMARY';

async function monitor() {
    const primaryStatus = await primaryChecker.check();
    const backupStatus = await backupChecker.check();

    console.log(`[${new Date().toISOString()}] Status Update:`);
    console.log(`  - Primary: ${primaryStatus}`);
    console.log(`  - Backup:  ${backupStatus}`);

    if (currentActive === 'PRIMARY' && primaryStatus === 'DOWN') {
        console.warn("⚠️ PRIMARY SERVER FAILURE DETECTED! INITIATING FAILOVER...");
        if (backupStatus === 'UP') {
            currentActive = 'BACKUP';
            console.log("✅ FAILOVER SUCCESSFUL. TRAFFIC NOW ROUTED TO BACKUP SERVER.");
            // In a real scenario, this might update a DNS record or Load Balancer config via API
            // For NGINX logic, if primary is down, it automatically uses backup, so this log confirms it.
        } else {
            console.error("❌ CRITICAL: BACKUP SERVER IS ALSO DOWN! SYSTEM UNAVAILABLE.");
        }
    } else if (currentActive === 'BACKUP' && primaryStatus === 'UP') {
        console.log("ℹ️ Primary server recovered. Falling back to Primary.");
        currentActive = 'PRIMARY';
    }
}

// Initial check
monitor();

// Interval
setInterval(monitor, CHECK_INTERVAL);

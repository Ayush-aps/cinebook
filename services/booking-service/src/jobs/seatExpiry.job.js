import { db } from "../config/db.js";

setInterval(async () => {
  await db.execute(`
    UPDATE seats 
    SET status='AVAILABLE', hold_expires_at=NULL
    WHERE status='HELD' AND hold_expires_at < NOW()
  `);
}, 60000); // every 1 minute


import fs from 'fs';
import path from 'path';

console.log("CWD:", process.cwd());
console.log("Files in CWD:", fs.readdirSync('.'));

try {
    console.log("Checking src/modules/auth/auth.service.js exists:", fs.existsSync('./src/modules/auth/auth.service.js'));
} catch (e) { console.log(e.message); }

import { authService } from './src/modules/auth/auth.service.js';
import pool from './src/config/db.js';

async function testLogin() {
    // ... existing code ...
    console.log("1. Testing Database Connection...");
    const connection = await pool.getConnection();
    console.log("   ✅ Database Connected!");
    connection.release();

    console.log("2. Testing authService.login('john@example.com', 'password')...");
    const result = await authService.login('john@example.com', 'password');
    console.log("   ✅ Login Successful!");
    console.log("   Token:", result.token ? "Generated" : "Missing");
}

testLogin();

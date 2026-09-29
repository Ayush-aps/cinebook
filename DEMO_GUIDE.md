# 🎬 CineBook Distributed System Demo Guide

This guide provides a step-by-step walkthrough to demonstrate the core distributed systems concepts implemented in this project to your professor or evaluator.

---

## 🛠️ Step 1: System Preparation (Start Here)
Ensure the full distributed environment is running. **Do not run the services manually in separate terminals.** You must use Docker to run the entire system.

1. Open your terminal in the project root.

cd cinebook-distributed-system-integration-test

2. Run the following command to start the distributed system:
   ```powershell
   docker-compose down
   docker-compose up -d --build
   ```
3. Open your browser to: [http://localhost:8080/client](http://localhost:8080/client)

---

## 🚨 Step 2: Demonstrating Fault Tolerance (Failover)
**Goal:** Prove that if the main server crashes, the backup server takes over instantly without dropping the user.

1. **Check Initial State:** Open your browser and check the API health endpoint: [http://localhost:8080/api/booking/health](http://localhost:8080/api/booking/health). It will show you are connected to the "primary" instance.

2. **Open the Watchdog:** Open a new terminal and watch the health monitor:
   ```powershell
   docker-compose logs -f watchdog
   ```
   *(You should see a message saying "Primary: UP, Backup: UP")*

3. **Kill the Primary Server:** Open *another* terminal and intentionally crash the primary server:
   ```powershell
   docker stop cinebook-distributed-system-integration-test-booking-primary-1
   ```

4. **Show the Failover:**
   - Look at the Watchdog logs. It will immediately say: `"⚠️ PRIMARY SERVER FAILURE DETECTED! INITIATING FAILOVER..."`
   - Go back to the health endpoint (`http://localhost:8080/api/booking/health`) and refresh. **It still works!** It will now show you are connected to the "backup" instance. NGINX has seamlessly routed you!

5. **Recover the System:** Start the primary server again:
   ```powershell
   docker start cinebook-distributed-system-integration-test-booking-primary-1
   ```

---

## 🔀 Step 3: Demonstrating Concurrency (Race Conditions)
**Goal:** Prove that two users cannot accidentally book the same seat at the exact same millisecond.

1. Run our automated integration test. This script artificially forces "User A" and "User B" to try and buy the exact same seat at the exact same time:
   ```powershell
   node test-integration.js
   ```
2. **Show the Result:** In the output, point to the section that says `✅ Double Booking Prevented`. Explain that the database uses strict transaction management and row-level locking to block the second transaction.

---

## 💾 Step 4: Demonstrating Database Replication
**Goal:** Prove that data written to the main database is automatically copied to the backup database.

1. **Make a Booking:** Go to the browser and successfully book a ticket.
2. **Query the Primary Database:** Prove the data was saved.
   ```powershell
   docker exec cinebook-distributed-system-integration-test-mysql-primary-1 mysql -u cinebook_user -pcinebook_password -D cinebook_db -e "SELECT * FROM bookings;"
   ```
3. **Query the Replica Database:** Prove the data was instantly copied over.
   ```powershell
   docker exec cinebook-distributed-system-integration-test-mysql-replica-1 mysql -u cinebook_user -pcinebook_password -D cinebook_db -e "SELECT * FROM bookings;"
   ```
   *Explain that both commands show the exact same data, proving the Replica database is syncing perfectly.*

---

## ⚖️ Step 5: Demonstrating Scalability & Transparency
**Goal:** Explain the underlying architecture to your evaluator.
*   **Transparency:** Point out that the user only ever visits `localhost:8080`. They have absolutely no idea that there are multiple backend servers (ports 3002, 3003) or multiple databases handling their request.
*   **Scalability:** Explain that NGINX acts as a load balancer to distribute traffic, and the Database Replica offloads read-heavy operations. This means the system can handle a massive number of concurrent users compared to a monolithic application.

---

## 🎥 Demo Video (Click the video to watch)

[![Demo Video](https://img.youtube.com/vi/ONe85SKjPSg/0.jpg)](https://www.youtube.com/watch?v=ONe85SKjPSg)

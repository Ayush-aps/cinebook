import fs from 'fs';

const BASE_URL = 'http://127.0.0.1:8080'; // Nginx port 8080 (Force IPv4)

async function runTests() {
    console.log("🎬 Starting CineBook Integration Tests...\n");

    // 1. Health Check
    console.log("1️⃣ Checking System Health...");
    try {
        const res = await fetch(`${BASE_URL}/api/booking/health`);
        if (!res.ok) {
            throw new Error(`Status ${res.status}: ${await res.text()}`);
        }
        const health = await res.json();
        console.log("   ✅ Health Check Passed:", health);
    } catch (e) {
        console.error("   ❌ Health Check Failed:", e.message);
        if (e.cause) console.error("      Cause:", e.cause);
        console.log("      (If 'fetch failed', Docker might not be ready or NGINX is unreachable. Wait 30s and try again.)");
        process.exit(1);
    }

    // 2. Create Booking
    console.log("\n2️⃣ Testing Ticket Reservation...");
    let bookingId;
    const userId = 1;
    const seatIds = [1, 2]; // Assuming these exist from seed

    try {
        const res = await fetch(`${BASE_URL}/api/booking/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                showtimeId: 1,
                seatIds,
                totalAmount: 700
            })
        });

        if (res.ok) {
            const data = await res.json();
            bookingId = data.data.bookingId;
            console.log("   ✅ Booking Successful! ID:", bookingId);
        } else {
            const err = await res.text();
            console.error("   ❌ Booking Failed:", err);
        }
    } catch (e) {
        console.error("   ❌ Request Failed:", e.message);
    }

    // 3. Test Concurrency (Double Booking)
    console.log("\n3️⃣ Testing Concurrency (Double Booking)...");
    if (bookingId) {
        try {
            const res = await fetch(`${BASE_URL}/api/booking/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 2, // Different user
                    showtimeId: 1,
                    seatIds, // SAME SEATS
                    totalAmount: 700
                })
            });

            if (res.status === 400) { // Expecting error
                const err = await res.json();
                console.log("   ✅ Double Booking Prevented:", err.error);
            } else {
                console.error("   ❌ TEST FAILED: System allowed double booking!");
            }
        } catch (e) {
            console.error("   ❌ Request Failed:", e.message);
        }
    }

    // 4. Cancel Booking
    console.log("\n4️⃣ Testing Ticket Cancellation...");
    if (bookingId) {
        try {
            const res = await fetch(`${BASE_URL}/api/booking/${bookingId}/cancel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });

            if (res.ok) {
                console.log("   ✅ Cancellation Successful");
            } else {
                const err = await res.text();
                console.error("   ❌ Cancellation Failed:", err);
            }

        } catch (e) {
            console.error("   ❌ Request Failed:", e.message);
        }
    }

    console.log("\n🏁 Tests Completed.");
}

runTests();

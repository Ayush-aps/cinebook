
import http from 'http';

// Testing with INVALID credentials to see error response
const data = JSON.stringify({
    email: 'nonexistent@example.com',
    password: 'wrongpassword'
});

const options = {
    hostname: 'nginx', // Hitting Nginx Service Name
    port: 80,
    path: '/api/auth/login', // Full path via Gateway
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log(`Sending Request to http://${options.hostname}:${options.port}${options.path}`);

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();

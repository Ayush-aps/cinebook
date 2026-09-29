import axios from 'axios';

export class HealthChecker {
    constructor(serviceName, url) {
        this.serviceName = serviceName;
        this.url = url;
        this.status = 'UNKNOWN';
        this.lastChecked = null;
    }

    async check() {
        try {
            const response = await axios.get(`${this.url}/health`, { timeout: 2000 });
            if (response.status === 200) {
                this.status = 'UP';
            } else {
                this.status = 'DEGRADED';
            }
        } catch (error) {
            this.status = 'DOWN';
            // console.error(`Error checking ${this.serviceName}: ${error.message}`);
        }
        this.lastChecked = new Date();
        return this.status;
    }
}

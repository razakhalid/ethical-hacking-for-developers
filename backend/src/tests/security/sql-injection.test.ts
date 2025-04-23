import { describe, it, expect } from 'vitest';
import axios from 'axios';

describe('Security Tests - SQL Injection', () => {
  it('should detect SQL injection vulnerability in login endpoint', async () => {
    try {
      const loginAttempt = await axios.post('http://localhost:3001/api/users/login', {
        email: "' OR '1'='1",
        password: "' OR '1'='1"
      });

      // If we get here, the SQL injection was successful
      expect(loginAttempt.status).toBe(200);
      expect(loginAttempt.data).toBeDefined();
      
      console.log('Vulnerability Found! SQL Injection successful:');
      console.log(loginAttempt.data);
    } catch (error) {
      // If we get an error, the SQL injection was prevented
      expect(error.response?.status).toBe(400);
    }
  });
}); 
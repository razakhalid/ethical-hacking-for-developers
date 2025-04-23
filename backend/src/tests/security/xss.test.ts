import { describe, it, expect } from 'vitest';
import axios from 'axios';

describe('Security Tests - XSS', () => {
  it('should detect XSS vulnerability in todo creation', async () => {
    try {
      // Register a test user
      const registerResponse = await axios.post('http://localhost:3001/api/users/register', {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      const token = registerResponse.data.token;

      // Create a todo with XSS payload
      const xssPayload = '<script>alert("XSS Attack!");</script>';
      const createTodoResponse = await axios.post(
        'http://localhost:3001/api/todos',
        {
          text: xssPayload,
          isPrivate: false
        },
        {
          headers: {
            'x-auth-token': token
          }
        }
      );

      // If we get here, the XSS payload was stored
      expect(createTodoResponse.status).toBe(201);
      expect(createTodoResponse.data.text).toContain(xssPayload);
      
      console.log('Vulnerability Found! XSS payload successfully stored:');
      console.log(createTodoResponse.data);

      // Retrieve the todo to verify the payload is stored
      const getTodoResponse = await axios.get(
        `http://localhost:3001/api/todos/${createTodoResponse.data._id}`,
        {
          headers: {
            'x-auth-token': token
          }
        }
      );

      expect(getTodoResponse.status).toBe(200);
      expect(getTodoResponse.data.text).toContain(xssPayload);
      
      console.log('Retrieved todo with XSS payload:');
      console.log(getTodoResponse.data);

    } catch (error) {
      // If we get an error, the XSS was prevented
      expect(error.response?.status).toBe(400);
    }
  });
}); 
import { describe, it, expect } from 'vitest';
import axios from 'axios';

describe('Security Tests - Broken Access Control', () => {
  it('should detect broken access control in private todos', async () => {
    let status;
    let privateNote;
    try {
      // Create two users
      const user1 = await axios.post('http://localhost:3001/api/users/register', {
        name: 'User1',
        email: 'user1@test.com',
        password: 'password123'
      });

      const user2 = await axios.post('http://localhost:3001/api/users/register', {
        name: 'User2',
        email: 'user2@test.com',
        password: 'password123'
      });

      // Login as User1
      const login1 = await axios.post('http://localhost:3001/api/users/login', {
        email: 'user1@test.com',
        password: 'password123'
      });

      // Create a todo with private note as User1
      const todo1 = await axios.post(
        'http://localhost:3001/api/todos',
        {
          title: 'User1 Todo',
          description: 'This is User1\'s todo',
          privateNote: 'This is a private note for User1 only'
        },
        {
          headers: {
            Authorization: `Bearer ${login1.data.token}`
          }
        }
      );

      // Login as User2
      const login2 = await axios.post('http://localhost:3001/api/users/login', {
        email: 'user2@test.com',
        password: 'password123'
      });

      // Try to access User1's todo as User2
      const todoAccess = await axios.get(
        `http://localhost:3001/api/todos/${todo1.data.id}`,
        {
          headers: {
            Authorization: `Bearer ${login2.data.token}`
          }
        }
      );

      // If we get here, the broken access control was successful
      status = todoAccess.status;
      privateNote = todoAccess.data.privateNote;
      
      console.log('Vulnerability Found! User2 can access User1\'s private note:');
      console.log(todoAccess.data);

    } catch (error) {
      // If we get an error, the access control is working
      expect(error.response?.status).toBe(400);
    }
    expect(status).toBe(400);
    expect(privateNote).toBeFalsy();
  });
}); 
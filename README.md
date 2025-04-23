# Vulnerable TODO Application

This application is intended to serve as an example of security vulnerabilities that exist in web applications. The "main" branch of this application is intentionally built with security vulnerabilities. Other branches focus on a fix for a particular vulnerability.

## Vulnerabilities in this Application

1. **Broken Access Control**
   - Users can access other users' TODOs
   - Demonstration of improper authorization checks

2. **SQL Injection**
   - Vulnerable search functionality
   - Demonstration of unsafe database queries

3. **Identification and Authentication Failures**
   - Weak password policies
   - Insecure session management
   - No rate limiting

4. **Cryptographic Failures**
   - Plain text storage of sensitive data
   - Weak encryption implementation

## Tech Stack

- Frontend: React + TypeScript
- Backend: Node.js + Express
- Database: PostgreSQL
- ORM: Prisma
- Authentication: JWT
- Containerization: Docker

## Setup Instructions

1. Clone the repository
   - 
   ```bash
   git clone https://github.com/razakhalid/ethical-hacking-for-developers.git
   ```
2. Run `docker-compose up --build`
3. Access the application at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Swagger Documentation: http://localhost:3001/api-docs

## Security Testing

Each vulnerability includes:
- Detailed explanation of the vulnerability
- Step-by-step instructions to exploit it
- Code examples showing the fix
- Testing scripts to verify the vulnerability and its fix

## Disclaimer

This application is intentionally vulnerable and should only be used for educational purposes in a controlled environment. Do not deploy this application in production or expose it to the internet. 
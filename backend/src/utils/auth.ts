import { Request } from 'express';
import jwt from 'jsonwebtoken';

export function getUserIdFromToken(req: Request): number | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: number };
    return decoded.userId;
  } catch (error) {
    return null;
  }
} 
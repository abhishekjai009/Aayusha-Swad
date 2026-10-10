import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db';

const JWT_SECRET = process.env.JWT_SECRET || 'aayusha_swad_secure_jwt_secret_token_key_2026';

export interface AuthUser {
  id: string;
  phone: string;
  fullName: string;
  email: string;
  role: 'customer' | 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      phone: user.phone,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; phone: string; role: 'customer' | 'admin' };
    const userRecord = db.prepare('SELECT id, phone, full_name, email, role FROM users WHERE id = ?').get(decoded.id) as any;
    if (userRecord) {
      req.user = {
        id: userRecord.id,
        phone: userRecord.phone,
        fullName: userRecord.full_name,
        email: userRecord.email,
        role: userRecord.role
      };
    }
  } catch (err) {
    // Invalid or expired token
  }
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please sign in with your phone number and OTP.'
    });
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access restricted to store administrators.'
    });
  }
  next();
}

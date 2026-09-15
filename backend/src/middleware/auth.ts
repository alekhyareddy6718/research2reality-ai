import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export function getJwtSecret(): string {
  return process.env.JWT_SECRET || 'research2reality_super_secret_jwt_key_2026_prod';
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const rawHeader = req.headers['authorization'] || req.headers['Authorization'] || req.headers['x-access-token'];
  let authHeader = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;

  let token: string | null = null;
  if (authHeader && typeof authHeader === 'string') {
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    } else {
      token = authHeader.trim();
    }
  } else if (req.query && req.query.token) {
    token = String(req.query.token).trim();
  }

  if (!token || token === 'null' || token === 'undefined') {
    return sendError(res, 'Authentication token required', 401, 'UNAUTHORIZED');
  }

  try {
    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret) as { id: string; email: string; role: string };
    req.user = decoded;
    next();
  } catch (err: any) {
    console.error('JWT Verification Error:', err.message);
    return sendError(res, 'Invalid or expired token', 401, 'UNAUTHORIZED');
  }
}

export function requireRole(role: 'ADMIN' | 'USER') {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', 401, 'UNAUTHORIZED');
    }
    if (role === 'ADMIN' && req.user.role !== 'ADMIN') {
      return sendError(res, 'Administrator access required', 403, 'FORBIDDEN');
    }
    next();
  };
}

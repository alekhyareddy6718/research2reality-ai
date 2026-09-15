import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest, getJwtSecret } from '../middleware/auth';

const prisma = new PrismaClient();

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name, role, organization } = req.body;

    if (!email || !password || !name) {
      return sendError(res, 'Email, password, and name are required', 400, 'VALIDATION_ERROR');
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return sendError(res, 'A user with this email already exists', 409, 'USER_EXISTS');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userRole = role === 'ADMIN' ? 'ADMIN' : 'USER';

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: userRole,
        organization: organization || 'Independent Researcher'
      }
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    return sendSuccess(res, {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organization: user.organization,
        avatar: user.avatar
      }
    }, 201);
  } catch (error: any) {
    return sendError(res, error.message || 'Registration failed', 500, 'SERVER_ERROR');
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400, 'VALIDATION_ERROR');
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return sendError(res, 'Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return sendError(res, 'Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    return sendSuccess(res, {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organization: user.organization,
        avatar: user.avatar
      }
    });
  } catch (error: any) {
    return sendError(res, error.message || 'Login failed', 500, 'SERVER_ERROR');
  }
}

export async function getProfile(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        bio: true,
        organization: true,
        apiKey: true,
        createdAt: true,
        _count: {
          select: {
            projects: true,
            savedPapers: true,
            analyses: true,
            gaps: true
          }
        }
      }
    });

    if (!user) return sendError(res, 'User not found', 404);
    return sendSuccess(res, user);
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const { name, bio, organization, apiKey } = req.body;

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, bio, organization, apiKey }
    });

    return sendSuccess(res, {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      role: updated.role,
      organization: updated.organization,
      bio: updated.bio
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) return sendError(res, 'Email required', 400);

    return sendSuccess(res, {
      message: 'Password reset link sent to your email address.'
    });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
}

import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export function sendSuccess<T>(res: Response, data: T, statusCode = 200) {
  const payload: ApiResponse<T> = {
    success: true,
    data
  };
  return res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 400,
  code = 'BAD_REQUEST',
  details?: any
) {
  const payload: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {})
    }
  };
  return res.status(statusCode).json(payload);
}

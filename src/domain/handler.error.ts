import { ZodError } from "zod";
import { Response } from "express";

export function errorHandler(e: unknown, res: Response) {
  if (e instanceof ZodError) {
    return res.status(400).json({
      message: e.errors.map((err) => ({
        code: err.code,
        message: err.message,
      })),
    });
  }
  if (e instanceof Error) {
    return res.status(500).json({
      error: e.message,
    });
  }
  return res.status(500).json({
    error: e,
  });
}

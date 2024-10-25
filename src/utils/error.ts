import { AppError } from "@/lib/errors";

export function isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
  }


export function handleError(error: unknown): { message: string; status: number } {
    if (isAppError(error)) {
      return {
        message: error.message,
        status: error.statusCode,
      };
    }
  
    if (error instanceof Error) {
      return {
        message: error.message,
        status: 500,
      };
    }
  
    return {
      message: 'An unexpected error occurred',
      status: 500,
    };
  }
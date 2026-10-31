export class ApiError extends Error {
  statusCode: number;
  errorCode?: string;
  details?: unknown;

  constructor(message: string, statusCode: number, errorCode?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
  }
}

export function handleAxiosError(error: unknown): ApiError {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const err = error as { response?: { status?: number; data?: { message?: string; code?: string; detail?: unknown } } };
    const status = err.response?.status || 500;
    const message = err.response?.data?.message || (typeof err.response?.data?.detail === 'string' ? err.response.data.detail : 'Server communication error');
    const code = err.response?.data?.code;
    return new ApiError(message, status, code, err.response?.data?.detail);
  }
  if (error instanceof Error) {
    if (error.message.includes('timeout') || (error as any).code === 'ECONNABORTED') {
      return new ApiError(
        'The server is warming up or processing complex ingredients. Please tap scan again.',
        408,
        'TIMEOUT'
      );
    }
    return new ApiError(error.message, 0);
  }
  return new ApiError('An unexpected network error occurred', 0);
}

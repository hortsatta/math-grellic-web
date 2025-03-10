import { TimeoutError } from 'ky';
import type { HTTPError } from 'ky';

export const PAGINATION_TAKE = 16;

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.statusCode = statusCode;
  }
}

export async function generateApiError(error: HTTPError | TimeoutError) {
  if (error instanceof TimeoutError) {
    return new ApiError(error.message, 408);
  }

  const errorRes = await (error as HTTPError).response.json();
  return new ApiError(errorRes.message, errorRes.statusCode);
}

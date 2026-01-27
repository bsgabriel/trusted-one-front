import type { ProblemDetail } from './api';

/**
 * Custom error class to represent API errors following the Problem Details specification.
 * @see https://datatracker.ietf.org/doc/html/rfc7807
 */
export class ApiError extends Error {
  public readonly problem: ProblemDetail;

  constructor(problem: ProblemDetail) {
    super(problem.detail);
    this.name = 'ApiError';
    this.problem = problem;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

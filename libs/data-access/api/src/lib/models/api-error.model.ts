export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, any>;
  timestamp: string;
}

export class ApiErrorResponse implements ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, any>;
  timestamp: string;

  constructor(
    code: string,
    message: string,
    statusCode: number,
    timestamp: string,
    details?: Record<string, any>
  ) {
    this.code = code;
    this.message = message;
    this.statusCode = statusCode;
    this.timestamp = timestamp;
    this.details = details;
  }
}

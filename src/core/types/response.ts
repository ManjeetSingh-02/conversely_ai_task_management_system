// interface for base response
interface IBaseResponse {
  readonly message: string;
}

// interface for SuccessResponse
export interface ISuccessResponse<T = unknown> extends IBaseResponse {
  readonly success: true;
  readonly data: T;
}

// interface for ErrorResponse
export interface IErrorResponse<T = unknown> extends IBaseResponse {
  readonly success: false;
  readonly code: string;
  readonly issues: T;
}

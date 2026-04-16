// interface for base response
interface IBaseResponse {
  readonly message: string;
}

// interface for SuccessResponse
export interface ISuccessResponse<D = undefined, M = undefined> extends IBaseResponse {
  readonly success: true;
  readonly data?: D;
  readonly meta?: M;
}

// interface for ErrorResponse
export interface IErrorResponse<I = undefined> extends IBaseResponse {
  readonly success: false;
  readonly code: string;
  readonly issues?: I;
}

export const HTTP_ERROR_CODES = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  UNPROCESSABLE_CONTENT: 422,
  INTERNAL_SERVER_ERROR: 500
};

type HttpErrorCode = keyof typeof HTTP_ERROR_CODES;

type HTTPErrorOpts = {
  message?: string;
  code: HttpErrorCode;
};

export class HTTPError extends Error {
  public readonly code: HttpErrorCode;
  public readonly statusCode: number;

  constructor(opts: HTTPErrorOpts) {
    super(opts.message);
    this.name = 'HTTPError';
    this.code = opts.code;
    this.statusCode = HTTP_ERROR_CODES[opts.code];

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

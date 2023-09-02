type Code = 'NOT_FOUND' | 'BAD_REQUEST' | 'INTERNAL_SERVER_ERROR';
type Message = string | undefined;

type HTTPErrorArgs = {
  message: Message;
  code: Code;
};

export class HTTPError {
  public readonly message: Message;
  public readonly code: Code;

  constructor({ message, code }: HTTPErrorArgs) {
    this.message = message;
    this.code = code;
  }
}

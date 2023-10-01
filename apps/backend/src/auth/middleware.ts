import { type Middleware } from 'lucia';

export type ElysiaContext = {
  request: Request;
  set: {
    headers: Record<string, string> & {
      ['Set-Cookie']?: string | string[];
    };
    status?: number | undefined | string;
    redirect?: string | undefined;
  };
};

export const elysiaMiddleware = (): Middleware<[ElysiaContext]> => {
  return ({ args }) => {
    const [{ request, set }] = args;
    return {
      request,
      setCookie: cookie => {
        const setCookieHeader = set.headers['Set-Cookie'] ?? [];
        const setCookieHeaders: string[] = Array.isArray(setCookieHeader)
          ? setCookieHeader
          : [setCookieHeader];
        setCookieHeaders.push(cookie.serialize());
        set.headers['Set-Cookie'] = setCookieHeaders;
      }
    };
  };
};

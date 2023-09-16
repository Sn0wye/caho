/// <reference types="lucia" />
declare namespace Lucia {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  type Auth = import('./src/auth/lucia').Auth;
  type DatabaseUserAttributes = {
    name: string | null;
    email: string | null;
    username: string;
  };
  // eslint-disable-next-line @typescript-eslint/ban-types
  type DatabaseSessionAttributes = {};
}

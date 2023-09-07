/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import('./src/auth/lucia').Auth;
  type DatabaseUserAttributes = {
    name: string | null;
    lastName: string | null;
    email: string | null;
    username: string;
  };
  type DatabaseSessionAttributes = {};
}

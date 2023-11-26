import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const sessionCookie = cookies().get('auth_session');
  console.log('route handler session cookie');

  if (sessionCookie) {
    cookies().set('auth_session', sessionCookie.value, {
      httpOnly: true,
      sameSite: 'lax'
    });
  }

  return new Response(null, { status: 204 });
}

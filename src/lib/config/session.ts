import { useSession, type H3Event, type SessionConfig } from 'h3';
import { randomBytes } from 'node:crypto';

const sessionConfig: SessionConfig = {
  name: 'h3-session',
  password: randomBytes(256).toString('hex'),
  cookie: {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24
  }
};

// eslint-disable-next-line react-hooks/rules-of-hooks
export const getAppSession = (event: H3Event) => useSession(event, sessionConfig);
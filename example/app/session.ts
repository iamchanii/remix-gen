import { createCookieSessionStorage } from '@remix-run/node';

export const { commitSession, getSession } = createCookieSessionStorage();

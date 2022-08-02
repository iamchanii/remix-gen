import { ActionFunction, LoaderFunction } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { gen } from 'remix-gen';
import { commitSession, getSession } from '~/session';

export const action: ActionFunction = ({ request }) =>
  gen(async function*({ actions }) {
    const session = await getSession(request.headers.get('cookie'));
    yield actions.flashSession({
      commitSession,
      session,
      name: 'message',
      value: `Your request was rejected. (Reason: Already Registered / ${new Date().toUTCString()})`,
    });

    return null;
  });

export const loader: LoaderFunction = ({ request }) =>
  gen(async function*({ actions }) {
    const session = await getSession(request.headers.get('cookie'));
    const message = yield actions.getSessionFlashData({ commitSession, session, name: 'message' });

    return { message };
  });

export default function() {
  const { message } = useLoaderData<{ message?: string }>();

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      {message && <div style={{ padding: 8, background: 'orange', margin: '16px 0' }}>{message}</div>}
      <Form method="post">
        <button>Registration</button>
      </Form>
    </div>
  );
}

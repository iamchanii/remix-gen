# remix-gen

A utility for Remix's loader/action based on async generator.

## Install

> Not Published Yet.

```sh
$ yarn add remix-gen
```

## Usage

```ts
declare const commitSession: SessionStorage['commitSession'];

// Without remix-gen:
export const action: ActionFunction = ({ request }) => {
  const session = await getSession(request.headers.get('cookie'));
  session.flash('notify', "You've 1 unread message.");

  return redirect('/main', {
    headers: [
      // You have to add [key, value] pairs for set cookie.
      ['Set-Cookie', await fooCookie.serialize('foo')],
      ['Set-Cookie', await barCookie.serialize('bar')],
      ['Set-Cookie', await zaxCookie.serialize('zax')],

      // Do you wanna use session? Don't forget to call commitSession!
      ['Set-Cookie', await commitSession(session)],
    ],
  });
};

// With remix-gen:
export const action: ActionFunction = ({ request }) =>
  gen(async function*({ actions }) {
    const session = await getSession(request.headers.get('cookie'));

    // You can set multiple Set-Cookie headers.
    yield actions.setCookieHeader(await fooCookie.serialize('foo'));
    yield actions.setCookieHeader(await barCookie.serialize('bar'));
    yield actions.setCookieHeader(await zaxCookie.serialize('zax'));

    // You can set value to session as flash.
    yield actions.flashSession({
      commitSession,
      session,
      key: 'notify',
      value: "You've 1 unread message.",
    });

    // ...and you don't have to set headers manually!
    return redirect('/main');
  });
```

## API

### `actions.setCookieHeader`

T.B.D

### `actions.flashSession`

T.B.D

## License

MIT

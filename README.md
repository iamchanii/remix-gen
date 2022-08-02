# remix-gen

A utility for Remix's loader/action based on async generator.

## Install

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
    yield actions.appendHeader({
      name: 'Set-Cookie',
      value: await fooCookie.serialize('foo'),
    });
    yield actions.appendHeader({
      name: 'Set-Cookie',
      value: await barCookie.serialize('bar'),
    });
    yield actions.appendHeader({
      name: 'Set-Cookie',
      value: await zaxCookie.serialize('zax'),
    });

    // You can set value to session as flash.
    yield actions.setSessionFlashData({
      commitSession,
      session,
      key: 'notify',
      value: "You've 1 unread message.",
    });

    // ...and you don't have to set headers manually!
    return redirect('/main');
  });

export const loader: LoaderFunction = ({ request }) =>
  gen(async function*({ actions }) {
    const session = await getSession(request.headers.get('cookie'));

    const message: string = yield actions.getSessionFlashData({
      commitSession,
      session,
      name: 'message',
    });

    return { message };
  });
```

## API

- `actions.appendHeader({ name, value })`
- `actions.setSessionData({ commitSession, session, name, value  })`
- `actions.setSessionFlashData({ commitSession, session, name, value  })`
- `actions.getSessionFlashData({ commitSession, session, name  })`

## Example

See [Example](/example/app/routes/index.tsx)

## FAQ

> I'm new to(or not used to) Remix. Am I have to use this library to handle session or cookie?

No. This is just a utility. if you're new to Remix, I suggest reading official Remix docs.

> When is the best to use this?

If you're using a session that creates via `createCookieSessionStorage`, You have to call `commitSession` and add `headers` to response. but you can miss it because easy to forget, troublesome or whatever. remix-gen might be helpful. it will be automatically processed using generator. In another word, You don't need this if you're using a session with memory, file, custom, etc.

> Is this related with a generate some files or snippets for Remix?

No. `gen` is just an abbreviation for generator of JS.

## License

MIT

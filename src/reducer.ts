import { Action } from './actions.js';
import { State } from './state.js';

export const reducer = async (state: State, action: Action): Promise<[State, any]> => {
  const { type, payload } = action;
  let nextValue = undefined;

  switch (type) {
    case 'SET_HEADER': {
      state.headers.push([payload.name, payload.value]);
      break;
    }

    case 'SET_COOKIE_HEADER': {
      state.headers.push(['Set-Cookie', payload.value]);
      break;
    }

    case 'SET_SESSION_DATA': {
      const { commitSession, session, name, value } = payload;
      session.set(name, value);
      state.headers.push(['Set-Cookie', await commitSession(session)]);
      break;
    }

    case 'SET_SESSION_FLASH_DATA': {
      const { commitSession, session, name, value } = payload;
      session.flash(name, value);
      state.headers.push(['Set-Cookie', await commitSession(session)]);
      break;
    }

    case 'GET_SESSION_FLASH_DATA': {
      const { commitSession, session, name } = payload;
      nextValue = session.get(name);
      state.headers.push(['Set-Cookie', await commitSession(session)]);
      break;
    }
  }

  return [state, nextValue];
};

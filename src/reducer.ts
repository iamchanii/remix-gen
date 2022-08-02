import { Action } from './actions.js';
import { State } from './state.js';

export const reducer = async (state: State, action: Action): Promise<State> => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_COOKIE_HEADER': {
      state.headers.push(['Set-Cookie', payload]);
      break;
    }

    case 'FLASH_SESSION': {
      const { commitSession, session, key, value } = payload;
      session.flash(key, value);
      state.headers.push(['Set-Cookie', await commitSession(session)]);
      break;
    }
  }

  return state;
};

import type { Session, SessionStorage } from '@remix-run/node';

export const actions = {
  setHeader: (payload: { name: string; value: string }) => ({
    type: 'SET_HEADER' as const,
    payload,
  }),

  setCookieHeader: (payload: { value: string }) => ({
    type: 'SET_COOKIE_HEADER' as const,
    payload,
  }),

  setSessionData: (payload: {
    commitSession: SessionStorage['commitSession'];
    session: Session;
    name: string;
    value: any;
  }) => ({ type: 'SET_SESSION_DATA' as const, payload }),

  setSessionFlashData: (payload: {
    commitSession: SessionStorage['commitSession'];
    session: Session;
    name: string;
    value: any;
  }) => ({ type: 'SET_SESSION_FLASH_DATA' as const, payload }),

  getSessionFlashData: (payload: {
    commitSession: SessionStorage['commitSession'];
    session: Session;
    name: string;
  }) => ({ type: 'GET_SESSION_FLASH_DATA' as const, payload }),
};

export type Action = ReturnType<typeof actions[keyof typeof actions]>;
export type ActionType = Action['type'];

export function isAction(input: unknown): input is Action {
  return (
    typeof input === 'object'
    && input !== null
    && Object.prototype.hasOwnProperty.call(input, 'type')
    && Object.prototype.hasOwnProperty.call(input, 'payload')
  );
}

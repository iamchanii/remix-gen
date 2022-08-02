import type { Session, SessionStorage } from '@remix-run/node';

export const actions = {
  setCookieHeader: (cookieValue: string) => ({
    type: 'SET_COOKIE_HEADER' as const,
    payload: cookieValue,
  }),
  flashSession: (payload: {
    commitSession: SessionStorage['commitSession'];
    session: Session;
    key: string;
    value: any;
  }) => ({ type: 'FLASH_SESSION' as const, payload }),
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

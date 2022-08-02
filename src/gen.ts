import { actions, isAction } from './actions.js';
import { reducer } from './reducer.js';
import { getInitialState } from './state.js';

interface LoaderOrActionGenFn {
  (args: { actions: typeof actions }): AsyncGenerator;
}

export const gen = async (loaderOrActionGenFn: LoaderOrActionGenFn) => {
  const generator = loaderOrActionGenFn({ actions });
  let result = await generator.next();
  let state = getInitialState();
  let nextValue;

  while (!result.done) {
    if (isAction(result.value)) {
      [state, nextValue] = await reducer(state, result.value);
    }

    result = await generator.next(nextValue);
  }

  const responseOrValue = result.value;

  if (responseOrValue instanceof Response) {
    responseOrValue.headers.forEach((value, key) => {
      state.headers.push([key, value]);
    });

    return new Response(responseOrValue.body, {
      ...responseOrValue,
      headers: new Headers(state.headers),
      status: responseOrValue.status,
    });
  }

  state.headers.push(['Content-Type', 'application/json; charset=utf-8']);

  return new Response(JSON.stringify(responseOrValue), {
    headers: new Headers(state.headers),
  });
};

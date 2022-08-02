import { actions, isAction } from './actions.js';
import { reducer } from './reducer.js';
import { getInitialState } from './state.js';

export const gen = async (
  loaderOrActionGenFn: (args: { actions: typeof actions }) => AsyncGenerator,
) => {
  const generator = loaderOrActionGenFn({ actions });
  let result = await generator.next();
  let state = getInitialState();

  while (!result.done) {
    if (!isAction(result.value)) {
      result = await generator.next();
      continue;
    }

    state = await reducer(state, result.value);
    result = await generator.next();
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

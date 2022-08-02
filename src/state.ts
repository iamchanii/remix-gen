export type State = {
  headers: [key: string, value: string][];
};

export const getInitialState = (): State => ({
  headers: [],
});

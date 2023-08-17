export const getByTestId$ = (dataTestId: string) => {
  return $(`[data-testid="${dataTestId}"]`);
};

export const getByTestId$$ = (dataTestId: string) => {
  return $$(`[data-testid="${dataTestId}"]`);
};

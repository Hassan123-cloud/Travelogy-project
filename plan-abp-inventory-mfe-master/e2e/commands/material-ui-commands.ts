export const getReactTestIdComponent$ = (dataTestId: string) => {
  return browser.react$('*', { props: { 'data-testid': `${dataTestId}` } });
};

export const getReactTestIdComponent$$ = (dataTestId: string) => {
  return browser.react$$('*', { props: { 'data-testid': `${dataTestId}` } });
};

import { Mfe } from '@by/plat-lui-functional-testing-utils';

describe('Login to Luminate Portal', () => {
  let portal: Mfe;
  beforeEach(() => {
    portal = new Mfe();
    portal.verifyLogin('/app-gallery');
  });

  it('Navigates to an MFE namespace', () => {
    expect(portal.$breadcrumbs).toHaveText('My Services');
  });
  it('Logs out', () => {
    portal.logout();
    expect(portal.$loginButton).toBeVisible();
  });
});

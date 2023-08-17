import { Mfe } from '@by/plat-lui-functional-testing-utils';
import { LuminateMapMfe } from '../../page-objects/luminate-map/mfe';
describe('Login to Luminate Map', () => {
  let portal: Mfe;
  let luminateMap: LuminateMapMfe;

  beforeEach(() => {
    luminateMap = new LuminateMapMfe();
    portal = new Mfe();
    portal.verifyLogin(process.env.APP_NAMESPACE);
  });
  it('Navigates to an MFE namespace', () => {   
    expect(portal.$breadcrumbs).toHaveTextContaining(`${process.env.APP_NAMESPACE}`);
    portal.switchToMfe();
    luminateMap.applyFilter();
  });
});

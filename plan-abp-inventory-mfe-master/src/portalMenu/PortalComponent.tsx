import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import NavBarContainer from './components/NavBarContainer';
import { MessageActions } from '@jda/lui-portal-utilities';
import translate from '../translate/translate';
import {
  displayNavBarIcons,
  registerListener,
  LCTWebappDeepLink,
} from './utils/portalNavigation';
import { IDeepLinkData } from '../api/commonApis';
import { isPortalDeepLink } from '@jda/list-view-container';

export interface IPortalComponent {
  allDisabledItems?: ReadonlyArray<string>;
  accessLevels?: ReadonlyArray<string>;
  token?: string;
  deepLinkData?: IDeepLinkData;
}
const PortalComponent: React.FC<IPortalComponent> = (
  props: IPortalComponent,
) => {
  const { token, deepLinkData } = props;
  const [isNavBarOpen, setNavBarOpen] = useState(false);
  const { i18n } = useTranslation();
  const namespaceMapping = translate(i18n);

  const toggleNavbar = () => {
    setNavBarOpen(!isNavBarOpen);
  };
  const portalEventsHandler = (message: any) => {
    switch (message.action) {
      case MessageActions.HamburgerTrigger:
        toggleNavbar();
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    registerListener(portalEventsHandler);
  });

  displayNavBarIcons(props.allDisabledItems, props.accessLevels);

  const navBarDeepLinkNavigate = (path: string) => {
    setNavBarOpen(false);
    const toCore = !isPortalDeepLink(path, deepLinkData);
    LCTWebappDeepLink(path, toCore);
  };

  return (
    <>
      <NavBarContainer
        displayLabels={namespaceMapping}
        appBarToggle={toggleNavbar}
        isOpen={isNavBarOpen}
        deepLinkCallback={navBarDeepLinkNavigate}
        token={token}
      />
    </>
  );
};

export default PortalComponent;

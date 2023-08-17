/*
 * ===============================================================================================================
 *                                Copyright 2020-2022, Blue Yonder Group, Inc.
 *                                           All Rights Reserved
 *
 *                               THIS IS UNPUBLISHED PROPRIETARY SOURCE CODE OF
 *                                          BLUE YONDER GROUP, INC.
 *
 *
 *                         The copyright notice above does not evidence any actual
 *                                 or intended publication of such source code.
 *
 * ===============================================================================================================
 */

import React from 'react';
import { filter } from 'lodash';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { ThemeProvider, Theme, Dialog } from '@material-ui/core';
import PortalComponent from './portalMenu/PortalComponent';
import { LightTheme } from '@jda/lui-common-component-library';

import { Map } from '@jda/map-canvas';

import {
  useDomHistoryMonitor,
  PortalMessageService,
  // ThemeSwitchResponseMessage,
  Message,
  MessageActions,
  isIFrame,
  ThemeSwitchRequestMessage,
  AccessTokenResponseMessage,
  AccessTokenRequestMessage,
  fetchData,
} from '@jda/lui-portal-utilities';

import './App.css';
import translate from './translate/translate';
import { AxiosResponse } from 'axios';
import { useLCT } from './api/commonApis';

import { IRegistration } from '@jda/map-canvas/dist/models/registrationModels';

// const themes = { dark: DarkTheme, light: LightTheme };

const App: React.FC = () => {
  const [registry, setRegistry] = React.useState<any>();
  const [token, setToken] = React.useState<any>();
  const [theme] = React.useState<Theme>(LightTheme);
  const [azureMapKey, setAzureMapKey] = React.useState<any>();
  const [namespaceMapping, setNamespaceMapping] = React.useState<any>();

  const { currentAccessLevels, bpConfiguration, dialog, deepLinkData } = useLCT();

  const portalEventsHandler = (message: Message) => {
    switch (message.action) {
      case MessageActions.ThemeSwitchResponse:
        // setTheme(themes[(message as ThemeSwitchResponseMessage)?.theme]);
        break;
      case MessageActions.AccessTokenResponse:
        const portalToken = (message as AccessTokenResponseMessage)?.token;
        localStorage.setItem('token', `Bearer ${portalToken?.accessToken || portalToken}`);
        setToken(portalToken?.accessToken || portalToken);
        break;
    }
  };
  PortalMessageService.getInstance().registerListener(portalEventsHandler);


  const { i18n } = useTranslation();
  useDomHistoryMonitor();

  const processModelUrl =
    window &&
    window['env'] &&
    window['env'].LCT_PROCESS_MODEL_SERVICE_URL &&
    `${window['env'].LCT_PROCESS_MODEL_SERVICE_URL}`;

  const apiHost =
    window &&
    window['env'] &&
    window['env'].MAP_SERVICE_URL &&
    `${window['env'].MAP_SERVICE_URL}`;


  const registrationApi =
    window &&
    window['env'] &&
    window['env'].MAP_REGISTRATION_URL &&
    `${window['env'].MAP_REGISTRATION_URL}`;

  const getRegistration = () => {
    (async () => {
      const url = `${registrationApi}/registrations`;
      const response: AxiosResponse = await fetchData(url);
      return response;
    })()
      .then((res: any) => {
        if (res && res.data && res.data) {
          const lctRegistry = filter(res.data, (registration: IRegistration) => {
            const includesAnyShipmentType = currentAccessLevels?.includes('inboundShipment') || currentAccessLevels?.includes('outboundShipment');
            return registration?.name !== 'shipments' ?
              currentAccessLevels?.includes(registration.name) || (includesAnyShipmentType && registration.name === 'ports')
              : includesAnyShipmentType;
          });
          setRegistry(processModelUrl ? lctRegistry : res.data);
        }
      })
      .catch((error) => {
        console.error('Registration API error: ', error);
      });
  };

  const getAzureMapKey = () => {
    (async () => {
      const url = `${apiHost}/mapKey`;
      const response: AxiosResponse = await fetchData(url);
      return response;
    })()
      .then((res: any) => {
        if (res && res.data) {
          setAzureMapKey(res.data);
        }
      })
      .catch((error) => {
        console.error('Azure Map Key API error: ', error);
      });
  };

  React.useEffect(() => {
    setNamespaceMapping(translate(i18n));
  }, [i18n]);

  React.useEffect(() => {
    getRegistration();
  }, [currentAccessLevels]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    !azureMapKey && getAzureMapKey();
  }, [azureMapKey]) // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    const themeSwitchRequestMessage = new ThemeSwitchRequestMessage();
    PortalMessageService.getInstance().sendMessageToPortal(
      themeSwitchRequestMessage
    );
    const getTokenRequestMessage = new AccessTokenRequestMessage();
    PortalMessageService.getInstance().sendMessageToPortal(
      getTokenRequestMessage,
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    getAzureMapKey();
  }, [token]) // eslint-disable-line react-hooks/exhaustive-deps

  return token ? (
    <div className="app">
      <ThemeProvider theme={theme}>
        {isIFrame() && (
          <PortalComponent
            token={token}
            allDisabledItems={bpConfiguration?.feature?.allDisabledItems}
            accessLevels={
              ((currentAccessLevels as unknown) as Record<
                string,
                ReadonlyArray<string>
              >)?.availableObjectTypes
            }
            deepLinkData={deepLinkData}
          />
        )}
        <Dialog
          open={dialog.dialog && dialog.open}
        >
          <React.Suspense fallback={<></>}>
            {dialog.dialog && dialog.open ?
              <dialog.dialog onClose={dialog.onClose} onApply={dialog.onApply} />
              : <></>}
          </React.Suspense>
        </Dialog>
        <Map
          subscriptionKey={azureMapKey}
          apiHost={apiHost}
          token={token}
          registry={registry}
          displayLabels={namespaceMapping}
          weather
          updateWhileMoving
          style={theme?.palette?.type === 'light' ? 'road' : 'night' }
        />
      </ThemeProvider>
    </div>
  ) : (
    <></>
  );
};

export default withRouter(App);

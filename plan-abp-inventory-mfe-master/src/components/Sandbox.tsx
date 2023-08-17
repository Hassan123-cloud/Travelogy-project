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

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import { LightTheme } from '@jda/lui-common-component-library';

import { Map, Events, mapEventClient } from '@jda/map-canvas';

import '../App.css';
import translate from '../translate/translate';
import { AxiosResponse } from 'axios';
import { api } from '../api/request';

const App: React.FC = () => {
  const [registry, setRegistry] = useState<any>();
  const [theme] = useState(LightTheme);
  const token = 'liam-token';
  const [azureMapKey, setAzureMapKey] = useState<any>();
  const [namespaceMapping, setNamespaceMapping] = useState<any>();

  const { i18n } = useTranslation();

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
      const response: AxiosResponse = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    })()
      .then((res: any) => {
        if (res && res.data && res.data.data) {
          setRegistry(res.data.data);
        }
      })
      .catch((error) => {
        console.error('Registration API error: ', error);
      });
  };

  const getAzureMapKey = () => {
    (async () => {
      const url = `${apiHost}/mapKey`;
      const response: AxiosResponse = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    })()
      .then((res: any) => {
        if (res && res.data && res.data.data) {
          setAzureMapKey(res.data.data);
        }
      })
      .catch((error) => {
        console.error('Azure Map Key API error: ', error);
      });
  };

  const onLayerChange = (payload: unknown[]) => {
    console.debug(payload);
  };

  useEffect(() => {
    setNamespaceMapping(translate(i18n));
  }, [i18n]);

  useEffect(() => {
    mapEventClient.on(Events.LAYER_DATA_CHANGED, onLayerChange);
    getAzureMapKey();
    getRegistration();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="app">
      <ThemeProvider theme={theme}>
        <Map
          subscriptionKey={azureMapKey}
          apiHost={apiHost}
          token={token}
          registry={registry}
          displayLabels={namespaceMapping}
          weather
          updateWhileMoving
        />
      </ThemeProvider>
    </div>
  );
};

export default withRouter(App);

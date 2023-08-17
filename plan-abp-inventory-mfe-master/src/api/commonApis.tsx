/*
 * ===============================================================================================================
 *                                Copyright 2022, Blue Yonder Group, Inc.
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

import { fetchData, getBaseAPIMUrl } from '@jda/lui-portal-utilities';
import { AxiosResponse } from 'axios';
import React from 'react';
import _ from 'lodash';
import { BpConfigProps } from '../portalMenu/types/types';
import { Events, mapEventClient } from '@jda/map-canvas';

export interface IDeepLinkData {
  [key: string]: {
    deepLink: boolean;
    regExp: string;
  };
}

export const useLCT = () => {
  const [deepLinkData, setDeepLinkData] = React.useState<IDeepLinkData>();

  const [bpConfiguration, setBpConfiguration] = React.useState<BpConfigProps>();
  const [currentAccessLevels, setCurrentAccessLevels] =
    React.useState<string[]>();
  const [globalFilterStatus, _setGlobalFilterStatus] =
    React.useState<boolean>(false);
  const [globalFilterCount, setGlobalFilterCount] = React.useState<
    number | undefined
  >(undefined);

  const globalFilterStatusRef = React.useRef(globalFilterStatus);
  const setGlobalFilterStatus = (data: boolean) => {
    globalFilterStatusRef.current = data;
    _setGlobalFilterStatus(data);
  };
  const [dialog, setDialog] = React.useState<any>();
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);

  const processModelUrl =
    window &&
    window['env'] &&
    window['env'].LCT_PROCESS_MODEL_SERVICE_URL &&
    `${window['env'].LCT_PROCESS_MODEL_SERVICE_URL}`;

  const getBusinessProcesses = async () => {
    const url = `${processModelUrl}/businessProcesses`;
    const response: AxiosResponse = await fetchData(url);
    return response;
  };

  const getCurrentAccessLevels = async () => {
    const url = `${processModelUrl}/businessProcesses/currentAccessLevels`;
    const response: AxiosResponse = await fetchData(url);
    return response;
  };

  const getDeepLinksData = async (baseUrl: string) => {
    const url = `${baseUrl}/lct/bff/v1/bff/navigation/deepLinks`;
    const response: AxiosResponse = await fetchData(url);
    return response;
  };

  const updateGlobalFilterStatus = () => {
    (async () => {
      const url = `${processModelUrl}/globalFilters/status`;
      const response: AxiosResponse = await fetchData(url);
      return response;
    })()
      .then((res: any) => {
        const status =
          res !== undefined && res !== null
            ? res
            : globalFilterStatusRef.current;
        localStorage.setItem('globalFilter.status', status);
        setGlobalFilterStatus(status);
      })
      .catch((error) => {
        console.error('Azure Map Key API error: ', error);
      });
  };

  const updateGlobalFilterLabel = () => {
    if (globalFilterCount === undefined) {
      localStorage.setItem('globalFilter.label', `Global Filters`);
    }
    getBaseAPIMUrl().then((baseUrl: string) => {
      (async () => {
        const url = `${baseUrl}/lct/bff/v1/bff/userProfiles?preferenceKey=globalFilters`;
        const response: AxiosResponse = await fetchData(url);
        return response;
      })()
        .then((res: any) => {
          const globalFilters = res?.globalFilters?.search;
          const globalFiltersApplied = _.filter(
            globalFilters,
            (o) => o && o.length,
          ).length;
          localStorage.setItem(
            'globalFilter.label',
            `Global Filters (${globalFiltersApplied})`,
          );
          setGlobalFilterCount(globalFiltersApplied);
        })
        .catch((error) => {
          console.error('LCT global filter applied count error: ', error);
        });
    });
  };

  const onGlobalFilterDialogOpen = () => {
    setDialogOpen(true);
  };
  const onGlobalFilterDialogClose = () => {
    updateGlobalFilterStatus();
    updateGlobalFilterLabel();
    mapEventClient.emit(Events.UPDATE_VISIBLE_LAYER);
    setDialogOpen(false);
  };

  React.useEffect(() => {
    if (processModelUrl) {
      mapEventClient.on(Events.LAYER_DATA_CHANGED, updateGlobalFilterStatus);
      mapEventClient.on(
        Events.GLOBAL_FILTER_DIALOG_OPEN,
        onGlobalFilterDialogOpen,
      );

      if (!bpConfiguration) {
        getBusinessProcesses()
          .then((response: Record<string, any>) => {
            if (response && response.configuration)
              setBpConfiguration(response.configuration);

            const GlobalFilterDialog = React.lazy(
              () => import('../lctComponents/globalFilter.js'),
            );
            if (GlobalFilterDialog) {
              localStorage.setItem('globalFilter.available', 'true');
              setDialog(GlobalFilterDialog);
            }
          })
          .catch((error) => {
            console.error('Fetch businessProcesses error', error);
          });
      }
      if (!currentAccessLevels) {
        getCurrentAccessLevels()
          .then((response: Record<string, any>) => {
            if (response && response.availableObjectTypes) {
              setCurrentAccessLevels(response.availableObjectTypes);
            }
          })
          .catch((error) => {
            console.error('Fetch currentAccessLevels error', error);
            setCurrentAccessLevels([]);
          });
      }
      if (!deepLinkData) {
        getBaseAPIMUrl().then((baseUrl: string) => {
          getDeepLinksData(baseUrl)
            .then((response: Record<string, any>) => {
              if (response && response.data) {
                setDeepLinkData(response.data);
              }
            })
            .catch((error) => {
              console.error('Fetch deepLinks data error', error);
              setDeepLinkData(undefined);
            });
        });
      }
    }
    updateGlobalFilterStatus();
    updateGlobalFilterLabel();
    return () => {
      localStorage.removeItem('globalFilter.available');
      localStorage.removeItem('globalFilter.status');
      localStorage.removeItem('globalFilter.label');
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return {
    dialog: {
      dialog,
      open: dialogOpen,
      onClose: onGlobalFilterDialogClose,
      onApply: onGlobalFilterDialogClose,
    },
    currentAccessLevels,
    bpConfiguration,
    deepLinkData,
  };
};

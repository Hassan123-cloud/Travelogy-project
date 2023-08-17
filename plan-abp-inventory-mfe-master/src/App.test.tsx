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

import './matchMedia.mock';
import React, { Suspense } from 'react';
import App from './App';
import { mount } from 'enzyme';
import { BrowserRouter, Route } from 'react-router-dom';
import * as utils from '@jda/lui-portal-utilities';

const Loader = () => (
  <div id={'app-loading'}>
    <div>loading...</div>
  </div>
);

describe('App', () => {
  xit('should render router correctly', () => {
    jest.spyOn(utils, 'useDomHistoryMonitor').mockReturnValue();
    const mockService = new utils.MockPortalMessageService();
    jest
      .spyOn(utils.PortalMessageService, 'getInstance')
      .mockReturnValue(mockService);

    const app = mount(
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <App />
        </Suspense>
      </BrowserRouter>,
    );
    const POCRoute = app.find(Route);
    expect(POCRoute.prop('path')).toStrictEqual('/');
  });
});

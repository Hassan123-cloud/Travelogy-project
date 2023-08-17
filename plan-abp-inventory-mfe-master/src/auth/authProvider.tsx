/*
 * ===============================================================================================================
 *                                Copyright 2020, Blue Yonder Group, Inc.
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

import { MsalAuthProvider } from 'react-aad-msal';
import config from './authProviderConfig';
import options from './authenticationOptions';
import authenticationParameters from './authenticationParameters';

const authProvider = new MsalAuthProvider(
  config,
  authenticationParameters,
  options,
);

export default authProvider;

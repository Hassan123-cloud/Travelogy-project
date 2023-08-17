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

import { Logger, LogLevel, Configuration } from 'msal';

const env = window['env'];
const clientId = env.APP_CLIENT_ID;
const tenantHost = env.APP_TENANT_HOST;
const policy = env.APP_POLICY_NAME;
const domainHost = env.APP_B2C_DOMAIN_HOST;

// Msal Configurations
const config = {
  auth: {
    authority: `https://${domainHost}/${tenantHost}/${policy}`,
    clientId,
    postLogoutRedirectUri: window.location.origin + '/auth.html',
    redirectUri: window.location.origin + '/auth.html',
    navigateToLoginRequestUrl: false,
    validateAuthority: false,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true,
  },
  // Enable logging of MSAL events for easier troubleshooting.
  // This should be disabled in production builds.
  system: {
    logger: new Logger(
      (logLevel: LogLevel, message: string, containsPii: boolean) => {
        console.log('[MSAL]', message);
      },
      {
        level: LogLevel.Verbose,
        piiLoggingEnabled: false,
      },
    ),
  },
} as Configuration;

export default config;

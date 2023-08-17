import { baseConfig } from './wdio.shared.conf';

const isDebugMode = !!process.env.DEBUG;

baseConfig.user = process.env.SAUCE_USERNAME;
baseConfig.key = process.env.SAUCE_ACCESS_KEY;
baseConfig.region = 'us';
const BUILD_PREFIX = process.env.BUILD_PREFIX ? `GitHub Actions-` : '';
const defaultBrowserSauceOptions = {
  build: `${BUILD_PREFIX}Luminate Map MFE availability test-${process.env.PORTAL_ENV}-${new Date().toISOString()}`,
  screenResolution: '1600x1200',
  extendedDebugging: false,
  capturePerformance: false,
  timeZone: 'Chicago',
};

const defaultBrowserDesktopSauceOptions = {
  screenResolution: '1600x1200',
};
baseConfig.services = [
  ...(baseConfig.services || []),
  [
    'sauce',
    {
      sauceConnect: isDebugMode,
    },
  ],
];

const config = {
  ...baseConfig,
  maxInstances: 2,
  waitforTimeout: 20000,
  capabilities: [
    {
      browserName: 'chrome',
      browserVersion: 'latest',
      platformName: 'Windows 10',
      'sauce:options': {
        ...defaultBrowserSauceOptions,
        ...defaultBrowserDesktopSauceOptions,
      },
    },
  ],
  reporters: ['spec'],
  specs: ['./e2e/specs/navigation/home.spec.ts'],
};
config.beforeSuite = function (suite) {
  browser.execute(`sauce:job-name=${suite.title}`);
};
export { config };

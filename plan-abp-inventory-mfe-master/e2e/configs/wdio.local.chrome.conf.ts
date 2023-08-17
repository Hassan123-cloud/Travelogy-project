import { baseConfig } from './wdio.shared.conf';

const isDebugMode = process.env.DEBUG;

let config = baseConfig;
config.runner = 'local';
config.services?.push([
  'chromedriver',
  {
    logFileName: 'wdio-chromedriver.log',
    outputDir: '.e2e/logs/local-driver',
    args: isDebugMode ? ['--inspect'] : ['--silent', '--disable-infobars', '--headless', '--disable-gpu']
  }
]);

export { config };

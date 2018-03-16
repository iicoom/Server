/**
 * Created by bjcwq on 16/8/1.
 */
import log4js from 'log4js';
import path from 'path';
import mkdirp from 'mkdirp';
import config from '../../config';

const { logdir, logServer } = config;

let logConfig = [
  {
    loggerHost: logServer.host,
    loggerPort: logServer.port,
    type: 'log4j-tcp',
    category: 'error',
  }, {
    loggerHost: logServer.host,
    loggerPort: logServer.port,
    type: 'log4j-tcp',
    category: 'access',
  },
];

if (process.env.NODE_ENV !== 'production') {
  mkdirp.sync(logdir);
  logConfig = logConfig.map((item) => {
    const localConfig = {};
    localConfig.category = item.category;
    localConfig.filename = path.join(logdir, `./${item.category}.log`);
    localConfig.pattern = '-yyyy-MM-dd';
    localConfig.alwaysIncludePattern = true;
    localConfig.type = 'dateFile';
    return localConfig;
  });
  logConfig.push({
    type: 'console',
  });
}

log4js.configure({
  appenders: logConfig,
});

export default log4js;

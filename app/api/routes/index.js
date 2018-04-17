import os from 'os';
import pkg from '../../../package.json';

export default (router) => {
  router
    .get('/', async (ctx) => {
      // const session = ctx.session;
      const ServerInfo = {};
      ServerInfo.hostname = os.hostname();
      // ServerInfo.service_name = process.env.npm_package_name;
      ServerInfo.version = pkg.version;
      ServerInfo.server = pkg.name;
      ctx.body = ServerInfo;
    });
};

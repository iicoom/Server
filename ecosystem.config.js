/**
 * Created by mxj on 2018/9/10.
 */
module.exports = {
  apps: [{
    name: 'Koa-server',
    script: './bin/www.js',
    instances: 1,
    max_memory_restart: '1G',
    node_args: [],
    out_file: '/mnt/log/Koa-server/out.log',
    error_file: '/mnt/log/Koa-server/err.log',
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    },
  }],
  deploy: {
    production: {},
    staging: {},
    development: {},
  },
};

// To start this app in a particular environment, use the --env flag:
// pm2 start ecosystem.config.js                  # uses variables from `env`
// pm2 start ecosystem.config.js --env production # uses variables from `env_production`

// Once added to your process list, the process environment is immutable.
// This behavior has been made to ensure consistency across restarts of your app.
// https://pm2.io/doc/en/runtime/guide/ecosystem-file/#updating-the-environment

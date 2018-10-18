import compose from 'koa-compose';
import convert from 'koa-convert';
import helmet from 'koa-helmet';
import cors from 'koa-cors';
import bodyParser from 'koa-bodyparser';
import session from 'koa-generic-session';
import redisStore from 'koa-redis';
import accessToken from './accessToken';
import accessLogger from './accessLogger';
import config from '../../config';
import { redisClient } from '../services/redis';


export default function middleware() {
  return compose([
    convert(accessLogger()),
    convert(helmet()), // reset HTTP headers (e.g. remove x-powered-by)
    convert(cors({
      origin: (request) => {
        const origin = request.get('Origin');
        if (origin && (/(\.yunfarm\.cn)($|:[0-9]*$)/.test(origin)
                    || (/(localhost)($|:[0-9]*$)/.test(origin))
                    || (/(127\.0\.0\.1)($|:[0-9]*$)/.test(origin)))) {
          return origin;
        }
        return 'http://www.fuck.com';
      },
    })),
    convert(bodyParser()),
    accessToken({ // 这个是自己封装的
      name: 'token',
      secret: config.session_secret,
    }),
    convert(session({
      prefix: 'sid:',
      store: redisStore({ client: redisClient }),
    })),
  ]);
}

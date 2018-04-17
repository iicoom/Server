import compose from 'koa-compose';
import Router from 'koa-router';
import importDir from 'import-dir';
import { prefix } from './config';

const routes = importDir('./routes');

export default function api() {
  const router = new Router({ prefix });

  Object.keys(routes).forEach(name => routes[name](router));

  return compose([
    router.routes(),
    router.allowedMethods(),
  ]);
}
/*
console.log(routes)
{
  announcement: [Function],
  index: [Function],
  messageTpl: [Function],
  order: [Function],
  reply: {},
  session: [Function],
  topic: [Function],
  users: [Function]
}
*/

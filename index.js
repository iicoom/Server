require('babel-register');
require('babel-polyfill');

require('./bin/www');
require('./create_order');
require('./tasks_consume');
require('./statistics');

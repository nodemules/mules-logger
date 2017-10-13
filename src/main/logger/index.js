{
  const assert = require('assert');
  const log4js = require('log4js');
  const log4js_extend = require('log4js-extend');

  const Level = log4js.levels;

  const DEFAULT_LOG_LEVEL = Level.INFO;

  log4js.configure({
    appenders: {
      default: {
        type: 'console',
        layout: {
          type: 'pattern',
          pattern: '%[%p %][%d{ISO8601}]%[ %m%]'
        }
      }
    },
    categories: {
      default: {
        level: DEFAULT_LOG_LEVEL,
        appenders: ['default']
      }
    }
  });

  // extend log4js to append file/line/method info
  log4js_extend(log4js, {
    path: __dirname,
    format: '\x1B[39m@name (@file:@line:@column)'
  });

  // define our custom logger
  const LOG = log4js.getLogger();
  // default to INFO level logging
  LOG.level = DEFAULT_LOG_LEVEL;

  // define our custom http request intereceptor logger
  const requestLogger = log4js.connectLogger(LOG, {
    level: 'auto',
    format: ':method :url :status :response-time ms - :res[content-length]',
    nolog: '\\.(gif|jpe?g|png|js|css|html?)'
  });

  function registerUncaughtExceptionHandler() {
    LOG.info('Registering uncaughtException handler');
    process.on('uncaughtException', function(err) {
      // log error then exit
      LOG.fatal(err);
      process.exit(1);
    });
  }

  function setLogLevel(level) {

    assert.ok(level, 'A level is required');
    assert.ok(Level.getLevel(level), `[${level}] is not a valid level`);

    LOG.level = Level.getLevel(level);

    LOG.info(`Logging level is set to [${LOG.level}]`);
    return `Logging level is set to [${LOG.level}]`;

  }

  function getLogger() {
    return LOG;
  }

  function getRequestLogger() {
    return requestLogger;
  }

  function initialize() {
    registerUncaughtExceptionHandler();
  }

  initialize();

  module.exports = {
    getLogger,
    getRequestLogger,
    setLogLevel,
    levels: log4js.levels
  };

}

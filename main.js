{
  const Logger = require('./src/main/logger');

  module.exports = {
    getLogger: Logger.getLogger,
    getRequestLogger: Logger.getRequestLogger,
    setLogLevel: Logger.setLogLevel,
    levels: Logger.levels
  };
}

{
  const Logger = require('./src/main/logger');

  module.exports = {
    getLogger: Logger.getLogger,
    setLogLevel: Logger.setLogLevel,
    levels: Logger.levels
  };
}

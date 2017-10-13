{
  const main = require.main.require('main');
  const chai = require('chai');
  const stdout = require('test-console').stdout;

  chai.use(require('chai-as-promised'));

  const expect = chai.expect;

  const LOG_LEVELS = main.levels;

  describe('logger core', () => {

    describe('logger set up', () => {

      it('should fail to set the log level because \'A level is required\'', () => {
        expect(() => main.setLogLevel()).to.throw(Error, /A level is required/);
      });

      it('should set the log level because \'[%s] is not a valid level\'', () => {
        expect(() => main.setLogLevel('Toast')).to.throw(Error, /\[Toast\] is not a valid level/);
      });

      it('should set the log level', () => {
        let result;
        stdout.ignoreSync(() => {
          result = main.setLogLevel(LOG_LEVELS.DEBUG);
        });
        expect(() => result).to.not.throw();
        expect(result).to.be.a.string;
        expect(result).to.match(/Logging level is set to \[DEBUG\]/);
      });

    });

    describe('logger verbosity', () => {

      const VISIBLE_STR = 'This message should appear';
      const VISIBLE_REGEX = /This message should appear/;

      const INVISIBLE_STR = 'This message should not appear';
      const INVISIBLE_REGEX = /This message should appear/;

      let LOG = main.getLogger();

      before(() => {
        stdout.ignoreSync(() => {
          main.setLogLevel(LOG_LEVELS.DEBUG);
        });
      });

      it('should not log a TRACE statement', () => {
        let inspect = stdout.inspect();
        LOG.trace(INVISIBLE_STR);
        inspect.restore();
        expect(inspect.output).to.be.empty;
      });

      it('should log a DEBUG statement', () => {
        let inspect = stdout.inspect();
        LOG.debug(VISIBLE_STR);
        inspect.restore();
        expect(inspect.output).to.have.length(1);
        expect(inspect.output.some((s) => VISIBLE_REGEX.test(s))).to.be.true;
      });

      it('should log a INFO statement', () => {
        let inspect = stdout.inspect();
        LOG.info(VISIBLE_STR);
        inspect.restore();
        expect(inspect.output).to.have.length(1);
        expect(inspect.output.some((s) => VISIBLE_REGEX.test(s))).to.be.true;
      });

      it('should log a ERROR statement', () => {
        let inspect = stdout.inspect();
        LOG.error(VISIBLE_STR);
        inspect.restore();
        expect(inspect.output).to.have.length(1);
        expect(inspect.output.some((s) => VISIBLE_REGEX.test(s))).to.be.true;
      });

      it('should log a FATAL statement', () => {
        let inspect = stdout.inspect();
        LOG.fatal(VISIBLE_STR);
        inspect.restore();
        expect(inspect.output).to.have.length(1);
        expect(inspect.output.some((s) => VISIBLE_REGEX.test(s))).to.be.true;
      });

    });

  });

}

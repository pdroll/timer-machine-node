const should = require('should');
const sinon = require('sinon');
const Timer = require('../lib/timer');

const getTimeMock = require('./mocks/date-get-time');
const timerTimeMock = require('./mocks/timer-time');

describe('A Timer object', () => {
  let timer;
  const start = 100;
  const end = 200;

  beforeEach(() => {
    timer = new Timer();
    getTimeMock.expect(start);
  });

  afterEach(() => {
    getTimeMock.revert();
  });

  describe('constructor', () => {
    it('should initialize a new Timer object', () => {
      timer.should.be.an.instanceof(Timer);
    });

    it('should be stopped unless the first argument is true', () => {
      timer.isStopped().should.be.true;
    });

    it('should be started if the first argument is true', () => {
      const autoTimer = new Timer(true);
      autoTimer.isStarted().should.be.true;
    });
  });

  describe('time prototype method', () => {
    it('should return 0 if the timer has not been started', () => {
      timer.time().should.equal(0);
    });

    // it('should return the time since start if only started once', () => {
    //   timer.start();
    //   getTimeMock.expect(end);
    //   timer.time().should.equal(end - start);
    // });

    // it('should include the total of past start/stops', () => {
    //   timer._total = 47;
    //   timer.start();
    //   getTimeMock.expect(end);
    //   timer.time().should.equal(end - start + timer._total);
    // });
  });

  describe('emitTime prototype method', () => {
    it('should return the result of timer.time', () => {
      const expected = {};
      timerTimeMock.expect(expected);
      timer.emitTime().should.equal(expected);
      timerTimeMock.revert();
    });
  });

  describe('timeFromStart prototype method', () => {
    it('should return 0 if the timer is stopped', () => {
      timer.timeFromStart().should.equal(0);
      timer.start();
      timer.stop();
      timer.timeFromStart().should.equal(0);
    });

    // it('should return the time since start', () => {
    //   timer.start();
    //   getTimeMock.expect(end);
    //   timer.timeFromStart().should.equal(end - start);
    // });

    // it('should not include the total of past start/stops', () => {
    //   timer._total = 47;
    //   timer.start();
    //   getTimeMock.expect(end);
    //   timer.timeFromStart().should.equal(end - start);
    // });
  });

  describe('isStarted prototype method', () => {
    it('should return false when the timer is stopped', () => {
      timer.isStarted().should.be.false;
      timer.start();
      timer.stop();
      timer.isStarted().should.be.false;
    });

    it('should return true when the timer is started', () => {
      timer.start();
      timer.isStarted().should.be.true;
    });
  });

  describe('isStopped prototype method', () => {
    it('should return true when the timer is stopped', () => {
      timer.isStopped().should.be.true;
      timer.start();
      timer.stop();
      timer.isStopped().should.be.true;
    });

    it('should return false when the timer is started', () => {
      timer.start();
      timer.isStopped().should.be.false;
    });
  });

  describe('start prototype method', () => {
    it('should return true if currently stopped', () => {
      timer.start().should.be.true;
      timer.stop();
      timer.start().should.be.true;
    });

    it('should return false if currently started', () => {
      timer.start();
      timer.start().should.be.false;
    });

    it('should set timer._start to the current time', () => {
      const hrt = process.hrtime();
      timer.start();
      timer._start[0].should.equal(hrt[0]);
    });
  });

  describe('stop prototype method', () => {
    it('should return true if currently started', () => {
      timer.start();
      timer.stop().should.be.true;
    });

    it('should return false if currently stopped', () => {
      timer.stop().should.be.false;
      timer.start();
      timer.stop();
      timer.stop().should.be.false;
    });

    it('should set timer._start to null', () => {
      timer.start();
      timer.stop();
      should(timer._start).equal(null);
    });
  });

  describe('stopParallel prototype method', () => {
    it('should return true if called equal to start', () => {
      timer.start();
      timer.start();
      timer.stopParallel();
      debugger;
      timer.stopParallel().should.be.true;
    });

    it('should return false if called less than start', () => {
      timer.start();
      timer.start();
      timer.stopParallel().should.be.false;
    });

    it('should set timer._start to null if called equal to start', () => {
      timer.start();
      timer.start();
      timer.stopParallel();
      timer.stopParallel();
      should(timer._start).equal(null);
    });

    it('should not set timer._start to null if called less', () => {
      timer.start();
      timer.start();
      timer.stopParallel();
      should(timer._start).not.equal(null);
    });
  });

  describe('toggle prototype method', () => {
    it('should start the timer when it is stopped', () => {
      timer.toggle();
      timer.isStarted().should.be.true;
    });

    it('should stop the timer when it is started', () => {
      timer.start();
      timer.toggle();
      timer.isStopped().should.be.true;
    });

    it('should always return true', () => {
      timer.toggle().should.be.true;
      timer.toggle().should.be.true;
    });
  });

  describe('toString prototype method', () => {
    it('should return a string', () => {
      timer.toString().should.be.a.String;
    });

    it('should be a whole number followed by"ms"', () => {
      timer.toString().should.match(/\d+ms/);
    });
  });

  describe('valueOf prototype method', () => {
    it('should be an alias of time()', () => {
      const expected = {};
      sinon.stub(timer, 'time').returns(expected);
      timer.valueOf().should.equal(expected);
      timer.time.restore();
    });
  });
});

'use strict';

const should = require('should');
const Timer = require('../lib/timer');
const EventEmitter = require('events').EventEmitter;
const sinon = require('sinon');

describe('The Timer/EventEmitter object', () => {
  let foo;
  let spy;

  beforeEach(() => {
    foo = new Timer();
    spy = sinon.spy();
  });

  it('should be an instance of EventEmitter', () => {
    foo.should.be.instanceof(EventEmitter);
  });

  it('should emit start event when started', () => {
    foo.on('start', spy);
    foo.start();
    spy.called.should.be.true;
  });

  it('should emit stop event when stopped', () => {
    foo.on('stop', spy);
    foo.start();
    spy.called.should.be.false;
    foo.stop();
    spy.called.should.be.true;
  });

  it('should emit time event when emitTime is called', () => {
    const expected = 47;
    foo._total = expected;
    foo.on('time', spy);
    foo.emitTime();
    spy.called.should.be.true;
    sinon.assert.calledWith(spy, expected);
  });
});

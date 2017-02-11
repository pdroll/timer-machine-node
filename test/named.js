'use strict';

const should = require('should');
const Timer = require('../lib/timer');

describe('The Timer function', () => {
  let foo;

  before(() => {
    foo = Timer.get('foo');
  });

  describe('get static method', () => {
    it('should create a new Timer if it does not exist', () => {
      Timer.get('bar')
        .should.be.an.instanceof(Timer)
        .and.should.not.equal(foo);
      Timer.destroy('bar');
    });

    it('should return a reference to an existing named timer', () => {
      Timer.get('foo').should.equal(foo);
    });
  });

  describe('destroy static method', () => {
    it('should destroy a named timer', () => {
      Timer.destroy('foo');
      Timer.get('foo').should.not.equal(foo);
    });

    it('should return true if the timer existed', () => {
      Timer.destroy('foo').should.be.true;
    });

    it('should return false if the timer did not exist', () => {
      Timer.destroy('bar').should.be.false;
    });
  });
});

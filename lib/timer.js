'use strict';

/**
 * Module dependencies.
 */
const EventEmitter = require('events').EventEmitter;
const inherits = require('util').inherits;

/**
 * Get milliseconds from a given hrtime
 * @return {Number}
 * @api private
 */
function hrtimeToMs(hrtime) {
  return ((hrtime[0] * 1e9) + hrtime[1]) / 1e6;
}

/**
 * Stores named timers.
 */
const timers = {};

/**
 * Initialize a `Timer` object
 * @param {Boolean} start
 * @api public
 */
function Timer(start) {
  EventEmitter.call(this);
  this._total = 0;
  this._start = null;
  this._startCount = 0;
  if (start) {
    this.start();
  }
}

/**
 * Timer extends EventEmitter.
 */
inherits(Timer, EventEmitter);

/**
 * Get a named timer, initialize a new one if it does not exist.
 * @param {String} name
 * @return {Timer}
 * @api public
 */
Timer.get = function get(name) {
  if (!timers[name]) {
    timers[name] = new Timer();
  }
  return timers[name];
};

/**
 * Destroy an existing named timer.
 * @param {String} name
 * @return {Boolean}
 * @api public
 */
Timer.destroy = function destroy(name) {
  if (timers[name]) {
    return delete timers[name];
  }
  return false;
};

/**
 * Get the total milliseconds the timer has run.
 * @return {Number}
 * #api public
 */
Timer.prototype.time = function time() {
  let total = this._total;
  total += this.timeFromStart();
  return total;
};

/**
 * Get the total millisseonds the time has run and emit time event.
 * @return {Number}
 */
Timer.prototype.emitTime = function emitTime() {
  const time = this.time();
  this.emit('time', time);
  return time;
};

/**
 * Get the time in milliseconds since the timer was last started.
 * @return {Number}
 * @api public
 */
Timer.prototype.timeFromStart = function timeFromStart() {
  return this.isStarted() ? hrtimeToMs(process.hrtime(this._start)) : 0;
};

/**
 * Check to see if the timer object is currently started.
 * @return {Boolean}
 * @api public
 */
Timer.prototype.isStarted = function isStarted() {
  return !this.isStopped();
};

/**
 * Check to see if the timer object is currently stopped.
 * @return {Boolean}
 * @api public
 */
Timer.prototype.isStopped = function isStopped() {
  return this._start === null;
};

/**
 * Start the timer if it was not already started.
 * @return {Boolean}
 * @api public
 */
Timer.prototype.start = function start() {
  this._startCount = this._startCount + 1;
  if (this.isStopped()) {
    this._start = process.hrtime();
    this.emit('start');
    return true;
  }
  return false;
};

/**
 * Stop the timer if it was not already stopped.
 * @return {Boolean}
 * @api public
 */
Timer.prototype.stop = function stop() {
  if (this.isStarted()) {
    this._total += this.timeFromStart();
    this._start = null;
    this._stopCount = 0;
    this.emit('stop');
    return true;
  }
  return false;
};

/**
 * Stop the timer if once called equal to the number of times start was called.
 * @return {Boolean} true if timer was stopped
 * @api public
 */
Timer.prototype.stopParallel = function stopParallel() {
  if (this.isStarted()) {
    this._startCount = this._startCount - 1;
    if (this._startCount === 0) {
      return this.stop();
    }
  }
  return false;
};

/**
 * Start or stop the timer depending on current state.
 * @return {Boolean}
 * @api public
 */
Timer.prototype.toggle = function toggle() {
  return this.start() || this.stop();
};

/**
 * Return a string representation of the timer.
 * @return {String}
 */
Timer.prototype.toString = function toString() {
  return `${this.time()}ms`;
};

/**
 * Return a numeric value of the timer in milliseconds.
 * @return {Number}
 */
Timer.prototype.valueOf = function valueOf() {
  return this.time();
};

/**
 * Expose `Timer`.
 */
module.exports = Timer;

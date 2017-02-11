const Timer = require('../../lib/timer');

const originalTime = Timer.prototype.time;

exports.expect = function (val) {
  Timer.prototype.time = function () {
    return val;
  };
};

exports.revert = function () {
  Timer.prototype.time = originalTime;
};

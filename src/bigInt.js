/**
 * @author oldj
 * @blog http://oldj.net
 */

'use strict';

var bi = require('./bi');

function BigInt(s) {
    this._value = s;
}

BigInt.bi = bi;

var prop = {
    val: function () {
        return this._value;
    }
};
prop.toString = prop.valueOf = prop.val;
var k;
var m;
for (k in bi) {
    if (bi.hasOwnProperty(k) && typeof (m = bi[k]) == 'function') {
        (function (_m) {
            prop[k] = function (b) {
                this._value = _m(this._value, b);
                return this;
            }
        })(m)
    }
}

BigInt.prototype = prop;

module.exports = function (s) {
    return new BigInt(s);
};

/**
 * @author oldj
 * @blog http://oldj.net
 */

'use strict';

var bi = require('./bi');

function BigInt(s) {
    this.val = s;
}

var prop = {
    bi: bi,
    val: function () {
        return this.val;
    },
};
prop.toString = prop.valueOf = prop.val;
var k;
var m;
for (k in bi) {
    if (bi.hasOwnProperty(k) && typeof (m = bi[k]) == 'function') {
        (function (_m) {
            prop[k] = function (b) {
                this.val = _m(this.val, b);
                return this;
            }
        })(m)
    }
}

BigInt.prototype = prop;

module.exports = function (s) {
    return new BigInt(s);
};

/**
 * JavaScript BigInt (version: 0.2.0)
 * @author oldj
 * @blog http://oldj.net
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * bi.js
 * @author oldj
 * @blog http://oldj.net
 */

'use strict';

var version = '0.2.0';

/**
 * @param a {Array}
 * @param fn {Function}
 */
function each(a, fn) {
    if (a.map) {
        a.map(fn);
        return;
    }

    for (var i = 0, l = a.length; i < l; i++) {
        fn(a[i], i);
    }
}

function __trans(bi) {
    if (typeof bi != 'string') {
        bi = bi.toString();
    }
    if (!bi || !bi.match(/^\d+$/)) {
        var err = new Error();
        err.name = 'BigInt Error';
        err.message = '\'' + bi + '\' is not an Integer.';
        throw err;
    }

    bi = bi.replace(/^0+/g, '').split('');
    each(bi, function (item, idx) {
        bi[idx] = parseInt(item);
    });

    return bi;
}

function __cmp(na, nb) {
    var len_a = na.length;
    var len_b = nb.length;

    if (len_a > len_b) {
        return 1;
    } else if (len_a < len_b) {
        return -1;
    } else {
        var i;
        var ia;
        var ib;
        for (i = 0; i < len_a; i++) {
            ia = na[i];
            ib = nb[i];
            if (ia != ib) {
                return ia > ib ? 1 : -1;
            }
        }
    }

    return 0;
}

function cmp(a, b) {
    var sa = sign(a);
    var sb = sign(b);

    if (sa > sb) {
        return 1;
    } else if (sa < sb) {
        return -1;
    }

    var t;
    if (sa == -1 && sb == -1) {
        t = a;
        a = abs(b);
        b = abs(t);
    }

    return a == b ? 0 : __cmp(__trans(a), __trans(b));
}

function gt(a, b) {
    // great than
    return cmp(a, b) == 1;
}

function gte(a, b) {
    // great than or equal
    return cmp(a, b) >= 0;
}

function lt(a, b) {
    // less than
    return cmp(a, b) == -1;
}

function lte(a, b) {
    // less than or equal
    return cmp(a, b) <= 0;
}

function eq(a, b) {
    // equal
    return a.replace(/^0+/g, '') == b.replace(/^0+/g, '');
}

/**
 * @param na {Array}
 * @private
 */
function __carry(na) {
    // 进位
    var i;
    var l = na.length;
    var s;
    for (i = 0; i < l; i++) {
        s = na[i];
        if (s > 9) {
            na[i] = s % 10;
            na[i + 1] = (na[i + 1] || 0) + Math.floor(s / 10);
        }
    }

    return na;
}

function __mkZeroArr(len) {
    var a = [];
    for (var i = 0; i < len; i++) {
        a[i] = 0;
    }
    return a;
}

function __add(na, nb) {
    var len = Math.max(na.length, nb.length);
    var result = __mkZeroArr(len);

    na = na.slice(0).reverse();
    nb = nb.slice(0).reverse();

    // 相加
    var i;
    for (i = 0; i < len; i++) {
        result[i] = (na[i] || 0) + (nb[i] || 0);
    }
    result = __carry(result).reverse();

    // 丢掉首位的 0
    while (result[0] == 0) {
        result.shift();
    }

    return result;
}

function add(a, b) {
    var sa = sign(a);
    var sb = sign(b);

    if (sa == -1 && sb == -1) {
        return '-' + add(abs(a), abs(b));
    } else if (sa == -1) {
        return subtract(b, abs(a));
    } else if (sb == -1) {
        return subtract(a, abs(b));
    }

    var na = __trans(a);
    var nb = __trans(b);
    return __add(na, nb).join('');
}

function __subtract(na, nb) {
    na = na.slice(0).reverse();
    nb = nb.slice(0).reverse();

    var len = Math.max(na.length, nb.length);
    var result = __mkZeroArr(len);

    // 相减
    var i;
    for (i = 0; i < len; i++) {
        result[i] = (na[i] || 0) - (nb[i] || 0);
    }

    // 借位
    var s;
    for (i = 0; i < len - 1; i++) {
        s = result[i];
        if (s < 0) {
            result[i] += 10;
            result[i + 1] -= 1;
        }
    }

    result = result.reverse();

    // 丢掉首位的 0
    while (result[0] == 0) {
        result.shift();
    }

    return result;
}

function subtract(a, b) {
    // 减法

    var sa = sign(a);
    var sb = sign(b);

    if (sa == -1 && sb == -1) {
        return neg(subtract(abs(a), abs(b)));
    } else if (sa == -1) {
        return '-' + add(abs(a),  b);
    } else if (sb == -1) {
        return add(a, abs(b));
    }

    var na = __trans(a);
    var nb = __trans(b);
    var result;

    switch (__cmp(na, nb)) {
        case -1:
            result = '-' + __subtract(nb, na).join('');
            break;
        case 0:
            result = 0;
            break;
        case 1:
            result = __subtract(na, nb).join('');
            break;
    }

    return result;
}

/**
 * 大数字 a 与个位数 si 相乘
 * @param a
 * @param si
 * @private
 */
function __multiplyBySingle(a, si) {
    if (si == 0) {
        return [0];
    }

    if (si == 1) {
        return a;
    }

    var na = a.slice(0).reverse();
    var len = na.length;
    na.push(0);
    var result = na;

    var i;
    for (i = 0; i < len; i++) {
        result[i] *= si;
    }
    result = __carry(result).reverse();

    if (result[0] == 0) {
        result.shift();
    }

    return result;
}

/**
 * 左移 n 位（在右侧补 n 个 0）
 * @param a
 * @param n
 * @private
 */
function __lmv(a, n) {
    if (n > 0) {
        return a.concat(__mkZeroArr(n));
    } else {
        return a;
    }
}

function __multiply(na, nb) {
    var result = [0];
    var cache = [];

    var max_idx = nb.length - 1;
    var i;
    var ib;
    for (i = max_idx; i >= 0; i--) {
        ib = nb[i];
        if (!cache[ib]) {
            cache[ib] = __multiplyBySingle(na, ib);
        }
        result = __add(result, __lmv(cache[ib], max_idx - i));
    }

    return result;
}

function multiply(a, b) {
    // 乘法
    var sa = sign(a);
    var sb = sign(b);
    var s = sa * sb;
    if (s === 0) return '0';
    var ss = s === 1 ? '' : '-';

    var na = __trans(abs(a));
    var nb = __trans(abs(b));

    if (na.length < nb.length) {
        return ss + __multiply(nb, na).join('');
    } else {
        return ss + __multiply(na, nb).join('');
    }
}

function __divide(na, nb) {
    var result = [0];
    var left = na.slice(0);
    var cache = [];
    var delta_len = na.length - nb.length;

    function _multi(i) {
        if (!cache[i]) {
            cache[i] = __multiplyBySingle(nb, i);
        }
        return cache[i];
    }

    var d_len;
    var i;
    var tmp;
    for (d_len = delta_len; d_len >= 0; d_len--) {
        for (i = 1; i <= 9; i++) {
            tmp = __lmv(_multi(i), d_len);
            if (__cmp(left, tmp) == -1) {
                result.push(i - 1);
                left = __subtract(left, __lmv(_multi(i - 1), d_len));
                break;
            }

            if (i == 9) {
                result.push(i);
                left = __subtract(left, __lmv(_multi(i), d_len));
            }
        }
    }

    while (result[0] == 0) {
        result.shift();
    }

    return [result, left];
}

function divide(a, b) {
    // 除法
    var sa = sign(a);
    var sb = sign(b);
    var s = sa * sb;
    if (sa === 0) return '0';
    if (sb === 0) return 'N/A';
    var ss = s === 1 ? '' : '-';

    var na = __trans(abs(a));
    var nb = __trans(abs(b));

    switch (__cmp(na, nb)) {
        case -1:
            return '0';
        case 0:
            return ss + '1';
        default:
            // a > b，开始除法计算
            return ss + __divide(na, nb)[0].join('')
    }
}

function mod(a, b) {
    // 求余

    var sa = sign(a);
    var sb = sign(b);
    if (sa === 0) return '0';
    if (sb === 0) return 'N/A';
    var ss = sa === 1 ? '' : '-';

    if (b == 1 || b == '1') {
        return '0';
    }

    var na = __trans(abs(a));
    var nb = __trans(abs(b));

    switch (__cmp(na, nb)) {
        case -1:
            return a;
        case 0:
            return '0';
        default:
            var m = __divide(na, nb)[1].join('');
            return m ? (ss + m) : '0';
    }
}

function abs(a) {
    // 求绝对值
    return a.toString().replace(/^-/, '');
}

function sign(a) {
    // 取得符号
    if (!a || a == '0') {
        return 0;
    } else if (a.toString().indexOf('-') == 0) {
        return -1;
    } else {
        return 1;
    }
}

function neg(a) {
    var sa = sign(a);
    if (sa === 1) {
        return '-' + a;
    } else if (sa === -1) {
        return abs(a);
    } else {
        return a;
    }
}

module.exports = {
    version: version,
    cmp: cmp,
    gt: gt,
    gte: gte,
    lt: lt,
    lte: lte,
    eq: eq,
    add: add,
    sub: subtract,
    mul: multiply,
    div: divide,
    mod: mod,
    abs: abs,
    sign: sign,
    neg: neg
};


},{}],2:[function(require,module,exports){
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

},{"./bi":1}]},{},[2])
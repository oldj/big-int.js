/**
 * author: oldj
 * blog: http://oldj.net
 */

module BIO {

    var version:string = "0.1.1";

    function err(msg:string) {
        var e = new Error();
        e.name = "BIO Error";
        e.message = msg;
        return e;
    }

    function __trans(bn:string):number[] {
        if (!bn.match(/^\d+$/)) {
            throw err(`'${bn}' is not an Integer.` );
        }
        var a:string[] = bn.replace(/^0+/g, "").split("");
        var result:number[];
        a.forEach(function (i) {
            result.push(parseInt(i));
        });
        return result;
    }

    /**
     * 比较两个数的大小
     * @param na
     * @param nb
     * @returns {number}
     * @private
     */
    function __cmp(na:number[], nb:number[]):number {
        if (na.length > nb.length) return 1;
        if (na.length < nb.length) return -1;

        var result:number = 0;
        var i:number;
        var ca:number, cb:number;
        for (i = 0; i < na.length; i ++) {
            ca = na[i];
            cb = nb[i];
            if (ca != cb) {
                result = ca > cb ? 1 : -1;
                break;
            }
        }
        return result;
    }

    /**
     * 大于
     * @param a
     * @param b
     * @returns {boolean}
     */
    function gt(a:string, b:string):boolean {
        return __cmp(__trans(a), __trans(b)) == 1;
    }

    /**
     * 大于等于
     * @param a
     * @param b
     * @returns {boolean}
     */
    function gte(a:string, b:string):boolean {
        return __cmp(__trans(a), __trans(b)) >= 0;
    }

    /**
     * 小于
     * @param a
     * @param b
     * @returns {boolean}
     */
    function lt(a:string, b:string):boolean {
        return __cmp(__trans(a), __trans(b)) == -1;
    }

    /**
     * 小于等于
     * @param a
     * @param b
     * @returns {boolean}
     */
    function lte(a:string, b:string):boolean {
        return __cmp(__trans(a), __trans(b)) <= 0;
    }

    /**
     * 等于
     * @param a
     * @param b
     * @returns {boolean}
     */
    function eq(a:string, b:string):boolean {
        return a.replace(/^0+/, "") == b.replace(/^0+/, "");
    }

    /**
     * 进位
     * @param na
     * @private
     */
    function __carry(na:number[]):number[] {
        var i:number;
        var l:number = na.length;
        var s:number;
        for (i = 0; i < l; i ++) {
            s = na[i];
            if (s > 9) {
                na[i] = s % 10;
                na[i + 1] += Math.floor(s / 10);
            }
        }
        return na;
    }

    function __add(na:number[], nb:number[]):number[] {
        var len:number = Math.max(na.length, nb.length);
        var result:number[] = [];
        var i;

        na = na.slice(0).reverse();
        nb = nb.slice(0).reverse();

        for (i = 0; i < len; i ++) {
            result[i] = (na[i] || 0) + (nb[i] || 0);
        }

        result = __carry(result).reverse();

        // 丢掉首位的 0
        while (result[0] == 0) {
            result.shift();
        }

        return result;
    }

    /**
     * 加法
     * @param a
     * @param b
     * @returns {string}
     */
    function add(a:string, b:string):string {
        var na:number[] = __trans(a);
        var nb:number[] = __trans(b);
        return __add(na, nb).join("")
    }

    function __minus(na:number[], nb:number[]):number[] {
        na = na.slice(0).reverse();
        nb = nb.slice(0).reverse();

        var len:number = Math.max(na.length, nb.length);
        var result:number[] = [];

        // 相减
        var i:number;
        for (i = 0; i < len; i ++) {
            result[i] = (na[i] || 0) - (nb[i] || 0);
        }

        // 借位
        var s:number;
        for (i = 0; i < len - 1; i ++) {
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

    /**
     * 减法
     * @param a
     * @param b
     */
    function minus(a:string, b:string):string {
        var na:number[] = __trans(a);
        var nb:number[] = __trans(b);

        var result:string;
        switch (__cmp(na, nb)) {
            case -1:
                result = "-" + __minus(nb, na).join("");
                break;
            case 0:
                result = "0";
                break;
            case 1:
                result = __minus(na, nb).join("")
        }

        return result;
    }
}

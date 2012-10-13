# -*- coding: utf-8 -*-
#
# author: oldj
# blog: http://oldj.net
# email: oldj.wu@gmail.com
#

import random

OPERATIONS = ("add", "minus", "multiply", "divide", "mod")

def rndBigInt():

    len = random.randint(50, 500)
    a = ["%d" % random.randint(0, 9) for i in range(len)]
    return long("".join(a))


def makeATest():

    operation = random.choice(OPERATIONS)
    a = rndBigInt()
    b = rndBigInt()

    if operation == "add":
        c = a + b
    elif operation == "minus":
        c = a - b
    elif operation == "multiply":
        c = a * b
    elif operation == "divide":
        c = a / b
    else:
        c = a % b

    return """["%s",\n\t\t"%d",\n\t\t"%d",\n\t\t"%d"\n\t]""" % (operation, a, b , c)



def main():

    js = """
function test(operation, a, b, result) {
    return BIO[operation](a, b) === result;
}

function doTest(datas) {
    for (var i = 0, l = datas.length, data; i < l; i ++) {
        data = datas[i];
        if (!test(data[0], data[1], data[2], data[3])) {
            console.log(data);
            console.log("Fail!");
            return;
        }
    }
    console.log("OK!");
}

doTest([%s]);
"""
    test_datas = []
    for i in xrange(1000):
        test_datas.append(makeATest())

    js %= ",\n\t".join(test_datas)

    open("tests.js", "w").write(js)


if __name__ == "__main__":
    main()

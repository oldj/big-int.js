# -*- coding: utf-8 -*-
#
# author: oldj
# blog: http://oldj.net
# email: oldj.wu@gmail.com
#

import random

OPERATIONS = ('add', 'minus', 'multiply', 'divide', 'mod')


def rnd_big_int():
    l = random.randint(50, 500)
    a = ['%d' % random.randint(0, 9) for _ in range(l)]
    return long(''.join(a))


def make_a_test():
    operation = random.choice(OPERATIONS)
    a = rnd_big_int()
    b = rnd_big_int()

    if operation == 'add':
        c = a + b
    elif operation == 'minus':
        c = a - b
    elif operation == 'multiply':
        c = a * b
    elif operation == 'divide':
        c = a // b
    else:
        c = a % b

    return """['%s',\n\t\t'%d',\n\t\t'%d',\n\t\t'%d'\n\t]""" % (operation, a, b, c)


def main():
    js = """exports.tests = [\n\t%s\n];"""
    test_datas = []
    for i in xrange(1000):
        test_datas.append(make_a_test())

    js %= ',\n\t'.join(test_datas)

    open('tests.js', 'w').write(js)


if __name__ == '__main__':
    main()

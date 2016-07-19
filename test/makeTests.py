# -*- coding: utf-8 -*-
#
# author: oldj
# blog: http://oldj.net
# email: oldj.wu@gmail.com
#

import random

OPERATIONS = ('add', 'sub', 'mul', 'div', 'mod')


def rnd_big_int():
    l = random.randint(50, 500)
    a = ['%d' % random.randint(0, 9) for _ in range(l)]
    s = random.choice([-1, 1])
    return s * int(''.join(a))


def make_a_test():
    operation = random.choice(OPERATIONS)
    a = rnd_big_int()
    b = rnd_big_int()

    if operation == 'add':
        c = a + b
    elif operation == 'sub':
        c = a - b
    elif operation == 'mul':
        c = a * b
    elif operation == 'div':
        s = 1 if a * b > 0 else -1
        c = s * (abs(a) // abs(b))
    else:  # mod
        s = 1 if a > 0 else -1
        c = s * (abs(a) % abs(b))

    return """['%s',\n\t\t'%d',\n\t\t'%d',\n\t\t'%d'\n\t]""" % (operation, a, b, c)


def main():
    js = """exports.tests = [\n\t%s\n];"""
    test_datas = []
    for i in xrange(2000):
        test_datas.append(make_a_test())

    js %= ',\n\t'.join(test_datas)

    open('tests.js', 'w').write(js)


if __name__ == '__main__':
    main()

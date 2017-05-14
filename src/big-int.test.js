/**
 * bigInt.test.js, created on 2016/7/20.
 * @author oldj
 * @blog http://oldj.net
 */

'use strict'

const bigInt = require('./big-int')
const assert = require('chai').assert

describe('chain test', () => {

  it('basic test', () => {
    assert.equal(bigInt('123').add('222').toString(), '345')
    assert.equal(bigInt('123').add('222').val(), '345')
    assert.equal(bigInt('100')
      .add('200')
      .sub('30')
      .mul('20')
      .div('6')
      .toString(), '900')
    assert.equal(bigInt('100')
      .add('-20') // 80
      .sub('-10') // 90
      .mul('-10') // -900
      .div('3') // -300
      .toString(), '-300')

    let c = bigInt('100')
      .add('50') // 150
      .sub('10') // 140
      .mul('2') // 280
      .div('11') // 25
    assert.equal(c.val(), 25)
  })

  it('cmp', () => {
    assert.equal(bigInt('100').cmp('200'), -1)
    assert.equal(bigInt('200').cmp('200'), 0)
    assert.equal(bigInt('200').cmp('-200'), 1)
    assert.equal(bigInt('-100').cmp('-200'), 1)

    assert.equal(bigInt('-100').gt('-200'), true)
    assert.equal(bigInt('-100').gte('-200'), true)
    assert.equal(bigInt('100').gte('200'), false)
    assert.equal(bigInt('100').gte('-200'), true)
    assert.equal(bigInt('100').lt('-200'), false)
    assert.equal(bigInt('100').lte('-200'), false)
    assert.equal(bigInt('100').lt('100'), false)
    assert.equal(bigInt('100').lte('100'), true)
  })

  it('other', () => {
    assert.equal(bigInt('100').sign(), 1)
    assert.equal(bigInt('200').sign(), 1)
    assert.equal(bigInt('-200').sign(), -1)
    assert.equal(bigInt('0').sign(), 0)

    assert.equal(bigInt('0').abs().toString(), '0')
    assert.equal(bigInt('100').abs().toString(), '100')
    assert.equal(bigInt('-100').abs().toString(), '100')

    assert.equal(bigInt('-100').neg().toString(), '100')
    assert.equal(bigInt('100').neg().toString(), '-100')
    assert.equal(bigInt('0').neg().toString(), '0')
  })
})

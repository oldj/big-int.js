# Big Integer Operations
# 大整数四则运算
#
# @author oldj
# @blog http://oldj.net
#


BIO =

  __trans: (bn) ->
    if not bn or not bn.match(/^\d+$/)
      err = new Error()
      err.name = "BIO Error"
      err.message = "'#{bn}' is not an Integer."
      throw err

    return (parseInt(i) for i in bn.replace(/^0+/g, "").split(""))


  __cmp: (na, nb) ->
    # 比较两个数的大小
    if na.length > nb.length
      1
    else if na.length < nb.length
      -1
    else
      result = 0
      for i in [0..(na.length-1)]
        if na[i] != nb[i]
          result = (if na[i] > nb[i] then 1 else -1)
          break

      result


  gt: (a, b) ->
    # 大于
    @__cmp(@__trans(a), @__trans(b)) == 1

  gte: (a, b) ->
    # 大于等于
    @__cmp(@__trans(a), @__trans(b)) >= 1

  lt: (a, b) ->
    # 小于
    @__cmp(@__trans(a), @__trans(b)) == -1

  lte: (a, b) ->
    # 小于等于
    @__cmp(@__trans(a), @__trans(b)) <= 0

  eq: (a, b) ->
    # 等于
    a == b

  __carry: (na) ->
    # 进位
    for i in [0..na.length]
      s = na[i]
      if s > 9
        na[i] = s % 10
        na[i+1] += Math.floor(s/10)

    na

  __add: (na, nb) ->
    len = Math.max(na.length, nb.length)
    result = (0 for i in [0..len])

    na = na.slice(0).reverse()
    nb = nb.slice(0).reverse()
    # 相加
    for i in [0..(len-1)]
      result[i] = (na[i] or 0) + (nb[i] or 0)

    result = @__carry(result).reverse()
    # 丢掉首位的 0
    while result[0] == 0
      result.shift()

    result


  add: (a, b) ->
    # 加法
    na = @__trans(a)
    nb = @__trans(b)
    @__add(na, nb).join("")


  __minus: (na, nb) ->
    na = na.slice(0).reverse()
    nb = nb.slice(0).reverse()
    len = Math.max(na.length, nb.length)
    result = (0 for i in [0..len])

    # 相减
    for i in [0..(len-1)]
      result[i] = (na[i] or 0) - (nb[i] or 0)

    # 借位
    for i in [0..len]
      s = result[i]
      if s < 0
        result[i] += 10
        result[i+1] -= 1

    result = result.reverse()
    # 丢掉首位的 0
    while result[0] == 0
      result.shift()

    result


  minus: (a, b) ->
    # 减法
    na = @__trans(a)
    nb = @__trans(b)

    switch @__cmp(na, nb)
      when -1
        result = "-" + @__minus(nb, na).join("")
      when 0
        result = 0
      when 1
        result = @__minus(na, nb).join("")

    result

  __multiplyBySigle: (a, si) ->
    # 大数字 a 与个位数 i 相乘
    if si == 0
      [0]

    else if si == 1
      a

    else
      na = a.slice(0).reverse()
      len = na.length
      na.push(0)
      result = na
      for i in [0..(len-1)]
        result[i] *= si

      result = @__carry(result).reverse()
      if result[0] == 0
        result.shift()

      result


  __lmv: (a, n) ->
    # 左移 n 位（在右则补 n 个 0）
    if n > 0 then a.concat(0 for i in [1..n]) else a


  __multiply: (na, nb) ->
    result = [0]
    cache = []

    max_idx = nb.length - 1
    for i in [max_idx..0]
      ib = nb[i]
      if not cache[ib]?
        cache[ib] = @__multiplyBySigle(na, ib)
      result = @__add(result, @__lmv(cache[ib], max_idx-i))

    result


  multiply: (a, b) ->
    # 乘法
    na = @__trans(a)
    nb = @__trans(b)

    if na.length < nb.length
      @__multiply(nb, na).join("")
    else
      @__multiply(na, nb).join("")


  __divide: (na, nb) ->

    result = [0]
    left = na.slice(0)
    cache = []
    delta_len = na.length - nb.length

    _multi = (i) =>
      if not cache[i]?
        cache[i] = @__multiplyBySigle(nb, i)
      cache[i]

    for d_len in [delta_len..0]
      for i in [1..9]
        tmp = @__lmv(_multi(i), d_len)
        if @__cmp(left, tmp) == -1
          result.push(i-1)
          left = @__minus(left, @__lmv(_multi(i-1), d_len))
          break

        if i == 9
          result.push(i)
          left = @__minus(left, @__lmv(_multi(i), d_len))


    while result[0] == 0
      result.shift()

    [result, left]


  divide: (a, b) ->
    # 除法
    na = @__trans(a)
    nb = @__trans(b)

    switch @__cmp(na, nb)
      when -1 then "0"
      when 0 then "1"
      else
        # a > b，开始除法
        @__divide(na, nb)[0].join("")


  mod: (a, b) ->
    # 求余
    na = @__trans(a)
    nb = @__trans(b)

    switch @__cmp(na, nb)
      when -1 then a
      when 0 then "0"
      else
      # a > b，开始除法
        @__divide(na, nb)[1].join("") or "0"


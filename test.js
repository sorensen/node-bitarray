'use strict';

var assert = require('assert')
  , ase = assert.strictEqual
  , ade = assert.deepEqual
  , BitArray = require('./index')

describe('BitArray', function() {

  it('should get the correct cardinality', function() {
    ase(BitArray.cardinality(144), 2)
    ase(BitArray.count(128), 1)
    ase(BitArray.bitcount(new Buffer([255, 128])), 9)
    ase(BitArray.population([0,1,1,0,1,0]), 3)

    var bits = new BitArray()
    bits.set(0, 1)
    bits.set(3, 0)
    bits.set(200, 1)
    ase(bits.cardinality(), 2)
  })

  it('should use the factory method for mapping', function() {
    var a = [255, 128].map(BitArray.factory).map(String)
    ase(a[0], '11111111')
    ase(a[1], '00000001')
  })

  it('should get the correct bits', function() {
    var bit = new BitArray(new Buffer([128, 144]))
    ase(bit.toString(), '0000100100000001')
    ase(bit.cardinality(), 3)
    ade(bit.toJSON(), [1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0])
    ase(JSON.stringify(bit), '[1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0]')
    var bit2 = new BitArray(255)
    ase([bit2].join(''), '11111111')
    ade(bit2.toArray(), [1,1,1,1,1,1,1,1])
  })

  it('should return a buffer', function() {
    var buf = BitArray.toBuffer([1,1,1,1,1,1,1,1])
    ase(buf instanceof Buffer, true)
    ase(buf[0], 255)
  })

  it('should create an octet array', function() {
    var oct = BitArray.octet([])
    ase(oct.length, 8)
    oct.push(1)
    var oct2 = BitArray.octet(oct)
    ase(oct2.length, 16)
  })

  it('should parse a binary string', function() {
    ade(BitArray.parse('100101'), [1,0,1,0,0,1])
    ase(new BitArray(new BitArray(128).toString()).toString(), '00000001')
  })

  it('should be coorced to a number', function() {
    var bits = new BitArray('1001')
    ase(+bits, 9)
  })

  it('should be coorced to a string', function() {
    var bits = new BitArray('0011')
    ase([bits].join(''), '0011')
  })

  it('should zero fill to the given offset', function() {
    var bits = new BitArray()
    bits.fill(24)
    ase(bits.length, 24)
  })

  it('should work from offsets', function() {
    var offs = [1, 5, 10]
      , ba = BitArray.fromOffsets(offs)
    ase(ba.length, 11)
    ase(ba.toString(), '10000100010')
  })

  it('should work from base 10 numbers', function() {
    var bits = BitArray.fromDecimal(12)
    ase(bits.length, 4)
    ase(bits.toString(), (12).toString(2))
    ade(bits.toJSON(), [0, 0, 1, 1])
  })

  it('should convert to a number', function() {
    var bits = new BitArray().set([1, 0, 1, 1])
    ase(bits.toNumber(), 13)
    ase(bits.toHex(), 'd')
  })

  it('should work from hexadecimal', function() {
    var bits = BitArray.fromHex('f0')
    ase(bits.toString(), '11110000')
    var bits = BitArray.fromHex(10)
    ase(bits.toString(), '10000')
  })

  it('should convert to hexadecimal', function() {
    var bits = new BitArray(255)
    ase(bits.toHex(), 'ff')
  })

  it('should perform a bitwise `xor`', function() {
    var a = [ 1, 0, 0, 1, 0, 0, 0, 1 ]
    var b = [ 1, 0, 0, 0, 1, 0, 0, 1 ]
    var c = [ 0, 1, 0, 0, 0, 1, 0, 1 ]
    var d = BitArray.xor(a, b, c)
    ade(d,  [ 0, 1, 0, 1, 1, 1, 0, 1 ])
  })

  it('should perform a bitwise `or`', function() {
    var a = [ 1, 0, 0, 1, 0, 0, 0, 1 ]
    var b = [ 1, 0, 0, 0, 1, 0, 0, 1 ]
    var c = [ 0, 1, 0, 0, 0, 1, 0, 1 ]
    var d = BitArray.or(a, b, c)
    ade(d,  [ 1, 1, 0, 1, 1, 1, 0, 1 ])
  })

  it('should perform a bitwise `and`', function() {
    var a = [ 1, 0, 0, 1, 0, 0, 0, 1 ]
    var b = [ 1, 0, 0, 0, 1, 0, 0, 1 ]
    var c = [ 0, 1, 0, 0, 0, 1, 0, 1 ]
    var d = BitArray.and(a, b, c)
    ade(d,  [ 0, 0, 0, 0, 0, 0, 0, 1 ])
  })

  it('should perform a bitwise `not`', function() {
    var a = [ 1, 0, 0, 1, 0, 0, 0, 1 ]
    var b = BitArray.not(a)
    ade(b,  [ 0, 1, 1, 0, 1, 1, 1, 0])
  })

  it('should get the correct offsets', function() {
    var offs = BitArray.offsets([1, 0, 0, 1])
    ade(offs, [0, 3])

    var bits = new BitArray(144)
    ade(bits.offsets(), [0, 3])
  })

  it('should use the correct getters and setters', function() {
    var bits = new BitArray()
    bits.set(0, 1)
    ase(bits.get(0), 1)
    bits.set(7, 1)
    ase(bits.get(6), 0)
    ase(bits.get(7), 1)
    ade(bits.toJSON(), [1,0,0,0,0,0,0,1])
    ase(bits.length, 8)
  })
})

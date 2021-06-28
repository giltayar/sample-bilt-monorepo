import mocha from 'mocha'
const {describe, it} = mocha
import {expect} from 'chai'

import {randomBetween, range} from '../../src/math-utils.js'

describe('math-utils (unit)', function () {
  describe('range', () => {
    it('should return an empty array if from === to', () => {
      expect(range(4, 4)).to.eql([])
    })
    it('should return an empty array if from > to', () => {
      expect(range(5, 4)).to.eql([])
    })
    it('should return the numbers if from < to', () => {
      expect(range(4, 7)).to.eql([4, 5, 6])
      expect(range(0, 4)).to.eql([0, 1, 2, 3])
    })
    it('should step correctly', () => {
      expect(range(4, 8, 2)).to.eql([4, 6])
      expect(range(0, 13, 3)).to.eql([0, 3, 6, 9, 12])
      expect(range(7, 8, 3)).to.eql([7])
    })
  })

  describe('randomBetween', () => {
    it('should return a number between 3 to 5', () => {
      for (const _ of range(0, 100000)) {
        expect(randomBetween(3, 5)).to.be.gte(3).and.be.lt(5)
      }
    })

    it('should return a number between 0 to 5', () => {
      for (const _ of range(0, 100000)) {
        expect(randomBetween(3, 5)).to.be.gte(0).and.be.lt(10)
      }
    })
  })
})

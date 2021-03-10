import mocha from 'mocha'
const {describe, it} = mocha
import {expect} from 'chai'

import * as m from '../../src/snake.js'

describe('snake (unit)', function () {
  describe('executeTick', () => {
    const initialBoard = m.makeBoard(30, 30)

    it('should locate snake in proper position', async () => {
      expect(m.addInitialSnake(initialBoard, 'east').snake).to.eql([{}])
    })

  })
})

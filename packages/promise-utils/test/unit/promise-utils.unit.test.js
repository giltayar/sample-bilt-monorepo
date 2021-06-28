import mocha from 'mocha'
const {describe, it} = mocha
import {expect} from 'chai'

import * as m from '../../src/promise-utils.js'

describe('promise-utils (unit) ', function () {
  it('should be able to load (you can delete this test once you have others)', async () => {
    expect(m).to.not.be.undefined
  })
})

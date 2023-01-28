import mocha from 'mocha'
import chai from 'chai'

const {describe, it} = mocha
const {expect} = chai

import {sqlRowToObject, sqlRowsToObjects, fieldToProperty} from '../../src/field-mappings.js'

describe('field-mappings (unit)', function () {
  it('should map field name to property name', async () => {
    expect(fieldToProperty('first_name')).to.equal('firstName')
    expect(fieldToProperty('last_name')).to.equal('lastName')
    expect(fieldToProperty('id')).to.equal('id')
  })

  it('should map an SQL row to an object', async () => {
    expect(sqlRowToObject({id: 'a', first_name: 'b', last_name: 'c'})).to.eql({
      id: 'a',
      firstName: 'b',
      lastName: 'c',
    })
  })

  it('should map SQL rows to an object array', async () => {
    expect(
      sqlRowsToObjects([
        {id: 'a', first_name: 'b', last_name: 'c'},
        {id: 'd', first_name: 'e', last_name: 'f'},
      ]),
    ).to.eql([
      {
        id: 'a',
        firstName: 'b',
        lastName: 'c',
      },
      {
        id: 'd',
        firstName: 'e',
        lastName: 'f',
      },
    ])
  })
})

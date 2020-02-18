const _ = require('lodash')
const { describe, it } = require('mocha')
const { get, del, getInstance } = require('../../src/services/shared/cache')
const { fakeRequest, createCustomer, updateCustomer, removeCustomer } = require('./appendix')

describe('Stone client registry route', () => {
  it('The client is successfully registered', (done) => {
    const validRequest = _.cloneDeep(fakeRequest)
    getInstance()
      .then(response => {
        get(validRequest.id)
          .then(response => {
            if (response) {
              del(validRequest.id)
                .then(() => {
                  createCustomer(validRequest, done)
                })
            }
            return createCustomer(validRequest, done)
          })
      })
  })
  it('The client to be registered already exists', (done) => {
    const validRequest = _.cloneDeep(fakeRequest)
    createCustomer(validRequest, done)
  })
  it('The client is successfuly updated', (done) => {
    const validRequest = _.cloneDeep(fakeRequest)
    updateCustomer(validRequest, done)
  })
  it('The client to be updated does not exist', (done) => {
    const validRequest = _.cloneDeep(fakeRequest)
    validRequest.id = '000000'
    updateCustomer(validRequest, done)
  })
  it('The client is successfully removed', (done) => {
    const validRequest = _.cloneDeep(fakeRequest)
    removeCustomer(validRequest, done)
  })
  it('The client to be removed does not exist', (done) => {
    const validRequest = _.cloneDeep(fakeRequest)
    validRequest.id = '00000'
    removeCustomer(validRequest, done)
  })
})

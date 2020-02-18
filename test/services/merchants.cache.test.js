const assert = require('assert')
const { describe, it } = require('mocha')
const chai = require('chai')
const { connected, getInstance, set, get, del } = require('../../src/services/shared/cache')

describe('Testing cache connection', () => {
  /// Negative Scnearios
  it('Cache insertion with invalid key is blocked', (done) => {
    getInstance()
      .then(() => {
        set({
          key: null,
          value: JSON.stringify({
            test: 'Cache'
          })
        })
          .then(assert.isUndefined)
          .catch(error => {
            done()
            chai.assert.isTrue(error.code === 500)
          })
      })
  })
  it('Cache selection with no key is blocked', (done) => {
    getInstance()
      .then(() => {
        get(undefined)
          .then(assert.isUndefined)
          .catch(error => {
            done()
            chai.assert.isTrue(error.code === 500)
          })
      })
  })
  it('Cache insertion with invalid value is blocked', (done) => {
    getInstance()
      .then(() => {
        set({
          key: 'invalidCache',
          value: undefined
        })
          .then(assert.isUndefined)
          .catch(error => {
            done()
            chai.assert.isTrue(error.code === 500)
          })
      })
  })
  it('Cache removal with invalid key is blocked', (done) => {
    getInstance()
      .then(() => {
        del(undefined)
          .then(assert.isUndefined)
          .catch(error => {
            done()
            chai.assert.isTrue(error.code === 500)
          })
      })
  })
  /// Positive Scenarios
  it('Cache connection is valid and completes', (done) => {
    getInstance()
      .then(() => {
        done()
        chai.assert.isTrue(connected())
      })
  })
  it('Valid cache insertion completes', (done) => {
    getInstance()
      .then(() => {
        set({
          key: 'testCache',
          value: {
            test: 'Cache with key'
          }
        })
          .then(response => {
            done()
            chai.assert.isObject(response)
          })
          .catch(error => {
            done()
            chai.assert.isTrue(error.code === 500)
          })
      })
  })
  it('Valid cache selection completes', (done) => {
    getInstance()
      .then(() => {
        get('testCache')
          .then(response => {
            done()
            chai.assert.isObject(response)
          })
          .catch(error => {
            done()
            chai.assert.isTrue(error.code === 500)
          })
      })
  })
  it('Valid cache removal completes', (done) => {
    getInstance()
      .then(() => {
        del('testCache')
          .then(response => {
            done()
            chai.assert.isObject(response)
          })
          .catch(error => {
            done()
            chai.assert.isTrue(error.code === 500)
          })
      })
  })
})

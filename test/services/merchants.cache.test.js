const assert = require('assert')
const { describe, it } = require('mocha')
const chai = require('chai')
const { connected, getInstance, set, get, del } = require('../../src/services/shared/cache')

describe('Teste de conexão do cache', () => {
  /// Negative Scnearios
  it('A conexão com o servidor falha quando inválida', () => {
  })
  it('Quando uma inserção de cache com chave inválida', (done) => {
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
  it('Quando uma seleção de dados sem chave', (done) => {
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
  it('Quando inserção de cache com valor inválido', (done) => {
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
  it('Quando uma exclusão com chave inválida', (done) => {
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
  it('Quando a conexão com o servidor de cache estiver válida', (done) => {
    getInstance()
      .then(() => {
        done()
        chai.assert.isTrue(connected())
      })
  })
  it('Quando uma inserção válida', (done) => {
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
  it('Quando uma seleção de cache válida', (done) => {
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
  it('Quando uma exclusão de cache válida', (done) => {
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

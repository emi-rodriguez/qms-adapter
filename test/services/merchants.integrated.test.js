const _ = require('lodash')
const { describe, it } = require('mocha')
const { get, del, getInstance } = require('../../src/services/shared/cache')
const { fakeRequest, createCustomer, updateCustomer, removeCustomer } = require('./appendix')

describe('Rota de cadastro do cliente Stone', () => {
  it('O cliente é cadastrado com sucesso', (done) => {
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
  it('O cliente a ser cadastrado já existe', (done) => {
    const validRequest = _.cloneDeep(fakeRequest)
    createCustomer(validRequest, done)
  })
  it('O cliente é atualizado com sucesso', (done) => {
    const validRequest = _.cloneDeep(fakeRequest)
    updateCustomer(validRequest, done)
  })
  it('O cliente a ser atualizado não existe', (done) => {
    const validRequest = _.cloneDeep(fakeRequest)
    validRequest.id = '000000'
    updateCustomer(validRequest, done)
  })
  it('O cliente é removido com sucesso', (done) => {
    const validRequest = _.cloneDeep(fakeRequest)
    removeCustomer(validRequest, done)
  })
  it('O cliente a ser removido não existe', (done) => {
    const validRequest = _.cloneDeep(fakeRequest)
    validRequest.id = '00000'
    removeCustomer(validRequest, done)
  })
})

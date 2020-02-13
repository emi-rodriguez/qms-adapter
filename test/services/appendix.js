const app = require('../../src/app')
const chai = require('chai')

const fakeRequest = {
  id: Date.now().toString(),
  stone_code: 12345,
  mcc: 1520,
  name: 'Cliente Stone',
  city: 'City',
  document_number: '1234567890',
  country_code: '55',
  postal_code: '54310000',
  payments_list: [{
    payment_type: 'STONE_ACCOUNT',
    merchant_key: 'string',
    transactions: [{
      transaction_type: 'CREDIT',
      fee: 5678,
      fee_type: 'PERCENTAGE',
      payment_delay: 0
    }]
  }]
}

const createFailure = (request, done) => {
  app
    .service('merchants')
    .create(request, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(response => {
      chai.assert.isUndefined(response)
      done()
    })
    .catch(error => {
      chai.assert.isTrue(error.code === 400, 'Erro esperado: Bad Request')
      done()
    })
}

const createSuccess = (request, done) => {
  app
    .service('merchants')
    .create(request, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(response => {
      chai.assert.isObject(response)
      done()
    })
    .catch(error => {
      chai.assert.isTrue(error.code === 400, 'Erro esperado: Bad Request')
      done()
    })
}

const updateFailure = (request, done) => {
  app
    .service('merchants')
    .update(request.id, request, {
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(response => {
      chai.assert.isUndefined(response)
      done()
    })
    .catch(error => {
      chai.assert.isTrue(error.code === 400, 'Erro esperado: Bad Request')
      done()
    })
}

module.exports = {
  fakeRequest,
  createFailure,
  createSuccess,
  updateFailure
}

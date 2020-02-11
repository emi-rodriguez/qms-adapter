const assert = require('assert')
const mocha = require('mocha')
const _ = require('lodash')
const chai = require('chai')
chai.use(require('chai-json-schema'))

const app = require('../../src/app')
const schema = require('../../src/services/merchants/merchants.schema')

const fakeRequest = {
  id: 'asdf123qwer',
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

const callServiceFailure = (request, done) => {
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

const callServiceSuccess = (request, done) => {
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

mocha.describe('Rota de cadastro do cliente Stone', () => {
  mocha.it('Quando a aplicação for registrada', () => {
    const service = app.service('merchants')

    assert.ok(service, 'Serviço registrado com sucesso')
  })
  mocha.it('[POST] O schema é validado sem alterações', () => {
    const clonedRequest = _.clone(fakeRequest)
    chai.assert
      .isTrue(chai.tv4
        .validate(clonedRequest, schema, true), 'O schema não foi validado')
  })
  mocha.it('[POST] O reques já existe no cache', (done) => {
    const rqExistentRequest = _.cloneDeep(fakeRequest)
    callServiceSuccess(rqExistentRequest, done)
  })
  mocha.it('[POST] O request é inválido quando o payment_type é inválido', (done) => {
    const rqWithInvalidPaymentType = _.cloneDeep(fakeRequest)
    rqWithInvalidPaymentType.payments_list
      .map(payment => {
        payment.payment_type = 'X'
      })
    callServiceFailure(rqWithInvalidPaymentType, done)
  })
  mocha.it('[POST] O request é inválido quando o transaction_type é inválido', (done) => {
    const rqWithInvalidTransactionType = _.cloneDeep(fakeRequest)
    const transactionErrors = _.flatten(rqWithInvalidTransactionType.payments_list
      .map(payment => {
        return payment.transactions
      }))
    transactionErrors
      .map(transaction => {
        transaction.transaction_type = 'X'
      })
    rqWithInvalidTransactionType
      .payments_list
      .map(payment => {
        payment.transactions = transactionErrors
      })
    callServiceFailure(rqWithInvalidTransactionType, done)
  })
  mocha.it('[POST] O request é inválido quando o fee_type é inválido', (done) => {
    const rqWithInvalidFeeType = _.cloneDeep(fakeRequest)
    const feeErrors = _.flatten(rqWithInvalidFeeType.payments_list
      .map(payment => {
        return payment.transactions
      }))
    feeErrors
      .map(transaction => {
        transaction.fee_type = 'X'
      })
    rqWithInvalidFeeType.payments_list.map(payment => { payment.transactions = feeErrors })
    callServiceFailure(rqWithInvalidFeeType, done)
  })
  mocha.it('[POST] O request é inválido quando o header é inválido', (done) => {
    app
      .service('/merchants')
      .create(_.cloneDeep(fakeRequest), {
        headers: {
          'content-type': 'xml'
        }
      })
      .then(response => {
        chai.assert.isUndefined(response)
        done()
      })
      .catch(error => {
        chai.assert.isOk(error.actual === null || error.code === 400, 'Erro esperado: Bad Request')
        done()
      })
  })
  mocha.it('[POST] O request é inválido quando o stone_code é inválido', (done) => {
    const rqWithInvalidStoneCode = _.cloneDeep(fakeRequest)
    rqWithInvalidStoneCode.stone_code = 'x'
    callServiceFailure(rqWithInvalidStoneCode, done)
  })
  mocha.it('[POST] O request é inválido quando o mcc é inválido', (done) => {
    const rqWithInvalidMCC = _.cloneDeep(fakeRequest)
    rqWithInvalidMCC.mcc = 'x'
    callServiceFailure(rqWithInvalidMCC, done)
  })
  mocha.it('[POST] O request é inválido quando o document_number é inválido', (done) => {
    const rqWithInvalidDocumentNumber = _.cloneDeep(fakeRequest)
    rqWithInvalidDocumentNumber.document_number = 'x'
    callServiceFailure(rqWithInvalidDocumentNumber, done)
  })
})

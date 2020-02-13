const assert = require('assert')
const { describe, it } = require('mocha')
const _ = require('lodash')
const chai = require('chai')
chai.use(require('chai-json-schema'))

const app = require('../../src/app')
const schema = require('../../src/services/merchants/merchants.schema')
const { fakeRequest, createFailure, createSuccess, updateFailure } = require('./appendix')

describe('Rota de cadastro do cliente Stone', () => {
  it('Registro da aplicação', () => {
    const service = app.service('merchants')

    assert.ok(service, 'Serviço registrado com sucesso')
  })
  it('Validação do schema', () => {
    const clonedRequest = _.clone(fakeRequest)
    chai.assert
      .isTrue(chai.tv4
        .validate(clonedRequest, schema, true), 'O schema não foi validado')
  })
  describe('Criação de um novo cadastro', () => {
    it('[POST] Criação de um novo request', (done) => {
      const rqExistentRequest = _.cloneDeep(fakeRequest)
      createSuccess(rqExistentRequest, done)
    })
    it('[POST] O request é inválido quando o payment_type é inválido', (done) => {
      const rqWithInvalidPaymentType = _.cloneDeep(fakeRequest)
      rqWithInvalidPaymentType.payments_list
        .map(payment => {
          payment.payment_type = 'X'
        })
      createFailure(rqWithInvalidPaymentType, done)
    })
    it('[POST] O request é inválido quando o transaction_type é inválido', (done) => {
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
      createFailure(rqWithInvalidTransactionType, done)
    })
    it('[POST] O request é inválido quando o fee_type é inválido', (done) => {
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
      createFailure(rqWithInvalidFeeType, done)
    })
    it('[POST] O request é inválido quando o header é inválido', (done) => {
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
    it('[POST] O request é inválido quando o stone_code é inválido', (done) => {
      const rqWithInvalidStoneCode = _.cloneDeep(fakeRequest)
      rqWithInvalidStoneCode.stone_code = 'x'
      createFailure(rqWithInvalidStoneCode, done)
    })
    it('[POST] O request é inválido quando o mcc é inválido', (done) => {
      const rqWithInvalidMCC = _.cloneDeep(fakeRequest)
      rqWithInvalidMCC.mcc = 'x'
      createFailure(rqWithInvalidMCC, done)
    })
    it('[POST] O request é inválido quando o document_number é inválido', (done) => {
      const rqWithInvalidDocumentNumber = _.cloneDeep(fakeRequest)
      rqWithInvalidDocumentNumber.document_number = 'x'
      createFailure(rqWithInvalidDocumentNumber, done)
    })
  })
  describe('Atualização de um cadastro já existente', () => {
    it('[PUT] O request é inválido quando o payment_type é inválido', (done) => {
      const rqWithInvalidPaymentType = _.cloneDeep(fakeRequest)
      rqWithInvalidPaymentType.payments_list
        .map(payment => {
          payment.payment_type = 'X'
        })
      updateFailure(rqWithInvalidPaymentType, done)
    })
    it('[PUT] O request é inválido quando o transaction_type é inválido', (done) => {
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
      updateFailure(rqWithInvalidTransactionType, done)
    })
    it('[PUT] O request é inválido quando o fee_type é inválido', (done) => {
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
      updateFailure(rqWithInvalidFeeType, done)
    })
    it('[PUT] O request é inválido quando o header é inválido', (done) => {
      const rqWithInvalidHeader = _.cloneDeep(fakeRequest)
      app
        .service('/merchants')
        .update(rqWithInvalidHeader.id, rqWithInvalidHeader, {
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
    it('[PUT] O request é inválido quando o stone_code é inválido', (done) => {
      const rqWithInvalidStoneCode = _.cloneDeep(fakeRequest)
      rqWithInvalidStoneCode.stone_code = 'x'
      updateFailure(rqWithInvalidStoneCode, done)
    })
    it('[PUT] O request é inválido quando o mcc é inválido', (done) => {
      const rqWithInvalidMCC = _.cloneDeep(fakeRequest)
      rqWithInvalidMCC.mcc = 'x'
      updateFailure(rqWithInvalidMCC, done)
    })
    it('[PUT] O request é inválido quando o document_number é inválido', (done) => {
      const rqWithInvalidDocumentNumber = _.cloneDeep(fakeRequest)
      rqWithInvalidDocumentNumber.document_number = 'x'
      updateFailure(rqWithInvalidDocumentNumber, done)
    })
  })
  describe('Remoção de um cadastro do cache', () => {
  })
})

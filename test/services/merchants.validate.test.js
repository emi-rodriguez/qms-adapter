const assert = require('assert')
const { describe, it } = require('mocha')
const _ = require('lodash')
const chai = require('chai')
chai.use(require('chai-json-schema'))

const app = require('../../src/app')
const schema = require('../../src/services/merchants/merchants.schema')
const { fakeRequest, createFailure } = require('./appendix')

describe('Validação dos dados das requisições', () => {
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
  it('O request é inválido quando o payment_type é inválido', (done) => {
    const rqWithInvalidPaymentType = _.cloneDeep(fakeRequest)
    rqWithInvalidPaymentType.payments_list
      .map(payment => {
        payment.payment_type = 'X'
      })
    createFailure(rqWithInvalidPaymentType, done)
  })
  it('O request é inválido quando o transaction_type é inválido', (done) => {
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
  it('O request é inválido quando o fee_type é inválido', (done) => {
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
  it('O request é inválido quando o header é inválido', (done) => {
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
  it('O request é inválido quando o stone_code é inválido', (done) => {
    const rqWithInvalidStoneCode = _.cloneDeep(fakeRequest)
    rqWithInvalidStoneCode.stone_code = 'x'
    createFailure(rqWithInvalidStoneCode, done)
  })
  it('O request é inválido quando o mcc é inválido', (done) => {
    const rqWithInvalidMCC = _.cloneDeep(fakeRequest)
    rqWithInvalidMCC.mcc = 'x'
    createFailure(rqWithInvalidMCC, done)
  })
  it('O request é inválido quando o document_number é inválido', (done) => {
    const rqWithInvalidDocumentNumber = _.cloneDeep(fakeRequest)
    rqWithInvalidDocumentNumber.document_number = 'x'
    createFailure(rqWithInvalidDocumentNumber, done)
  })
})

const assert = require('assert')
const { describe, it } = require('mocha')
const _ = require('lodash')
const chai = require('chai')
chai.use(require('chai-json-schema'))

const app = require('../../src/app')
const schema = require('../../src/services/merchants/merchants.schema')
const { fakeRequest, createFailure } = require('./appendix')

describe('Validation of requisition data', () => {
  it('Application registration', () => {
    const service = app.service('merchants')

    assert.ok(service, 'Service successfully registered')
  })
  it('Schema validation', () => {
    const clonedRequest = _.clone(fakeRequest)
    chai.assert
      .isTrue(chai.tv4
        .validate(clonedRequest, schema, true), 'Schema is invalid')
  })
  it('The request is invalid when payment_type is invalid', (done) => {
    const rqWithInvalidPaymentType = _.cloneDeep(fakeRequest)
    rqWithInvalidPaymentType.payments_list
      .map(payment => {
        payment.payment_type = 'X'
      })
    createFailure(rqWithInvalidPaymentType, done)
  })
  it('Request is invalid when transaction_type is invalid', (done) => {
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
  it('Request is invalid when fee_type is invalid', (done) => {
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
  it('Request is invalid when the content-type is invalid', (done) => {
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
  it('The request is invalid when stone_code is invalid', (done) => {
    const rqWithInvalidStoneCode = _.cloneDeep(fakeRequest)
    rqWithInvalidStoneCode.stone_code = 'x'
    createFailure(rqWithInvalidStoneCode, done)
  })
  it('The request is invalid when mcc is invalid', (done) => {
    const rqWithInvalidMCC = _.cloneDeep(fakeRequest)
    rqWithInvalidMCC.mcc = 'x'
    createFailure(rqWithInvalidMCC, done)
  })
  it('The request is invalid when document_number is invalid', (done) => {
    const rqWithInvalidDocumentNumber = _.cloneDeep(fakeRequest)
    rqWithInvalidDocumentNumber.document_number = 'x'
    createFailure(rqWithInvalidDocumentNumber, done)
  })
})

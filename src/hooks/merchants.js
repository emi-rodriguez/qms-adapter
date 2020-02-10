const errors = require('@feathersjs/errors')
const Ajv = require('ajv')
const _ = require('lodash')
const merchantSchema = require('../services/qms-adapter/merchants/merchants.schema')
const validateSchema = new Ajv().compile(merchantSchema)
const config = require('../../config/merchant')

const checkRequestHeaders = (headers) => {
  return headers['content-type'] === 'application/json'
}

const checkFields = (fields) => {
  return fields.stone_code > 0 && Number(fields.document_number) > 0
}

const checkMCC = (data) => {
  return Object.values(config.mccTypes).includes(data.mcc)
}

const checkPaymentList = (paymentList) => {
  return paymentList.every((payment) => {
    return Object.values(config.paymentModes).includes(payment.payment_type)
  })
}

const checkTransactionTypes = (transactionList) => {
  return transactionList.every((transaction) => {
    return Object.values(config.transactionTypes).includes(transaction.transaction_type)
  })
}

const checkFeeTypes = (feeList) => {
  return feeList.every((fee) => {
    return Object.values(config.feeTypes).includes(fee.fee_type)
  })
}

const validate = (ctx) => {
  const valid = checkRequestHeaders(ctx.params.headers) &&
  validateSchema(ctx.data) &&
  checkFields(ctx.data) &&
  checkMCC(ctx.data) &&
  checkPaymentList(ctx.data.payments_list) &&
  checkTransactionTypes(_.flatten(ctx.data.payments_list.map(payment => { return payment.transactions }))) &&
  checkFeeTypes(_.flatten(ctx.data.payments_list.map(payment => { return payment.transactions })))

  if (!valid) {
    const error = new errors.BadRequest()
    error.message = 'Request inválido'
    throw error
  }
}

module.exports = {
  validate
}

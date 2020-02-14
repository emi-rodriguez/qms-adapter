const { BadRequest } = require('@feathersjs/errors')
const Ajv = require('ajv')
const _ = require('lodash')
const moment = require('moment')
const merchantSchema = require('../services/merchants/merchants.schema')
const validSchema = new Ajv().compile(merchantSchema)
const config = require('../../config/merchant')

const validateSchema = (data) => {
  return new Promise((resolve, reject) => {
    return validSchema(data)
      ? resolve(data)
      : reject(new Error('json schema'))
  })
}

const checkRequestHeaders = (headers) => {
  return new Promise((resolve, reject) => {
    const isValid = headers['content-type'] === 'application/json'
    return (isValid)
      ? resolve(headers)
      : reject(new Error('content-type'))
  })
}

const checkStoneCode = (data) => {
  return new Promise((resolve, reject) => {
    const isValid = data.stone_code > 0
    return (isValid)
      ? resolve(data)
      : reject(new Error('stone code'))
  })
}

const checkDocumentNumber = (data) => {
  return new Promise((resolve, reject) => {
    const isValid = Number(data.document_number) > 0
    return (isValid)
      ? resolve(data)
      : reject(new Error('document number'))
  })
}

const checkMCC = (data) => {
  return new Promise((resolve, reject) => {
    const isValid = Object.values(config.mccTypes).includes(data.mcc)
    return (isValid)
      ? resolve(data)
      : reject(new Error('mcc'))
  })
}

const checkPaymentType = (paymentList) => {
  return new Promise((resolve, reject) => {
    const isValid = paymentList.every((payment) => {
      return Object.values(config.paymentModes).includes(payment.payment_type)
    })
    return (isValid)
      ? resolve(paymentList)
      : reject(new Error('payment_type'))
  })
}

const checkTransactionTypes = (data) => {
  const transactionList = _.flatten(data.payments_list.map(payment => { return payment.transactions }))
  return new Promise((resolve, reject) => {
    const isValid = transactionList.every((transaction) => {
      return Object.values(config.transactionTypes).includes(transaction.transaction_type)
    })
    return (isValid)
      ? resolve(data)
      : reject(new Error('transaction_type'))
  })
}

const checkFeeTypes = (data) => {
  const feeList = _.flatten(data.payments_list.map(payment => { return payment.transactions }))
  return new Promise((resolve, reject) => {
    const isValid = feeList.every((fee) => {
      return Object.values(config.feeTypes).includes(fee.fee_type)
    })
    return (isValid)
      ? resolve(data)
      : reject(new Error('fee_type'))
  })
}

const validate = (ctx) => {
  return checkRequestHeaders(ctx.params.headers)
    .then(() => validateSchema(ctx.data))
    .then(() => checkStoneCode(ctx.data))
    .then(() => checkDocumentNumber(ctx.data))
    .then(() => checkMCC(ctx.data))
    .then(() => checkPaymentType(ctx.data.payments_list))
    .then(() => checkTransactionTypes(ctx.data))
    .then(() => checkFeeTypes(ctx.data))
    .then(() => {
      return ctx
    })
    .catch(error => {
      const featherErrors = new BadRequest()
      featherErrors.message = error.message
      featherErrors.className = 'merchants.hooks.core'
      throw featherErrors
    })
}

const addEnvelope = (ctx) => {
  ctx.data = {
    envelope: {
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss.SSS Z'),
      credentials: {
        username: ctx.params.headers.username
      },
      merchant: ctx.data
    }
  }
  return ctx
}

module.exports = {
  validate,
  addEnvelope
}

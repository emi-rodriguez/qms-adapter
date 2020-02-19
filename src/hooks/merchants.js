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
      : reject(new Error('Invalid request. All fields must be compliant with json schema'))
  })
}

const checkRequestHeaders = (headers) => {
  return new Promise((resolve, reject) => {
    const isValid = headers['content-type'] === 'application/json'
    return (isValid)
      ? resolve(headers)
      : reject(new Error('Invalid content-type. Request must be application/json'))
  })
}

const checkStoneCode = (stoneCode) => {
  return new Promise((resolve, reject) => {
    const isValid = stoneCode > 0
    return (isValid)
      ? resolve(stoneCode)
      : reject(new Error('Invalid stone code'))
  })
}

const checkDocumentNumber = (documentNumber) => {
  return new Promise((resolve, reject) => {
    const isValid = Number(documentNumber) > 0
    return (isValid)
      ? resolve(documentNumber)
      : reject(new Error('Invalid document number'))
  })
}

const checkMCC = (mcc) => {
  return new Promise((resolve, reject) => {
    const isValid = Object.values(config.mccTypes).includes(mcc)
    return (isValid)
      ? resolve(mcc)
      : reject(new Error('Invalid mcc'))
  })
}

const checkPaymentType = (paymentList) => {
  return new Promise((resolve, reject) => {
    const isValid = [].concat(paymentList).every((payment) => {
      return Object.values(config.paymentModes).includes(payment.payment_type)
    })
    return (isValid)
      ? resolve(paymentList)
      : reject(new Error('Invalid payment_type'))
  })
}

const checkTransactionTypes = (data) => {
  const transactionList = _.flatten(data.payments_list.map(payment => { return payment.transactions }))
  return new Promise((resolve, reject) => {
    const isValid = [].concat(transactionList).every((transaction) => {
      return Object.values(config.transactionTypes).includes(transaction.transaction_type)
    })
    return (isValid)
      ? resolve(data)
      : reject(new Error('Invalid transaction_type'))
  })
}

const checkFeeTypes = (data) => {
  const feeList = _.flatten(data.payments_list.map(payment => { return payment.transactions }))
  return new Promise((resolve, reject) => {
    const isValid = [].concat(feeList).every((fee) => {
      return Object.values(config.feeTypes).includes(fee.fee_type)
    })
    return (isValid)
      ? resolve(data)
      : reject(new Error('Invalid fee_type'))
  })
}

const validate = (ctx) => {
  const {
    payments_list,
    mcc,
    stone_code,
    document_number
  } = ctx.data

  return checkRequestHeaders(ctx.params.headers)
    .then(() => validateSchema(ctx.data))
    .then(() => checkStoneCode(stone_code))
    .then(() => checkDocumentNumber(document_number))
    .then(() => checkMCC(mcc))
    .then(() => checkPaymentType(payments_list))
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
      timestamp: moment().format('YYYYMMDD HH:mm:ss.SSSZ'),
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

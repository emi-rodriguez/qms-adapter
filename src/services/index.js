const qmsAdapterMerchants = require('./merchants/merchants.service.js')

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(qmsAdapterMerchants)
}

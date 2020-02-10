// Initializes the `qms-adapter/merchants` service on path `/qms-adapter/merchants`
const merchants = require('./merchants.core')
const hooks = require('./merchants.hooks')

module.exports = function (app) {
  // Initialize our service with any options it requires
  app.use('/qms-adapter/merchants', merchants(app))

  // Get our initialized service so that we can register hooks
  const service = app.service('qms-adapter/merchants')

  service.hooks(hooks)
}

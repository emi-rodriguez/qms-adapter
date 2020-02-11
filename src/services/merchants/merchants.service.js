const merchants = require('./merchants.core')
const hooks = require('./merchants.hooks')

module.exports = (app) => {
  // Initialize our service with any options it requires
  app.use('/merchants', merchants(app))

  // Get our initialized service so that we can register hooks
  const service = app.service('/merchants')

  service.hooks(hooks)
}

const errors = require('@feathersjs/errors')
const { get, set, del } = require('../shared/cache')

module.exports = (app) => {
  return {
    async create (params) {
      return get(app)(params.envelope.merchant.id)
        .then(response => {
          if (!response) {
            return set(app)({
              key: params.envelope.merchant.id,
              value: params
            })
          }
          const error = new errors.BadRequest('Data already exists')
          error.className = 'merchants.core'
          throw error
        })
    },
    async remove (id) {
      return get(app)(id)
        .then(response => {
          if (response) {
            return del(app)(id)
          }
          const error = new errors.NotFound('The required registry was not found')
          error.className = 'merchants.core'
          throw error
        })
    },
    async update (id, params) {
      return get(app)(id)
        .then(response => {
          if (response) {
            return set(app)({
              key: id,
              value: params
            })
          }
          const error = new errors.NotFound('The register does not exist')
          error.className = 'merchants.core'
          throw error
        })
    }
  }
}

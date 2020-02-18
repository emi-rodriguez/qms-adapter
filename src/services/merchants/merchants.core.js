const errors = require('@feathersjs/errors')
const cache = require('../shared/cache')

module.exports = (app) => {
  return {
    async create (params) {
      return cache
        .get(params.envelope.merchant.id)
        .then(response => {
          if (!response) {
            return cache.set({
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
      return cache
        .get(id)
        .then(response => {
          if (response) {
            return cache.del(id)
          }
          const error = new errors.NotFound('Registro não existe')
          error.className = 'merchants.core'
          throw error
        })
    },
    async update (id, params) {
      return cache
        .get(id)
        .then(response => {
          if (response) {
            return cache.set({
              key: id,
              value: params
            })
          }
          const error = new errors.NotFound('Registro não existe')
          error.className = 'merchants.core'
          throw error
        })
    }
  }
}

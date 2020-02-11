const errors = require('@feathersjs/errors')
const cache = require('../shared/cache')
const cacheFake = []

module.exports = (app) => {
  return {
    async find (params) {
      return cacheFake
    },
    async create (params) {
      return cache
        .get(params.id)
        .then(response => {
          if (!response) {
            cache.set({
              key: params.id,
              value: params
            })
            return {
              message: 'Registro criado com sucesso',
              code: 201,
              data: params
            }
          } else {
            const error = new errors.BadRequest('Registro já existe')
            error.className = 'merchants.core'
            throw error
          }
        })
    },
    async get (id, params) {
      cache.get(id)
    },
    async remove (id, params) {
      return cache
        .get(id)
        .then(response => {
          if (response) {
            cache.set({
              key: id,
              value: response,
              expires: app.get('gcp').cache.options.expires
            })
            return {
              message: 'Registro agendado para remoção'
            }
          } else {
            const error = new errors.NotFound('Registro não existe')
            error.className = 'merchants.core'
            throw error
          }
        })
    },
    async update (id, params) {
      return cache
        .get(id)
        .then(response => {
          if (!response) {
            const error = new errors.NotFound('Registro não existe')
            error.className = 'merchants.core'
            throw error
          } else {
            cache.set({
              key: id,
              value: params
            })
            return {
              message: 'Registro atualizado com sucesso',
              data: params
            }
          }
        })
    }
  }
}

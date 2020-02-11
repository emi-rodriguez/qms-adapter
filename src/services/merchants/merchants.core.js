const errors = require('@feathersjs/errors')
const cache = require('../shared/cache')

module.exports = (app) => {
  return {
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
    async remove (id, params) {
      return cache
        .get(id)
        .then(response => {
          if (response) {
            cache.del(id)
            return {
              message: 'Registro removido com sucesso'
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

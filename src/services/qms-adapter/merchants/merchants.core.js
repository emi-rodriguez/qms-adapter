const errors = require('@feathersjs/errors')
const cache = require('../../shared/cache/')
let cacheFake = []

module.exports = () => {
  return {
    async find (params) {
      return cacheFake
    },
    async create (params) {
      return cache
        .get(params.id)
        .then(exists => {
          if (exists) {
            return {
              msg: 'Este registro já existe'
            }
          } else {
            cache.set(params.id, params)
          }
          return {
            msg: 'Registro criado com sucesso'
          }
        })
    },
    async get (id, params) {
      const exists = cache.get(id)
      if (!exists) {
        const error = new errors.NotFound('Registro não encontrado')
        error.className = 'Merchants.core'
        throw error
      } else {
        return exists
      }
    },
    async remove (id, params) {
      const exists = cacheFake.find(merchant => merchant.id === id)
      if (!exists) {
        return {
          msg: 'Este registro não existe'
        }
      } else {
        cacheFake = cacheFake.filter(merchant => merchant.id !== id)
        return cacheFake && {
          msg: 'Registro excluído com sucesso'
        }
      }
    },
    async update (id, params) {
      const exists = cacheFake.find(merchant => merchant.id === params.id)
      if (!exists) {
        return {
          msg: 'Este registro não existe'
        }
      } else {
        cacheFake
          .filter(merchant => merchant.id === params.id)
          .map(mp => {
            mp.merchant.stone_code = params.stone_code
            mp.merchant.mcc = params.mcc
            mp.merchant.name = params.name
            mp.merchant.city = params.city
            mp.merchant.document_number = params.document_number
            mp.merchant.country_code = params.country_code
            mp.merchant.postal_code = params.postal_code
            mp.merchant.payment_list = params.payment_list
          })
        return params && {
          msg: 'Registro modificado com sucesso'
        }
      }
    }
  }
}

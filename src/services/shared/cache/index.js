const redis = require('redis')
const { BadGateway, GeneralError } = require('@feathersjs/errors')
let client

const connected = () => client && client.connected

const getInstance = (ctx) => {
  return new Promise((resolve, reject) => {
    if (connected()) {
      return resolve(ctx)
    }
    client = redis
      .createClient(process.env.CACHE_PORT, process.env.CACHE_HOST)

    client.on('connect', () => {
      resolve(ctx)
    })

    client.on('error', (error) => {
      reject(new BadGateway('An error occured when trying to connect to Redis', error))
    })
  })
}

/**
 * Function to insert or update cache based
 * @param {key} key key for insert on cache
 * @param {value} value value for insert on cache
 */

const set = (data) => {
  const {
    key,
    value
  } = data
  return new Promise((resolve, reject) => {
    client.set(key, JSON.stringify(value), (error, response) => {
      if (error) {
        return reject(new GeneralError(error))
      }
      return resolve({
        code: response,
        message: 'Registro atualizado com sucesso'
      })
    })
  })
}

const get = (key) => {
  return new Promise((resolve, reject) => {
    client.get(key, (error, response) => {
      if (error) {
        return reject(new GeneralError(error))
      }
      return resolve(JSON.parse(response))
    })
  })
}

const del = (key) => {
  return new Promise((resolve, reject) => {
    client.del(key, (error, response) => {
      if (error) {
        return reject(new GeneralError(error))
      }
      return resolve({
        code: response,
        message: 'Registro removido com sucesso'
      })
    })
  })
}

module.exports = {
  getInstance,
  connected,
  set,
  get,
  del
}

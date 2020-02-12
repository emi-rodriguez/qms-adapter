const redis = require('redis')
const { BadGateway } = require('@feathersjs/errors')
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

const set = (data) => {
  const {
    key,
    value
  } = data
  return new Promise((resolve, reject) => {
    client.set(key, JSON.stringify(value), (error, response) => {
      if (error) {
        return reject(error)
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
        return reject(error)
      }
      return resolve(JSON.parse(response))
    })
  })
}

const del = (key) => {
  return new Promise((resolve, reject) => {
    client.del(key, (error, response) => {
      if (error) {
        return reject(error)
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

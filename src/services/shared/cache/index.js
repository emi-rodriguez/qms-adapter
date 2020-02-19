const redis = require('redis')
const { BadGateway, GeneralError } = require('@feathersjs/errors')

const checkCacheConnection = (ctx) => {
  if (!(ctx.app.get('redisConnection') && ctx.app.get('redisConnection').connected)) {
    const error = new BadGateway('Cache connection failed')
    error.className = 'shared/cache'
    throw error
  }
  return ctx
}

const createInstance = (app) => {
  const client = redis
    .createClient(
      process.env.CACHE_PORT,
      process.env.CACHE_HOST)
  client.on('connect', () => {
    app.set('redisConnection', client)
    console.log('cache connected')
  })
  client.on('error', (error) => {
    console.log(`cache connection error: ${error}`)
  })
}

/**
 * Function to insert or update cache based
 * @param {key} key key for insert on cache
 * @param {value} value value for insert on cache
 */

const set = (app) => (data) => {
  const {
    key,
    value
  } = data
  return new Promise((resolve, reject) => {
    app.get('redisConnection').set(key, JSON.stringify(value), (error, response) => {
      if (error) {
        return reject(new GeneralError(error))
      }
      return resolve({
        code: response,
        message: 'Registry successfully updated'
      })
    })
  })
}

const get = (app) => (key) => {
  return new Promise((resolve, reject) => {
    app.get('redisConnection').get(key, (error, response) => {
      if (error) {
        return reject(new GeneralError(error))
      }
      return resolve(JSON.parse(response))
    })
  })
}

const del = (app) => (key) => {
  return new Promise((resolve, reject) => {
    app.get('redisConnection').del(key, (error, response) => {
      if (error) {
        return reject(new GeneralError(error))
      }
      return resolve({
        code: response,
        message: 'Unregistered successfully'
      })
    })
  })
}

module.exports = {
  createInstance,
  checkCacheConnection,
  set,
  get,
  del
}

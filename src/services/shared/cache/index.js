const redis = require('redis')
let client

const createInstance = (ctx) => {
  const option = {}
  client = redis.createClient(ctx.app.get('gcp').cache.port, ctx.app.get('gcp').cache.url, option)

  client.on('connect', () => {
    console.log('Cache connected')
  })
}

const set = (key, value) => {
  client.set(key, JSON.stringify(value))
}

const get = (key) => {
  return new Promise((resolve, reject) => {
    client.get(key, (error, response) => {
      if (error) {
        reject(error)
      }
      return resolve(JSON.parse(response))
    })
  })
}

module.exports = {
  createInstance,
  set,
  get
}

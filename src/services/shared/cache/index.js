const redis = require('redis')
let client

const connected = () => client && client.connected

const getInstance = (ctx) => {
  if (connected()) {
    return
  }
  client = redis
    .createClient(ctx.app.get('gcp').cache.options)

  client.on('connect', () => {
    console.log('Cache connected')
  })

  client.on('error', () => {
    console.log('Cache connection error')
  })
}

const set = (data) => {
  const {
    key,
    value,
    expires = undefined
  } = data

  if (expires) {
    client.setex(key, expires, JSON.stringify(value))
  } else {
    client.set(key, JSON.stringify(value))
  }
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

module.exports = {
  getInstance,
  connected,
  set,
  get
}

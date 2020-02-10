const { validate } = require('../../../hooks/merchants')
const { createInstance } = require('../../shared/cache/index')

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [createInstance, validate],
    update: [validate],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}

const { validate } = require('../../hooks/merchants')
const { getInstance } = require('../shared/cache/index')

module.exports = {
  before: {
    all: [getInstance],
    find: [],
    get: [],
    create: [validate],
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

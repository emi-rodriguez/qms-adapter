const { validate, addEnvelope } = require('../../hooks/merchants')
const { getInstance } = require('../shared/cache/index')

module.exports = {
  before: {
    all: [getInstance],
    find: [],
    get: [],
    create: [validate, addEnvelope],
    update: [validate, addEnvelope],
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

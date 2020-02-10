module.exports = {
  definitions: {},
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'http://example.com/root.json',
  type: 'object',
  title: 'The Root Schema',
  required: [
    'id',
    'stone_code',
    'mcc',
    'name',
    'city',
    'document_number',
    'country_code',
    'postal_code',
    'payments_list'
  ],
  properties: {
    id: {
      $id: '#/properties/id',
      type: 'string',
      title: 'The Id Schema',
      default: '',
      examples: [
        'asdf123qwer'
      ],
      pattern: '^(.*)$'
    },
    stone_code: {
      $id: '#/properties/stone_code',
      type: 'integer',
      title: 'The Stone_code Schema',
      default: 0,
      examples: [
        12345
      ]
    },
    mcc: {
      $id: '#/properties/mcc',
      type: 'integer',
      title: 'The Mcc Schema',
      default: 0,
      examples: [
        313
      ]
    },
    name: {
      $id: '#/properties/name',
      type: 'string',
      title: 'The Name Schema',
      default: '',
      examples: [
        'Cliente Stone'
      ],
      pattern: '^(.*)$'
    },
    city: {
      $id: '#/properties/city',
      type: 'string',
      title: 'The City Schema',
      default: '',
      examples: [
        'City'
      ],
      pattern: '^(.*)$'
    },
    document_number: {
      $id: '#/properties/document_number',
      type: 'string',
      title: 'The Document_number Schema',
      default: '',
      examples: [
        '123456789000101'
      ],
      pattern: '^(.*)$'
    },
    country_code: {
      $id: '#/properties/country_code',
      type: 'string',
      title: 'The Country_code Schema',
      default: '',
      examples: [
        '55'
      ],
      pattern: '^(.*)$'
    },
    postal_code: {
      $id: '#/properties/postal_code',
      type: 'string',
      title: 'The Postal_code Schema',
      default: '',
      examples: [
        '54310000'
      ],
      pattern: '^(.*)$'
    },
    payments_list: {
      $id: '#/properties/payments_list',
      type: 'array',
      title: 'The Payments_list Schema',
      items: {
        $id: '#/properties/payments_list/items',
        type: 'object',
        title: 'The Items Schema',
        required: [
          'payment_type',
          'merchant_key',
          'transactions'
        ],
        properties: {
          payment_type: {
            $id: '#/properties/payments_list/items/properties/payment_type',
            type: 'string',
            title: 'The Payment_type Schema',
            default: '',
            examples: [
              'STONE_ACCOUNT'
            ],
            pattern: '^[A-Z_]*$'
          },
          merchant_key: {
            $id: '#/properties/payments_list/items/properties/merchant_key',
            type: 'string',
            title: 'The Merchant_key Schema',
            default: '',
            examples: [
              'string'
            ],
            pattern: '^(.*)$'
          },
          transactions: {
            $id: '#/properties/payments_list/items/properties/transactions',
            type: 'array',
            title: 'The Transactions Schema',
            items: {
              $id: '#/properties/payments_list/items/properties/transactions/items',
              type: 'object',
              title: 'The Items Schema',
              required: [
                'transaction_type',
                'fee',
                'fee_type',
                'payment_delay'
              ],
              properties: {
                transaction_type: {
                  $id: '#/properties/payments_list/items/properties/transactions/items/properties/transaction_type',
                  type: 'string',
                  title: 'The Transaction_type Schema',
                  default: '',
                  examples: [
                    'DEBIT'
                  ],
                  pattern: '^[A-Z_]*$'
                },
                fee: {
                  $id: '#/properties/payments_list/items/properties/transactions/items/properties/fee',
                  type: 'integer',
                  title: 'The Fee Schema',
                  default: 0,
                  examples: [
                    5678
                  ]
                },
                fee_type: {
                  $id: '#/properties/payments_list/items/properties/transactions/items/properties/fee_type',
                  type: 'string',
                  title: 'The Fee_type Schema',
                  default: '',
                  examples: [
                    'PERCENTAGE'
                  ],
                  pattern: '^[A-Z]*$'
                },
                payment_delay: {
                  $id: '#/properties/payments_list/items/properties/transactions/items/properties/payment_delay',
                  type: 'integer',
                  title: 'The Payment_delay Schema',
                  default: 0,
                  examples: [
                    0
                  ]
                }
              }
            }
          }
        }
      }
    }
  }
}

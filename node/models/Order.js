const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderSchema = new Schema({
  number: Number, // automatic
  paymentMethod: {
    type: String,
    enum: [
      'card',
      'abitab',
      'redpagos',
      'free'
    ],
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  // paymentMethod: String,
  status: {
    type: String,
    enum: [
      'impaga', // The order has been created but not yet paid
      'procesando pago', // The card returned a in_process
      'a confirmar', // The order has been received but not yet acknoledged
      'confirmada', // The seller has acknolage it and is processing the order
      'pausada',
      'enviada',
      'lista para retirar',
      'completada', // The order is completed
      'reembolsada',
      'cancelada' // the order is not payed and cancelled
    ],
    required: true
  },
  billed: {
    type: Number,
    required: true
  },
  discount: {
    coupon: {
      type: Schema.Types.ObjectId,
      ref: 'Coupon'
    },
    code: String,
    description: String
  },
  personal: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    idType: String,
    idNumber: String
  },
  shipping: {
    state: {
      type: String,
      required: true
    },
    neighborhood: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    tracking: String
  },
  items: [
    {
      originalProduct: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      handle: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      variant: String,
      unitPrice: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ]
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

orderSchema.methods.prettyCreated = function (time) {
  return this.created.toLocaleDateString('es-US', { month: 'short', day: 'numeric', year: 'numeric', hour: time && 'numeric', minute: time && 'numeric' })
}

orderSchema.pre('save', async function (next) {
  // Only increments when the document is new
  if (this.isNew) {
    const count = await this.constructor.countDocuments()
    this.number = count // Increment count
    next()
  } else {
    next()
  }
})

module.exports = mongoose.model('Order', orderSchema)

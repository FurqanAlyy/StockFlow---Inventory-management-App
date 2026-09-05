import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },

    description: {
      type: String,
      default: ''
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },

    minimumStock: {
      type: Number,
      required: true,
      min: 0,
      default: 5
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    supplier: {
      type: String,
      required: true,
      trim: true
    },

    image: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
)

const Product =
  mongoose.models.Product ||
  mongoose.model('Product', productSchema)

export default Product
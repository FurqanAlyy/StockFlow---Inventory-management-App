import mongoose from 'mongoose'

const inventoryMovementSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },

    type: {
      type: String,
      enum: ['in', 'out'],
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    previousStock: {
      type: Number,
      required: true,
      min: 0
    },

    newStock: {
      type: Number,
      required: true,
      min: 0
    },

    note: {
      type: String,
      default: '',
      trim: true
    }
  },
  {
    timestamps: true
  }
)

const InventoryMovement =
  mongoose.models.InventoryMovement ||
  mongoose.model('InventoryMovement', inventoryMovementSchema)

export default InventoryMovement
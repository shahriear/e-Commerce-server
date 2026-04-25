const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    slug:{
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    mainImg: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['active', 'pending', 'reject'],
    },
    varients: [
      {
        name: {
          type: String,
          enum: ['color', 'size'],
          lowercase: true,
        },
        options: [
          {
            colorname: {
              type: String,
            },

            size: {
              type: String,
            },
            additionalPrice: {
              type: Number,
              default: 0,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model('Product', productSchema);

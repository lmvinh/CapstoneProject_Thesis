const mongoose = require("mongoose");

const tempSensor = mongoose.Schema(
  {
    

    value: {
      type: Number,
      required: true,
      default: 0,
    },

    date: {
      type: Date,
      required: true,
      default: 0,
    }

  },
  {
    timestamps: true,
  }
);


const Product = mongoose.model("temps", tempSensor);

module.exports = Product;
const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: String,
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
});

const productSchema = new Schema({
    name: String,
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    price: Number,
    description: String,
  });

module.exports = {
  Category: mongoose.model("Category", categorySchema),
  Product: mongoose.model("Product", productSchema)
};
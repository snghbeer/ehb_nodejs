const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: String,
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }], //one to many, 1 category has many products
});

const productSchema = new Schema({
    name: String,
    category: { type: Schema.Types.ObjectId, ref: 'Category' }, //one to one, each product has only 1 category
    price: Number,
    description: String,
  });

module.exports = {
  Category: mongoose.model("Category", categorySchema),
  Product: mongoose.model("Product", productSchema)
};
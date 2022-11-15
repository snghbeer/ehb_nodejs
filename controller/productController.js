const mongoose = require('mongoose');
const dbURI = process.env.dbURI;

const {Category, Product}  =  require('../models/product');


async function addNewCategory(data){
    await mongoose.connect(dbURI, {ssl:true})
    .then(async() =>{
        console.log("Adding new category...")
        const aCategory = new Category({
            name: data.name
        })
        await aCategory.save().then(() => mongoose.connection.close());
    })
}

async function addNewProduct(data){
    await mongoose.connect(dbURI, {ssl:true})
    .then(async() =>{
        console.log("Adding new product...")
        const aCat = await Category.findOne({name: data.category}).exec()
        const aProduct = new Product({
            name: data.name,
            price: data.price,
            description: data.description,
            category: aCat.id
        })
        await aProduct.save().then(async () => {
            aCat.products.push(aProduct);
            await aCat.save();
            mongoose.connection.close()
        });
    })
}

async function getCategories(){
    var cats;
    await mongoose.connect(dbURI, {ssl:true})
    .then(async() =>{
        console.log("Fetching all categories...")
        cats = await Category.find().exec()
        mongoose.connection.close()
    })
    return cats;
}

async function getProducts(category){
    var prods;
    await mongoose.connect(dbURI, {ssl:true})
    .then(async() =>{
        console.log("Fetching products for category: "+ category)
        prods = await (await Category.findOne({name: category}).exec()).populate("products")
        //console.log(prods.products)
        mongoose.connection.close()
    })
    return prods.products;
}

module.exports = { 
    addNewCategory: addNewCategory,
    addNewProduct: addNewProduct,
    getProducts: getProducts,
    getCategories: getCategories,
 }


const mongoose = require('mongoose');
const dbURI = process.env.dbURI;

const {Category, Product}  =  require('../models/product');

//CATEGORY

async function addNewCategory(catName, dontClose){
    var aCategory;
    await mongoose.connect(dbURI, {ssl:true})
    .then(async() =>{
        console.log("Adding new category...")
        aCategory = new Category({
            name: catName
        })
        if(!dontClose){
            await aCategory.save().then(() => mongoose.connection.close());
        }
    })
    return aCategory;
}

async function updateCategory(newData){
    var aCategory;
    await mongoose.connect(dbURI, {ssl:true})
    .then(async() =>{
        console.log("Updating product with ID: "+ id)
        aCategory = await Category.findOneAndUpdate({name: category}, newData, {new: true}).exec();
        mongoose.connection.close()
    })
    return aCategory;
}

async function deleteCategory(id){
    var deleted = false;
    await mongoose.connect(dbURI, {ssl:true})
    .then(async() =>{
        console.log("Deleting product with ID: "+ id)
        await Category.deleteOne({_id: id});
        await Product.deleteMany({category: id}); //cascade delete
        deleted = true
        mongoose.connection.close()
    })
    return deleted;
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

//PRODUCT

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

async function addNewProduct(data){
    await mongoose.connect(dbURI, {ssl:true})
    .then(async() =>{
        console.log("Adding new product...")
        const aCat = await Category.findOne({name: data.category}).exec()
        if(aCat){
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
        }
        else{
            console.log("Category not found for this product...")
            await addNewCategory(data.category, true).then(async(newCategory) => {
                console.log(newCategory)
                const aProduct = new Product({
                    name: data.name,
                    price: data.price,
                    description: data.description,
                    category: newCategory.id
                })
                await aProduct.save().then(async () => {
                    newCategory.products.push(aProduct);
                    await newCategory.save();
                    mongoose.connection.close()
                });
            });

        }
    })
}

async function getProduct(id){
    var prod;
    await mongoose.connect(dbURI, {ssl:true})
    .then(async() =>{
        console.log("Fetching product with ID: "+ id)
        prod = await Product.findById(id).exec();
        //console.log(prods.products)
        mongoose.connection.close()
    })
    return prod;
}

async function updateProduct(id, newData){
    var prod;
    await mongoose.connect(dbURI, {ssl:true})
    .then(async() =>{
        console.log("Fetching product with ID: "+ id)
        prod = await Product.findByIdAndUpdate(id, newData, {new: true}).exec();
        //console.log(prods.products)
        mongoose.connection.close()
    })
    return prod;
}

async function deleteProduct(id){
    var deleted = false;
    await mongoose.connect(dbURI, {ssl:true})
    .then(async() =>{
        console.log("Deleting product with ID: "+ id)
        await Product.deleteOne({_id: id});
        deleted = true
        mongoose.connection.close()
    })
    return deleted;
}

module.exports = { 
    addNewCategory: addNewCategory,
    updateCategory: updateCategory,
    deleteCategory: deleteCategory,
    getCategories: getCategories,

    addNewProduct: addNewProduct,
    getProducts: getProducts,
    getProduct: getProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct,
 }


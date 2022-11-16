const express = require('express')
require('express-router-group');
const {addNewCategory, addNewProduct, getProducts, getCategories, getProduct,
     updateProduct, deleteProduct, deleteCategory, updateCategory} = require('../controller/productController');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json()

const app = express()
const homeRouter = express.Router()

homeRouter.group("/v1", (homeRouter) => {
    homeRouter.get("/", function(req, res){
        res.send("API home page")
    }); 
    homeRouter.get("/test", function(req, res){
        res.send("Test api")
     //   console.log(req.cookies)
    });

    homeRouter.group("/category", (homeRouter) => {
        homeRouter.post("/new", jsonParser, function(req, res){
            console.log(req.body)
            const data = req.body.name;
            addNewCategory(data).then(() =>{
                res.status(200).send("Category added succesfully!")
            });
        });

        homeRouter.get("/:cat/products", async function(req, res){
            const data = req.params.cat;
            var products;
            try{
                products = await getProducts(data)
                res.status(200).send(products)
            }
            catch(err){
                console.log(err)
            }
        });

        homeRouter.get("/all", jsonParser, async function(req, res){
            const data = req.params.cat;
            var cats;
            try{
                cats = await getCategories()
                res.status(200).send(cats)
            }
            catch(err){
                console.log(err)
            }
        });

        homeRouter.delete("/:id", async function(req, res){
            const id = req.params.id;
            const deleted = await deleteCategory(id)
            if(deleted) res.status(200).send("Category deleted succesfully!")
            else res.status(404).send("Category does not exist");

        });

        homeRouter.put("/:id", async function(req, res){
            const id = req.params.id;
            const deleted = await updateCategory(id)
            if(deleted) res.status(200).send("Category updated succesfully!")
            else res.status(404).send("Category does not exist");

        });
    });

    homeRouter.group("/product", (homeRouter) => {
        homeRouter.post("/new", jsonParser, function(req, res){
            console.log(req.body)
            const data = req.body;
            addNewProduct(data).then(() =>{
                res.status(200).send("Product added succesfully!")
            });
        });

        homeRouter.get("/:id", jsonParser, async function(req, res){
            const id = req.params.id;
            const product = await getProduct(id);
            console.log(product);
            if(product) res.status(200).send(product)
            else res.status(404).send("Not found");
        });

        homeRouter.put("/:id", jsonParser, async function(req, res){
            const id = req.params.id;
            const newData = req.body;
            console.log(newData)
            const updatedProd = await updateProduct(id, newData);
            if(updatedProd) res.status(200).send("Product updated succesfully with fields: " + updatedProd)
            else res.status(404).send("Couldn't update product");

        });

        homeRouter.delete("/:id", async function(req, res){
            const id = req.params.id;
            console.log("Deleting")
            const deleted = await deleteProduct(id)
            if(deleted) res.status(200).send("Product deleted succesfully!")
            else res.status(404).send("Product does not exist");

        });
    });
});


module.exports = homeRouter;



const express = require('express')
require('express-router-group');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const {addNewCategory, addNewProduct, getProducts, getCategories}  =  require('../controller/productController');

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
    homeRouter.post("/category/new", jsonParser, function(req, res){
        console.log(req.body)
        const data = req.body;
        addNewCategory(data).then(() =>{
            res.status(200).send("Category added succesfully!")
        });
    });

    homeRouter.post("/product/new", jsonParser, function(req, res){
        console.log(req.body)
        const data = req.body;
        addNewProduct(data).then(() =>{
            res.status(200).send("Product added succesfully!")
        });
    });

    homeRouter.get("/:cat/products", jsonParser, async function(req, res){
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

    homeRouter.get("/categories", jsonParser, async function(req, res){
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
});


module.exports = homeRouter;



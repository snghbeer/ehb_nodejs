require('express-router-group');
const express = require('express');
const {addNewCategory, addNewProduct, getProducts, getCategories, getProduct,
     updateProduct, deleteProduct, deleteCategory, updateCategory, getAllProducts,
     getAllProductsWithLimitOffset} = require('../controller/productController');
const {fetchUser, registerUser} = require('../controller/userController');
var bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');

var jsonParser = bodyParser.json()
const homeRouter = express.Router()
const PORT = process.env.PORT || 3000 ;

//MIDDLEWARE function
//for authenticated users
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1] //because Auhtorization header contains "Bearer tokenXYZ", so we split string and only take the 2nd part of string
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.privateKey, (err) => { //verifies if JWT token is valid or not
      if (err) return res.sendStatus(403)
      next() //if valid, request can proceed
    })
}

homeRouter.group("/v1", (homeRouter) => {
    homeRouter.get("/", function(req, res){
        res.send("API home page")
    });

    //this route is used when a users logs in succesfuly
    homeRouter.get("/getToken", function(req, res){ //should be a private route but is made public for testing purposes on postman
        const url = req.baseUrl + "/dashboard"
        var token = jwt.sign({ foo: process.env.payload }, process.env.privateKey, { expiresIn: '3600s'}); //token will expire after x seconds
        res.json({token: token, redirect: url})
    });

    //route with middleware using a jwt token
    homeRouter.get("/dashboard", authenticateToken, function(req, res){
        const url = req.baseUrl + "/product/all"
        const catUrl = req.baseUrl + "/category/all"
        res.render("dashboard", {productUrl: url, catUrl: catUrl})
    });

    homeRouter.get("/login", function(req, res){
        const registerUrl = req.baseUrl + "/register"
        const loginrUrl = req.baseUrl + "/login"

        res.render("index", {registerUrl: registerUrl, loginUrl: loginrUrl })

    });

    homeRouter.post("/login", jsonParser, async function(req, res){
        const data = req.body;
        const url = req.baseUrl + "/getToken"
        await fetchUser(data.username, data.password, function(err){
            if(!err.error){
                res.redirect(url);
            } //res.status(200).send("User signed in succesfully!")
            else res.status(403).send("Wrong credentials")
        })
    });

    homeRouter.get("/register", function(req, res){
        const registerUrl = req.baseUrl + "/register"
        const loginrUrl = req.baseUrl + "/login"

        res.render("auth/register", { registerUrl: registerUrl, loginUrl: loginrUrl })
    });

    homeRouter.post("/register", jsonParser, async function(req, res){
        const loginrUrl = req.baseUrl + "/login"
        const data = req.body;
        const psw = data.password;
        const cpsw = data.cpassword;
        if(psw === cpsw){
            try{
                const aUser = await registerUser(data)
                if (aUser) res.status(200).send("User registered succesfully!")
                else res.status(404).send("Something went wrong")
            }
            catch(err){
                res.status(400).send(err._message)
            }
        }else res.status(403).send("Something went wrong")
    });

    //Category endpoints
    homeRouter.group("/category", (homeRouter) => {
        homeRouter.post("/new", jsonParser, 
        body('name').isString().not().isEmpty(), //validation
        function(req, res){
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            } else{
                const data = req.body.name;
                addNewCategory(data).then(() =>{
                    res.status(200).send("Category added succesfully!")
                });
            }
        });

        homeRouter.get("/:cat/products", authenticateToken, async function(req, res){
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
                res.json({categories: cats})
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

        homeRouter.put("/:id",jsonParser,  
        body('name').isString().not().isEmpty(),
        async function(req, res){
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            } else{
                const id = req.params.id;
                const newData = req.body;
                const updated = await updateCategory(id, newData)
                if(updated) res.status(200).send("Category updated succesfully!")
                else res.status(404).send("Category does not exist");
            }
        });
    });

    //Product endpoints
    homeRouter.group("/product", (homeRouter) => {
        homeRouter.get("/all", authenticateToken,  async function(req, res){
            const products = await getAllProducts();
            if (products) res.json({products: products})
            else res.status(404).send("Not found")
        })

        
        //Endpoint to return values with limit & offset
        //optionally uses middleware -> uncomment to use
        homeRouter.get("/take", /*authenticateToken,*/ async function(req, res){
            let offset = req.query.offset || 0;
            let limit = req.query.limit || 2;
            const products = await getAllProductsWithLimitOffset(limit, offset)
            res.json({products: products});
        });

        homeRouter.post("/new", jsonParser, 
        body('name').isString().not().isEmpty(), body('price').isNumeric().not().isEmpty(),
        body('category').isString().not().isEmpty(), body('description').isString().not().isEmpty(), //validation
        function(req, res){
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            } else{
                const data = req.body;
                addNewProduct(data).then(() =>{
                    res.status(200).send("Product added succesfully!")
                });
            }      
        });

        homeRouter.get("/:id", jsonParser, async function(req, res){
            const id = req.params.id;
            const product = await getProduct(id);
            console.log(product);
            if(product) res.status(200).send(product)
            else res.status(404).send("Not found");
        });

        homeRouter.put("/:id", jsonParser, 
        body('name').isString().optional(), body('price').isNumeric().optional(),
        body('category').isString().optional(), body('description').isString().optional(), //validation
        async function(req, res){
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            } else{
                const id = req.params.id;
                const newData = req.body;
                const updatedProd = await updateProduct(id, newData);
                if(updatedProd) res.status(200).send("Product updated succesfully with fields: " + updatedProd)
                else res.status(404).send("Couldn't update product");
            }
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



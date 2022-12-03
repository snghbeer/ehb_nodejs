# NodeJS project readme:

## It is recommended to use postman for most endpoints

#### Authentication (Postman not needed for login and register):
* **login:** /api/v1/login
* **register:** /api/v1/register
* **getToken:** /api/v1/getToken (is automatically called when login is succesful)

#### Endpoints requiring users to be authenticated (using JWT token):
* /api/v1/dashboard (is a redirection after succesful login)

#### Endpoints requiring a token:
* **get product for a category:** /:cat/products with :cat a category name
* **get all products:** /api/v1/product/all 

#### Get all categories:
* /api/v1/category/all

#### Post requests body examples:
![Adding category JSON body](https://user-images.githubusercontent.com/56880412/205454830-318228b7-cbf1-4a66-9a5d-c82dc6a7ca0a.png)
![Add product JSON body](https://user-images.githubusercontent.com/56880412/205454872-3d0d4a78-26bc-4220-8c0a-0061ad0dfd0d.png)


### Sources checked: 

* [Jquery/Ajax](https://stackoverflow.com/questions/9269265/ajax-jquery-simple-get-request)
* [Mongoose](https://mongoosejs.com/docs/models.html)
* [Mongoose authentication](https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1)
* [Mongoose one-to-many (a category has many products)](https://stackoverflow.com/questions/34985846/mongoose-document-references-with-a-one-to-many-relationship)
* [ExpressJs](https://expressjs.com/en/guide/using-middleware.html) 
* [Grouping routes in EpxressJs](https://stackoverflow.com/questions/38894102/grouping-routes-in-express) 
* [EJS for rendering html like blade templates](https://ejs.co/) 
* [Session storage](https://www.w3schools.com/jsref/prop_win_sessionstorage.asp) 
* [Session token (JWT)](https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs) 
* [Login/Register form](https://mdbootstrap.com/docs/standard/extended/login/#section-6)  
* [GIT repo](https://github.com/snghbeer/ehb_nodejs) 

NodeJS project:

It is recommended to use postman for most endpoints

Authentication (Postman not needed for login and register):
*login: /api/v1/login
*register: /api/v1/register
*getToken: /api/v1/getToken (is automatically called when login is succesful)

Endpoints requiring users to be authenticated (using JWT token):
*/api/v1/dashboard (is a redirection after succesful login)

Endpoints requiring a token:
*get product for a category: /:cat/products with :cat a category name
*get all products: /api/v1/product/all 

Get all categories:
*/api/v1/category/all


Sources checked: 

Jquery/Ajax: https://stackoverflow.com/questions/9269265/ajax-jquery-simple-get-request

Mongoose: https://mongoosejs.com/docs/models.html

https://expressjs.com/en/guide/using-middleware.html

https://stackoverflow.com/questions/38894102/grouping-routes-in-express (npm express-group-routes)

https://ejs.co/ (documentations for rendering html like a blade template)

Session storage: https://www.w3schools.com/jsref/prop_win_sessionstorage.asp
Session token (JWT): https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs

login/register form: https://mdbootstrap.com/docs/standard/extended/login/#section-6

GIT repo: https://github.com/snghbeer/ehb_nodejs

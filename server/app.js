const express = require('express')
const app = express()  //create instance of express  // Init app
const session = require('express-session')
const configRoutes = require('./routes')
const cors = require('cors')  // ❤ for CORS policy

app.use(cors())  // ❤ for CORS policy
app.use(express.json())  //❤ allow us to read the request body. Without this line, if you try to read request body, it will be undefined

app.use('/public', express.static(__dirname + '/public'))  // tell app to use the /public directory as static. Without this, /public/css/main.css will not have effect
app.use(express.json())  //❤ allow us to read the request body. Without this line, if you try to read request body, it will be undefined
app.use(express.urlencoded({extended: true}))  // get form data
app.use(async (req, res, next) => {
    // If the user posts to the server with a property called _method, rewrite the request's method
    // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
    // rewritten in this middleware to a PUT route
    if (req.body && req.body._method) {
        req.method = req.body._method
        delete req.body._method
    }
    // let the next middleware run:
    next()
})


configRoutes(app)

app.listen(3001, "0.0.0.0", () => {
    console.log("We've now got a server!")
    console.log('Your routes will be running on http://localhost:3001')
})
const express = require('express')
const app = express()
const configRoutes = require('./routes')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
configRoutes(app)

app.listen(3030, () => {
    console.log("We've now got a server!")
    console.log('Your routes will be running on http://localhost:3030')
})

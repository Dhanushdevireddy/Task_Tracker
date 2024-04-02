const connectToMongo = require("./db");
const authentication = require('./routes/auth.js')
const exporttasks = require('./routes/tasks.js')
const path = require('path')

connectToMongo();
const express = require('express')
var cors = require('cors')
var app = express()
 
app.use(cors())
 
const port = process.env.PORT || 5000
app.use(express.json({extended:false}))

app.use("/api/auth",authentication)
app.use("/api/tasks",exporttasks)

app.get('/', (req, res) => {
    res.send('Hello World!')
})  


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
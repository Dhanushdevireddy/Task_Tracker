const mongoose = require("mongoose")
require('dotenv').config();
const connectToMongo = () =>{
    mongoose 
    .connect(process.env.ATLAS_URI, {
           useNewUrlParser: true,
           useUnifiedTopology: true})   
    .then(() => console.log("Database connected!"))
    .catch(err => console.log(err));
}

module.exports = connectToMongo
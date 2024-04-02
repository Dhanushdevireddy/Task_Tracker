const mongoose = require("mongoose")
const { Schema } = mongoose;
const UserProfileSchema = new Schema({
    name: {
        type:String,
        required: true
    },
    email: {
        type:String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required: true,
    },
    userName: {
        type: String,
        required: true
    },
     });

module.exports = mongoose.model('Users',UserProfileSchema)
//Users named collection will be created
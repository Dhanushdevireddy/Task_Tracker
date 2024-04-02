const mongoose = require("mongoose")
const { Schema } = mongoose;
const TaskSchema = new Schema({
    nameOfTheTask: {
        type:String,
        required: true
    },
    description: {
        type:String,
        required: true
    },
    userName: {
        type:String,
        required: true,
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    },
    date: {
        type: String,
        required: true
    },
     });

module.exports = mongoose.model('Tasks',TaskSchema)
//Tasks named collection will be created
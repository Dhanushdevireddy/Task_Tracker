const express = require("express")
const fetchuser = require("../middleware/fetchuser")
const router = express.Router()
const tasksch = require("../models/tasks")
const { body, validationResult } = require('express-validator');


//gets notes with the auth token provided in header
router.get("/gettasks", fetchuser, async (req, res) => {
    try {
        const notes = await tasksch.find({ userId: req.user.id })
        res.status(200).send(notes)
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error occured")
    }
})



//add notes to a particular person's notes with auth token provided in header
router.post("/addtasks", fetchuser, body('nameOfTheTask').isLength({ min: 3 }), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { nameOfTheTask, description, userName, date } = req.body
        let tasks = await tasksch.create({
            userId: req.user.id,
            nameOfTheTask: nameOfTheTask,
            description: description,
            userName: userName,
            date: date
        })
        res.status(200).send(tasks)
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error occured")
    }
})




//update a particular person's notes with auth token provided in header
router.put("/updatetask/:id", fetchuser, async (req, res) => {
    try {
        const { nameOfTheTask, description, userName, date } = req.body
        const tasks = await tasksch.findById(req.params.id)
        if (!tasks) {
            return res.status(404).send("Notes doesnot exists")
        }
        if (tasks.userName != req.body.userName) {
            return res.status(401).send("Not authorised!!")
        }
        
        const newtask = {}
        newtask.nameOfTheTask = nameOfTheTask
        newtask.description = description
        newtask.userName = userName
        newtask.date = date
        let task = await tasksch.findByIdAndUpdate(req.params.id, { $set: newtask }, { new: true })
        return res.status(200).send(task)
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error occured")
    }
})



//delete a particular person's notes with auth token provided in header
router.delete("/deletetask/:id", fetchuser, async (req, res) => {
    try {
        const tasks = await tasksch.findById(req.params.id)
        if (!tasks) {
            return res.status(404).send("Task does not exists")
        }
        if (tasks.userName != req.body.userName) {
            return res.status(401).send("Not authorised!!")
        }
        let task = await tasksch.findByIdAndDelete(req.params.id)
        return res.status(200).send("Success! Task has been deleted")
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error occured")
    }
})


module.exports = router
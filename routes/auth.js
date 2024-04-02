const express = require("express");
const usersch = require("../models/Users")
const router = express.Router();
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
let fetchuser = require("../middleware/fetchuser")

secretKey = process.env.SECRET_KEY




//create user with end point /api/auth/createuser. No login required
router.post("/createuser",
    //validations for name,email,password
    body('name').isLength({ min: 3 }),
    body('userName').isLength({min:4}),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }), async (req, res) => {
        try {
            //if there are any errors in validations,then they will be displayed
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            //checking whether user exists already or not.
            let user1 = await usersch.findOne({ userName: req.body.userName })
            if (user1) {
                return res.status(400).json({ error: "This email already exists" })
            }
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(req.body.password, salt);
            let data ={
                user:{
                    id:usersch.id
                }
            }
            var token = jwt.sign(data,secretKey);
            //if user doesn't exist, new user will be created.
            let user = await usersch.create({
                name: req.body.name,
                email: req.body.email,
                userName: req.body.userName,
                password: hash,
            }).then(user => res.json({"token":token}))
        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server error occured")
        }
    })




//Login a user with end point /api/auth/loginuser. login required
router.post("/loginuser",
    //validations for email
    body('userName').isLength({min:4}),
    body('password').isLength({ min: 5 }), async (req, res) => {
        let success = false
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            let user =await usersch.findOne({userName:req.body.userName})
            if (!user){
                return res.status(400).send({success,"message":"Sorry,No user with this Username exists"})
            }

            let login = bcrypt.compare(req.body.password, user.password);
            if (!login){
                return res.status(400).send({success,"message":"Please login with correct credentials"})
            }
            let data ={
                user:{
                    id:user.id
                }
            }
            var token = jwt.sign(data, secretKey);
            success = true
            return res.status(200).send({success,token})
            
        }
        catch(error){
            console.error(error.message);
            res.status(500).send("Internal Server error occured")
        }
    })



//gets user with the auth token provided in header
router.post("/getuser",fetchuser, async (req, res) => {
    try{
        let userid = req.user.id
        const user = await usersch.findById(userid).select("-password")
        res.status(200).send(user)
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server error occured")
    }

})
module.exports = router
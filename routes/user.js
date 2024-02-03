// backend/routes/user.js
const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const zod = require("zod");
// const User = require("../db");
// const Account = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const authMiddleware = require('../middleware');
const { User, Account } = require('../db');
router.use(express.json());

const signupBody = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6).max(16),
	firstName: zod.string(),
	lastName: zod.string(),
})

router.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body)

    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })
    
    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken"
        })
    }
    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })

    const userId = user._id;

    await Account.create({
        userId,
        balance: 1+ parseInt((Math.random()*10000))
    })

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    })
})

const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });
    const userId = user._id;
    if (user) {
        const token = jwt.sign({
            userId
        }, JWT_SECRET);
  
        res.status(200).json({
            token: token
        })
        return;
    }

    
    res.status(404).json({
        message: "User does not exist"
    })
})

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
})

router.put("/",authMiddleware, async function(req,res){
    const { success } = updateBody.safeParse(req.body);
    if(!success){
        res.status(404).send("Error while login")
    }

    await User.updateOne({_id: req.userId}, req.body);
    res.status(200).send("Update Successfull");
})

router.get("/bulk", async function(req,res){
    const filter = req.query.filter || "";
    const regexFilter = new RegExp(filter, 'i');

    const users = await User.find({
        $or: [
            { firstName: { $regex: regexFilter } }, // Match firstName
            { lastName: { $regex: regexFilter } }   // Match lastName
        ]
    });

    res.json({"users": users})
})

router.get("/verify",authMiddleware,async function(req,res){
    const userId = req.userId;
    const user = await User.findOne({
        _id: userId
    })
    res.status(200).json({"user": user});
})

module.exports = router;
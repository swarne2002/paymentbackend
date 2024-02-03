const express = require("express");
const authMiddleware = require("../middleware");
const { default: mongoose } = require("mongoose");
const { Account } = require("../db");

const router = express.Router();
router.use(express.json());

router.post("/transfer",authMiddleware, async function(req,res){

    const session = await mongoose.startSession();
    session.startTransaction();

    const { amount, to } = req.body;

    const account = await Account.findOne({userId: req.userId}).session(session);

    if(!account || account.balance<amount){
        session.abortTransaction();
        res.status(400).json({"message": "Insufficient Balance"});
    }

    const reciver = await Account.findOne({userId: to}).session(session);

    if(!reciver){
        session.abortTransaction();
        console.log(reciver)
        res.status(401).json({"message": "Invalid Account"});
    }

    await Account.updateOne({userId: req.userId},{$inc:{balance: -amount}}).session(session);

    await Account.updateOne({userId:to},{$inc:{balance: amount}}).session(session);

    await session.commitTransaction();

    res.status(200).json({"message": "Transfer Successfull"});
})

module.exports = router;
const express = require("express");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const rootRouter = require('./routes/index')
const app = express();

app.use(express.json());

app.use(cors());

app.use("/",rootRouter);


app.listen(3000,"0.0.0.0",function(){
    console.log("app is running")
});



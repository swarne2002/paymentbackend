const express = require("express");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const rootRouter = require('./routes/index')
const app = express();
const port = 3000;

app.use(express.json());

app.use(cors());

app.use("/",rootRouter);


app.listen(process.env.PORT || port,"0.0.0.0",function(){
    console.log("app is running")
});



const express = require('express');
const uesrRoutes = require('./user');
const accountRoutes = require('./account');

const router = express.Router();

router.use("/user",uesrRoutes);
router.use("/account",accountRoutes);

module.exports = router;
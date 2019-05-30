//Dependencies
const express = require('express');
const router = express.Router();

// importing controllers
const balanceController = require('../controllers/balance');

// controllers for specific routes
router.get('/', balanceController.get_balance);

router.post('/fund', balanceController.fund_balance);

// exporting module
module.exports = router;
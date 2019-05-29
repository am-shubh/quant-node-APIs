//Dependencies
const express = require('express');
const router = express.Router();

// importing controllers
const accountController = require('../controllers/account');

// controllers for specific routes
router.post('/create_new_account', accountController.create_new_account);
router.post('/set_default_account', accountController.set_default_account);

router.get('/list_all_accounts', accountController.list_all_accounts);
router.get('/accounts_by_dlt/:dlt_type', accountController.accounts_by_dlts);
router.get('/default/:dlt_type', accountController.get_default_account);


// exporting module
module.exports = router;
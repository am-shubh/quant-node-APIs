//Dependencies
'use strict';
const express = require('express');
const app = express();
const cors = require('cors')({origin: true});
const bodyParser = require('body-parser');

const OverledgerSDK = require("@quantnetwork/overledger-sdk").default;
const mAppId = process.env.mAppId;
const bpiKey = process.env.bpiKey;
const dlts = [{ dlt: "bitcoin" }, { dlt: "ethereum" }, { dlt: "ripple" }];

// setting overledger as variable for every controllers
app.locals.overledger = new OverledgerSDK(mAppId, bpiKey, { dlts });

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// enabling CORS
app.use(cors);

// routes
const accountRoutes = require('./api/routes/account');
const balanceRoutes = require('./api/routes/balance');

// redirecting to Routes
app.use('/account', accountRoutes);
app.use('/balance', balanceRoutes);

// exporting app module
module.exports = app;
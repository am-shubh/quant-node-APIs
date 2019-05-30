// Dependencies
var fs = require("fs");

const fileName = process.env.fileName;

exports.create_new_account = async (req, res) => {

    let overledger = req.app.locals.overledger;
    let dlt_type = req.body.dlt_type;

    try {

        let newAccount = await overledger.dlts[dlt_type].createAccount();

        newAccount.dlt_type = dlt_type;

        fs.appendFile(fileName, JSON.stringify(newAccount) + '\n', (err) => {

            if (err) {
                return res.status(500).send({ "error": "Could not save account" });
            }

            delete newAccount.privateKey;
            return res.status(201).send(newAccount);

        });

    } catch (e) {
        let response_body = {
            "message": "something went wrong",
            "error": e
        }
        return res.status(500).send(response_body);
    }

}

exports.set_default_account = async (req, res) => {

    let overledger = req.app.locals.overledger;

    let dlt_type = req.body.dlt_type;
    let address = req.body.address;

    get_account_by_address(address).then(async (accountData)=>{

        if (accountData == '') {
            return res.status(404).send({ "message": "account not found" });
        } else {
            try {

                let privateKey = accountData.privateKey;
                await overledger.dlts[dlt_type].setAccount(privateKey);
    
                return res.status(200).send({ "message": "account set as default" })
    
            } catch (err) {
                console.log(err)
                return res.status(500).send({ "error": "Something went wrong" });
            }
        }

    }).catch((err)=>{
        return res.status(500).send({ "error": "Something went wrong" });
    });


}

exports.list_all_accounts = async (req, res) => {

    let all_accounts = [];

    try {

        fs.readFile(fileName, 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).send({ "error": "Could not fetch accounts" });
            }

            data.split('\n').forEach((splittedData) => {
                if (splittedData != '') {
                    tempData = JSON.parse(splittedData);
                    delete tempData.privateKey;
                    all_accounts.push(tempData);
                }
            });

            let response_body = {
                "count": all_accounts.length,
                "accounts": all_accounts
            }

            return res.status(200).send(response_body);
        });

    } catch (err) {

        return res.status(500).send({ "error": "something went wrong" });

    }

}

exports.accounts_by_dlts = async (req, res) => {

    let dlt_type = req.params.dlt_type;

    let dlt_accounts = [];

    try {

        fs.readFile(fileName, 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).send({ "error": "Could not fetch accounts" });
            }

            data.split('\n').forEach((splittedData) => {
                if (splittedData != '') {
                    tempData = JSON.parse(splittedData);
                    if (tempData.dlt_type == dlt_type) {
                        delete tempData.privateKey;
                        dlt_accounts.push(tempData);
                    }
                }
            });

            let response_body = {
                "count": dlt_accounts.length,
                "accounts": dlt_accounts
            }

            return res.status(200).send(response_body);
        });

    } catch (err) {

        return res.status(500).send({ "error": "something went wrong" });

    }

}

exports.get_default_account = async(req, res) => {

    let overledger = req.app.locals.overledger;

    let dlt_type = req.params.dlt_type;

    try{

        let def_Account = overledger.dlts[dlt_type].account;

        response_body = {
            "dlt_type": dlt_type,
            "account": def_Account
        }

        return res.status(200).send(response_body)

    } catch(err){
        console.log(err);
        return res.status(500).send({"error":"something went wrong"})
    }

}

function get_account_by_address(address){

    let returnData = '';

    return new Promise(function(resolve, reject) {

        fs.readFile(fileName, 'utf-8', (err, data) => {
            if (err) {
                reject(err)
            }

            data.split('\n').forEach((splittedData) => {

                if (splittedData != '') {
                    tempData = JSON.parse(splittedData);
                    if (tempData.address == address) {
                        returnData = tempData;
                    }
                }
            });

            resolve(returnData)
        });

    })

}

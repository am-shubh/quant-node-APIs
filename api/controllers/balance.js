exports.get_balance = async (req, res) => {

    let overledger = req.app.locals.overledger;
    let dlt_type = req.body.dlt_type;
    let address = req.body.address;

    try{

        let balance = await overledger.dlts[dlt_type].getBalance(address);
        
        return res.status(200).send(JSON.parse(JSON.stringify(balance.data)));

    } catch(err){

        console.log(err)
        return res.status(500).send({"error": err});

    }
}

exports.fund_balance = async (req, res) => {

    let overledger = req.app.locals.overledger;

    let address = req.body.address;
    let amount = req.body.amount;
    let dlt_type = req.body.dlt_type;

    overledger.dlts[dlt_type].fundAccount(amount, address).then((data)=>{

        return res.status(200).send(JSON.parse(data.data.message));

    }).catch((err)=>{

        return res.status(500).send({"error":err});

    });

}
module.exports = function web3tx(fn, msg) {
    let web3 = global.web3;

    // use the default openzeppelin test-helpers web3
    if (!web3) {
        web3 = require("./config").getWeb3();
    }

    return async function() {
        console.log(msg + ": started");
        let r = await fn.apply(null, arguments);
        let transactionHash, receipt, tx;

        // in case of contract.sendtransaction
        if (r.tx) {
            transactionHash = r.tx;
            receipt = r.receipt;
        }

        // in case of contract.new
        if (r.transactionHash) {
            transactionHash = r.transactionHash;
            receipt = await web3.eth.getTransactionReceipt(transactionHash);
        }

        let gasUsed;
        if (receipt) {
            r.receipt = receipt;

            // some ganache return gasUsed in hex string
            if (typeof(receipt.gasUsed) == "string" &&
                receipt.gasUsed.startsWith("0x")) {
                receipt.gasUsed = parseInt(receipt.gasUsed, 16);
            }
            gasUsed = receipt.gasUsed;
        }


        let gasPriceGwei;
        if (transactionHash && receipt)  {
            tx = await web3.eth.getTransaction(transactionHash);
            if (tx) {
                // calculate gas cost
                let cost = web3.utils.toBN(receipt.gasUsed * tx.gasPrice);
                r.txCost = cost;
                r.gasPrice = tx.gasPrice;
                gasPriceGwei = web3.utils.fromWei(r.gasPrice, "gwei");
            }
        }

        console.log(`${msg}: done, gas used ${gasUsed}, gas price ${gasPriceGwei} Gwei`);

        return r;
    };
};

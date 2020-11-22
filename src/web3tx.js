const { expectEvent } = require("@openzeppelin/test-helpers");

const web3backup = require("@openzeppelin/test-helpers/src/setup").web3;

module.exports = function web3tx(fn, msg, expects = {}) {
    const web3 = global.web3 || web3backup;

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
        if (transactionHash)  {
            tx = await web3.eth.getTransaction(transactionHash);
            // calculate gas cost
            let cost = web3.utils.toBN(receipt.gasUsed * tx.gasPrice);
            r.txCost = cost;
            r.gasPrice = tx.gasPrice;
            gasPriceGwei = web3.utils.fromWei(r.gasPrice, "gwei");
        }

        // check logs
        if (expects.inConstruction) {
            await Promise.all(expects.inConstruction.map(async i => {
                await expectEvent.inConstruction(r, i.name, i.args);
            }));
        }
        if (expects.inLogs) {
            expects.inLogs.forEach(i => {
                expectEvent.inLogs(receipt.logs, i.name, i.args);
            });
        }


        console.log(`${msg}: done, gas used ${gasUsed}, gas price ${gasPriceGwei} Gwei`);

        return r;
    };
};

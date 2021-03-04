const { web3tx } = require("..");
const { expect } = require("chai");
const Tester = artifacts.require("Tester");

async function assertFailure (promise) {
    try {
        await promise;
    } catch (error) {
        return;
    }
    expect.fail();
}

contract("web3tx", accounts => {
    it("new and setValue", async () => {
        const tester1 = await web3tx(Tester.new, "Tester.new 1")();
        console.debug("receipt", tester1.receipt);
        console.debug("address", tester1.address);
        console.debug("txCost", tester1.txCost);
        console.debug("gasPrice", tester1.gasPrice);
        assert.isDefined(tester1.receipt);
        assert.isDefined(tester1.address);
        assert.isTrue(tester1.txCost > 100000);
        const tx = await web3tx(tester1.setValue, "tester.setValue 10")(10);
        console.debug(tx);
        assert.isDefined(tx.receipt);
        assert.isDefined(tx.tx);
        assert.isDefined(tx.gasPrice);
        assert.isTrue(tx.txCost > 100000);
    });

    it("encodeABI", async () => {
        const tester = await web3tx(Tester.new, "Tester.new")();
        assert.equal(tester.contract.methods.setValue(2).encodeABI(), "0xfb693f770000000000000000000000000000000000000000000000000000000000000002");
    });

    it("disable global web3", async () => {
        delete global.web3;
        const tester = await web3tx(Tester.new, "Tester.new")();
        assert.equal(tester.contract.methods.setValue(2).encodeABI(), "0xfb693f770000000000000000000000000000000000000000000000000000000000000002");
    });
});

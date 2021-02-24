const { getWeb3, setWeb3Provider } = require("../src/config");

describe("config", () => {
    it("setWeb3Provider/getWeb3", () => {
        setWeb3Provider(web3.currentProvider);
        assert.equal(getWeb3().currentProvider, web3.currentProvider);
    });
});

const { round, fromDecimals, toDecimals, wad4human, toWad } = require("../src");

describe("math-utils", () => {
    it("round", () => {
        assert.equal(round("2.322222"), 2.32);
        assert.equal(round(2.322), 2.32);
        assert.equal(round(2.322, 3), 2.322);
        assert.equal(round("2.325555"), 2.33);
        assert.equal(round(2.325555), 2.33);
        assert.equal(round(2.325555, 3), 2.326);
        assert.equal(round("-2.322222"), -2.32);
        assert.equal(round("-2.325555"), -2.33);
    })

    it("fromDecimals", () => {
        assert.equal(fromDecimals(1234567, 3), "1234.567");
        assert.equal(fromDecimals(1234560, 3), "1234.56");
        assert.equal(fromDecimals(1234560.2, 3), "1234.56");
        assert.equal(fromDecimals(1234560.2, 3, { truncate: false } ), "1234.5602");
        assert.equal(fromDecimals(-1234567, 3), "-1234.567");
        assert.equal(fromDecimals(-1234560, 3), "-1234.56");
        assert.equal(fromDecimals(-1234560.2, 3), "-1234.56");
        assert.equal(fromDecimals(-1234560.2, 3, { truncate: false } ), "-1234.5602");
    })

    it("toDecimals", () => {
        assert.equal(toDecimals(1234.567, 3), "1234567");
        assert.equal(toDecimals(1234.56, 3), "1234560");
        assert.equal(toDecimals(1234.5602, 3), "1234560");
        assert.equal(toDecimals(1234.5602, 3, { truncate: false }), "1234560.2");
        assert.equal(toDecimals(-1234.567, 3), "-1234567");
        assert.equal(toDecimals(-1234.56, 3), "-1234560");
        assert.equal(toDecimals(-1234.5602, 3), "-1234560");
        assert.equal(toDecimals(-1234.5602, 3, { truncate: false }), "-1234560.2");
    })

    it("wad4human", () => {
        assert.equal(wad4human("1234567901234567890123456789"), "1234567901.23457");
        assert.equal(wad4human("1234567901234567890123456789", 3), "1234567901.235");
        assert.equal(wad4human("-1234567901234567890123456789"), "-1234567901.23457");
        assert.equal(wad4human("-1234567901234567890123456789", 3), "-1234567901.235");
    })

    it("toWad", () => {
        assert.equal(toWad("1234567901.23457").toString(), "1234567901234570000000000000");
        assert.equal(toWad("-1234567901.23457").toString(), "-1234567901234570000000000000");
    })
})

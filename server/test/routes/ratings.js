const Axios = require("axios");
const { expect, assert } = require("chai");

require("../../src/index");

const host = "http://localhost:8000";

describe("ratings", () => {
  const rating = {
    user_id: 1,
    workspace_id: 1,
    rating: 7,
    comment: "The place was good but the bathroom was without a soap",
  };

  describe("create", () => {
    it("should create a rating", async () => {
      try {
        await Axios.post(`${host}/ratings/create`, { rating });
      } catch (err) {
        assert(`Test failed: ${err.message}`);
      }
    });
  });

  describe("get by workspace id", () => {
    it("should get ratings list by workspace id", async () => {
      try {
        await Axios.post(`${host}/ratings/create`, { rating });
        const ratings = await Axios.get(`${host}/ratings/${rating.workspace_id}`);
        expect(ratings.data).to.deep.equal([rating]);
      } catch (err) {
        assert(`Test failed: ${err.message}`);
      }
    });
  });

  describe("get by user id", () => {
    it("should get ratings list by user id", async () => {
      try {
        await Axios.post(`${host}/ratings/create`, { rating });
        const ratings = await Axios.get(`${host}/ratings/${rating.user_id}`);
        expect(ratings.data).to.deep.equal([rating]);
      } catch (err) {
        assert(`Test failed: ${err.message}`);
      }
    });
  });
});

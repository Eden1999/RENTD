const Axios = require("axios");
const { expect, assert } = require("chai");

require("../../src/index");

const host = "http://localhost:8000";

describe("orders", () => {
  const order = {
    startdate: new Date(),
    enddate: new Date(),
    capacity: 2,
    user_id: 1,
    order_id: 1,
    asset_id: 1,
  };

  describe("create", () => {
    it("should create an order", async () => {
      try {
        await Axios.post(`${host}/orders/create`, { order });
      } catch (err) {
        assert(`Test failed: ${err.message}`);
      }
    });
  });

  describe("get by user id", () => {
    it("should get orders list by user id", async () => {
      try {
        await Axios.post(`${host}/orders/create`, { order });
        const orders = await Axios.get(`${host}/orders/${order.host_id}`);
        expect(orders.data).to.deep.equal([order]);
      } catch (err) {
        assert(`Test failed: ${err.message}`);
      }
    });
  });

  describe("delete order by id", () => {
    it("should delete order by id", async () => {
      try {
        await Axios.post(`${host}/orders/create`, { order });
        await Axios.delete(`${host}/orders/1`);
        const orders = await Axios.get(`${host}/orders/${order.host_id}`);
        expect(orders.data).to.deep.equal([]);
      } catch (err) {
        assert(`Test failed: ${err.message}`);
      }
    });
  });
});

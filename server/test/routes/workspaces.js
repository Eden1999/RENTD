const Axios = require("axios");
const { expect, assert } = require("chai");

require("../../src/index");

const host = "http://localhost:8000";

describe("workspaces", () => {
  const workspace = {
    name: "name",
    host_id: "1",
    city: "Holon",
    address: "Weizmann",
    wifi: true,
    disabled_access: true,
    smoke_friendly: true,
    location_x: 1.0,
    location_y: 1.0,
    description: "Good place",
    photo: "",
    space_type_id: 1,
    opening_days: [true, false, false, false, false, false, false],
    opening_hour: "10:00",
    closing_hour: "23:00",
    assets: [
      {
        capacity: 2,
        cost_per_hour: 20,
        asset_id: "1",
        text: "Room",
      },
    ],
  };
  describe("create", () => {
    it("should create a workspace", async () => {
      try {
        await Axios.post(`${host}/workspaces/create`, { workspace });
      } catch (err) {
        assert(`Test failed: ${err.message}`);
      }
    });
  });

  describe("search", () => {
    it("should search for a workspace", async () => {
      try {
        await Axios.post(`${host}/workspaces/create`, { workspace });
        const query = {
          params: { city: "Holon", capacity: 2, space_type_id: 1 },
        };
        const results = await Axios.post(`${host}/workspaces/search`, null, query);
        expect(results.data[0]).to.deep.equal(workspace);
      } catch (err) {
        assert(`Test failed: ${err.message}`);
      }
    });
  });

  describe("get by host id", () => {
    it("should get workspaces list by host id", async () => {
      try {
        await Axios.post(`${host}/workspaces/create`, { workspace });
        const workspaces = await Axios.get(`${host}/workspaces/${workspace.host_id}`);
        expect(workspaces.data).to.deep.equal([workspace]);
      } catch (err) {
        assert(`Test failed: ${err.message}`);
      }
    });
  });

  describe("delete workspace by id", () => {
    it("should delete workspace by id", async () => {
      try {
        await Axios.post(`${host}/workspaces/create`, { workspace });
        await Axios.delete(`${host}/workspaces/1`);
        const workspaces = await Axios.get(`${host}/workspaces/${workspace.host_id}`);
        expect(workspaces.data).to.deep.equal([]);
      } catch (err) {
        assert(`Test failed: ${err.message}`);
      }
    });
  });
});

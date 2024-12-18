// TODO
import assert = require("assert");
import * as httpMocks from "node-mocks-http";
import { createUser, getAllUsers } from "../controllers/userController";
import { AppDataSource } from "../config/data-source";
import { createUserValidator } from "../middleware/validators/createUserValidator";
import { before, after } from "mocha";
import { createShopValidator } from "../middleware/validators/createShopValidator";
import { deleteShop, getAllShops } from "../controllers/shopController";

describe("user-routes", function () {
  before(async function () {
    // Initialize the connection before any tests
    this.timeout(5000); // Optional: Increase the timeout if connection takes time
    await AppDataSource.initialize()
      .then(() => {
        console.log("DataSource has been initialized!");
      })
      .catch((error) => {
        console.error("Error during DataSource initialization:", error);
      });
  });

  // 'after' hook to close the connection after all tests have finished
  after(async function () {
    await AppDataSource.destroy() // Ensure the connection is properly closed
      .then(() => {
        console.log("DataSource connection closed!");
      })
      .catch((error) => {
        console.error("Error during DataSource destruction:", error);
      });
  });

  it("create", async function () {
    // No given body
    let s = httpMocks.createRequest({
      method: "POST",
      urls: "/users/",
      body: {},
    });

    let s2 = httpMocks.createResponse({});

    createUserValidator(s, s2, () => createUser(s, s2));

    assert.deepStrictEqual(s2._getStatusCode(), 400);
    assert.deepStrictEqual(
      s2._getJSONData().error,
      "At least one missing field: name: undefined, email: undefined"
    );

    // Only name included
    s = httpMocks.createRequest({
      method: "POST",
      urls: "/users/",
      body: { name: "Aadi" },
    });
    s2 = httpMocks.createResponse({});

    createUserValidator(s, s2, () => createUser(s, s2));

    assert.deepStrictEqual(s2._getStatusCode(), 400);
    assert.deepStrictEqual(
      s2._getJSONData().error,
      "At least one missing field: name: Aadi, email: undefined"
    );

    // Only email included
    s = httpMocks.createRequest({
      method: "POST",
      urls: "/users/",
      body: { email: "aadi@uw.edu" },
    });
    s2 = httpMocks.createResponse({});

    createUserValidator(s, s2, () => createUser(s, s2));

    assert.deepStrictEqual(s2._getStatusCode(), 400);
    assert.deepStrictEqual(
      s2._getJSONData().error,
      "At least one missing field: name: undefined, email: aadi@uw.edu"
    );

    // Empty strings passed
    s = httpMocks.createRequest({
      method: "POST",
      urls: "/users/",
      body: { name: "", email: "" },
    });
    s2 = httpMocks.createResponse({});

    createUserValidator(s, s2, () => createUser(s, s2));

    assert.deepStrictEqual(s2._getStatusCode(), 400);
    assert.deepStrictEqual(
      s2._getJSONData().error,
      "At least one missing field: name: , email: "
    );

    // Non-UW email passed in
    s = httpMocks.createRequest({
      method: "POST",
      urls: "/users/",
      body: { name: "Ailsa", email: "ailsa123@gmail.com" },
    });
    s2 = httpMocks.createResponse({});

    createUserValidator(s, s2, () => createUser(s, s2));

    assert.deepStrictEqual(s2._getStatusCode(), 400);
    assert.deepStrictEqual(
      s2._getJSONData().error,
      `Email in invalid format, email: ailsa123@gmail.com`
    );

    // Valid Case
    s = httpMocks.createRequest({
      method: "POST",
      urls: "/users/",
      body: { name: "Sean", email: "sean456@uw.edu" },
    });
    s2 = httpMocks.createResponse({});

    createUserValidator(s, s2, () => createUser(s, s2));
    console.log(s2._getStatusCode());
    assert.deepStrictEqual(s2._getStatusCode(), 200);
  });

  it("get", async function () {
    const s = httpMocks.createRequest({
      method: "POST",
      urls: "/users/",
      body: {
        name: "ailsa",
        email: "",
      },
    });

    const s2 = httpMocks.createResponse({});

    createUserValidator(s, s2, () => createUser(s, s2));

    assert.deepStrictEqual(s2._getStatusCode(), 400);

    const l = httpMocks.createRequest({
      method: "GET",
      urls: "/users/",
    });
    const l2 = httpMocks.createResponse({});
    getAllUsers(l, l2);

    assert.deepStrictEqual(l2._getStatusCode(), 200);
  });

  it("createShop", async function () {
    // Test: Invalid Request Body - Missing fields
    let req = httpMocks.createRequest({
      method: "POST",
      url: "/shops/",
      body: {}, // Missing required fields
    });
    let res = httpMocks.createResponse();
    let next = () => {};

    createShopValidator(req, res, next);
    assert.strictEqual(res.statusCode, 400);
    assert(res._getJSONData().error.includes("At least one missing field"));
  });

  it("getAllShops", async function () {
    let req = httpMocks.createRequest({
      method: "GET",
      url: "/shops/",
      body: {},
    });
    let res = httpMocks.createResponse();
    await getAllShops(req, res);
    assert.deepStrictEqual(res._getStatusCode(), 200);
  });

  it("deleteShop", async function () {
    let req = httpMocks.createRequest({
      method: "DELETE",
      url: "/shops/",
      // params: new URLSearchParams({}),
    });
    let res = httpMocks.createResponse();

    await deleteShop(req, res);
    assert.deepStrictEqual(res._getStatusCode(), 400);

    req = httpMocks.createRequest({
      method: "DELETE",
      url: "/shops/",
      params: { id: "1" },
    });
    res = httpMocks.createResponse();
    await deleteShop(req, res);
    assert.deepStrictEqual(res._getStatusCode(), 204);
  });
});

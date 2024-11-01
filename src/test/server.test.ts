// TODO
import assert = require("assert");
import * as httpMocks from "node-mocks-http";
import { createUser, getAllUsers } from "../controllers/userController";
import { AppDataSource } from "../config/data-source";
import { createUserValidator } from "../middleware/validators/createUserValidator";
import { before, after } from "mocha";

before(async () => {
  await AppDataSource.initialize().catch((error) => {
    console.error(`Error during Data Source Initialization: ${error}`);
    return;
  });
});

after(async () => {
  await AppDataSource.destroy();
});

describe("user-routes", function () {
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
});

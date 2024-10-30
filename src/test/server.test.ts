// TODO
import assert = require("assert");
import * as httpMocks from "node-mocks-http"
import { createUser, getAllUsers } from "../controllers/userController";
import { AppDataSource } from "../config/data-source";
describe("routes", function(){
    it("get", async function(){
        await AppDataSource.initialize();
        const s = httpMocks.createRequest({
            method: "POST",
            urls:"/users/",
            body:{
                name: "ailsa",
                email: "ailsa@uw.edu"
            }
        });

        const s2 = httpMocks.createResponse({})
        createUser(s,s2);

        const l = httpMocks.createRequest({
            method: "GET",
            urls:"/users/"
        })
        const l2 = httpMocks.createResponse({});
        getAllUsers(l,l2);

        assert.strictEqual(l2._getStatusCode(),200);

    });
});
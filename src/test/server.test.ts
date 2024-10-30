// TODO
import assert = require("assert");
import * as httpMocks from "node-mocks-http"
import { createUser, getAllUsers } from "../controllers/userController";
import { AppDataSource } from "../config/data-source";
import { createUserValidator } from "../middleware/validators/createUserValidator";
import { create } from "domain";
describe("routes", function(){
    it("get", async function(){
        await AppDataSource.initialize();
        const s = httpMocks.createRequest({
            method: "POST",
            urls:"/users/",
            body:{
                name: "ailsa",
                email: ""
            }
        });

        const s2 = httpMocks.createResponse({})
        
        createUserValidator(s,s2,() => createUser(s,s2));

        assert.deepStrictEqual(s2._getStatusCode(),400);

        const l = httpMocks.createRequest({
            method: "GET",
            urls:"/users/"
        })
        const l2 = httpMocks.createResponse({});
        getAllUsers(l,l2);

        assert.deepStrictEqual(l2._getStatusCode(),200);

    });
});
// create unit tests for routes from src/routes/user.route.js
//fix import
import userRoute from "../../src/routes/user.route.js";
import userController from "../../src/controllers/user.controller.js";
import sinon from "sinon";

describe("User Route", () => {
    it("should signup successfully", async () => {
        const req = {
            body: {
                name: "name1234",
                password: "password123",
                confirmPassword: "password123",
                displayName: "name1234"
            }
        };

        const res = {
            status: sinon.spy(),
            json: sinon.spy()
        };

        sinon.stub(userController, "signup").returns({
            _id: "id",
            name: "name1234",
            displayName: "name1234"
        });

    it("should return 400 when missing name or username less than 8 characters", async () => {
        const req = {
            body: {
                name: "name",
                email: "email",
                password: "password"
            }
        };

        const res = {
            status: sinon.spy(),
            json: sinon.spy()
        };

        sinon.stub(userController, "signup").returns({
            _id: "id",
            name: "name",
            email: "email"
        });

        await userRoute.signup(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({
            message: "Name is required and must be at least 8 characters"
        })).to.be.true;

        userController.signup.restore();
    });
});
});


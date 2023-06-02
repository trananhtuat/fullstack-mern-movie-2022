//create unit test from src/controllers/favorite.controller.js
//fix import
import responseHandler from "../../src/handlers/response.handler.js";
import favoriteModel from "../../src/models/favorite.model.js";
import sinon from "sinon";

describe("Favorite Controller", () => {
    // create unit test for favoriteController.addFavorite
    describe("addFavorite", () => {
        it("should return 201 and favorite data", async () => {
            const req = {
                body: {
                    userId: "userId",
                    movieId: "movieId"
                }
            };

            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };

            sinon.stub(responseHandler, "created").returns(res);

            sinon.stub(favoriteModel.prototype, "save").returns({
                _id: "id",
                userId: "userId",
                movieId: "movieId"
            });

            await favoriteController.addFavorite(req, res);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWith({
                _id: "id",
                userId: "userId",
                movieId: "movieId"
            })).to.be.true;

            responseHandler.created.restore();
            favoriteModel.prototype.save.restore();
        });

        it("should return 400 when missing userId", async () => {
            const req = {
                body: {
                    movieId: "movieId"
                }
            };

            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };

            sinon.stub(responseHandler, "error").returns(res);

            await favoriteController.addFavorite(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({
                message: "userId is required"
            })).to.be.true;

            responseHandler.error.restore();
        });

        it("should return 400 when missing movieId", async () => {
            const req = {
                body: {
                    userId: "userId"
                }
            };

            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };

            sinon.stub(responseHandler, "error").returns(res);

            await favoriteController.addFavorite(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({
                message: "movieId is required"
            })).to.be.true;

            responseHandler.error.restore();
        });
    });

    // create unit test for favoriteController.removeFavorite
    describe("removeFavorite", () => {
        it("should return 200 and favorite data", async () => {
            const req = {
                params: {
                    favoriteId: "favoriteId"
                }
            };

            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };

            sinon.stub(responseHandler, "ok").returns(res);

            sinon.stub(favoriteModel, "findByIdAndDelete").returns({
                _id: "id",
                userId: "userId",
                movieId: "movieId"
            });

            await favoriteController.removeFavorite(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({
                _id: "id",
                userId: "userId",
                movieId: "movieId"
            })).to.be.true;

            responseHandler.ok.restore();
            favoriteModel.findByIdAndDelete.restore();
        });

        it("should return 400 when missing favoriteId", async () => {
            const req = {
                params: {}
            };

            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };

            sinon.stub(responseHandler, "error").returns(res);

            await favoriteController.removeFavorite(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({
                message: "favoriteId is required"
            })).to.be.true;

            responseHandler.error.restore();
        });
    });

    // create unit test for favoriteController.getFavoritesOfUser
    describe("getFavoritesOfUser", () => {
        it("should return 200 and favorite data", async () => {
            const req = {
                params: {
                    userId: "userId"
                }
            };

            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };

            sinon.stub(responseHandler, "ok").returns(res);

            sinon.stub(favoriteModel, "find").returns([{
                _id: "id",
                userId: "userId",
                movieId: "movieId"
            }]);

            await favoriteController.getFavoritesOfUser(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith([{
                _id: "id",
                userId: "userId",
                movieId: "movieId"
            }])).to.be.true;

            responseHandler.ok.restore();
            favoriteModel.find.restore();
        });

        it("should return 400 when missing userId", async () => {
            const req = {
                params: {}
            };

            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };

            sinon.stub(responseHandler, "error").returns(res);

            await favoriteController.getFavoritesOfUser(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({
                message: "userId is required"
            })).to.be.true;

            responseHandler.error.restore();
        });
    });
});
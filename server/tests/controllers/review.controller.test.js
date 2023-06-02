// create unit test from src/controllers/review.controller.js

import { expect } from "chai";
import sinon from "sinon";
import responseHandler from "../../src/handlers/response.handler.js";
import reviewModel from "../../src/models/review.model.js";
import reviewController from "../../src/controllers/review.controller.js";

describe("Review Controller", () => {
    // create unit test for reviewController.create
    describe("create", () => {
        it("should return 201 and review data", async () => {
            const req = {
                body: {
                    title: "title",
                    content: "content",
                    rating: 5,
                    productId: "productId",
                    userId: "userId"
                }
            };

            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };

            sinon.stub(responseHandler, "created").returns(res);

            sinon.stub(reviewModel.prototype, "save").returns({
                _id: "id",
                title: "title",
                content: "content",
                rating: 5,
                productId: "productId",
                userId: "userId"
            });

            await reviewController.create(req, res);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWith({
                _id: "id",
                title: "title",
                content: "content",
                rating: 5,
                productId: "productId",
                userId: "userId"
            })).to.be.true;

            responseHandler.created.restore();
            reviewModel.prototype.save.restore();
        });

        it("should return 400 when missing title", async () => {
            const req = {
                body: {
                    content: "content",
                    rating: 5,
                    productId: "productId",
                    userId: "userId"
                }
            };

            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };

            sinon.stub(responseHandler, "badrequest").returns(res);

            await reviewController.create(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith("missing title")).to.be.true;

            responseHandler.badrequest.restore();
        });

        it("should return 400 when missing content", async () => {
            const req = {
                body: {
                    title: "title",
                    rating: 5,
                    productId: "productId",
                    userId: "userId"
                }
            };

            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };

            sinon.stub(responseHandler, "badrequest").returns(res);

            await reviewController.create(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith("missing content")).to.be.true;

            responseHandler.badrequest.restore();
        });

        it("should return 400 when missing rating", async () => {
            const req = {
                body: {
                    title: "title",
                    content: "content",
                    productId: "productId",
                    userId: "userId"
                }
            };

            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };

            sinon.stub(responseHandler, "badrequest").returns(res);

            await reviewController.create(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith("missing rating")).to.be.true;

            responseHandler.badrequest.restore();
        });
    });

    //unit test for reviewController.remove
    describe("remove", () => {
        it("should return 200 when review is found", async () => {
            const req = {
                params: {
                    reviewId: "reviewId"
                },
                user: {
                    id: "userId"
                }
            };

            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };

            sinon.stub(responseHandler, "ok").returns(res);

            sinon.stub(reviewModel, "findOneAndDelete").returns({
                _id: "reviewId",
                userId: "userId"
            });

            await reviewController.remove(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith("review deleted")).to.be.true;

            responseHandler.ok.restore();
            reviewModel.findOneAndDelete.restore();
        });

        it("should return 404 when review is not found", async () => {
            const req = {
                params: {
                    reviewId: "reviewId"
                },
                user: {
                    id: "userId"
                }
            };

            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };

            sinon.stub(responseHandler, "notfound").returns(res);

            sinon.stub(reviewModel, "findOneAndDelete").returns(null);

            await reviewController.remove(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith("review not found")).to.be.true;

            responseHandler.notfound.restore();
            reviewModel.findOneAndDelete.restore();
        });

        it("should return 403 when user is not authorized", async () => {
            const req = {
                params: {
                    reviewId: "reviewId"
                },
                user: {
                    id: "userId"
                }
            };

            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };

            sinon.stub(responseHandler, "forbidden").returns(res);

            sinon.stub(reviewModel, "findOneAndDelete").returns({
                _id: "reviewId",
                userId: "anotherUserId"
            });

            await reviewController.remove(req, res);

            expect(res.status.calledWith(403)).to.be.true;
            expect(res.json.calledWith("user not authorized")).to.be.true;

            responseHandler.forbidden.restore();
            reviewModel.findOneAndDelete.restore();
        });
    });

    //create unit test for reviewController.getReviewsOfUser
    describe("getReviewsOfUser", () => {
        it("should return 200 and reviews of user", async () => {
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

            sinon.stub(reviewModel, "find").returns([{
                _id: "reviewId",
                userId: "userId"
            }]);
            await reviewController.getReviewsOfUser(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith([{
                _id: "reviewId",
                userId: "userId"
            }])).to.be.true;

            responseHandler.ok.restore();
            reviewModel.find.restore();
        });

        it("should return 404 when user is not found", async () => {
            const req = {
                params: {
                    userId: "userId"
                }
            };

            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };

            sinon.stub(responseHandler, "notfound").returns(res);

            sinon.stub(reviewModel, "find").returns([]);

            await reviewController.getReviewsOfUser(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith("user not found")).to.be.true;

            responseHandler.notfound.restore();
            reviewModel.find.restore();
        });
    });
});
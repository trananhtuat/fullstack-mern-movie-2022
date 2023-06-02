// unit test for server/src/controllers/media.controller.js

import mediaController from "../../src/controllers/media.controller.js";
import responseHandler from "../../src/handlers/response.handler.js";
import tmdbApi from "../../src/tmdb/tmdb.api.js";
import sinon from "sinon";

describe("Media Controller", () => {
    // unit test for media.controller.getList
    describe("getList", () => {
        it("should return 200 and media data", async () => {
            const req = {
                params: {
                    mediaType: "mediaType",
                    mediaId: "mediaId",
                    listType: "listType"
                }
            };

            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };

            sinon.stub(responseHandler, "ok").returns(res);

            sinon.stub(tmdbApi, "getList").returns({
                id: "id",
                name: "name",
                description: "description",
                results: [{
                    id: "id",
                    title: "title",
                    poster_path: "poster_path",
                    backdrop_path: "backdrop_path"
                }]
            });

            await mediaController.getList(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({
                id: "id",
                name: "name",
                description: "description",
                results: [{
                    id: "id",
                    title: "title",
                    poster_path: "poster_path",
                    backdrop_path: "backdrop_path"
                }]
            })).to.be.true;

            responseHandler.ok.restore();
            tmdbApi.getList.restore();
        });

        it("should return 400 when missing mediaType", async () => {
            const req = {
                params: {
                    mediaId: "mediaId",
                    listType: "listType"
                }
            };

            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };

            sinon.stub(responseHandler, "error").returns(res);

            await mediaController.getList(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({
                message: "Missing mediaType"
            })).to.be.true;

            responseHandler.error.restore();
        });

        it("should return 400 when missing mediaId", async () => {
            const req = {
                params: {
                    mediaType: "mediaType",
                    listType: "listType"
                }
            };

            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };

            sinon.stub(responseHandler, "error").returns(res);

            await mediaController.getList(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({
                message: "Missing mediaId"
            })).to.be.true;

            responseHandler.error.restore();
        });

        it("should return 400 when missing listType", async () => {
            const req = {
                params: {
                    mediaType: "mediaType",
                    mediaId: "mediaId"
                }
            };

            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };

            sinon.stub(responseHandler, "error").returns(res);

            await mediaController.getList(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({
                message: "Missing listType"
            })).to.be.true;

            responseHandler.error.restore();
        });
    });

    // unit test for media.controller.getGenres
    describe("getGenres", () => {
        it("should return 200 and genres data", async () => {
            const req = {
                params: {
                    mediaType: "mediaType"
                }
            };

            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };

            sinon.stub(responseHandler, "ok").returns(res);

            sinon.stub(tmdbApi, "getGenres").returns([{
                id: "id",
                name: "name"
            }]);

            await mediaController.getGenres(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith([{
                id: "id",
                name: "name"
            }])).to.be.true;

            responseHandler.ok.restore();
            tmdbApi.getGenres.restore();
        });

        it("should return 400 when missing mediaType", async () => {
            const req = {
                params: {}
            };

            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };

            sinon.stub(responseHandler, "error").returns(res);

            await mediaController.getGenres(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({
                message: "Missing mediaType"
            })).to.be.true;

            responseHandler.error.restore();
        });
    });

    // unit test for media.controller.search
    describe("search", () => {
        it("should return 200 and search data", async () => {
            const req = {
                params: {
                    mediaType: "mediaType",
                    query: "query"
                }
            };

            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };

            sinon.stub(responseHandler, "ok").returns(res);

            sinon.stub(tmdbApi, "search").returns([{
                id: "id",
                title: "title",
                poster_path: "poster_path",
                backdrop_path: "backdrop_path"
            }]);

            await mediaController.search(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith([{
                id: "id",
                title: "title",
                poster_path: "poster_path",
                backdrop_path: "backdrop_path"
            }])).to.be.true;

            responseHandler.ok.restore();
            tmdbApi.search.restore();
        });

        it("should return 400 when missing mediaType", async () => {
            const req = {
                params: {
                    query: "query"
                }
            };

            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };

            sinon.stub(responseHandler, "error").returns(res);

            await mediaController.search(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({
                message: "Missing mediaType"
            })).to.be.true;

            responseHandler.error.restore();
        });

        it("should return 400 when missing query", async () => {
            const req = {
                params: {
                    mediaType: "mediaType"
                }
            };

            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };

            sinon.stub(responseHandler, "error").returns(res);

            await mediaController.search(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({
                message: "Missing query"
            })).to.be.true;

            responseHandler.error.restore();
        });
    });

    // unit test for media.controller.getDetail
    describe("getDetail", () => {
        it("should return 200 and detail data", async () => {
            const req = {
                params: {
                    mediaType: "mediaType",
                    mediaId: "mediaId"
                }
            };

            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };

            sinon.stub(responseHandler, "ok").returns(res);

            sinon.stub(tmdbApi, "getDetail").returns({
                id: "id",
                title: "title",
                poster_path: "poster_path",
                backdrop_path: "backdrop_path",
                release_date: "release_date",
                overview: "overview",
                genres: [{
                    id: "id",
                    name: "name"
                }]
            });

            await mediaController.getDetail(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({
                id: "id",
                title: "title",
                poster_path: "poster_path",
                backdrop_path: "backdrop_path",
                release_date: "release_date",
                overview: "overview",
                genres: [{
                    id: "id",
                    name: "name"
                }]
            })).to.be.true;

            responseHandler.ok.restore();
            tmdbApi.getDetail.restore();
        });

        it("should return 400 when missing mediaType", async () => {
            const req = {
                params: {
                    mediaId: "mediaId"
                }
            };

            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };

            sinon.stub(responseHandler, "error").returns(res);

            await mediaController.getDetail(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({
                message: "Missing mediaType"
            })).to.be.true;

            responseHandler.error.restore();
        });

        it("should return 400 when missing mediaId", async () => {
            const req = {
                params: {
                    mediaType: "mediaType"
                }
            };

            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };

            sinon.stub(responseHandler, "error").returns(res);

            await mediaController.getDetail(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({
                message: "Missing mediaId"
            })).to.be.true;

            responseHandler.error.restore();
        });
    });
});

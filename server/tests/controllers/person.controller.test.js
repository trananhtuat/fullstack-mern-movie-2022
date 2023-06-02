// create unit test from src/controllers/person.controller.js
//fix import
import responseHandler from "../../src/handlers/response.handler.js";
import tmdbApi from "../../src/tmdb/tmdb.api.js";
import sinon from "sinon";

describe("Person Controller", () => {
    //unit test forr person.controller.personDetail
    describe("personDetail", () => {
        it("should return 200 and person data", async () => {
            const req = {
                params: {
                    personId: "personId"
                }
            };

            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };

            sinon.stub(responseHandler, "ok").returns(res);

            sinon.stub(tmdbApi, "personDetail").returns({
                id: "id",
                name: "name",
                biography: "biography",
                birthday: "birthday",
                place_of_birth: "place_of_birth",
                profile_path: "profile_path"
            });

            await personController.personDetail(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({
                id: "id",
                name: "name",
                biography: "biography",
                birthday: "birthday",
                place_of_birth: "place_of_birth",
                profile_path: "profile_path"
            })).to.be.true;

            responseHandler.ok.restore();
            tmdbApi.personDetail.restore();
        });

        it("should return 400 when missing personId", async () => {
            const req = {
                params: {}
            };

            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };

            sinon.stub(responseHandler, "error").returns(res);

            await personController.personDetail(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({
                message: "Missing personId"
            })).to.be.true;

            responseHandler.error.restore();
        });

        it("should return 500 when tmdbApi.personDetail throw error", async () => {
            const req = {
                params: {
                    personId: "personId"
                }
            };

            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };

            sinon.stub(responseHandler, "error").returns(res);

            sinon.stub(tmdbApi, "personDetail").throws();

            await personController.personDetail(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({
                message: "Error"
            })).to.be.true;

            responseHandler.error.restore();
            tmdbApi.personDetail.restore();
        });
    });

    //unit test for person.controller.personMedias
    describe("personMedias", () => {
        it("should return 200 and medias data", async () => {
            const req = {
                params: {
                    personId: "personId"
                }
            };

            const res = {
                status: sinon.spy(),
                json: sinon.spy()
            };

            sinon.stub(responseHandler, "ok").returns(res);

            sinon.stub(tmdbApi, "personMedias").returns([{
                id: "id",
                title: "title",
                poster_path: "poster_path",
                media_type: "media_type"
            }]);

            await personController.personMedias(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith([{
                id: "id",
                title: "title",
                poster_path: "poster_path",
                media_type: "media_type"
            }])).to.be.true;

            responseHandler.ok.restore();
            tmdbApi.personMedias.restore();
        });

    it("should return 400 when missing personId", async () => {
        const req = {
            params: {}
        };

        const res = {
            status: sinon.spy(),
            json: sinon.spy()
        };

        sinon.stub(responseHandler, "error").returns(res);

        await personController.personMedias(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({
            message: "Missing personId"
        })).to.be.true;

        responseHandler.error.restore();
    });

    it("should return 500 when tmdbApi.personMedias throw error", async () => {
        const req = {
            params: {
                personId: "personId"
            }
        };

        const res = {
            status: sinon.spy(),
            json: sinon.spy()
        };

        sinon.stub(responseHandler, "error").returns(res);

        sinon.stub(tmdbApi, "personMedias").throws();

        await personController.personMedias(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWith({
            message: "Error"
        })).to.be.true;

        responseHandler.error.restore();
        tmdbApi.personMedias.restore();
    });
});
});

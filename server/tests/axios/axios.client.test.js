import axios from "axios";
import sinon from "sinon";
import { expect } from "chai";
import axiosClient from "../../src/axios/axios.client.js";

describe("Axios client", () => {
  describe("get", () => {
    it("should make a GET request and return the response data", async () => {
      const responseData = { message: "Success" };
      const axiosGetStub = sinon.stub(axios, "get").resolves({ data: responseData });

      const url = "https://example.com/api";
      const result = await axiosClient.get(url);

      expect(axiosGetStub.calledOnceWith(url, {
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "identity"
        }
      })).to.be.true;
      expect(result).to.deep.equal(responseData);

      axiosGetStub.restore();
    });

    it("should handle errors and throw an exception", async () => {
      const error = new Error("Request failed");
      const axiosGetStub = sinon.stub(axios, "get").rejects(error);

      const url = "https://example.com/api";
      try {
        await axiosClient.get(url);
      } catch (err) {
        expect(axiosGetStub.calledOnceWith(url, {
          headers: {
            Accept: "application/json",
            "Accept-Encoding": "identity"
          }
        })).to.be.true;
        expect(err).to.equal(error);
      }

      axiosGetStub.restore();
    });
  });
});

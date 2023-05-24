import axios from "axios";
import axiosClient from "../../src/axios/axios.client.js";


jest.mock("axios");

describe("axios.client", () => {
  it("should make a GET request using axios and return the response data", async () => {
    // Set up the mock response
    const mockData = { message: "Mocked response" };
    const mockResponse = { data: mockData };

    // Mock the axios get method and provide the desired response
    axios.get.mockResolvedValue(mockResponse);

    // Define the URL to be used in the test
    const url = "https://example.com/api/data";

    // Call the `get` method from axiosClient
    const result = await axiosClient.get(url);

    // Assert that axios.get was called with the correct URL
    expect(axios.get).toHaveBeenCalledWith(url, {
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "identity",
      },
    });

    // Assert that the result matches the mock response data
    expect(result).toEqual(mockData);
  });
});

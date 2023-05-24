import request from "supertest";
import express from "express";
import { body } from "express-validator";
import userRoute from "../../src/routes/user.route.js";
import userController from "../../src/controllers/user.controller.js";
import favoriteController from "../../src/controllers/favorite.controller.js";
import tokenMiddleware from "../../src/middlewares/token.middleware.js";
import requestHandler from "../../src/handlers/request.handler.js";
import userModel from "../../src/models/user.model.js";

const app = express();
app.use(express.json());
app.use("/", userRoute);

jest.mock("../../src/controllers/user.controller.js", () => ({
  signup: jest.fn(),
  signin: jest.fn(),
  updatePassword: jest.fn(),
  getInfo: jest.fn(),
}));

jest.mock("../../src/controllers/favorite.controller.js", () => ({
  getFavoritesOfUser: jest.fn(),
  addFavorite: jest.fn(),
  removeFavorite: jest.fn(),
}));

jest.mock("../../src/middlewares/token.middleware.js", () => ({
  auth: jest.fn(),
}));

jest.mock("../../src/handlers/request.handler.js", () => ({
  validate: jest.fn(),
}));

describe("User Routes", () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });
  jest.setTimeout(150000);

  it("should call userController.signup when POST /signup", async () => {
    const mockRequest = {
      body: {
        username: "testuser",
        password: "testpassword",
        confirmPassword: "testpassword",
        displayName: "Test User",
      },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    userController.signup.mockResolvedValueOnce({ message: "User signed up successfully" });

    await request(app).post("/signup").send(mockRequest.body);

    expect(userController.signup).toHaveBeenCalledWith(mockRequest, mockResponse);
  });

  it("should call userController.signin when POST /signin", async () => {
    const mockRequest = {
      body: {
        username: "testuser",
        password: "testpassword",
      },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    userController.signin.mockResolvedValueOnce({ token: "testtoken" });

    await request(app).post("/signin").send(mockRequest.body);

    expect(userController.signin).toHaveBeenCalledWith(mockRequest, mockResponse);
  });

  it("should call userController.updatePassword when PUT /update-password", async () => {
    const mockRequest = {
      body: {
        password: "oldpassword",
        newPassword: "newpassword",
        confirmNewPassword: "newpassword",
      },
      user: { _id: "testuserid" },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    tokenMiddleware.auth.mockImplementationOnce((req, res, next) => next());

    userController.updatePassword.mockResolvedValueOnce({ message: "Password updated successfully" });

    await request(app)
      .put("/update-password")
      .set("Authorization", "Bearer testtoken")
      .send(mockRequest.body);

    expect(tokenMiddleware.auth).toHaveBeenCalled();
    expect(userController.updatePassword).toHaveBeenCalledWith(mockRequest, mockResponse);
  });

  it("should call userController.getInfo when GET /info", async () => {
    const mockRequest = {
      user: { _id: "testuserid" },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    tokenMiddleware.auth.mockImplementationOnce((req, res, next) => next());

    userController.getInfo.mockResolvedValueOnce({ username: "testuser" });

    await request(app)
      .get("/info")
      .set("Authorization", "Bearer testtoken");

    expect(tokenMiddleware.auth).toHaveBeenCalled();
    expect(userController.getInfo).toHaveBeenCalledWith(mockRequest, mockResponse);
  });

  it("should call favoriteController.getFavoritesOfUser when GET /favorites", async () => {
    const mockRequest = {
      user: { _id: "testuserid" },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    tokenMiddleware.auth.mockImplementationOnce((req, res, next) => next());

    favoriteController.getFavoritesOfUser.mockResolvedValueOnce([]);

    await request(app)
      .get("/favorites")
      .set("Authorization", "Bearer testtoken");

    expect(tokenMiddleware.auth).toHaveBeenCalled();
    expect(favoriteController.getFavoritesOfUser).toHaveBeenCalledWith(mockRequest, mockResponse);
  });

  it("should call favoriteController.addFavorite when POST /favorites", async () => {
    const mockRequest = {
      body: {
        mediaType: "movie",
        mediaId: "testmediaid",
        mediaTitle: "Test Movie",
        mediaPoster: "movie_poster.jpg",
        mediaRate: 4.5,
      },
      user: { _id: "testuserid" },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    tokenMiddleware.auth.mockImplementationOnce((req, res, next) => next());

    favoriteController.addFavorite.mockResolvedValueOnce({ message: "Favorite added successfully" });

    await request(app)
      .post("/favorites")
      .set("Authorization", "Bearer testtoken")
      .send(mockRequest.body);

    expect(tokenMiddleware.auth).toHaveBeenCalled();
    expect(favoriteController.addFavorite).toHaveBeenCalledWith(mockRequest, mockResponse);
  });

  it("should call favoriteController.removeFavorite when DELETE /favorites/:favoriteId", async () => {
    const mockRequest = {
      params: {
        favoriteId: "testfavoriteid",
      },
      user: { _id: "testuserid" },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    tokenMiddleware.auth.mockImplementationOnce((req, res, next) => next());

    favoriteController.removeFavorite.mockResolvedValueOnce({ message: "Favorite removed successfully" });

    await request(app)
      .delete("/favorites/testfavoriteid")
      .set("Authorization", "Bearer testtoken");

    expect(tokenMiddleware.auth).toHaveBeenCalled();
    expect(favoriteController.removeFavorite).toHaveBeenCalledWith(mockRequest, mockResponse);
  });
});

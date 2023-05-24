import userController from "../../src/controllers/user.controller.js";
import userModel from "../../src/models/user.model.js";
import responseHandler from "../../src/handlers/response.handler.js";
import jsonwebtoken from "jsonwebtoken";

jest.mock("../../src/models/user.model.js");
jest.mock("../../src/handlers/response.handler.js");
jest.mock("jsonwebtoken");

describe("User Controller", () => {
  describe("signup", () => {
    let req, res;

    beforeEach(() => {
      req = {
        body: {
          username: "testuser",
          password: "testpassword",
          displayName: "Test User",
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should create a new user and return a token", async () => {
      const mockUser = {
        id: "user123",
        displayName: "Test User",
        username: "testuser",
        setPassword: jest.fn(),
        save: jest.fn(),
      };
      userModel.findOne.mockResolvedValue(null);
      userModel.mockReturnValue(mockUser);
      jsonwebtoken.sign.mockReturnValue("testtoken");

      await userController.signup(req, res);

      expect(userModel.findOne).toHaveBeenCalledWith({ username: "testuser" });
      expect(userModel).toHaveBeenCalled();
      expect(mockUser.setPassword).toHaveBeenCalledWith("testpassword");
      expect(mockUser.save).toHaveBeenCalled();
      expect(jsonwebtoken.sign).toHaveBeenCalledWith(
        { data: "user123" },
        process.env.TOKEN_SECRET,
        { expiresIn: "24h" }
      );
      expect(responseHandler.created).toHaveBeenCalledWith(res, {
        token: "testtoken",
        ...mockUser._doc,
        id: "user123",
      });
    });

    it("should return a bad request error if username is already used", async () => {
      userModel.findOne.mockResolvedValue({ username: "testuser" });

      await userController.signup(req, res);

      expect(userModel.findOne).toHaveBeenCalledWith({ username: "testuser" });
      expect(responseHandler.badrequest).toHaveBeenCalledWith(
        res,
        "username already used"
      );
      expect(userModel).not.toHaveBeenCalled();
      expect(jsonwebtoken.sign).not.toHaveBeenCalled();
      expect(responseHandler.created).not.toHaveBeenCalled();
    });

    it("should return an error response on exception", async () => {
      userModel.findOne.mockRejectedValue(new Error("Database error"));

      await userController.signup(req, res);

      expect(responseHandler.error).toHaveBeenCalledWith(res);
    });
  });

  
    describe("signin", () => {
      let req, res;
  
      beforeEach(() => {
        req = {
          body: {
            username: "testuser",
            password: "testpassword",
          },
        };
        res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
      });
  
      afterEach(() => {
        jest.clearAllMocks();
      });
  
      it("should authenticate the user and return a token", async () => {
        const mockUser = {
          id: "user123",
          displayName: "Test User",
          username: "testuser",
          select: jest.fn().mockReturnThis(),
          validPassword: jest.fn().mockReturnValue(true),
        };
        userModel.findOne.mockResolvedValue(mockUser);
        jsonwebtoken.sign.mockReturnValue("testtoken");
  
        await userController.signin(req, res);
  
        expect(userModel.findOne).toHaveBeenCalledWith({ username: "testuser" });
        expect(mockUser.select).toHaveBeenCalledWith(
          "username password salt id displayName"
        );
        expect(mockUser.validPassword).toHaveBeenCalledWith("testpassword");
        expect(jsonwebtoken.sign).toHaveBeenCalledWith(
          { data: "user123" },
          process.env.TOKEN_SECRET,
          { expiresIn: "24h" }
        );
        expect(mockUser.password).toBeUndefined();
        expect(mockUser.salt).toBeUndefined();
        expect(responseHandler.created).toHaveBeenCalledWith(res, {
          token: "testtoken",
          ...mockUser._doc,
          id: "user123",
        });
      });
  
      it("should return a bad request error if user does not exist", async () => {
        userModel.findOne.mockResolvedValue(null);
  
        await userController.signin(req, res);
  
        expect(userModel.findOne).toHaveBeenCalledWith({ username: "testuser" });
        expect(responseHandler.badrequest).toHaveBeenCalledWith(
          res,
          "User not exist"
        );
        expect(jsonwebtoken.sign).not.toHaveBeenCalled();
        expect(responseHandler.created).not.toHaveBeenCalled();
      });
  
      it("should return a bad request error if password is incorrect", async () => {
        const mockUser = {
          validPassword: jest.fn().mockReturnValue(false),
        };
        userModel.findOne.mockResolvedValue(mockUser);
  
        await userController.signin(req, res);
  
        expect(mockUser.validPassword).toHaveBeenCalledWith("testpassword");
        expect(responseHandler.badrequest).toHaveBeenCalledWith(
          res,
          "Wrong password"
        );
        expect(jsonwebtoken.sign).not.toHaveBeenCalled();
        expect(responseHandler.created).not.toHaveBeenCalled();
      });
  
      it("should return an error response on exception", async () => {
        userModel.findOne.mockRejectedValue(new Error("Database error"));
  
        await userController.signin(req, res);
  
        expect(responseHandler.error).toHaveBeenCalledWith(res);
      });
    });
  
    describe("updatePassword", () => {
      let req, res;
  
      beforeEach(() => {
        req = {
          body: {
            password: "oldpassword",
            newPassword: "newpassword",
          },
          user: { id: "user123" },
        };
        res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
      });
  
      afterEach(() => {
        jest.clearAllMocks();
      });
  
      it("should update the user's password", async () => {
        const mockUser = {
          validPassword: jest.fn().mockReturnValue(true),
          setPassword: jest.fn(),
          save: jest.fn(),
        };
        userModel.findById.mockResolvedValue(mockUser);
  
        await userController.updatePassword(req, res);
  
        expect(userModel.findById).toHaveBeenCalledWith("user123");
        expect(mockUser.validPassword).toHaveBeenCalledWith("oldpassword");
        expect(mockUser.setPassword).toHaveBeenCalledWith("newpassword");
        expect(mockUser.save).toHaveBeenCalled();
        expect(responseHandler.ok).toHaveBeenCalledWith(res);
      });
  
      it("should return an unauthorized error if user does not exist", async () => {
        userModel.findById.mockResolvedValue(null);
  
        await userController.updatePassword(req, res);
  
        expect(userModel.findById).toHaveBeenCalledWith("user123");
        expect(responseHandler.unauthorize).toHaveBeenCalledWith(res);
        expect(mockUser.validPassword).not.toHaveBeenCalled();
        expect(mockUser.setPassword).not.toHaveBeenCalled();
        expect(mockUser.save).not.toHaveBeenCalled();
        expect(responseHandler.ok).not.toHaveBeenCalled();
      });
  
      it("should return a bad request error if the old password is incorrect", async () => {
        const mockUser = {
          validPassword: jest.fn().mockReturnValue(false),
        };
        userModel.findById.mockResolvedValue(mockUser);
  
        await userController.updatePassword(req, res);
  
        expect(mockUser.validPassword).toHaveBeenCalledWith("oldpassword");
        expect(responseHandler.badrequest).toHaveBeenCalledWith(
          res,
          "Wrong password"
        );
        expect(mockUser.setPassword).not.toHaveBeenCalled();
        expect(mockUser.save).not.toHaveBeenCalled();
        expect(responseHandler.ok).not.toHaveBeenCalled();
      });
  
      it("should return an error response on exception", async () => {
        userModel.findById.mockRejectedValue(new Error("Database error"));
  
        await userController.updatePassword(req, res);
  
        expect(responseHandler.error).toHaveBeenCalledWith(res);
      });
    });
  
    describe("getInfo", () => {
      let req, res;
  
      beforeEach(() => {
        req = {
          user: { id: "user123" },
        };
        res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
      });
  
      afterEach(() => {
        jest.clearAllMocks();
      });
  
      it("should get the user's information", async () => {
        const mockUser = {
          displayName: "Test User",
        };
        userModel.findById.mockResolvedValue(mockUser);
  
        await userController.getInfo(req, res);
  
        expect(userModel.findById).toHaveBeenCalledWith("user123");
        expect(responseHandler.ok).toHaveBeenCalledWith(res, mockUser);
      });
  
      it("should return a not found error if user does not exist", async () => {
        userModel.findById.mockResolvedValue(null);
  
        await userController.getInfo(req, res);
  
        expect(userModel.findById).toHaveBeenCalledWith("user123");
        expect(responseHandler.notfound).toHaveBeenCalledWith(res);
        expect(responseHandler.ok).not.toHaveBeenCalled();
      });
  
      it("should return an error response on exception", async () => {
        userModel.findById.mockRejectedValue(new Error("Database error"));
  
        await userController.getInfo(req, res);
  
        expect(responseHandler.error).toHaveBeenCalledWith(res);
      });
    });
});

import jsonwebtoken from 'jsonwebtoken';
import tokenMiddleware from '../../src/middlewares/token.middleware.js';
import responseHandler from '../../src/handlers/response.handler.js';
import userModel from '../../src/models/user.model.js';

jest.mock('jsonwebtoken');
jest.mock('../../src/handlers/response.handler.js');
jest.mock('../../src/models/user.model.js');

describe('Token Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {
        authorization: 'Bearer token123'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should decode and verify the token', () => {
    const tokenData = {
      data: 'user-id'
    };

    jsonwebtoken.verify.mockReturnValueOnce(tokenData);

    tokenMiddleware.tokenDecode(req);

    expect(jsonwebtoken.verify).toHaveBeenCalledWith('token123', process.env.TOKEN_SECRET);
  });

  it('should return the decoded token data if a valid token is provided', () => {
    const tokenData = {
      data: 'user-id'
    };

    jsonwebtoken.verify.mockReturnValueOnce(tokenData);

    const decodedToken = tokenMiddleware.tokenDecode(req);

    expect(decodedToken).toEqual(tokenData);
  });

  it('should return false if no token is provided', () => {
    req.headers.authorization = undefined;

    const decodedToken = tokenMiddleware.tokenDecode(req);

    expect(decodedToken).toBe(false);
  });

  it('should return false if an invalid token is provided', () => {
    jsonwebtoken.verify.mockImplementation(() => {
      throw new Error();
    });

    const decodedToken = tokenMiddleware.tokenDecode(req);

    expect(decodedToken).toBe(false);
  });

  it('should authenticate the user and set it in the request object', async () => {
    const tokenData = {
      data: 'user-id'
    };

    jsonwebtoken.verify.mockReturnValueOnce(tokenData);

    const user = {
      _id: 'user-id',
      username: 'testuser'
    };

    userModel.findById.mockResolvedValueOnce(user);

    await tokenMiddleware.auth(req, res, next);

    expect(userModel.findById).toHaveBeenCalledWith('user-id');
    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if no token is provided', async () => {
    req.headers.authorization = undefined;

    await tokenMiddleware.auth(req, res, next);

    expect(responseHandler.unauthorize).toHaveBeenCalledWith(res);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if an invalid token is provided', async () => {
    jsonwebtoken.verify.mockImplementation(() => {
      throw new Error();
    });

    await tokenMiddleware.auth(req, res, next);

    expect(responseHandler.unauthorize).toHaveBeenCalledWith(res);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if the user is not found', async () => {
    const tokenData = {
      data: 'user-id'
    };

    jsonwebtoken.verify.mockReturnValueOnce(tokenData);

    userModel.findById.mockResolvedValueOnce(null);

    await tokenMiddleware.auth(req, res, next);

    expect(responseHandler.unauthorize).toHaveBeenCalledWith(res);
    expect(next).not.toHaveBeenCalled();
  });
});

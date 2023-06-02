import { expect } from 'chai';
import sinon from 'sinon';
import jsonwebtoken from 'jsonwebtoken';
import responseHandler from '../../src/handlers/response.handler.js';
import userModel from '../../src/models/user.model.js';
import tokenMiddleware from '../../src/middlewares/token.middleware.js';

describe('Token Middleware', () => {
  describe('auth', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
      req = {
        headers: {},
      };
      res = {};
      next = sinon.spy();
    });

    it('should call responseHandler.unauthorize if token is missing', async () => {
      const unauthorizeStub = sinon.stub(responseHandler, 'unauthorize');

      await tokenMiddleware.auth(req, res, next);

      expect(unauthorizeStub.calledOnce).to.be.true;
      expect(next.called).to.be.false;

      unauthorizeStub.restore();
    });

    it('should call responseHandler.unauthorize if token is invalid', async () => {
      req.headers['authorization'] = 'Bearer invalidToken';
      const unauthorizeStub = sinon.stub(responseHandler, 'unauthorize');

      await tokenMiddleware.auth(req, res, next);

      expect(unauthorizeStub.calledOnce).to.be.true;
      expect(next.called).to.be.false;

      unauthorizeStub.restore();
    });

    it('should call responseHandler.unauthorize if user is not found', async () => {
      const token = jsonwebtoken.sign({ data: 'userId' }, 'invalidSecret');
      req.headers['authorization'] = `Bearer ${token}`;
      const unauthorizeStub = sinon.stub(responseHandler, 'unauthorize');
      sinon.stub(userModel, 'findById').resolves(null);

      await tokenMiddleware.auth(req, res, next);

      expect(unauthorizeStub.calledOnce).to.be.true;
      expect(next.called).to.be.false;

      unauthorizeStub.restore();
      userModel.findById.restore();
    });
      
  });

  describe('tokenDecode', () => {
    it('should return false if bearerHeader is missing', () => {
      const req = {
        headers: {},
      };

      const result = tokenMiddleware.tokenDecode(req);

      expect(result).to.be.false;
    });

    it('should return false if token is invalid', () => {
      const req = {
        headers: {
          'authorization': 'Bearer invalidToken',
        },
      };

      const result = tokenMiddleware.tokenDecode(req);

      expect(result).to.be.false;
    });

    it('should return false if token is expired', () => {
      const expiredToken = jsonwebtoken.sign({ data: 'userId' }, 'invalidSecret', { expiresIn: '0s' });
      const req = {
        headers: {
          'authorization': `Bearer ${expiredToken}`,
        },
      };

      const result = tokenMiddleware.tokenDecode(req);

      expect(result).to.be.false;
    });
      
  });
});

import { expect } from 'chai';
import sinon from 'sinon';
import jsonwebtoken from 'jsonwebtoken';
import userModel from '../../src/models/user.model.js';
import responseHandler from '../../src/handlers/response.handler.js';
import userController from '../../src/controllers/user.controller.js';

describe('User Controller', () => {
  describe('signup', () => {
    let req;
    let res;

    beforeEach(() => {
      req = {
        body: {
            username: 'testuser',
            password: 'testpassword',
            confirmPassword: 'testpassword',
            displayName: 'Test User',
          },
      };
      res = {};
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should create a new user and return a token and user details', async () => {
      sinon.stub(userModel, 'findOne').resolves(null);
      sinon.stub(userModel.prototype, 'save').resolves();
      sinon.stub(jsonwebtoken, 'sign').returns('testtoken');
      const createdStub = sinon.stub(responseHandler, 'created');

      await userController.signup(req, res);

      expect(createdStub.calledOnce).to.be.true;
      expect(createdStub.firstCall.args[0]).to.equal(res);
      expect(createdStub.firstCall.args[1].token).to.equal('testtoken');
      expect(createdStub.firstCall.args[1].username).to.equal('testuser');
      expect(createdStub.firstCall.args[1].displayName).to.equal('Test User');

      sinon.assert.calledOnce(userModel.findOne);
      sinon.assert.calledOnce(userModel.prototype.save);
      sinon.assert.calledOnce(jsonwebtoken.sign);
      sinon.assert.calledOnce(responseHandler.created);
    });

    it('should return a bad request response if the username is already used', async () => {
      sinon.stub(userModel, 'findOne').resolves({ username: 'testuser' });
      const badRequestStub = sinon.stub(responseHandler, 'badrequest');

      await userController.signup(req, res);

      expect(badRequestStub.calledOnce).to.be.true;
      expect(badRequestStub.firstCall.args[0]).to.equal(res);

      sinon.assert.calledOnce(userModel.findOne);
      sinon.assert.calledOnce(responseHandler.badrequest);
    });

    it('should return an error response if an error occurs during signup', async () => {
      sinon.stub(userModel, 'findOne').throws();
      const errorStub = sinon.stub(responseHandler, 'error');

      await userController.signup(req, res);

      expect(errorStub.calledOnce).to.be.true;
      expect(errorStub.firstCall.args[0]).to.equal(res);

      sinon.assert.calledOnce(userModel.findOne);
      sinon.assert.calledOnce(responseHandler.error);
    });
  });

  describe('signin', () => {
    let req;
    let res;
  
    beforeEach(() => {
      req = {
        body: {
            username: 'testuser',
            password: 'testpassword',
            confirmPassword: 'testpassword',
            displayName: 'Test User',
          },
      };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
    });
  
    afterEach(() => {
      sinon.restore();
    });
  
    it('should return a token and user details if signin is successful', async () => {
      const user = {
        username: 'testuser',
        password: 'testpassword',
        salt: 'salt',
        id: 'userid',
        displayName: 'Test User',
        validPassword: sinon.stub().returns(true),
      };
      sinon.stub(userModel, 'findOne').resolves(user);
      sinon.stub(jsonwebtoken, 'sign').returns('testtoken');
      const createdStub = sinon.stub(responseHandler, 'created');
  
      await userController.signin(req, res);
  
      expect(createdStub.calledOnce).to.be.true;
      expect(createdStub.firstCall.args[0]).to.equal(res);
      expect(createdStub.firstCall.args[1].token).to.equal('testtoken');
      expect(createdStub.firstCall.args[1].username).to.equal('testuser');
      expect(createdStub.firstCall.args[1].displayName).to.equal('Test User');
  
      sinon.assert.calledOnce(userModel.findOne);
      sinon.assert.calledOnce(jsonwebtoken.sign);
      sinon.assert.calledOnce(responseHandler.created);
    });
  
    it('should return a bad request response if the user does not exist', async () => {
      sinon.stub(userModel, 'findOne').resolves(null);
      const badRequestStub = sinon.stub(responseHandler, 'badrequest');
  
      await userController.signin(req, res);
  
      expect(badRequestStub.calledOnce).to.be.true;
      expect(badRequestStub.firstCall.args[0]).to.equal(res);
      expect(badRequestStub.firstCall.args[1]).to.equal('User does not exist');
  
      sinon.assert.calledOnce(userModel.findOne);
      sinon.assert.calledOnce(responseHandler.badrequest);
    });
  
    it('should return a bad request response if the password is wrong', async () => {
      const user = {
        username: 'testuser',
        password: 'hashedpassword',
        salt: 'salt',
        id: 'userid',
        displayName: 'Test User',
        validPassword: sinon.stub().returns(false),
      };
      sinon.stub(userModel, 'findOne').resolves(user);
      const badRequestStub = sinon.stub(responseHandler, 'badrequest');
  
      await userController.signin(req, res);
  
      expect(badRequestStub.calledOnce).to.be.true;
      expect(badRequestStub.firstCall.args[0]).to.equal(res);
      expect(badRequestStub.firstCall.args[1]).to.equal('Wrong password');
  
      sinon.assert.calledOnce(userModel.findOne);
      sinon.assert.calledOnce(responseHandler.badrequest);
    });
  
    it('should return an error response if an error occurs during signin', async () => {
      sinon.stub(userModel, 'findOne').throws();
      const errorStub = sinon.stub(responseHandler, 'error');
  
      await userController.signin(req, res);
  
      expect(errorStub.calledOnce).to.be.true;
      expect(errorStub.firstCall.args[0]).to.equal(res);
  
      sinon.assert.calledOnce(userModel.findOne);
      sinon.assert.calledOnce(responseHandler.error);
    });
  });
  
  describe('updatePassword', () => {
    let req;
    let res;
  
    beforeEach(() => {
      req = {
        body: {
          password: 'testpassword',
          newPassword: 'newpassword',
        },
        user: {
          id: 'userid',
        },
      };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
    });
  
    afterEach(() => {
      sinon.restore();
    });
  
    it('should update the user password if the current password is correct', async () => {
      const user = {
        password: 'testpassword',
        id: 'userid',
        salt: 'salt',
        validPassword: sinon.stub().returns(true),
        save: sinon.stub().resolves(),
      };
      sinon.stub(userModel, 'findById').resolves(user);
      const okStub = sinon.stub(responseHandler, 'ok');
  
      await userController.updatePassword(req, res);
  
      expect(okStub.calledOnce).to.be.true;
      expect(okStub.firstCall.args[0]).to.equal(res);
  
      sinon.assert.calledOnce(userModel.findById);
      sinon.assert.calledOnce(responseHandler.ok);
      sinon.assert.calledOnce(user.save);
    });
  
    it('should return a bad request response if the current password is wrong', async () => {
      const user = {
        password: 'hashedpassword',
        id: 'userid',
        salt: 'salt',
        validPassword: sinon.stub().returns(false),
      };
      sinon.stub(userModel, 'findById').resolves(user);
      const badRequestStub = sinon.stub(responseHandler, 'badrequest');
  
      await userController.updatePassword(req, res);
  
      expect(badRequestStub.calledOnce).to.be.true;
      expect(badRequestStub.firstCall.args[0]).to.equal(res);
      expect(badRequestStub.firstCall.args[1]).to.equal('Wrong password');
  
      sinon.assert.calledOnce(userModel.findById);
      sinon.assert.calledOnce(responseHandler.badrequest);
    });
  
    it('should return an unauthorized response if the user does not exist', async () => {
      sinon.stub(userModel, 'findById').resolves(null);
      const unauthorizedStub = sinon.stub(responseHandler, 'unauthorize');
  
      await userController.updatePassword(req, res);
  
      expect(unauthorizedStub.calledOnce).to.be.true;
      expect(unauthorizedStub.firstCall.args[0]).to.equal(res);
  
      sinon.assert.calledOnce(userModel.findById);
      sinon.assert.calledOnce(responseHandler.unauthorize);
    });
  
    it('should return an error response if an error occurs during password update', async () => {
      const user = {
        password: 'testpassword',
        id: 'userid',
        salt: 'salt',
        validPassword: sinon.stub().returns(true),
        save: sinon.stub().throws(),
      };
      sinon.stub(userModel, 'findById').resolves(user);
      const errorStub = sinon.stub(responseHandler, 'error');
  
      await userController.updatePassword(req, res);
  
      expect(errorStub.calledOnce).to.be.true;
      expect(errorStub.firstCall.args[0]).to.equal(res);
  
      sinon.assert.calledOnce(userModel.findById);
      sinon.assert.calledOnce(responseHandler.error);
    });
  });
  
  describe('getInfo', () => {
    let req;
    let res;
  
    beforeEach(() => {
      req = {
        user: {
          id: 'userid',
        },
      };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
    });
  
    afterEach(() => {
      sinon.restore();
    });
  
    it('should return the user information if the user exists', async () => {
      const user = {
        username: 'testuser',
        displayName: 'Test User',
      };
      sinon.stub(userModel, 'findById').resolves(user);
      const okStub = sinon.stub(responseHandler, 'ok');
  
      await userController.getInfo(req, res);
  
      expect(okStub.calledOnce).to.be.true;
      expect(okStub.firstCall.args[0]).to.equal(res);
      expect(okStub.firstCall.args[1]).to.deep.equal(user);
  
      sinon.assert.calledOnce(userModel.findById);
      sinon.assert.calledOnce(responseHandler.ok);
    });
  
    it('should return an unauthorized response if the user does not exist', async () => {
      sinon.stub(userModel, 'findById').resolves(null);
      const unauthorizedStub = sinon.stub(responseHandler, 'unauthorize');
  
      await userController.getInfo(req, res);
  
      expect(unauthorizedStub.calledOnce).to.be.true;
      expect(unauthorizedStub.firstCall.args[0]).to.equal(res);
  
      sinon.assert.calledOnce(userModel.findById);
      sinon.assert.calledOnce(responseHandler.unauthorize);
    });
  
    it('should return an error response if an error occurs during user retrieval', async () => {
      sinon.stub(userModel, 'findById').throws();
      const errorStub = sinon.stub(responseHandler, 'error');
  
      await userController.getInfo(req, res);
  
      expect(errorStub.calledOnce).to.be.true;
      expect(errorStub.firstCall.args[0]).to.equal(res);
  
      sinon.assert.calledOnce(userModel.findById);
      sinon.assert.calledOnce(responseHandler.error);
    });
  });
  
});

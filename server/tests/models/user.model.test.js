import { expect } from 'chai';
import User from '../../src/models/user.model.js';
import crypto from 'crypto';
import sinon from 'sinon';

describe('User Model', () => {
  let user;

  beforeEach(() => {
    user = new User({
      username: 'testuser',
      displayName: 'Test User',
    });
  });

  it('should set and validate the user password correctly', () => {
    const password = 'testpassword';
    user.setPassword(password);

    expect(user.password).to.not.equal(password);
    expect(user.validPassword(password)).to.be.true;
  });

  it('should not authenticate with an incorrect password', () => {
    const password = 'testpassword';
    user.setPassword(password);

    const incorrectPassword = 'incorrectpassword';
    expect(user.validPassword(incorrectPassword)).to.be.false;
  });

  describe('Integration Tests', () => {
    let saveStub;
    let findOneStub;

    before(() => {
      saveStub = sinon.stub(User.prototype, 'save');
      findOneStub = sinon.stub(User, 'findOne');
    });

    after(() => {
      saveStub.restore();
      findOneStub.restore();
    });

    beforeEach(() => {
      saveStub.reset();
      findOneStub.reset();
    });

    it('should save a new user', async () => {
        saveStub.resolves();
      
        const user = new User({
          username: 'testuser',
          displayName: 'Test User',
        });
      
        await user.save();
      
        expect(saveStub.calledOnce).to.be.true;
      });
      
      

    it('should find a user by username', async () => {
      const foundUser = { _id: '123', username: 'testuser', displayName: 'Test User' };
      findOneStub.resolves(foundUser);

      const username = 'testuser';
      const fetchedUser = await User.findOne({ username });

      expect(fetchedUser).to.deep.equal(foundUser);
      expect(findOneStub.calledOnce).to.be.true;
      expect(findOneStub.calledWith({ username })).to.be.true;
    });
  });
});

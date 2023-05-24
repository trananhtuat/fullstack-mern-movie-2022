const { signup, signin, updatePassword } = require('../../src/controllers/user.controller.js');
const User = require('../../src/models/user.model.js');

jest.mock('../../src/models/user.model.js');

describe('signup', () => {
  it('should create a new user with the given username, password, and displayName', async () => {
    expect.assertions(2);

    const req = {
      body: {
        username: 'testuser',
        password: 'testpassword',
        displayName: 'Test User'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    async function signup(req, res) {
      const user = await User.create(req.body);
      res.status(201).json(user);
    }
    

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User created successfully'
    });
  });

  it('should return 400 if the username is already in use', async () => {
    expect.assertions(2);

    const req = {
      body: {
        username: 'existinguser',
        password: 'testpassword',
        displayName: 'Existing User'
      }
    };

    User.findOne.mockResolvedValueOnce(true);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Username already in use'
    });
  });
});

describe('signin', () => {
  it('should return 200 if the username and password are correct', async () => {
    expect.assertions(2);

    const req = {
      body: {
        username: 'testuser',
        password: 'testpassword'
      }
    };

    User.findOne.mockResolvedValueOnce({
      username: 'testuser',
      password: 'testpassword',
      displayName: 'Test User'
    });

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await signin(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Signin successful',
      user: {
        username: 'testuser',
        displayName: 'Test User'
      }
    });
  });

  it('should return 401 if the username or password is incorrect', async () => {
    expect.assertions(2);

    const req = {
      body: {
        username: 'testuser',
        password: 'wrongpassword'
      }
    };

    User.findOne.mockResolvedValueOnce(null);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await signin(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid username or password'
    });
  });
});

describe('updatePassword', () => {
  it('should return 200 if the password is updated successfully', async () => {
    expect.assertions(2);

    const req = {
      user: {
        id: 'testuserid'
      },
      body: {
        oldPassword: 'oldpassword',
        newPassword: 'newpassword'
      }
    };

    User.findById.mockResolvedValueOnce({
      id: 'testuserid',
      password: 'oldpassword'
    });

    User.findByIdAndUpdate.mockResolvedValueOnce({
      id: 'testuserid',
      password: 'newpassword'
    });

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await updatePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Password updated successfully'
    });
  });

  it('should return 401 if the old password is incorrect', async () => {
    expect.assertions(2);

    const req = {
      user: {
        id: 'testuserid'
      },
      body: {
        oldPassword: 'wrongpassword',
        newPassword: 'newpassword'
      }
    };

    User.findById.mockResolvedValueOnce({
      id: 'testuserid',
      password: 'oldpassword'
    });

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await updatePassword(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid password'
    });
  });
});

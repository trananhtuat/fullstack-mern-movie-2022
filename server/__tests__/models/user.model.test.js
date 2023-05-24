import userModel from "../../src/models/user.model.js";
import crypto from 'crypto';

describe('User Model', () => {
  let user;

  beforeEach(() => {
    user = new userModel();
  });

  afterEach(() => {
    user = null;
  });

  it('should set the username property', () => {
    const username = 'john.doe';
    user.username = username;
    expect(user.username).toBe(username);
  });

  it('should set the displayName property', () => {
    const displayName = 'John Doe';
    user.displayName = displayName;
    expect(user.displayName).toBe(displayName);
  });

  it('should set the password property', () => {
    const password = 'myPassword';
    user.setPassword(password);

    expect(user.salt).toBeDefined();
    expect(user.password).toBeDefined();
    expect(user.password).not.toBe(password);

    const hash = crypto.pbkdf2Sync(
      password,
      user.salt,
      1000,
      64,
      'sha512'
    ).toString('hex');

    expect(user.password).toBe(hash);
  });

  it('should validate the password', () => {
    const password = 'myPassword';
    user.setPassword(password);

    expect(user.validPassword(password)).toBe(true);
    expect(user.validPassword('incorrectPassword')).toBe(false);
  });
});

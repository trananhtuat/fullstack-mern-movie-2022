import mongoose from "mongoose";
import crypto from "crypto";
import userModel from "../../src/models/user.model.js";

describe("User Model", () => {
  beforeAll(() => {
    // Connect to the MongoDB test database
    const url = "mongodb://localhost:27017/testdb";
    return mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Disconnect from the MongoDB test database
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear the user collection before each test
    await userModel.deleteMany({});
  });

  it("should hash the password and set the salt when calling 'setPassword'", async () => {
    const user = new userModel();
    const password = "testpassword";
    const randomBytesMock = jest
      .spyOn(crypto, "randomBytes")
      .mockResolvedValue(Buffer.from("randomsalt", "hex"));
    const pbkdf2SyncMock = jest.spyOn(crypto, "pbkdf2Sync").mockReturnValue(
      Buffer.from("hashedpassword", "hex")
    );

    await user.setPassword(password);

    expect(user.salt.toString()).toBe("randomsalt");
    expect(pbkdf2SyncMock).toHaveBeenCalledWith(
      password,
      "randomsalt",
      1000,
      64,
      "sha512"
    );
    expect(user.password.toString()).toBe("hashedpassword");
    expect(pbkdf2SyncMock).toHaveBeenCalledTimes(1);

    randomBytesMock.mockRestore();
    pbkdf2SyncMock.mockRestore();
  });

  

  it("should return true if the password is valid", async() => {
    const user = new userModel();
    user.password = "hashedpassword";
    user.salt = "randomsalt";
    const pbkdf2SyncMock = jest.spyOn(crypto, "pbkdf2Sync").mockReturnValue(
      Buffer.from("hashedpassword", "hex")
    );

    const isValid = await user.validPassword("testpassword");

    expect(pbkdf2SyncMock).toHaveBeenCalledWith(
      "testpassword",
      "randomsalt",
      1000,
      64,
      "sha512"
    );
    expect(isValid).toBe(true);

    pbkdf2SyncMock.mockRestore();
  });

  it("should return false if the password is invalid", () => {
    const user = new userModel();
    user.password = "hashedpassword";
    user.salt = "randomsalt";
    const pbkdf2SyncMock = jest.spyOn(crypto, "pbkdf2Sync").mockReturnValue(
      Buffer.from("incorrectpassword", "hex")
    );

    const isValid = user.validPassword("testpassword");

    expect(pbkdf2SyncMock).toHaveBeenCalledWith(
      "testpassword",
      "randomsalt",
      1000,
      64,
      "sha512"
    );
    expect(isValid).toBe(false);

    pbkdf2SyncMock.mockRestore();
  });
});

import userModel from "../models/user.model.js";
import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";

const signup = async (req, res) => {
  try {
    const { username, password, displayName } = req.body;
    console.log("user", req.body);
    const checkUser = await userModel.findOne({ username });
    console.log("user", checkUser);
    if (checkUser)
      return responseHandler.badrequest(res, "username already used");

    const user = new userModel();
    console.log("user", user);
    user.displayName = displayName;
    user.username = username;
    user.setPassword(password);
    user.email = null;

    await user.save();

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );
    console.log("user", token);
    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id,
    });
  } catch {
    responseHandler.error(res);
  }
};

const signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("req.body", req.body);
    const user = await userModel
      .findOne({ username })
      .select("username password salt id displayName email");
console.log("user", user);
    if (!user) return responseHandler.badrequest(res, "User not exist");

    if (!user.validPassword(password))
      return responseHandler.badrequest(res, "Wrong password");

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    user.password = undefined;
    user.salt = undefined;
    user.email = null;
    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id,
    });
  } catch {
    responseHandler.error(res);
  }
};

const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;

    const user = await userModel
      .findById(req.user.id)
      .select("password id salt");

    if (!user) return responseHandler.unauthorize(res);

    if (!user.validPassword(password))
      return responseHandler.badrequest(res, "Wrong password");

    user.setPassword(newPassword);

    await user.save();

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

const getInfo = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    //const user = { name: "chien" };
    console.log("user2", user);
    if (!user) return responseHandler.notfound(res);

    responseHandler.ok(res, user);
  } catch {
    responseHandler.error(res);
  }
};

const signinGoogle = async (req, res) => {
  try {
    console.log("ggss");
    const { name, email } = req.body;
    console.log("req.body", req.body);
    console.log("email: " + email);
    const user = await userModel
      .findOne({ email })
      .select("email password salt id displayName");
    console.log("userfoud", user);
    if (!user)
      return responseHandler.badrequest(
        res,
        "User not exist, you have to sign up first"
      );

    // if (!user.validPassword(password))
    //   return responseHandler.badrequest(res, "Wrong password");

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    user.password = undefined;
    user.salt = undefined;

    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id,
    });
  } catch {
    responseHandler.error(res);
  }
};

const signupGoogle = async (req, res) => {
  try {
    const { name, email } = req.body;
    const password = email;
    const checkUser = await userModel.findOne({ email });

    if (checkUser) return responseHandler.badrequest(res, "email already used");

    const user = new userModel();
    console.log("user", user);
    user.displayName = name;
    user.username = name;
    user.setPassword(password);
    user.email = email;
    await user.save();

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );
    console.log("token", token);
    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id,
    });
  } catch {
    responseHandler.error(res);
  }
};

export default {
  signup,
  signin,
  getInfo,
  updatePassword,
  signinGoogle,
  signupGoogle,
};

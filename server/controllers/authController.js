import User from "../models/User.model.js";
import { errorHandler } from "../utils/error.js";
import { generateToken } from "../utils/token.js";

// function to login user into the system
export const login = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phoneNumber } = req.body;
    if (!email || !password || !phoneNumber || !firstName || !lastName)
      return next(errorHandler(400, "please provide all required fields"));
    //check if user exists in database
    const isUser = await User.findOne({ email });
    if (!email)
      return next(errorHandler(400, "Please provide your email first!"));
    if (!isUser) return next(errorHandler(403, "Invalid credentials"));
    // check passwords
    const isMatch = await isUser.checkPassword(password);
    if (!isMatch) return next(errorHandler(403, "Invalid credentials"));
    // create new user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
    });

    newUser.password = undefined;
    res
      .cookie("access_token", generateToken(newUser._id, newUser.role), {
        httpOnly: true,
      })
      .status(200)
      .json(newUser);
  } catch (error) {
    next(error);
  }
};

// function to register new user
export const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;
    if (!firstName || !lastName || !email || !phoneNumber || !password)
      return next(errorHandler(400, "PLEASE PROVIDE ALL REQUIRED FIELDS"));
    //check if user exists in database
    const isUser = await User.findOne({ email });
    if (isUser) return next(errorHandler(400, "Email taken!"));

    // proceed to create user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
    });

    newUser.password = undefined;
    res.status(200).json(newUser);
  } catch (error) {
    next(error);
  }
};

// function to logout user
export const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("Access_token").status(200).json("logout successful");
  } catch (error) {
    next(error);
  }
};

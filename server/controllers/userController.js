import User from "../models/User.model.js";
import { errorHandler } from "../utils/error.js";

export const getUsers = async (req, res, next) => {
  try {
    const limit = req.query.limit || 10;
    const startIndex = req.query.startindex || 0;
    const searchTerm = req.query.searchTerm
      ? {
          $or: [
            { firstName: { $regex: searchTerm, $options: "i" } },
            { lastName: { $regex: searchTerm, $options: "i" } },
            { email: { $regex: searchTerm, $options: "i" } },
          ],
        }
      : {};
    const user = await User.find({
      searchTerm,
      _id: { $ne: req.user.id },
    });

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const systemUser = await User.findById(req.params.id, { password: 0 });
    if (!systemUser) return next(errorHandler(404, "User not found"));
    res.status(200).json(systemUser);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    const isUser = await User.findById(req.params.id);
    if (!isUser)
      return next(errorHandler(404, "no user with matching ID was found"));
    // initiate updates
    updates.forEach((update) => (isUser[update] = req.body[update]));
    await isUser.save();
    isUser.password = undefined;

    res.status(200).json(isUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    //find user in database
    const isUser = await User.findById(req.params.id);
    if (!isUser)
      return next(errorHandler(404, "nO USER WITH MATCHING id was found"));
    // soft delete user
    isUser.isDeleted = true;
    await isUser.save();

    res.status(200).json("user deleted successfully");
  } catch (error) {
    next(error);
  }
};

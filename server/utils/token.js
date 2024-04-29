import jwt from "jsonwebtoken";

export const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, isAdmin: role }, process.env.JWT_SECRET);
};

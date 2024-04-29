import express from "express";
import {
  login,
  logoutUser,
  registerUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", registerUser);
router.get("/logout", logoutUser);

export default router;

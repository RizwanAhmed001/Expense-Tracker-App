import express from "express";
import upload from "../middleware/multer.js";
import { login, logout, register } from "../controllers/user.controller.js";

const userRoute = express.Router();

userRoute.post("/register", upload.single("image"), register)
userRoute.post("/login", login);
userRoute.post("/logout", logout)

export default userRoute;
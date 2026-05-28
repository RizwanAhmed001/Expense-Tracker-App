import express from "express";
import upload from "../middleware/multer.js";
import { login, register } from "../controllers/user.controller.js";

const userRoute = express.Router();

userRoute.post("/register", upload.single("image"), register)
userRoute.post("/login", login)

export default userRoute;
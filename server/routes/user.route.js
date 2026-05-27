import express from "express";
import upload from "../middleware/multer.js";
import { register } from "../controllers/user.controller.js";

const userRoute = express.Router();

userRoute.post("/register", upload.single("image"), register)

export default userRoute;
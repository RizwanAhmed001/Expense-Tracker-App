import UserModel from "../models/User.model.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const image = req.file;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Profile Image Is Required!",
      });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "User Fields Are Mandatory!",
      });
    }

    const isExist = await UserModel.findOne({ email });

    if (isExist) {
      return res.status(409).json({
        success: false,
        message: "Email Already In Use!",
      });
    }

    const result = await cloudinary.uploader.upload(image.path, {
      folder: "uploads",
    });

    const imageUrl = result.secure_url;

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      image: imageUrl,
      name,
      email,
      password: hashPassword,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    const isProduction = process.env.NODE_ENV === "production"; // development in server

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction, // boolean
      sameSite: isProduction ? "none" : "lax", // correct logic
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User Registered",
      user: {
        name: newUser.name,
        image: newUser.image,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All Fields Are Mandatory!",
      });
    }

    const isExist = await UserModel.findOne({ email });

    if (!isExist) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials!",
      });
    }

    const isCompared = await bcrypt.compare(password, isExist.password);

    if (!isCompared) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials!",
      });
    }

    const token = jwt.sign(
      { id: isExist._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "User Login!",
      user: {
        name: isExist.name,
        image: isExist.image,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
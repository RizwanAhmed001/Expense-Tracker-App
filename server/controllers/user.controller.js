import UserModel from "../models/User.model.js"; 
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcrypt";

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
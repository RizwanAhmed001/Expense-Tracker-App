import UserModel from "../models/User.model";

export const register = async (req, res) => {
  try {

    const image = req.file;

    if(!image){
      return res.status(401).json({success: false, message: "Profile Image Is Required!"})
    }

    const {name, email, password} = req.body;

    if(!name || !email || !password){
      return res.status(401).json({success: false, message: "User Fileds Are Mendatory!"})
    }

    const isExist = await UserModel.findOne({email});

    if(isExist){
      return res.status(409).json({success: false, message: "Email Alreadt In Use!"})
    }

    

  } catch (error) {
    return res.status(200).json({success: false, message: error.message})
  }
}
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
export const signup = async (req,res) => {
    const { fullName,email,password } = req.body
    try{
            if(!fullName || !email || !password) {
                return res.status(400).json({message: "Vui lòng điền đầy đủ thông tin"});
            }
            if(password.length <6 ) {
                return res.status(400).json({message: "mật khẩu có ít nhất 6 ký tự"});
            }
            const user = await User.findOne({email}); 
            if (user) return res.status(400).json({message: "email đã tồn tại"});

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password,salt)
            const newUser = new User ({
                fullName,
                email,
                password: hashedPassword
            })
            if (newUser){ 
            generateToken(newUser._id,res)
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
                createdAt: newUser.createdAt,
            });
            }
            else  
            {
                return res.status(400).json({message: "User đã tồn tại"});
            }
    } catch (error) {
        console.log("lỗi đăng nhập",error.message );
        res.status(500).json({message: "Internal server error"});
    }
};
export const login = async (req,res) => {
 
    const {email,password} = req.body
    try {
        const user = await User.findOne({email}) 
    if(!user){
        return res.status(400).json({message:"Người dùng không tồn tại"});
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if(!isPasswordCorrect){
        return res.status(400).json({message:"Mật khẩu không đúng"});
    }
    generateToken(user._id,res)
    res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        createdAt: user.createdAt,
    });
    } catch (error) {
        console.log("Lỗi đăng nhập", error.message);
        return res.status(500).json({message: "lỗi máy chủ - nội bộ"})
    }
};
export const logout = (req,res) => {
    try {
    res.cookie("jwt", "", {maxAge: 0});
    res.status(200).json({message: "Đăng xuất thành công"});
    } catch (error) {
        console.log("Lỗi đăng xuất", error.message);
        return res.status(500).json({message: "lỗi máy chủ - nội bộ"});
    }
};
export const updateProfile = async (req,res) => {
    try { 
        const {profilePic} = req.body
      const userId = req.user._id

      if (!profilePic){
        return res.status(400).json({message: "Ảnh đại diện không được để trống"});
      }
      const uploadResponse = await cloudinary.uploader.upload(profilePic)
      const updateUser= await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url}, {new:true})
     res.status(200).json(updateUser)
    } catch (error) {
        console.log("lỗi update", error)
        res.status(500).json({message:" lỗi server"});
    }
};
export const checkAuth = (req,res) => {
try{
res.status(200).json(req.user);
}catch (error) {
    console.log("lỗi trong checkAuth controller", error.message);
    res.status(500).json({message:"lỗi server"})
}
}

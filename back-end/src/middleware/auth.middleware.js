import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectRound = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({message: "Không có quyền truy cập"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded){
            return res.status(401).json({message: "Không có quyền truy cập"});
        }
        const user = await User.findById(decoded.userId).select("-password");
        if (!user){
            return res.status(401).json({message: "Không có quyền truy cập"});
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("Lỗi xác thực", error.message);
        return res.status(500).json({message: "lỗi máy chủ - nội bộ"})
    }

}
import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {  Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";

import toast from "react-hot-toast";
const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Vui lòng nhập họ và tên");
    if (!formData.email.trim()) return toast.error("Vui lòng nhập email");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Định dạng email không hợp lệ");
    if (!formData.password) return toast.error("Vui lòng nhập mật khẩu");
    if (formData.password.length < 6) return toast.error("Mật khẩu phải có ít nhất 6 ký tự");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signup(formData);
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="w-full max-w-md bg-base-100 p-8 rounded-2xl shadow-xl">
        {/* LOGO */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 group">
          
            <h1 className="text-2xl font-bold mt-2">Đăng ký </h1>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Họ và tên</span>
            </label>
            <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
      <User className="w-5 h-5 text-gray-400" /> {/* 👈 thay text-gray-400 để dễ thấy hơn */}
    </div>

    {/* Ô INPUT */}
    <input
      type="text"
      className="input input-bordered w-full pl-10 pr-3 bg-base-100 text-base-content"
      placeholder="Nhập họ và tên"
      value={formData.fullName}
      onChange={(e) =>
        setFormData({ ...formData, fullName: e.target.value })
      }
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Mail className="size-5 text-base-content/40" />
              </div>
              <input
                type="email"
                className="input input-bordered w-full pl-10"
                placeholder="Vui lòng nhập email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Mật khẩu</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Lock className="size-5 text-base-content/40" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full pl-10"
                placeholder="Vui lòng nhập mật khẩu"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="size-5 text-base-content/40" />
                ) : (
                  <Eye className="size-5 text-base-content/40" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Tạo tài khoản"
              )}
            </button>
        </form>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className="text-base-content/60">
          Bạn đã có tài khoản?{" "}
           <Link 
  to="/login" 
  className="text-blue-500 hover:text-blue-700 font-medium transition-colors"
>
  Đăng nhập
</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

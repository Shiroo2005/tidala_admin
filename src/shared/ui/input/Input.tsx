import { Link } from "react-router-dom";
import { APP_PATHS } from "@/shared/constants/appPaths";
import { useState, type InputHTMLAttributes } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  forgotPassword?: boolean;
  containerClassName?: string;
  showPasswordToggle?: boolean;
}

export const Input = ({
  label,
  error,
  fullWidth = false,
  icon,
  forgotPassword = false,
  containerClassName = "",
  className = "",
  disabled = false,
  showPasswordToggle = false,
  type = "text",
  required = false,
  ...props
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Xác định type thực tế của input
  const inputType =
    showPasswordToggle && type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type;

  return (
    <div
      className={`inline-flex flex-col justify-start items-start gap-2 ${fullWidth ? "w-full" : "self-stretch"} ${containerClassName}`}
    >
      {/* Label and Forgot Password */}
      {(label || forgotPassword) && (
        <div className="w-full flex justify-between items-center">
          {label && (
            <label className="text-indigo-950 text-sm font-normal font-['Lexend']">
              {label}
              {required && <span className="ml-1 text-red-500">*</span>}
            </label>
          )}
          {forgotPassword && (
            <Link
              to={APP_PATHS.FORGOT_PASSWORD}
              className="text-right text-sm font-normal text-[#137FEC] hover:underline transition-all"
            >
              Quên mật khẩu?
            </Link>
          )}
        </div>
      )}

      {/* Input Container */}
      <div
        className={`
          self-stretch h-12 px-3 rounded-2xl 
          border
          inline-flex justify-between items-center gap-2
          transition-all duration-200
          ${
            isFocused && !error && !disabled
              ? "border-[#137FEC] shadow-sm shadow-[#137FEC]/20"
              : error
                ? "border-red-500"
                : "border-[#C8CDE0]"
          }
          ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
          ${fullWidth ? "w-full" : ""}
        `}
      >
        <input
          {...props}
          type={inputType}
          required={required}
          disabled={disabled}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={`
            flex-1 h-full bg-transparent
            text-[#1A1D42] text-sm font-medium font-['Lexend']
            placeholder:text-[#A8AFCD]
            outline-none
            disabled:cursor-not-allowed disabled:text-gray-400
            ${className}
          `}
        />
        {/* Hiện icon mắt nếu là password và showPasswordToggle */}
        {showPasswordToggle && type === "password" ? (
          <button
            type="button"
            tabIndex={-1}
            className="w-6 h-6 shrink-0 flex items-center justify-center text-[#A8AFCD] hover:text-[#137FEC] focus:outline-none"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? (
              <LuEyeOff className="text-[20px]" />
            ) : (
              <LuEye className="text-[20px]" />
            )}
          </button>
        ) : icon ? (
          <div className="w-6 h-6 shrink-0 flex items-center justify-center">
            {icon}
          </div>
        ) : null}
      </div>

      {/* Error Message */}
      {error && (
        <span className="text-red-500 text-xs font-normal font-['Lexend'] animate-in fade-in slide-in-from-top-1 duration-200">
          {error}
        </span>
      )}
    </div>
  );
};

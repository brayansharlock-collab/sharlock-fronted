import React from "react";
import { Input } from "antd";
import type { InputProps } from "antd";

interface AppInputProps extends InputProps {
  icon?: React.ReactNode;
}

export const AppInput: React.FC<AppInputProps> = ({ icon, ...props }) => {
  return (
    <div className="relative w-full">
      {icon && <span className="absolute left-3 top-2.5 text-gray-500">{icon}</span>}
      <Input
        {...props}
        className={`pl-10 border-gray-300 focus:border-gray-500 focus:ring-gray-500 ${props.className || ""}`}
      />
    </div>
  );
};
import React from "react";
import { Button } from "antd";
import type { ButtonProps } from "antd";

export  const AppButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <Button
      {...props}
      className={`transition-colors duration-200 ${props.className || ""}`}
    >
      {children}
    </Button>
  );
};

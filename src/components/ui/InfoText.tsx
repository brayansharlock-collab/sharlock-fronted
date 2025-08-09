import React from 'react';

interface InfoTextProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const InfoText: React.FC<InfoTextProps> = ({ children, style }) => {
  return (
    <span style={{ fontFamily: 'Inter, Arial, sans-serif', ...style }}>
      {children}
    </span>
  );
};

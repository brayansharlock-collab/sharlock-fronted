import React from 'react';

interface PromoTextProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const PromoText: React.FC<PromoTextProps> = ({ children, style }) => {
  return (
    <span style={{ fontFamily: 'Cinzel, serif', ...style }}>
      {children}
    </span>
  );
};

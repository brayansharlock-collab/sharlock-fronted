import React from 'react';
import { Typography } from 'antd';

const { Title: AntTitle } = Typography;

interface TitleProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5;
  style?: React.CSSProperties;
}

export const Title: React.FC<TitleProps> = ({ children, level = 2, style }) => {
  return (
    <AntTitle level={level} style={{ fontFamily: 'Lora, serif', ...style }}>
      {children}
    </AntTitle>
  );
};

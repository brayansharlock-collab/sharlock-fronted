import React from 'react';
import { Typography } from 'antd';

const { Paragraph: AntParagraph } = Typography;

interface ParagraphProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Paragraph: React.FC<ParagraphProps> = ({ children, style }) => {
  return (
    <AntParagraph style={{ fontFamily: 'Lora, serif', ...style }}>
      {children}
    </AntParagraph>
  );
};

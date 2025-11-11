import { UpOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const threshold = 9;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsVisible(scrollTop > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{
              position: 'fixed',
              right: 0,
              bottom: 0,
            }}
          >
            <FloatButton
              onClick={scrollToTop}
              icon={<UpOutlined />}
              style={{
                transform: 'none !important',
                transition: 'none !important',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
              className="float-button-no-hover"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
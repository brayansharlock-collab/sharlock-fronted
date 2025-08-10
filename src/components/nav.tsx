import React, { useEffect, useState } from 'react';
import { useScroll } from 'framer-motion';
import { motion } from 'framer-motion';

const AnimatedNav: React.FC = () => {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const unsubscribe = scrollY.on('change', (latest) => {
            setIsScrolled(latest > 10);
        });
        return () => unsubscribe();
    }, [scrollY]);

    // Animación del texto que actúa como logo
    const textVariants = {
        initial: {
            scale: 4,
            y: 0,
            opacity: 1,
        },
        collapsed: {
            scale: 1,           // Tamaño normal de navbar
            y: -15,             // Sube un poco al contraerse
            opacity: 1,
        },
    };

    return (
        <motion.nav
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '70px',
                background: isScrolled ? 'linear-gradient(to bottom, #e6e1d7, #e6e1d7bc, transparent )' : 'transparent',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                transition: 'all 0.3s ease-in',
                overflow: 'visible',
            }}
        >
            <motion.span
                style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: isScrolled ? '#000' : '#fff',
                    whiteSpace: 'nowrap',
                    fontFamily: 'Lora, serif',
                    position: 'relative',
                    // Posición inicial: abajo del nav
                    top: isScrolled ? '22%' : '22%',
                    // left: '50%',
                    transform: isScrolled
                        ? 'translate(-50%, -50%)' // Centrado en el nav
                        : 'translateX(-50%)',     // Centrado horizontal en pantalla
                    originY: 0,
                }}
                variants={textVariants}
                initial="initial"
                animate={isScrolled ? 'collapsed' : 'initial'}
                transition={{
                    duration: 1,
                    ease: [0.6, -0.05, 0.01, 0.99], // Easing suave y natural
                }}
            >
                SHARLOCK
            </motion.span>
        </motion.nav>
    );
};

export default AnimatedNav;
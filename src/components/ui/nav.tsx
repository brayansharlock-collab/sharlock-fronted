import { Badge } from 'antd';
import { motion } from 'framer-motion';
import { useScroll } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { SearchDrawer } from './SearchDrawer';

const AnimatedNav: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';

    const { scrollY } = useScroll();
    const [cartCount, setCartCount] = useState(2);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        if (!isHome) {
            setIsScrolled(true);
            return;
        }

        const unsubscribe = scrollY.on('change', (latest) => {
            setIsScrolled(latest > 10);
        });

        return () => unsubscribe();
    }, [scrollY]);

    const textVariants = {
        initial: {
            scale: 4,
            y: 0,
            opacity: 1,
        },
        collapsed: {
            scale: 1,
            y: -15,
            opacity: 1,
        },
    };

    const mockProducts = [
        { id: 1, name: "Laptop Gamer Pro", category: "Electrónicos" },
        { id: 2, name: "Teclado Mecánico RGB", category: "Accesorios" },
        { id: 3, name: "Mouse Inalámbrico Ergonómico", category: "Accesorios" },
        { id: 4, name: "Smartphone Ultra 5G", category: "Electrónicos" },
        { id: 5, name: "Auriculares Bluetooth Inalámbricos", category: "Audio" },
        { id: 6, name: "Monitor 4K 27 pulgadas", category: "Electrónicos" },
        { id: 7, name: "Parlante Portátil Resistente al Agua", category: "Audio" },
        { id: 8, name: "Cargador Rápido USB-C", category: "Accesorios" },
        { id: 9, name: "Tablet para Dibujo Digital", category: "Electrónicos" },
        { id: 10, name: "Silla Gamer Reclinable", category: "Muebles" },
    ];

    const handleSearch = (term: string, results: any[]) => {
        console.log("Término buscado:", term);
        console.log("Resultados encontrados:", results);
        // Aquí puedes actualizar el estado, mostrar resultados, etc.
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
                alignItems: 'center',
                zIndex: 1000,
                transition: 'all 0.3s ease-in', justifyContent: 'space-between',
                overflow: 'visible',
                backdropFilter: "blur(1px)",
                padding: '0 20px',
            }}
        >
            <SearchDrawer products={mockProducts} onSearch={handleSearch} isScrolled={isScrolled} />

            <motion.span
                style={{
                    fontSize: 'clamp(1px, 4vw, 24px)',
                    fontWeight: 'bold',
                    mixBlendMode: 'difference',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                    color: '#fff',
                    whiteSpace: 'nowrap',
                    fontFamily: 'Lora, serif',
                    position: 'relative',
                    top: isScrolled ? '25%' : '25%',
                    transform: isScrolled
                        ? 'translate(-50%, -50%)'
                        : 'translateX(-50%)',
                    originY: 0,
                }}
                className="left-[6%] md:left-[0%] lg:left-0%]"
                variants={textVariants}
                initial="initial"
                animate={isScrolled ? 'collapsed' : 'initial'}
                transition={{
                    duration: 1,
                    ease: [0.6, -0.05, 0.01, 0.99],
                }}
            >
                SHARLOCK
            </motion.span>

            <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                style={{ display: 'flex', alignItems: 'center', gap: '20px' }}
            >
                <UserOutlined
                    style={{
                        fontSize: '18px',
                        color: isScrolled ? '#000' : '#fff',
                        cursor: 'pointer',
                    }}
                    onClick={() => { navigate("/Profile") }}
                />

                <Badge count={cartCount} size="small">
                    <ShoppingCartOutlined
                        style={{
                            fontSize: '18px',
                            color: isScrolled ? '#000' : '#fff',
                            cursor: 'pointer',
                        }}
                        onClick={() => { navigate("/CarPage") }}
                    />
                </Badge>

            </motion.div>

        </motion.nav>
    );
};

export default AnimatedNav;
import { Badge } from 'antd';
import { motion } from 'framer-motion';
import { useScroll } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { SearchDrawer } from './SearchDrawer';
import { cartService } from '../../service/cartService';

const AnimatedNav: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';

    const { scrollY } = useScroll();
    const [cartCount, setCartCount] = useState(2);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const fetchCartCount = async () => {
            try {
                const data = await cartService.getCart();
                // 👇 El count viene directo de la API
                setCartCount(data?.data?.count || 0);
            } catch (err) {
                console.error("Error al obtener el carrito", err);
                setCartCount(0);
            }
        };

        fetchCartCount();
    }, []);

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

    return (
        isHome ? (
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
                <SearchDrawer isScrolled={isScrolled} />

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
                    <div onClick={() => { navigate("/Profile") }}>
                        {isHome && (
                            <UserOutlined
                                style={{
                                    fontSize: '18px',
                                    color: isScrolled ? '#000' : '#fff',
                                    cursor: 'pointer',
                                }}
                            />
                        )}
                    </div>
                    <Badge count={cartCount} size="small" onClick={() => { navigate("/CarPage") }}>
                        <ShoppingCartOutlined
                            style={{
                                fontSize: '18px',
                                color: isScrolled ? '#000' : '#fff',
                                cursor: 'pointer',
                            }}
                        />
                    </Badge>

                </motion.div>

            </motion.nav>) : (
            <nav
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '70px',
                    background: isScrolled
                        ? 'linear-gradient(to bottom, #e6e1d7, #e6e1d7bc, transparent)'
                        : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    zIndex: 1000,
                    transition: 'background 0.3s ease-in-out',
                    padding: '0 20px',
                    backdropFilter: 'blur(1px)',
                }}
            >
                {/* SearchDrawer */}
                <SearchDrawer isScrolled={isScrolled} />

                {/* Logo */}
                <span
                    style={{
                        fontSize: 'clamp(14px, 4vw, 24px)',
                        fontWeight: 'bold',
                        color: isScrolled ? '#000' : '#fff',
                        textShadow: isScrolled ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.3)',
                        whiteSpace: 'nowrap',
                        fontFamily: 'Lora, serif',
                        transition: 'color 0.3s ease',
                    }}
                >
                    SHARLOCK
                </span>

                {/* Carrito */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Badge count={cartCount} size="small" onClick={() => navigate('/CarPage')}>
                        <ShoppingCartOutlined
                            style={{
                                fontSize: '18px',
                                color: isScrolled ? '#000' : '#fff',
                                cursor: 'pointer',
                            }}
                        />
                    </Badge>
                </div>
            </nav>
        )
    );
};

export default AnimatedNav;
import { Badge, Tooltip } from 'antd';
import { motion } from 'framer-motion';
import { useScroll } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { ApartmentOutlined, SearchOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { cartService } from '../../service/cartService';
import { getDecryptedCookie } from '../../utils/encrypt';

const AnimatedNav: React.FC = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const user = getDecryptedCookie("data");

    const { scrollY } = useScroll();
    const [cartCount, setCartCount] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const fetchCartCount = async () => {
            try {
                const data = await cartService.getCountCar();
                setCartCount(data?.data || 0);
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
        entry: {
            opacity: 0,
            y: 40,
            scale: 0.8,
        },
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
                    padding: '0 20px',
                }}
            >
                {/* <SearchDrawer isScrolled={isScrolled} /> menu desplegable de preductos*/}
                <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45 }}
                    style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                >
                    <Link to="/products" >
                        <SearchOutlined
                            style={{
                                fontSize: "22px",
                                color: isScrolled ? "#000" : "#fff",
                            }}
                        />
                    </Link>
                </motion.div>

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
                        top: '25%',
                        transform: isScrolled
                            ? 'translate(-50%, -50%)'
                            : 'translateX(-50%)',
                        originY: 0,
                    }}
                    className="left-[6%] md:left-[1.5%] lg:left-0%]"
                    variants={textVariants}
                    initial="entry"
                    animate={isScrolled ? "collapsed" : "initial"}
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
                    {user.role === "administrador" && (
                        <Tooltip title="Ir a la página de administración">
                            <Link to="/admin/options" >
                                <ApartmentOutlined
                                    style={{
                                        fontSize: '22px',
                                        color: isScrolled ? '#000' : '#fff',
                                        cursor: 'pointer',
                                    }}
                                />
                            </Link>
                        </Tooltip>
                    )}

                    <Tooltip title="Tu perfil">
                        <Link to="/Profile">
                            {isHome && (
                                <UserOutlined
                                    style={{
                                        fontSize: '22px',
                                        color: isScrolled ? '#000' : '#fff',
                                        cursor: 'pointer',
                                    }}
                                />
                            )}
                        </Link>
                    </Tooltip>
                    <Tooltip title="Tu Carrito">
                        <Link to="/CarPage">
                            <Badge count={cartCount} size="small">
                                <ShoppingCartOutlined
                                    style={{
                                        fontSize: '22px',
                                        color: isScrolled ? '#000' : '#fff',
                                        cursor: 'pointer',
                                    }}
                                />
                            </Badge>
                        </Link>
                    </Tooltip>

                </motion.div>

            </motion.nav>) : (null
        )
    );
};

export default AnimatedNav;
// src/pages/auth/ResetPassword.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, Typography, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import SharlockLogo from '../components/ui/SharlockLogo';
import Footer from '../components/ui/Footer';
import Silk from '../components/animations/Silk';
import type { Variants } from 'framer-motion';
import { motion, } from 'framer-motion';

import { Link, useSearchParams } from 'react-router-dom';
import { authService } from '../service/authService';

const { Title, Paragraph, Text } = Typography;

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.42, 0, 0.58, 1] },
    },
};

const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const tokenFromUrl = searchParams.get('token');

    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);

    const [messageApi, contextHolder] = message.useMessage();

    const hasShownError = useRef(false);

    useEffect(() => {
        if (!tokenFromUrl && !hasShownError.current) {
            messageApi.error('Token no válido. Por favor, solicita un nuevo enlace.');
            hasShownError.current = true;
        }
    }, [tokenFromUrl, messageApi]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!tokenFromUrl) {
            messageApi.error('No se encontró un token válido.');
            return;
        }

        if (password !== confirmPassword) {
            messageApi.error('Las contraseñas no coinciden.');
            return;
        }

        setLoading(true);

        try {
            await authService.resetPassword(tokenFromUrl, password, confirmPassword);
            messageApi.success('¡Contraseña actualizada correctamente!');
            setSuccess(true);
        } catch (err: any) {
            const errorMsg =
                err.response?.data?.error ||
                err.message ||
                'Error al restablecer la contraseña. El token podría haber expirado.';
            messageApi.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                display: "flex", alignItems: "center", justifyContent: "center", height: "100vh"
            }}
        >
            {contextHolder}

            {/* Logo arriba izquierda */}
            <SharlockLogo />

            {/* Footer abajo derecha */}
            <Footer />

            {/* Fondo animado */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ width: '100%', height: '100vh', zIndex: -1, position: 'absolute' }}
            >
                <Silk speed={10} scale={1} color="#e6e1d7" noiseIntensity={1.5} rotation={0} />
            </motion.div>

            {/* Formulario animado */}
            <motion.div
                initial={{ width: 63, height: 434, borderRadius: '50%' }}
                animate={{ width: '100%', maxWidth: 400, height: 'auto', borderRadius: '1rem' }}
                transition={{ type: 'spring', stiffness: 120, damping: 15, duration: 0.8 }}
                style={{ position: 'absolute' }}
            >
                <Card style={{ border: 'none', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 120, damping: 10, delay: 0.2 }}
                        style={{
                            width: 64,
                            height: 64,
                            margin: '0 auto 1rem',
                            borderRadius: '50%',
                            backgroundColor: '#f7f5f2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <LockOutlined style={{ fontSize: 28, color: '#7a6449' }} />
                    </motion.div>

                    <motion.div variants={itemVariants} initial="hidden" animate="show">
                        <Title level={2} style={{ marginBottom: 4, textAlign: 'center' }}>
                            Nueva contraseña
                        </Title>
                        <Paragraph style={{ color: '#6b7280', fontSize: '0.95rem', textAlign: 'center' }}>
                            Ingresa y confirma tu nueva contraseña.
                        </Paragraph>
                    </motion.div>

                    {success ? (
                        <motion.div variants={itemVariants} initial="hidden" animate="show">
                            <Paragraph style={{ textAlign: 'center', color: '#4caf50', marginTop: '1rem' }}>
                                Ya puedes iniciar sesión con tu nueva contraseña.
                            </Paragraph>
                            <motion.div
                                variants={itemVariants}
                                initial="hidden"
                                animate="show"
                                style={{ textAlign: 'center', marginTop: '1.5rem' }}
                            >
                                <Link to="/login" style={{ fontWeight: 500 }}>
                                    Ir a iniciar sesión
                                </Link>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <motion.div variants={itemVariants} initial="hidden" animate="show" style={{ marginBottom: '1rem' }}>
                                <Text>Nueva contraseña</Text>
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="••••••••"
                                    style={{ marginTop: 4 }}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </motion.div>

                            <motion.div variants={itemVariants} initial="hidden" animate="show" style={{ marginBottom: '1rem' }}>
                                <Text>Confirmar contraseña</Text>
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="••••••••"
                                    style={{ marginTop: 4 }}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                initial="hidden"
                                animate="show"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    loading={loading}
                                    disabled={!tokenFromUrl}
                                    style={{ border: 'none', fontWeight: 500 }}
                                >
                                    {loading ? 'Actualizando...' : 'Actualizar contraseña'}
                                </Button>
                            </motion.div>
                        </form>
                    )}
                </Card>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
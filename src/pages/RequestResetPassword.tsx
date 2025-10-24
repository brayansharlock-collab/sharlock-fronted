// src/pages/auth/RequestResetPassword.tsx
import React, { useState } from 'react';
import { Card, Input, Button, Typography, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { motion, } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { authService } from '../service/authService';
import SharlockLogo from '../components/ui/SharlockLogo';
import Footer from '../components/ui/Footer';
import Silk from '../components/animations/Silk';

const { Title, Paragraph, Text } = Typography;

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.42, 0, 0.58, 1] },
    },
};

const RequestResetPassword: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);

    const [messageApi, contextHolder] = message.useMessage();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await authService.requestPasswordReset(email);
            messageApi.success('¡Correo enviado! Revisa tu bandeja de entrada (y spam).');
            setSuccess(true);
        } catch (err: any) {
            const errorMsg =
                err.response?.data?.error ||
                'Error al enviar el correo. Verifica que el email sea correcto.';
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

            <SharlockLogo />

            <Footer />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ width: '100%', height: '100vh', zIndex: -1, position: 'absolute' }}
            >
                <Silk speed={10} scale={1} color="#e6e1d7" noiseIntensity={1.5} rotation={0} />
            </motion.div>

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
                        <MailOutlined style={{ fontSize: 28, color: '#7a6449' }} />
                    </motion.div>

                    <motion.div variants={itemVariants} initial="hidden" animate="show">
                        <Title level={2} style={{ marginBottom: 4, textAlign: 'center' }}>
                            ¿Olvidaste tu contraseña?
                        </Title>
                        <Paragraph style={{ color: '#6b7280', fontSize: '0.95rem', textAlign: 'center' }}>
                            Ingresa tu correo y te enviaremos un enlace para restablecerla.
                        </Paragraph>
                    </motion.div>

                    {success ? (
                        <motion.div variants={itemVariants} initial="hidden" animate="show">
                            <Paragraph style={{ textAlign: 'center', color: '#4caf50', marginTop: '1rem' }}>
                                Revisa tu correo para continuar.
                            </Paragraph>
                            <motion.div
                                variants={itemVariants}
                                initial="hidden"
                                animate="show"
                                style={{ textAlign: 'center', marginTop: '1.5rem' }}
                            >
                                <Link to="/login" style={{ fontWeight: 500 }}>
                                    Volver a iniciar sesión
                                </Link>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <motion.div variants={itemVariants} initial="hidden" animate="show" style={{ marginBottom: '1rem' }}>
                                <Text>Email</Text>
                                <Input
                                    prefix={<MailOutlined />}
                                    placeholder="tu@ejemplo.com"
                                    style={{ marginTop: 4 }}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    style={{ border: 'none', fontWeight: 500 }}
                                >
                                    {loading ? 'Enviando...' : 'Enviar enlace'}
                                </Button>
                            </motion.div>
                        </form>
                    )}

                    <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        animate="show"
                        style={{ textAlign: 'center', marginTop: '1.5rem' }}
                    >
                        <Paragraph style={{ color: '#6b7280' }}>
                            ¿Recuerdas tu contraseña?{' '}
                            <Link to="/login" style={{ padding: 0 }}>
                                Inicia sesión aquí
                            </Link>
                        </Paragraph>
                    </motion.div>
                </Card>
            </motion.div>
        </div>
    );
};

export default RequestResetPassword;
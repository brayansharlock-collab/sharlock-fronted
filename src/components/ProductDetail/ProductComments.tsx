"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { commentService } from "../../service/commentService"
import {
    Avatar,
    Button,
    Card,
    Typography,
    Input,
    Empty,
    Divider,
    Space,
    Tooltip,
    message,
} from "antd"
import {
    SendOutlined,
    CommentOutlined,
    MessageOutlined,
    UserOutlined,
    LockOutlined,
} from "@ant-design/icons"
import { tokenStorage } from "../../utils/token"

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

interface Comment {
    id: number;
    user_name?: string;
    comment: string;
    created_at: string;
    replies: any[];
}

export const ProductComments = ({ productId }: { productId: number }) => {
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [replyTarget, setReplyTarget] = useState<number | null>(null)
    const [replyComment, setReplyComment] = useState("")
    const [isLogged, setIsLogged] = useState(false)
    const token = tokenStorage.getAccessToken()

    useEffect(() => {
        setIsLogged(!!token)
        fetchComments()
    }, [productId])

    const fetchComments = async () => {
        try {
            const res = await commentService.getByProduct(productId)
            setComments(res)
        } catch {
            setError("Error al cargar los comentarios")
        }
    }

    const handleReply = async (parentId: number) => {
        if (!isLogged) {
            message.warning("Debes iniciar sesión para responder un comentario.")
            return
        }
        if (!replyComment.trim()) {
            setError("Escribe una respuesta primero")
            return
        }

        try {
            setLoading(true)
            setError(null)
            await commentService.create({
                product: productId,
                comment: replyComment,
                comment_parent: parentId,
            })
            setReplyComment("")
            setReplyTarget(null)
            fetchComments()
        } catch {
            setError("Error al enviar respuesta")
        } finally {
            setLoading(false)
        }
    }

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            setError("Escribe un comentario primero")
            return
        }

        try {
            setLoading(true)
            setError(null)
            await commentService.create({ product: productId, comment: newComment })
            setNewComment("")
            fetchComments()
        } catch {
            setError("Error al enviar comentario")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchComments()
    }, [productId])

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
                width: "100%",
                maxWidth: "1300px",
                margin: "20px auto",
                padding: "0 20px 60px",
                boxSizing: "border-box",
            }}
        >
            {/* Header */}
            <div style={{ marginBottom: "40px", }}>
                <MessageOutlined style={{ fontSize: 46, color: "#aea08fff" }} />
                <Title
                    level={2}
                    style={{
                        marginTop: "12px",
                        fontWeight: 700,
                        fontFamily: "'Playfair Display', serif",
                        color: "#1a1a1a",
                    }}
                >
                    Opiniones y Experiencias
                </Title>
                <Text type="secondary" style={{ fontSize: "15px" }}>
                    Comparte tu punto de vista y ayuda a otros usuarios.
                </Text>
            </div>

            {/* Comentario nuevo */}
            <Card
                style={{
                    padding: "24px",
                    borderRadius: "16px",
                    background: "linear-gradient(160deg, #ffffff, #e6e1d7)",
                    border: "1px solid #e8e8e8",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                    // opacity: isLogged ? 1 : 0.5
                }}
            >
                {isLogged ? (
                    <div
                        style={{
                            display: "flex",
                            gap: "14px",
                            alignItems: "flex-start",
                            flexWrap: "wrap",
                        }}
                    >
                        <Avatar
                            size={52}
                            icon={<UserOutlined />}
                            style={{
                                backgroundColor: "#5c503a32",
                                color: "#ab9c7dff",
                                fontWeight: 600,
                                fontSize: "20px",
                                flexShrink: 0,
                            }}
                        />
                        <div style={{ flex: "1 1 300px", minWidth: "0" }}>
                            <TextArea
                                placeholder="Escribe algo inspirador o deja tu opinión..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                autoSize={{ minRows: 3, maxRows: 6 }}
                                style={{
                                    resize: "none",
                                    marginBottom: "10px",
                                    fontSize: "15px",
                                    borderRadius: "10px",
                                    border: "1px solid #d9d9d9",
                                    backgroundColor: "#fff",
                                    width: "100%",
                                }}
                            />
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{
                                        color: "#ff4d4f",
                                        fontSize: "14px",
                                        marginBottom: "8px",
                                    }}
                                >
                                    {error}
                                </motion.p>
                            )}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    gap: "10px",
                                }}
                            >
                                <Button
                                    type="primary"
                                    icon={<SendOutlined />}
                                    onClick={handleAddComment}
                                    disabled={loading || !newComment.trim()}
                                    loading={loading}
                                    style={{
                                        borderRadius: "10px",
                                        fontWeight: 600,
                                        padding: "0 20px",
                                    }}
                                >
                                    {loading ? "Enviando..." : "Publicar"}
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "40px 0",
                            color: "#888",
                        }}
                    >
                        <LockOutlined style={{ fontSize: 40, color: "#c5b8a0" }} />
                        <Paragraph style={{ marginTop: 10, fontSize: 16 }}>
                            Debes iniciar sesión para escribir un comentario.
                        </Paragraph>
                        <Button type="primary" href="/login" target="blank" style={{ borderRadius: 8 }}>
                            Iniciar sesión
                        </Button>
                    </div>
                )}
            </Card>

            {/* Divider */}
            <Divider
                plain
                style={{
                    margin: "40px 0",
                    color: "#888",
                }}
            >
                <CommentOutlined style={{ marginRight: 6 }} />
                Comentarios recientes
            </Divider>

            {/* Lista de comentarios */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "18px",
                }}
            >
                <AnimatePresence mode="popLayout">
                    {comments.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                textAlign: "center",
                                padding: "60px 0",
                                background: "#fff",
                                borderRadius: "16px",
                                border: "1px solid #f0f0f0",
                            }}
                        >
                            <Empty
                                description={
                                    <>
                                        <Paragraph style={{ color: "#8c8c8c", fontSize: "16px", marginBottom: 0 }}>
                                            Aún no hay comentarios
                                        </Paragraph>
                                        <Text type="secondary" style={{ fontSize: "13px" }}>
                                            Sé el primero en iniciar la conversación ✨
                                        </Text>
                                    </>
                                }
                            />
                        </motion.div>
                    ) : (
                        comments.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                            >
                                <Card
                                    hoverable
                                    style={{
                                        padding: "24px",
                                        borderRadius: "16px",
                                        background: "linear-gradient(135deg, #ffffff, #f7faff)",
                                        border: "1px solid #eef0f6",
                                        boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: "16px",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <Avatar
                                            size={48}
                                            style={{
                                                backgroundColor: "#1677ff25",
                                                color: "#1677ff",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {item.user_name?.[0]?.toUpperCase() || "U"}
                                        </Avatar>

                                        <div style={{ flex: "1 1 300px", minWidth: 0 }}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    flexWrap: "wrap",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Text strong style={{ fontSize: "16px", color: "#222" }}>
                                                    {item.user_name || "Usuario"}
                                                </Text>
                                                <Text type="secondary" style={{ fontSize: "12px" }}>
                                                    {new Date(item.created_at).toLocaleDateString("es-ES", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </Text>
                                            </div>

                                            <Paragraph
                                                style={{
                                                    margin: "6px 0 12px",
                                                    fontSize: "15px",
                                                    color: "#333",
                                                    lineHeight: 1.6,
                                                }}
                                            >
                                                {item.comment}
                                            </Paragraph>

                                            <Space>
                                                <Tooltip title={isLogged ? "Responder a este comentario" : "Inicia sesión para poder reponder este comentario"}>
                                                    <Button
                                                        disabled={!isLogged}
                                                        type="link"
                                                        size="small"
                                                        icon={<CommentOutlined />}
                                                        style={{
                                                            padding: 0,
                                                            color: "#8e7d69ff",
                                                            fontWeight: 500,
                                                        }}
                                                        onClick={() => setReplyTarget(item.id)}
                                                    >
                                                        Responder
                                                    </Button>
                                                </Tooltip>
                                            </Space>

                                            {/* Campo para responder */}
                                            {replyTarget === item.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    style={{
                                                        marginTop: "12px",
                                                        background: "#f9fbff",
                                                        borderRadius: "10px",
                                                        padding: "12px",
                                                        border: "1px solid #e6ebf5",
                                                    }}
                                                >
                                                    <TextArea
                                                        rows={3}
                                                        value={replyComment}
                                                        onChange={(e) => setReplyComment(e.target.value)}
                                                        placeholder={`Responder a ${item.user_name || "este comentario"}...`}
                                                        style={{
                                                            resize: "none",
                                                            fontSize: "14px",
                                                            borderRadius: "8px",
                                                            border: "1px solid #d9d9d9",
                                                        }}
                                                    />
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "flex-end",
                                                            gap: "8px",
                                                            marginTop: "8px",
                                                        }}
                                                    >
                                                        <Button
                                                            onClick={() => setReplyTarget(null)}
                                                            style={{
                                                                borderRadius: "8px",
                                                                fontWeight: 500,
                                                            }}
                                                        >
                                                            Cancelar
                                                        </Button>
                                                        <Button
                                                            type="primary"
                                                            icon={<SendOutlined />}
                                                            loading={loading}
                                                            onClick={() => handleReply(item.id)}
                                                            style={{
                                                                borderRadius: "8px",
                                                                fontWeight: 500,
                                                            }}
                                                        >
                                                            Enviar
                                                        </Button>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* Mostrar respuestas */}
                                            {item.replies?.length > 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.3 }}
                                                    style={{
                                                        marginTop: "16px",
                                                        marginLeft: "40px",
                                                        borderLeft: "2px solid #eaeaea",
                                                        paddingLeft: "12px",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: "12px",
                                                    }}
                                                >
                                                    {item.replies.map((reply) => (
                                                        <div
                                                            key={reply.id}
                                                            style={{
                                                                background: "#fafbff",
                                                                borderRadius: "10px",
                                                                padding: "10px 14px",
                                                                border: "1px solid #f0f0f0",
                                                            }}
                                                        >
                                                            <Text strong style={{ fontSize: "14px", color: "#8e7d69ff" }}>
                                                                {reply.user_name || "Usuario"}
                                                            </Text>
                                                            <Paragraph
                                                                style={{
                                                                    margin: "4px 0 0",
                                                                    fontSize: "14px",
                                                                    color: "#444",
                                                                }}
                                                            >
                                                                {reply.comment}
                                                            </Paragraph>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}
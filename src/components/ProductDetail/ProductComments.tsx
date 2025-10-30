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
    StarOutlined,
} from "@ant-design/icons"
import { tokenStorage } from "../../utils/token"

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

interface Comment {
    id: number
    user_name?: string
    comment: string
    created_at: string
    replies: any[]
    rating: number
}

export const ProductComments = ({
    productId,
    totalComent,
    totalRating,
}: {
    productId: number
    totalComent: number
    totalRating: number
}) => {
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState("")
    const [newRating, setNewRating] = useState<number>(0)
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
                rating: newRating,
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
        if (newRating === 0) {
            setError("Selecciona una calificación antes de publicar.")
            return
        }

        try {
            setLoading(true)
            setError(null)
            await commentService.create({
                product: productId,
                comment: newComment,
                rating: newRating,
            })
            setNewComment("")
            setNewRating(0)
            fetchComments()
        } catch {
            setError("Error al enviar comentario")
        } finally {
            setLoading(false)
        }
    }

    const StarRating = ({
        rating,
        setRating,
        interactive = false,
    }: {
        rating: number
        setRating?: (r: number) => void
        interactive?: boolean
    }) => (
        <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
            {[...Array(5)].map((_, i) => (
                <StarOutlined
                    key={i}
                    onClick={() => interactive && setRating && setRating(i + 1)}
                    style={{
                        height: "1.1rem",
                        width: "1.1rem",
                        color: i < Math.floor(rating) ? "#facc15" : "#a3a3a3",
                        fill: i < Math.floor(rating) ? "#facc15" : "none",
                        cursor: interactive ? "pointer" : "default",
                        transition: "color 0.2s ease",
                    }}
                />
            ))}
        </div>
    )

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
            {/* HEADER */}
            <div style={{ marginBottom: "40px", textAlign: "center" }}>
                <MessageOutlined style={{ fontSize: 46, color: "#aea08fff" }} />

                <Title
                    level={2}
                    style={{
                        marginTop: "12px",
                        fontWeight: 700,
                        fontFamily: "'Playfair Display', serif",
                        color: "#1a1a1a",
                        textAlign: "center"
                    }}
                >
                    Opiniones y Experiencias
                </Title>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <StarRating rating={totalRating} />
                </div>

                <Text type="secondary" style={{ fontSize: "15px" }}>
                    Comparte tu punto de vista y ayuda a otros usuarios.
                </Text><br />

                <Text type="secondary" style={{ fontSize: "15px" }}>
                    Total de comentarios:  {totalComent}
                </Text>
            </div>

            <Card
                style={{
                    padding: "24px",
                    borderRadius: "16px",
                    background: "linear-gradient(160deg, #ffffff, #e6e1d7)",
                    border: "1px solid #e8e8e8",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                }}
            >
                {isLogged ? (
                    <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", flexWrap: "wrap" }}>
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
                            <StarRating rating={newRating} setRating={setNewRating} interactive />
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
                                    disabled={loading || !newComment.trim() || newRating === 0}
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
                    <div style={{ textAlign: "center", padding: "40px 0", color: "#888" }}>
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

            {/* LISTA DE COMENTARIOS */}
            <Divider plain style={{ margin: "40px 0", color: "#888" }}>
                <CommentOutlined style={{ marginRight: 6 }} />
                Comentarios recientes
            </Divider>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
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
                                        background: "linear-gradient(160deg, #ffffff, #e9e4da50)",
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
                                                backgroundColor: "#5c503a32",
                                                color: "#ab9c7dff",
                                                fontWeight: 600,
                                                fontSize: "20px",
                                                flexShrink: 0,
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

                                            <StarRating rating={item.rating} />

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
                                                <Tooltip
                                                    title={
                                                        isLogged
                                                            ? "Responder a este comentario"
                                                            : "Inicia sesión para poder responder"
                                                    }
                                                >
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
                                                    {/* ⭐ Selector de estrellas para la respuesta */}
                                                    <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                                                        {[...Array(5)].map((_, i) => (
                                                            <StarOutlined
                                                                key={i}
                                                                onClick={() => setNewRating(i + 1)}
                                                                style={{
                                                                    cursor: "pointer",
                                                                    fontSize: "18px",
                                                                    marginRight: "4px",
                                                                    color: i < newRating ? "#facc15" : "#d1d5db",
                                                                    transition: "color 0.2s",
                                                                }}
                                                            />
                                                        ))}
                                                        <span
                                                            style={{
                                                                fontSize: "13px",
                                                                color: "#6b7280",
                                                                marginLeft: "6px",
                                                            }}
                                                        >
                                                            {newRating > 0 ? `${newRating} / 5` : "Selecciona tu calificación"}
                                                        </span>
                                                    </div>

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
                                                            onClick={() => {
                                                                setReplyTarget(null)
                                                                setReplyComment("")
                                                                setNewRating(0)
                                                            }}
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
                                                                background: "#ffffffff",
                                                                borderRadius: "10px",
                                                                padding: "10px 14px",
                                                                border: "1px solid #f0f0f0",
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    display: "flex",
                                                                    justifyContent: "space-between",
                                                                    alignItems: "center",
                                                                    flexWrap: "wrap",
                                                                    marginBottom: "4px",
                                                                }}
                                                            >
                                                                <Text strong style={{ fontSize: "14px", color: "#8e7d69ff" }}>
                                                                    {reply.user_name || "Usuario"}
                                                                </Text>
                                                                <Text type="secondary" style={{ fontSize: "12px" }}>
                                                                    {new Date(reply.created_at).toLocaleDateString("es-ES", {
                                                                        year: "numeric",
                                                                        month: "short",
                                                                        day: "numeric",
                                                                        hour: "2-digit",
                                                                        minute: "2-digit",
                                                                    })}
                                                                </Text>
                                                            </div>

                                                            {/* ⭐ Rating individual de la respuesta */}
                                                            {reply.rating ? (
                                                                <div style={{ marginBottom: "4px" }}>
                                                                    <StarRating rating={reply.rating} />
                                                                </div>
                                                            ) : (
                                                                <Text type="secondary" style={{ fontSize: "12px" }}>
                                                                    Sin calificación
                                                                </Text>
                                                            )}

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

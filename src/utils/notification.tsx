import React, { createContext, useContext } from "react"
import { message } from "antd"

type MessageType = "success" | "error" | "warning" | "info" | "loading"

type NotifyContextType = {
  notify: (type: MessageType, content: string, duration?: number) => void
}

const NotifyContext = createContext<NotifyContextType | null>(null)

export const NotifyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage()

  const notify = (type: MessageType, content: string, duration = 3) => {
    messageApi.open({ type, content, duration })
  }

  return (
    <NotifyContext.Provider value={{ notify }}>
      {contextHolder}
      {children}
    </NotifyContext.Provider>
  )
}

export const useNotify = () => {
  const context = useContext(NotifyContext)
  if (!context) {
    throw new Error("useNotify debe usarse dentro de NotifyProvider")
  }
  return context.notify
}

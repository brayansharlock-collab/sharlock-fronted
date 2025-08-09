import { message } from "antd";

/**
 * @param {string} text
 */

export const showMessage = {
  success: (text: string) =>
    message.success({
      content: <span style={{ fontFamily: "Lora, serif" }}>{text}</span>,
    }),
  error: (text: string) =>
    message.error({
      content: <span style={{ fontFamily: "Lora, serif" }}>{text}</span>,
    }),
  info: (text: string) =>
    message.info({
      content: <span style={{ fontFamily: "Inter, Arial, sans-serif" }}>{text}</span>,
    }),
  warning: (text: string) =>
    message.warning({
      content: <span style={{ fontFamily: "Lora, serif" }}>{text}</span>,
    }),
};

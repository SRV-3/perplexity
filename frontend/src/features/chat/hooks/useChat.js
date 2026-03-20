import { initializeSocketConnection } from "../service/chat.socket";
import {
  sendMessage,
  getChats,
  getMessages,
  deleteChat,
} from "../service/chat.api.js";
import { useDispatch } from "react-redux";
import {
  setChats,
  setCurrentChatId,
  setLoading,
  setError,
} from "../chat.slice.js";

export const useChat = () => {
  const dispatch = useDispatch();

  async function handleSendMessage({ message, chatid }) {
    dispatch(setLoading(true));
    const data = await sendMessage({ message, chatid });
    const { chat, aiMessage } = data;
    dispatch(
      setChats((prev) => {
        return {
          ...prev,
          [chat.title]: {
            ...chat,
            message: [{ content: message, role: "user" }, aiMessage],
          },
        };
      }),
    );
    dispatch(setCurrentChatId(chat._id));
  }

  return {
    initializeSocketConnection,
    handleSendMessage,
  };
};

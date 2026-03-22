import { initializeSocketConnection } from "../service/chat.socket";
import {
  sendMessage,
  getChats,
  getMessages,
  deleteChats,
} from "../service/chat.api.js";
import { useDispatch } from "react-redux";
import {
  setChats,
  setCurrentChatId,
  setLoading,
  createNewChat,
  setError,
  addNewMessage,
} from "../chat.slice.js";

export const useChat = () => {
  const dispatch = useDispatch();

  async function handleSendMessage({ message, chatid }) {
    dispatch(setLoading(true));
    const data = await sendMessage({ message, chatid });
    const { chat, aiMessage } = data;
    dispatch(
      createNewChat({
        chatid: chat._id,
        title: chat.title,
      }),
    );
    dispatch(
      addNewMessage({
        chatid: chat._id,
        content: message,
        role: "user",
      }),
    );
    dispatch(
      addNewMessage({
        chatid: chat._id,
        content: aiMessage.content,
        role: aiMessage.role,
      }),
    );
    dispatch(setCurrentChatId(chat._id));
  }

  return {
    initializeSocketConnection,
    handleSendMessage,
  };
};

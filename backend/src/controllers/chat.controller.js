import { generateResponse, generaetChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {
  const { message, chat: chatId } = req.body;

  let title = null,
    chat = null;

  if (!chatId) {
    title = await generaetChatTitle(message);
    chat = await chatModel.create({
      user: req.user.id,
      title,
    });
  }

  const userMessage = await messageModel.create({
    chat: chatId || chat._id,
    content: message,
    role: "user",
  });

  const messages = await messageModel.find({ chat: chatId || chat._id });

  const result = await generateResponse(messages);

  const aiMessage = await messageModel.create({
    chat: chatId || chat._id,
    content: result,
    role: "ai",
  });

  res.status(201).json({ title: title, chat, aiMessage, userMessage });
}

export async function getChats(req, res) {
  const user = req.user;
  const chats = await chatModel.find({ user: user.id });
  res.status(201).json({
    message: "chat fetched successfully",
    chats,
  });
}

export async function getMessages(req, res) {
  const { chatId } = req.params;

  const chat = await chatModel.findOne({
    _id: chatId,
    user: req.user.id,
  });

  if (!chat) {
    return res.status(404).json({
      messages: "No chat found",
      success: false,
      error: "user don't contain this chat",
    });
  }

  const messages = await messageModel.find({ chat: chatId });
  res.status(201).json({
    message: "messages fetched successfully",
    messages,
  });
}

export async function deleteChat(req, res) {
  const { chatId } = req.params;

  const chat = await chatModel.findOne({
    _id: chatId,
    user: req.user.id,
  });

  if (!chat) {
    return res.status(404).json({
      messages: "No chat found",
      success: false,
      error: "user don't contain this chat",
    });
  }

  const messagesDelete = await messageModel.deleteMany({ chat: chatId });
  const chatDelete = await chatModel.deleteOne({ _id: chatId });

  res.status(201).json({
    message: "chat deleted successfully",
  });
}

export async function deleteMessages(req, res) {
  const { msgId } = req.params;

  const message = await messageModel.findOne({
    _id: msgId,
  });

  if (!message) {
    return res.status(404).json({
      messages: "No message found",
      success: false,
      error: "user don't contain this chat",
    });
  }

  await messageModel.deleteOne({ _id: msgId });
  res.status(201).json({
    message: "messages deleted successfully",
  });
}

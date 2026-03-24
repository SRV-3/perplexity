import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import { useChat } from "../hooks/useChat";

const Dashboard = () => {
  const user = "s";
  const chat = useChat();

  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const trimmedMessage = input.trim();
    if (!trimmedMessage) return;

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId });

    setInput("");
    setIsTyping(true);
  };

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats);
  };

  return (
    <main className="h-screen w-full flex bg-[#171717] text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 h-full flex flex-col border-r border-[#2f2f2f] bg-[#171717]">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight">srvAI</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
          <button className="w-full flex items-center justify-between p-3 rounded-lg border border-[#2f2f2f] hover:bg-[#212121] transition-colors mb-6">
            <span className="text-sm font-medium">New Chat</span>
            <span className="text-lg">+</span>
          </button>

          <div className="space-y-1">
            {Object.values(chats).map((c) => (
              <div
                onClick={() => openChat(c.id)}
                key={c.id}
                className="group relative p-3 rounded-xl hover:bg-[#212121] cursor-pointer transition-all border border-transparent hover:border-[#2f2f2f]"
              >
                <p className="text-sm text-neutral-400 group-hover:text-white truncate pr-6">
                  {c.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-[#2f2f2f] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full" />
          <p className="text-sm font-medium truncate">
            {user?.username || "Guest"}
          </p>
        </div>
      </aside>

      {/* Main Chat Area */}
      <section className="flex-1 h-full flex flex-col items-center relative">
        <div className="w-full max-w-3xl flex-1 overflow-y-auto scrollbar-hide pt-10 px-4 space-y-8 pb-32">
          {chats[currentChatId]?.messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col w-full ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-3 text-base shadow-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#2f2f2f] text-white self-end"
                    : "bg-transparent text-neutral-200 self-start border border-transparent"
                }`}
              >
                {msg.role === "ai" && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px]">
                      AI
                    </div>
                    <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      srvAI
                    </span>
                  </div>
                )}
                {msg.role === "ai" ? (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                ) : (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                )}
              </div>
            </div>
          ))}
          {/* {isTyping && (
            <div className="flex items-center gap-2 text-neutral-500 ml-2">
              <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce [animation-delay:-.3s]" />
              <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce [animation-delay:-.5s]" />
            </div>
          )} */}
          {/* <div ref={messagesEndRef} /> */}
        </div>

        {/* Floating Input Bar */}
        <div className="absolute bottom-0 w-full p-8 flex justify-center">
          <form
            onSubmit={handleSendMessage}
            className="w-full max-w-3xl relative group"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message srvAI..."
              className="w-full bg-[#212121] border border-[#2f2f2f] rounded-2xl p-4 pl-6 pr-14 text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 transition-all shadow-xl"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-200 transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m5 12 7-7 7 7" />
                <path d="M12 19V5" />
              </svg>
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;

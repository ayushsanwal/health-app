"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔥 LOAD FROM LOCAL STORAGE
  useEffect(() => {
    const saved = localStorage.getItem("chat_history");
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  // 🔥 SAVE TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem("chat_history", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/chat",
        { message: input },
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        }
      );

      setMessages([
        ...newMessages,
        { role: "bot", text: res.data.reply },
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "bot", text: "Something went wrong ❌" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-green-700 z-50"
      >
        💬
      </button>

      {/* CHAT WINDOW */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 h-[450px] bg-white rounded-xl shadow-xl flex flex-col z-50">

          {/* HEADER */}
          <div className="bg-green-600 text-white p-3 rounded-t-xl font-semibold">
            Health Assistant
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">

            {messages.length === 0 && (
              <p className="text-gray-500 text-sm">
                Ask me anything about fitness, diet, or health 💪
              </p>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-sm p-2 rounded-lg max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-green-100 self-end ml-auto text-gray-900"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <p className="text-gray-500 text-sm">Typing...</p>
            )}

          </div>

          {/* INPUT */}
          <div className="p-3 border-t flex gap-2">

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm text-gray-900"
            />

            <button
              onClick={sendMessage}
              className="bg-green-600 text-white px-3 rounded-lg hover:bg-green-700"
            >
              Send
            </button>

          </div>

        </div>
      )}
    </>
  );
}
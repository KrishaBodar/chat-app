import { useState, useRef, useEffect } from "react";
import { Send, Image as ImageIcon, Smile } from "lucide-react";
import { motion } from "framer-motion";

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: "text" | "image";
  timestamp: string;
  seen?: boolean;
}

interface ChatWindowProps {
  messages: Message[];
  currentUserId: string;
  chatName: string;
  chatAvatar?: string;
  online?: boolean;
  onSendMessage: (content: string, type: "text" | "image") => void;
  loading?: boolean;
}

/**
 * ChatWindow — message bubbles, input bar, auto-scroll.
 */
export function ChatWindow({
  messages,
  currentUserId,
  chatName,
  chatAvatar,
  online,
  onSendMessage,
  loading,
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input.trim(), "text");
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-border bg-card/50">
        <div className="relative">
          <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-semibold text-sm">
            {chatAvatar ? (
              <img src={chatAvatar} alt={chatName} className="w-full h-full rounded-full object-cover" />
            ) : (
              chatName.charAt(0).toUpperCase()
            )}
          </div>
          {online && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-online border-2 border-card" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm">{chatName}</h3>
          <p className="text-xs text-muted-foreground">
            {online ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Start a conversation...
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMine = msg.senderId === currentUserId;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i > messages.length - 3 ? 0.05 : 0 }}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                    isMine
                      ? "bg-chat-sent text-chat-sent-foreground rounded-br-md"
                      : "bg-chat-received text-chat-received-foreground rounded-bl-md"
                  }`}
                >
                  {msg.type === "image" ? (
                    <img
                      src={msg.content}
                      alt="shared"
                      className="rounded-lg max-w-full max-h-60 object-cover"
                    />
                  ) : (
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  )}
                  <p
                    className={`text-[10px] mt-1 ${
                      isMine ? "text-primary-foreground/60" : "text-muted-foreground"
                    }`}
                  >
                    {msg.timestamp}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Input bar */}
      <div className="px-4 py-3 border-t border-border bg-card/50">
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
            <Smile className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
            <ImageIcon className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 h-10 px-4 rounded-lg bg-secondary text-foreground placeholder:text-muted-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

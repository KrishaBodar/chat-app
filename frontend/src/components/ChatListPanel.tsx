import { Search } from "lucide-react";
import { useState } from "react";

export interface ChatItem {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unseenCount: number;
  online?: boolean;
}

interface ChatListPanelProps {
  chats: ChatItem[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  loading?: boolean;
}

/**
 * ChatListPanel — shows list of conversations with search, unread badges, online status.
 */
export function ChatListPanel({ chats, activeChatId, onSelectChat, loading }: ChatListPanelProps) {
  const [search, setSearch] = useState("");

  const filtered = chats.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-80 h-full border-r border-border flex flex-col bg-card/50">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-bold text-foreground mb-3">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-lg bg-secondary text-foreground placeholder:text-muted-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm mt-8">No conversations yet</p>
        ) : (
          filtered.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all hover:bg-secondary/80 ${
                activeChatId === chat.id ? "bg-secondary" : ""
              }`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-11 h-11 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  {chat.avatar ? (
                    <img src={chat.avatar} alt={chat.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    chat.name.charAt(0).toUpperCase()
                  )}
                </div>
                {chat.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-online border-2 border-card" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-semibold text-sm text-foreground truncate">{chat.name}</span>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{chat.timestamp}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
              </div>

              {/* Unseen badge */}
              {chat.unseenCount > 0 && (
                <span className="flex-shrink-0 w-5 h-5 rounded-full gradient-bg text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {chat.unseenCount}
                </span>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import { IconSidebar } from "@/components/IconSidebar";
import { ChatListPanel, ChatItem } from "@/components/ChatListPanel";
import { ChatWindow, Message } from "@/components/ChatWindow";
import { RightPanel } from "@/components/RightPanel";
import { getAllChats, getMessages, sendMessage as sendMessageApi, getAllUsers, createChat } from "@/services/api";
import { toast } from "sonner";
import { socket } from "@/lib/socket";

interface ChatPageProps {
  user: { id: string; email: string; name?: string; avatar?: string };
  onLogout: () => void;
}

export default function ChatPage({ user, onLogout }: ChatPageProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "profile" | "settings">("chat");
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // ✅ LOAD CHATS
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await getAllChats();
        setChats(data.chats || []);
      } catch {
        setChats([]);
      } finally {
        setLoadingChats(false);
      }
    };
    fetchChats();
  }, []);

  // ✅ LOAD USERS (FOR START CHAT)
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const { data } = await getAllUsers();
      console.log("USERS:", data); // 👈 ADD THIS
      setUsers(data.users || []);
    } catch (err) {
      console.log("ERROR USERS:", err);
    }
  };

  fetchUsers();
}, []);

  // ✅ CREATE CHAT
  const handleStartChat = async (otherUserId: string) => {
    try {
      await createChat(otherUserId);

      const { data } = await getAllChats();
      setChats(data.chats || []);

      toast.success("Chat created!");
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ LOAD MESSAGES
  const loadMessages = useCallback(async (chatId: string) => {
    setActiveChatId(chatId);

    socket.emit("join_chat", chatId);

    setLoadingMessages(true);
    try {
      const { data } = await getMessages(chatId);
      setMessages(data.messages || []);
    } catch {
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  // ✅ SOCKET LISTENER
  useEffect(() => {
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  // ✅ SEND MESSAGE
  const handleSendMessage = async (content: string, type: "text" | "image") => {
    if (!activeChatId) return;

    const newMsg: Message = {
      id: `temp-${Date.now()}`,
      chatId: activeChatId,
      senderId: user.id,
      content,
      type,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMsg]);

    socket.emit("send_message", {
      chatId: activeChatId,
      text: content,
    });

    try {
      await sendMessageApi({
        chatId: activeChatId,
        content,
        type,
      });
    } catch {
      toast.error("Message may not have been delivered");
    }
  };

  const activeChat = chats.find((c) => c.id === activeChatId);

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <IconSidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={onLogout} />

      {/* 🔥 START CHAT SECTION */}
      <div className="w-60 border-r p-2 overflow-y-auto">
        <h3 className="font-bold mb-2">Start Chat</h3>
        {users.map((u) => (
          <button
            key={u._id}
            onClick={() => handleStartChat(u._id)}
            className="block w-full text-left p-2 hover:bg-gray-200 rounded"
          >
            {u.name}
          </button>
        ))}
      </div>

      <ChatListPanel
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={loadMessages}
        loading={loadingChats}
      />

      {activeChatId && activeChat ? (
        <ChatWindow
          messages={messages}
          currentUserId={user.id}
          chatName={activeChat.name}
          chatAvatar={activeChat.avatar}
          online={activeChat.online}
          onSendMessage={handleSendMessage}
          loading={loadingMessages}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <h3>Select a chat</h3>
        </div>
      )}

      {activeChatId && activeChat && (
        <RightPanel
          name={activeChat.name}
          avatar={activeChat.avatar}
          online={activeChat.online}
          sharedImages={messages.filter((m) => m.type === "image").map((m) => m.content)}
        />
      )}
    </div>
  );
}
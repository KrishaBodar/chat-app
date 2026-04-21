import { MessageCircle, User, Settings, Sun, Moon, LogOut } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

interface IconSidebarProps {
  activeTab: "chat" | "profile" | "settings";
  onTabChange: (tab: "chat" | "profile" | "settings") => void;
  onLogout: () => void;
}

/**
 * IconSidebar — narrow left sidebar with icon navigation and theme toggle.
 */
export function IconSidebar({ activeTab, onTabChange, onLogout }: IconSidebarProps) {
  const { theme, toggleTheme } = useTheme();

  const tabs = [
    { id: "chat" as const, icon: MessageCircle, label: "Chats" },
    { id: "profile" as const, icon: User, label: "Profile" },
    { id: "settings" as const, icon: Settings, label: "Settings" },
  ];

  return (
    <div className="w-[68px] h-full glass-strong flex flex-col items-center py-6 gap-2">
      {/* Logo */}
      <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center mb-6">
        <MessageCircle className="w-5 h-5 text-primary-foreground" />
      </div>

      {/* Nav tabs */}
      <div className="flex-1 flex flex-col gap-1">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            title={label}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
              activeTab === id
                ? "gradient-bg text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <Icon className="w-5 h-5" />
          </button>
        ))}
      </div>

      {/* Bottom actions */}
      <div className="flex flex-col gap-1">
        <button
          onClick={toggleTheme}
          title="Toggle theme"
          className="w-11 h-11 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button
          onClick={onLogout}
          title="Logout"
          className="w-11 h-11 rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

import { useState } from "react";
import AuthPage from "@/pages/AuthPage";
import ChatPage from "@/pages/ChatPage";
import { useAuth } from "@/hooks/useAuth";
import { Toaster as Sonner } from "@/components/ui/sonner";

/**
 * App — root component. Shows auth or chat based on login state.
 * No router needed since there are only two states.
 */
const App = () => {
  const { isAuthenticated, user, login, logout } = useAuth();

  const handleAuthSuccess = (token: string, userData: any) => {
    login(token, userData);
  };

  if (!isAuthenticated || !user) {
    return (
      <>
        <Sonner />
        <AuthPage onSuccess={handleAuthSuccess} />
      </>
    );
  }

  return (
    <>
      <Sonner />
      <ChatPage user={user} onLogout={logout} />
    </>
  );
};

export default App;

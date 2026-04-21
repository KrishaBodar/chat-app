import axios from "axios";

// Use your machine's IP since the browser accesses from 10.38.22.180
// Change this if you deploy — ideally use env variables
const AUTH_BASE = import.meta.env.VITE_AUTH_API ?? "http://10.38.22.180:5001/api/v1";
const CHAT_BASE = import.meta.env.VITE_CHAT_API ?? "http://10.38.22.180:5000/api/v1";

/** Auth API — email OTP based (port 5001) */
const authApi = axios.create({
  baseURL: AUTH_BASE,
});

/** Chat API — messages & chats (port 5000) */
const chatApi = axios.create({
  baseURL: CHAT_BASE,
});

// Interceptor: attach token to ALL auth requests (needed for /me, /user/all etc.)
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor: attach token to ALL chat requests
chatApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth endpoints ──────────────────────────────────────────────

/** Step 1: Send OTP to email */
export const sendOtp = (email: string) =>
  authApi.post("/login", { email });

/** Step 2: Verify OTP → returns { token, user } */
export const verifyOtp = (email: string, otp: string) =>
  authApi.post("/verify", { email, otp });

/** Get current logged-in user profile */
export const getMyProfile = () =>
  authApi.get("/me");

/** Get all users (for starting new chats) */
export const getAllUsers = () =>
  authApi.get("/user/all");

// ── Chat endpoints ──────────────────────────────────────────────

/** Get all chats for current user */
export const getAllChats = () => chatApi.get("/chat/all");

/** Start a new chat with a user */
export const createChat = (userId: string) =>
  chatApi.post("/chat/new", { otherUserId: userId });


/** Get messages for a specific chat */
export const getMessages = (chatId: string) =>
  chatApi.get(`/message/${chatId}`);

/** Send a text or image message */
export const sendMessage = (data: {
  chatId: string;
  content: string;
  type?: "text" | "image";
}) => chatApi.post("/message", data);

/** Get a specific user's info by ID */
export const getUser = (userId: string) =>
  authApi.get(`/user/${userId}`);   // NOTE: user routes are on authApi (port 5001)
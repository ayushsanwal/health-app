"use client";

import { usePathname } from "next/navigation";
import Chatbot from "./Chatbot";

export default function ChatbotWrapper() {
  const pathname = usePathname();

  const hiddenRoutes = [
    "/cart",
    "/checkout",
    "/auth",
    "/profile",
  ];

  if (hiddenRoutes.includes(pathname)) return null;

  return <Chatbot />;
}
import ChatBody from "../components/chat/ChatBody";
import { useLocation, useNavigate } from "react-router-dom";
import BottomNavBar from "../components/tutor/mobile/BottomNavBar";
import MChatBody from "../components/chat/mobile/MChatBody";
import NavBar from "@/components/NavBar";
import React, { useState, useEffect, useRef } from "react";

function ChatPage() {
  const navigate = useNavigate();
  const isMobile = /iPhone|iPod|Android/i.test(window.navigator.userAgent);
  const { state } = useLocation();

  console.log("state", state);
  const back = () => {
    navigate("/");
  };

  useEffect(() => {
    if (!state) back();
  }, []);

  if (!state) return;

  if (isMobile) {
    return (
      <div className="flex flex-col h-full">
        <NavBar onBack={back}>聊天</NavBar>
        <MChatBody AIdata={state?.AIdata} />
      </div>
    );
  } else {
    return <ChatBody AIdata={state?.AIdata} />;
  }
}
export default ChatPage;

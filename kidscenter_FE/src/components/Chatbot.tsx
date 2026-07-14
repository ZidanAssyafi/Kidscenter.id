"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./Chatbot.css";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
}

export default function Chatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  // Drag states
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0 });
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Halo! Aku Mari, asisten virtual Kidscenter. Aku bisa bantu kamu mencari ide atau merancang konsep animasi lho. Ada yang bisa aku bantu hari ini?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check auth status
  useEffect(() => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const user = sessionStorage.getItem("user") || localStorage.getItem("user");
    if (token && user) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setPosition({ x: 0, y: 0 });
      setHasDragged(false);
      setIsDragging(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragRef.current.startX,
        y: e.clientY - dragRef.current.startY,
      });
    };
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent dragging when clicking the close button
    if ((e.target as HTMLElement).closest('.chatbot-close-btn')) return;
    
    setIsDragging(true);
    setHasDragged(true);
    dragRef.current = {
      startX: e.clientX - position.x,
      startY: e.clientY - position.y,
    };
  };

  const handleIconClick = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(!showLoginPrompt);
      setIsOpen(false);
    } else {
      setIsOpen(!isOpen);
      setShowLoginPrompt(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue;
    const newUserMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, newUserMsg],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const newBotMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: data.reply || "Maaf, sepertinya aku sedang kesulitan berpikir. Coba tanyakan lagi nanti ya!",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, newBotMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "Maaf, koneksiku sedang tidak stabil. Tolong coba lagi ya! 😢",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      const windowEl = document.querySelector('.chatbot-window') as HTMLElement;
      if (windowEl && window.visualViewport) {
        if (window.innerWidth <= 768) {
          // Set height exactly to visual viewport height so keyboard doesn't push it up out of view
          windowEl.style.height = `${window.visualViewport.height}px`;
        } else {
          windowEl.style.height = '';
        }
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      handleResize(); // trigger immediately on open
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, [isOpen]);

  // Hide chatbot on certain pages
  if (
    pathname?.startsWith("/admin") || 
    pathname?.startsWith("/profile") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register")
  ) {
    return null;
  }

  return (
    <div className="chatbot-wrapper">
      {/* Tooltip */}
      {!isOpen && !showLoginPrompt && (
        <div className="chatbot-tooltip">Ngobrol dengan Mari!</div>
      )}

      {/* Floating Icon */}
      <div className="chatbot-trigger" onClick={handleIconClick}>
        <Image
          src="/Mari.webp"
          alt="Mari Chatbot"
          width={70}
          height={70}
          className="chatbot-icon-img"
        />
      </div>

      {/* Unauthenticated Prompt */}
      {showLoginPrompt && (
        <div className="chatbot-login-prompt">
          <button
            className="chatbot-close-prompt"
            onClick={() => setShowLoginPrompt(false)}
            aria-label="Tutup"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <h4>Halo! 👋</h4>
          <p>Masuk dulu yuk supaya kita bisa ngobrol dan aku bisa bantu kamu lebih jauh!</p>
          <Link href="/login" className="chatbot-btn-login">
            Masuk Sekarang
          </Link>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="chatbot-window"
          style={hasDragged ? { 
            transform: `translate(${position.x}px, ${position.y}px)`, 
            transition: isDragging ? 'none' : 'transform 0.2s',
            animation: 'none' 
          } : undefined}
        >
          {/* Header */}
          <div 
            className="chatbot-header"
            onMouseDown={handleMouseDown}
            style={{ cursor: isDragging ? "grabbing" : "grab", userSelect: "none" }}
          >
            <div className="chatbot-header-info">
              <div className="chatbot-header-avatar">
                <Image src="/Mari.webp" alt="Mari Avatar" width={44} height={44} />
              </div>
              <div className="chatbot-header-text">
                <span className="chatbot-header-name">Mari</span>
                <span className="chatbot-header-status">
                  <span className="chatbot-status-dot"></span> Online
                </span>
              </div>
            </div>
            <button
              className="chatbot-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Tutup Chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="chatbot-body">
            {messages.map((msg) => {
              // Format simple markdown (bold and line breaks)
              const formattedText = msg.text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n/g, '<br/>');

              return (
                <div key={msg.id} className={`chat-message ${msg.sender}`}>
                  <div className="chat-bubble" dangerouslySetInnerHTML={{ __html: formattedText }} />
                  <div className="chat-time">{msg.time}</div>
                </div>
              );
            })}
            {isTyping && (
              <div className="chat-message bot">
                <div className="chat-bubble typing-indicator">
                  <span>.</span><span>.</span><span>.</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer (Input) */}
          <form className="chatbot-footer" onSubmit={handleSendMessage}>
            <input
              type="text"
              className="chatbot-input"
              placeholder="Ketik pesanmu di sini..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              type="submit"
              className="chatbot-send-btn"
              disabled={!inputValue.trim()}
              aria-label="Kirim Pesan"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

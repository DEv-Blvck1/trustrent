"use client";

import React, { useState } from "react";
import {
  Lock,
  Unlock,
  Send,
  MessageSquare,
  Shield,
  User,
  AlertCircle,
} from "lucide-react";
import { ChatMessage, ConversationSettings, UserRole } from "@/types/property";
import { useToast } from "@/components/common/Toast";
import { genId } from "@/lib/utils";
import { sanitizeInput, rateLimiter } from "@/lib/security";

interface TwoWayChatProps {
  propertyId: string;
  propertyAddress: string;
  userRole: UserRole;
  userName: string;
  chats: ChatMessage[];
  conversationSettings: ConversationSettings;
  onSendMessage: (msg: ChatMessage) => void;
  onToggleLock: (isLocked: boolean) => void;
}

export function TwoWayChat({
  propertyId,
  propertyAddress,
  userRole,
  userName,
  chats,
  conversationSettings,
  onSendMessage,
  onToggleLock,
}: TwoWayChatProps) {
  const [inputText, setInputText] = useState("");
  const { showToast } = useToast();

  const propertyChats = chats.filter((c) => c.propertyId === propertyId);
  const isOwner = userRole === "owner";
  const isLocked = conversationSettings.isLocked;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanText = sanitizeInput(inputText);
    if (!cleanText) return;

    if (isLocked && !isOwner) {
      showToast("Conversation is currently locked by the Property Owner.", "warning");
      return;
    }

    // Rate Limiting Protection (Anti-Spam)
    const rateCheck = rateLimiter.check(`chat_${propertyId}_${userRole}`, 6, 10000);
    if (!rateCheck.allowed) {
      showToast(`Slow down! Please wait ${rateCheck.waitSeconds}s before sending another message.`, "warning");
      return;
    }

    const newMsg: ChatMessage = {
      id: genId(),
      propertyId,
      senderRole: isOwner ? "owner" : "tenant",
      senderName: userName || (isOwner ? "Property Owner" : "Tenant"),
      text: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
    };

    onSendMessage(newMsg);
    setInputText("");
    showToast("Message sent.", "success");
  };

  const handleToggleLockClick = () => {
    const nextLocked = !isLocked;
    onToggleLock(nextLocked);
    showToast(
      nextLocked
        ? "Conversation locked. Tenants cannot reply until unlocked."
        : "Conversation unlocked. Two-way messaging enabled.",
      nextLocked ? "warning" : "success"
    );
  };

  return (
    <div className="card bg-white rounded-3xl border border-[#e6ddce] shadow-md flex flex-col h-[520px] overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 bg-[#faf6ef] border-b border-[#e6ddce] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0f4c81]/15 text-[#0f4c81] flex items-center justify-center">
            <MessageSquare size={18} />
          </div>
          <div>
            <h4 className="font-display font-bold text-base text-[#1b130a]">
              Direct Two-Way Messaging
            </h4>
            <p className="text-xs text-[#786953]">
              Property: <strong className="text-[#1b130a]">{propertyAddress}</strong>
            </p>
          </div>
        </div>

        {/* Lock / Unlock Toggle Button (Super Admin control) */}
        {isOwner ? (
          <button
            onClick={handleToggleLockClick}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isLocked
                ? "bg-[#b91c1c] text-white hover:bg-[#991b1b]"
                : "bg-[#226444] text-white hover:bg-[#1a4f35]"
            }`}
            title="Super Admin controls two-way messaging access"
          >
            {isLocked ? <Lock size={13} /> : <Unlock size={13} />}
            <span>{isLocked ? "Conversation Locked" : "Conversation Open"}</span>
          </button>
        ) : (
          <span
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
              isLocked
                ? "bg-[#fee2e2] text-[#991b1b]"
                : "bg-[#dcfce7] text-[#166534]"
            }`}
          >
            {isLocked ? <Lock size={12} /> : <Unlock size={12} />}
            <span>{isLocked ? "Chat Locked by Owner" : "Active & Open"}</span>
          </span>
        )}
      </div>

      {/* Lock Banner Notice */}
      {isLocked && (
        <div className="bg-[#fef2f2] border-b border-[#fecaca] px-4 py-2 flex items-center gap-2 text-xs text-[#991b1b]">
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>
            {isOwner
              ? "You have locked this conversation. Tenants can read past history but cannot reply."
              : conversationSettings.lockedReason || "Direct replies have been locked by the Property Owner."}
          </span>
        </div>
      )}

      {/* Message Bubbles Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#fdfbf8]">
        {propertyChats.map((c) => {
          const isMe =
            (isOwner && c.senderRole === "owner") ||
            (!isOwner && c.senderRole === "tenant");

          return (
            <div
              key={c.id}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              <div className="flex items-center gap-1.5 mb-0.5 text-[10px] text-[#786953]">
                <span>{c.senderName}</span>
                <span>•</span>
                <span>{c.timestamp}</span>
              </div>
              <div
                className={`max-w-[78%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                  isMe
                    ? "bg-[#0f4c81] text-white rounded-tr-none"
                    : "bg-white text-[#1b130a] border border-[#e6ddce] rounded-tl-none"
                }`}
              >
                {c.text}
              </div>
            </div>
          );
        })}

        {propertyChats.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center text-[#786953] space-y-2">
            <MessageSquare size={32} className="opacity-30 text-[#0f4c81]" />
            <p className="text-xs font-semibold">No messages yet in this channel</p>
            <p className="text-[11px] max-w-xs">
              Start a direct conversation regarding repairs, tenancy terms, or official queries.
            </p>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-white border-t border-[#e6ddce] flex items-center gap-2"
      >
        <input
          type="text"
          disabled={isLocked && !isOwner}
          placeholder={
            isLocked && !isOwner
              ? "Conversation locked by Property Owner"
              : "Type your message..."
          }
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-[#faf6ef] border border-[#e6ddce] rounded-2xl px-4 py-2.5 text-xs text-[#1b130a] focus:outline-none focus:border-[#0f4c81] disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={(!inputText.trim()) || (isLocked && !isOwner)}
          className="p-2.5 rounded-2xl bg-[#0f4c81] text-white hover:bg-[#0a365c] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-[#0f4c81]/20"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}


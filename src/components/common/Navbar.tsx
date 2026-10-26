"use client";

import React, { useState } from "react";
import {
  Home,
  Bell,
  User,
  Shield,
  Building,
  Menu,
  X,
  CheckCircle,
  FileText,
  AlertCircle,
  Megaphone,
  Briefcase,
  LogOut,
  UserCheck,
} from "lucide-react";
import { UserRole, AppNotification, UserSession } from "@/types/property";

interface NavbarProps {
  currentRole: UserRole;
  session: UserSession | null;
  onSignOut: () => void;
  onNavigateHome: () => void;
  onSelectRole: (role: UserRole) => void;
  onOpenAuth: (mode: "login" | "signup", role?: UserRole) => void;
  notifications: AppNotification[];
  onMarkNotificationsRead: () => void;
}

export function Navbar({
  currentRole,
  session,
  onSignOut,
  onNavigateHome,
  onSelectRole,
  onOpenAuth,
  notifications,
  onMarkNotificationsRead,
}: NavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter notifications relevant to current role
  const roleNotifications = notifications.filter((n) => {
    if (currentRole === "guest") return true;
    return n.targetRole === "all" || n.targetRole === currentRole;
  });

  const unreadCount = roleNotifications.filter((n) => !n.read).length;

  const handleToggleNotifications = () => {
    if (!showNotifications) {
      onMarkNotificationsRead();
    }
    setShowNotifications(!showNotifications);
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-[#e6ddce] transition-all">
      <div className="w-full px-4 lg:px-8 py-3.5 flex items-center justify-between">
        {/* LOGO: Clicking always takes to Homepage */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-3 text-left group focus:outline-none"
          title="Return to TrustRent Homepage"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0f4c81] to-[#2563eb] text-white flex items-center justify-center shadow-md shadow-[#0f4c81]/25 group-hover:scale-105 transition-transform">
            <Home size={20} className="stroke-[2.3]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-2xl tracking-tight text-[#1b130a] group-hover:text-[#0f4c81] transition-colors leading-none">
                TrustRent
              </span>
              <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-[#0f4c81]/10 text-[#0f4c81]">
                Estate
              </span>
            </div>
            <p className="text-[10px] text-[#786953] font-semibold mt-0.5">
              Rental & Property Management
            </p>
          </div>
        </button>

        {/* Public Desktop Navigation Links (matching Sample Image 1) */}
        <div className="hidden lg:flex items-center gap-8 text-xs font-bold text-[#786953]">
          <button
            onClick={onNavigateHome}
            className={`transition-colors hover:text-[#0f4c81] ${
              currentRole === "guest" ? "text-[#0f4c81]" : ""
            }`}
          >
            Home
          </button>
          <a href="#about" className="transition-colors hover:text-[#0f4c81]">
            About
          </a>
          <a href="#services" className="transition-colors hover:text-[#0f4c81]">
            Services
          </a>
          <a href="#properties" className="transition-colors hover:text-[#0f4c81]">
            Properties
          </a>
          <a href="#agents" className="transition-colors hover:text-[#0f4c81]">
            Agents
          </a>
          <a href="#testimonials" className="transition-colors hover:text-[#0f4c81]">
            Testimonials
          </a>
        </div>

        {/* Action Controls & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Role Switcher Tabs */}
          <div className="hidden md:flex items-center p-1 rounded-2xl bg-[#faf6ef] border border-[#e6ddce] text-xs font-bold">
            <button
              onClick={() => onSelectRole("guest")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                currentRole === "guest"
                  ? "bg-white text-[#0f4c81] shadow-sm"
                  : "text-[#786953] hover:text-[#1b130a]"
              }`}
            >
              Public
            </button>
            <button
              onClick={() => onSelectRole("tenant")}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                currentRole === "tenant"
                  ? "bg-[#0f4c81] text-white shadow-sm"
                  : "text-[#786953] hover:text-[#1b130a]"
              }`}
            >
              <User size={13} /> Tenant
            </button>
            <button
              onClick={() => onSelectRole("agent")}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                currentRole === "agent"
                  ? "bg-[#0284c7] text-white shadow-sm"
                  : "text-[#786953] hover:text-[#1b130a]"
              }`}
            >
              <Briefcase size={13} /> Agent
            </button>
            <button
              onClick={() => onSelectRole("owner")}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                currentRole === "owner"
                  ? "bg-[#c4601a] text-white shadow-sm"
                  : "text-[#786953] hover:text-[#1b130a]"
              }`}
            >
              <Shield size={13} /> Super Admin
            </button>
          </div>

          {/* NOTIFICATION BELL ICON (Present on all sides) */}
          <div className="relative">
            <button
              onClick={handleToggleNotifications}
              className="p-2 sm:p-2.5 rounded-2xl bg-[#faf6ef] border border-[#e6ddce] text-[#786953] hover:text-[#1b130a] relative transition-colors"
              title="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#b91c1c] text-white text-[10px] font-bold flex items-center justify-center animate-pulse shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Drawer */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white border border-[#e6ddce] shadow-2xl p-4 z-50 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-[#e6ddce]">
                  <h4 className="font-display font-bold text-base text-[#1b130a]">
                    Notifications ({roleNotifications.length})
                  </h4>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 rounded-lg text-[#786953] hover:bg-[#faf6ef]"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto space-y-2.5 py-3">
                  {roleNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-3 rounded-2xl bg-[#faf6ef] border border-[#e6ddce]/60 text-xs space-y-1 hover:border-[#0f4c81]/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1b130a] flex items-center gap-1.5">
                          {notif.type === "reminder" && <Bell size={13} className="text-[#b91c1c]" />}
                          {notif.type === "receipt" && <FileText size={13} className="text-[#166534]" />}
                          {notif.type === "announcement" && <Megaphone size={13} className="text-[#0f4c81]" />}
                          <span>{notif.title}</span>
                        </span>
                        <span className="text-[10px] text-[#786953]">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-[#786953] text-[11px] leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  ))}

                  {roleNotifications.length === 0 && (
                    <div className="p-6 text-center text-xs text-[#786953]">
                      No new notifications.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Session or Auth Trigger Buttons */}
          {session ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#faf6ef] border border-[#e6ddce]">
                <div className="w-6 h-6 rounded-full bg-[#0f4c81] text-white flex items-center justify-center text-[10px] font-bold">
                  {session.name ? session.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-bold text-[#1b130a] leading-tight line-clamp-1 max-w-[100px]">
                    {session.name || session.email}
                  </p>
                  <span className="text-[9px] uppercase font-bold text-[#786953]">
                    {session.role === "owner" ? "Super Admin" : session.role === "agent" ? "House Agent" : "Tenant"}
                  </span>
                </div>
              </div>
              <button
                onClick={onSignOut}
                className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                title="Sign Out of Session"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth("login")}
              className="px-3.5 sm:px-4 py-2 rounded-2xl bg-[#0f4c81] text-white text-xs font-bold hover:bg-[#0a365c] transition-all shadow-md shadow-[#0f4c81]/20 whitespace-nowrap"
            >
              Sign In
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 md:hidden rounded-xl text-[#786953] hover:bg-[#faf6ef]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden p-4 bg-white border-t border-[#e6ddce] space-y-3 animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col gap-2 text-xs font-bold text-[#786953]">
            <button
              onClick={() => {
                onNavigateHome();
                setMobileMenuOpen(false);
              }}
              className="text-left py-1.5 hover:text-[#0f4c81]"
            >
              Home
            </button>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#0f4c81]"
            >
              About
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#0f4c81]"
            >
              Services
            </a>
            <a
              href="#properties"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#0f4c81]"
            >
              Properties
            </a>
            <a
              href="#agents"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#0f4c81]"
            >
              Agents
            </a>
          </div>

          {/* Mobile Role Switcher */}
          <div className="pt-2 border-t border-[#e6ddce] grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onSelectRole("guest");
                setMobileMenuOpen(false);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                currentRole === "guest"
                  ? "bg-stone-800 text-white"
                  : "bg-stone-100 text-stone-700"
              }`}
            >
              Public
            </button>
            <button
              onClick={() => {
                onSelectRole("tenant");
                setMobileMenuOpen(false);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                currentRole === "tenant"
                  ? "bg-[#0f4c81] text-white"
                  : "bg-blue-50 text-[#0f4c81]"
              }`}
            >
              <User size={13} /> Tenant
            </button>
            <button
              onClick={() => {
                onSelectRole("agent");
                setMobileMenuOpen(false);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                currentRole === "agent"
                  ? "bg-[#0284c7] text-white"
                  : "bg-sky-50 text-[#0284c7]"
              }`}
            >
              <Briefcase size={13} /> Agent
            </button>
            <button
              onClick={() => {
                onSelectRole("owner");
                setMobileMenuOpen(false);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                currentRole === "owner"
                  ? "bg-[#c4601a] text-white"
                  : "bg-amber-50 text-[#c4601a]"
              }`}
            >
              <Shield size={13} /> Super Admin
            </button>
          </div>

          {session && (
            <div className="pt-2 border-t border-[#e6ddce] flex items-center justify-between">
              <div className="text-xs">
                <p className="font-bold text-[#1b130a]">{session.name || session.email}</p>
                <p className="text-[10px] text-[#786953] capitalize">{session.role} session active</p>
              </div>
              <button
                onClick={() => {
                  onSignOut();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}


"use client";

import React, { useState, useEffect } from "react";
import {
  Property,
  PaymentRecord,
  PaymentStatus,
  DefectEvidence,
  CautionFeeTracker,
  PropertyExpense,
  Announcement,
  ChatMessage,
  AgentApplication,
  AppNotification,
  UserRole,
  TenantProfile,
  AgentProfile,
  OwnerProfile,
  UserSession,
} from "@/types/property";
import {
  loadProperties,
  saveProperties,
  loadAnnouncements,
  saveAnnouncements,
  loadChats,
  saveChats,
  loadAgents,
  saveAgents,
  loadNotifications,
  saveNotifications,
  loadTenantProfile,
  saveTenantProfile,
  loadAgentProfile,
  saveAgentProfile,
  loadOwnerProfile,
  saveOwnerProfile,
  loadSession,
  saveSession,
  clearSession,
  resetAllDataToSeed,
} from "@/lib/storage";
import {
  DEFAULT_TENANT_PROFILE,
  DEFAULT_AGENT_PROFILE,
  DEFAULT_OWNER_PROFILE,
} from "@/lib/constants";
import { Navbar } from "@/components/common/Navbar";
import { LandingPage } from "@/components/home/LandingPage";
import { Sidebar } from "@/components/Sidebar";
import { PropertyHeader } from "@/components/PropertyHeader";
import { OverviewTab } from "@/components/tabs/OverviewTab";
import { PaymentsTab } from "@/components/tabs/PaymentsTab";
import { DefectsTab } from "@/components/tabs/DefectsTab";
import { CautionTrackerTab } from "@/components/tabs/CautionTrackerTab";
import { NotesTab } from "@/components/tabs/NotesTab";
import { TenantLeaseCountdown } from "@/components/tenant/TenantLeaseCountdown";
import { TenantDocumentsVault } from "@/components/tenant/TenantDocumentsVault";
import { TwoWayChat } from "@/components/chat/TwoWayChat";
import { AdminRevenueExpenses } from "@/components/admin/AdminRevenueExpenses";
import { AdminAnnouncements } from "@/components/admin/AdminAnnouncements";
import { AdminTenantDirectory } from "@/components/admin/AdminTenantDirectory";
import { AdminAgentApprovals } from "@/components/admin/AdminAgentApprovals";
import { TenantProfileSettings } from "@/components/profile/TenantProfileSettings";
import { OwnerProfileSettings } from "@/components/profile/OwnerProfileSettings";
import { AgentDashboard } from "@/components/agent/AgentDashboard";
import { AuthModal } from "@/components/auth/AuthModals";
import { AddPropertyModal } from "@/components/modals/AddPropertyModal";
import { EditPropertyModal } from "@/components/modals/EditPropertyModal";
import { AddPaymentModal } from "@/components/modals/AddPaymentModal";
import { AdminIssueReceiptModal } from "@/components/modals/AdminIssueReceiptModal";
import { ReceiptModal } from "@/components/modals/ReceiptModal";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { useToast } from "@/components/common/Toast";
import {
  Home,
  CreditCard,
  Camera,
  ShieldAlert,
  FileText,
  Clock,
  FolderLock,
  MessageSquare,
  TrendingUp,
  Megaphone,
  Users,
  Award,
  PlusCircle,
  Building2,
  Sparkles,
  Settings,
  Shield,
  Briefcase,
  Lock,
  UserCheck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function TrustRentMain() {
  const [userRole, setUserRole] = useState<UserRole>("guest");
  const [session, setSession] = useState<UserSession | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [authRoleTarget, setAuthRoleTarget] = useState<UserRole>("tenant");

  // Profiles for Tenant, Agent, and Owner
  const [tenantProfile, setTenantProfile] = useState<TenantProfile>(DEFAULT_TENANT_PROFILE);
  const [agentProfile, setAgentProfile] = useState<AgentProfile>(DEFAULT_AGENT_PROFILE);
  const [ownerProfile, setOwnerProfile] = useState<OwnerProfile>(DEFAULT_OWNER_PROFILE);

  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [agents, setAgents] = useState<AgentApplication[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Active view tab inside Super Admin or Tenant portal
  const [adminTab, setAdminTab] = useState<
    "properties" | "revenue" | "directory" | "announcements" | "agents" | "chat" | "settings"
  >("properties");
  const [tenantTab, setTenantTab] = useState<
    "countdown" | "vault" | "payments" | "defects" | "caution" | "chat" | "notes" | "profile"
  >("countdown");

  // Modals state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup" | "forgot">("login");
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [showEditProperty, setShowEditProperty] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showAdminIssueReceipt, setShowAdminIssueReceipt] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState<PaymentRecord | null>(null);
  const [deletePropertyConfirm, setDeletePropertyConfirm] = useState(false);

  const { showToast } = useToast();

  // Hydration
  useEffect(() => {
    const loadedProps = loadProperties();
    const loadedAnn = loadAnnouncements();
    const loadedChats = loadChats();
    const loadedAgents = loadAgents();
    const loadedNotifs = loadNotifications();
    const loadedSess = loadSession();
    const loadedTP = loadTenantProfile();
    const loadedAP = loadAgentProfile();
    const loadedOP = loadOwnerProfile();

    setProperties(loadedProps);
    setAnnouncements(loadedAnn);
    setChats(loadedChats);
    setAgents(loadedAgents);
    setNotifications(loadedNotifs);
    setTenantProfile(loadedTP);
    setAgentProfile(loadedAP);
    setOwnerProfile(loadedOP);

    if (loadedSess) {
      setSession(loadedSess);
      setCurrentUserEmail(loadedSess.email);
    }

    if (loadedProps.length > 0) {
      setSelectedId(loadedProps[0].id);
    }
    setIsClient(true);
  }, []);

  // Profile and Session Handlers
  const handleSaveTenantProfile = (updated: TenantProfile) => {
    setTenantProfile(updated);
    saveTenantProfile(updated);
  };

  const handleSaveAgentProfile = (updated: AgentProfile) => {
    setAgentProfile(updated);
    saveAgentProfile(updated);
  };

  const handleSaveOwnerProfile = (updated: OwnerProfile) => {
    setOwnerProfile(updated);
    saveOwnerProfile(updated);
  };

  const handleSignOut = () => {
    clearSession();
    setSession(null);
    setUserRole("guest");
    showToast("Session ended. Signed out securely.", "info");
  };

  const handleAuthSuccess = (role: UserRole, email: string, name?: string) => {
    const newSession: UserSession = {
      role,
      email,
      name: name || email.split("@")[0],
    };
    saveSession(newSession);
    setSession(newSession);
    setUserRole(role);
    setCurrentUserEmail(email);
    setShowAuthModal(false);
  };

  const handleSwitchRole = (targetRole: UserRole) => {
    setUserRole(targetRole);
    if (targetRole !== "guest") {
      setAuthRoleTarget(targetRole);
    }
  };

  // Save Helpers
  const updateProperties = (updated: Property[]) => {
    setProperties(updated);
    saveProperties(updated);
  };

  const updateAnnouncements = (updated: Announcement[]) => {
    setAnnouncements(updated);
    saveAnnouncements(updated);
  };

  const updateChats = (updated: ChatMessage[]) => {
    setChats(updated);
    saveChats(updated);
  };

  const updateAgents = (updated: AgentApplication[]) => {
    setAgents(updated);
    saveAgents(updated);
  };

  const updateNotifications = (updated: AppNotification[]) => {
    setNotifications(updated);
    saveNotifications(updated);
  };

  // Currently selected property reference
  const selectedProperty =
    properties.find((p) => p.id === selectedId) || properties[0] || null;

  // Property Handlers
  const handleAddProperty = (newProp: Property) => {
    const updated = [newProp, ...properties];
    updateProperties(updated);
    setSelectedId(newProp.id);
    showToast(`Property "${newProp.address}" added to your portfolio!`, "success");
  };

  const handleSaveProperty = (updatedProp: Property) => {
    const updated = properties.map((p) =>
      p.id === updatedProp.id ? updatedProp : p
    );
    updateProperties(updated);
  };

  const handleDeleteSelectedProperty = () => {
    if (!selectedProperty) return;
    const remaining = properties.filter((p) => p.id !== selectedProperty.id);
    updateProperties(remaining);
    if (remaining.length > 0) {
      setSelectedId(remaining[0].id);
    } else {
      setSelectedId("");
    }
    showToast("Property record removed.", "info");
  };

  // Payment Handlers
  const handleAddPayment = (newPayment: PaymentRecord) => {
    if (!selectedProperty) return;
    const updatedProp: Property = {
      ...selectedProperty,
      payments: [newPayment, ...selectedProperty.payments],
    };
    handleSaveProperty(updatedProp);
    showToast("Payment record logged successfully.", "success");
  };

  const handleDeletePayment = (paymentId: string) => {
    if (!selectedProperty) return;
    const updatedProp: Property = {
      ...selectedProperty,
      payments: selectedProperty.payments.filter((p) => p.id !== paymentId),
    };
    handleSaveProperty(updatedProp);
    showToast("Payment record deleted.", "info");
  };

  const handleTogglePaymentStatus = (paymentId: string, newStatus: PaymentStatus) => {
    if (!selectedProperty) return;
    const updatedPayments = selectedProperty.payments.map((p) => {
      if (p.id === paymentId) {
        return {
          ...p,
          status: newStatus,
          paidDate:
            newStatus === "paid"
              ? p.paidDate || new Date().toISOString().split("T")[0]
              : undefined,
        };
      }
      return p;
    });

    const updatedProp: Property = {
      ...selectedProperty,
      payments: updatedPayments,
    };
    handleSaveProperty(updatedProp);
    showToast(`Payment marked as ${newStatus}.`, "success");
  };

  // Issue Official Receipt from Super Admin Side
  const handleIssueReceiptByOwner = (payment: PaymentRecord) => {
    if (!selectedProperty) return;
    const updatedProp: Property = {
      ...selectedProperty,
      payments: [payment, ...selectedProperty.payments],
    };
    handleSaveProperty(updatedProp);

    // Create notification for tenant
    const newNotif: AppNotification = {
      id: "notif_" + Date.now(),
      title: "New Official Rent Receipt Issued",
      message: `Landlord issued receipt ${payment.receiptNo} for ${selectedProperty.address}. Stored in your vault.`,
      type: "receipt",
      targetRole: "tenant",
      propertyId: selectedProperty.id,
      timestamp: "Just now",
      read: false,
    };
    updateNotifications([newNotif, ...notifications]);
  };

  // Expense Handler (Super Admin)
  const handleAddExpense = (expense: PropertyExpense) => {
    const updated = properties.map((p) => {
      if (p.id === expense.propertyId) {
        return {
          ...p,
          expenses: [expense, ...(p.expenses || [])],
        };
      }
      return p;
    });
    updateProperties(updated);
  };

  // Announcement Handler (Super Admin Broadcast)
  const handleAddAnnouncement = (ann: Announcement) => {
    const updated = [ann, ...announcements];
    updateAnnouncements(updated);

    // Add alert notification to tenants
    const newNotif: AppNotification = {
      id: "notif_" + Date.now(),
      title: ann.title,
      message: ann.content.substring(0, 90) + "...",
      type: "announcement",
      targetRole: "tenant",
      timestamp: "Just now",
      read: false,
    };
    updateNotifications([newNotif, ...notifications]);
  };

  // Chat Handlers (Two-Way Communication)
  const handleSendMessage = (msg: ChatMessage) => {
    const updated = [...chats, msg];
    updateChats(updated);
  };

  const handleToggleChatLock = (isLocked: boolean) => {
    if (!selectedProperty) return;
    const updatedProp: Property = {
      ...selectedProperty,
      conversationSettings: {
        isLocked,
        lastUpdated: new Date().toISOString().split("T")[0],
      },
    };
    handleSaveProperty(updatedProp);
  };

  // Agent Application & Verification Handler
  const handleApplyAgent = (app: AgentApplication) => {
    const updated = [app, ...agents];
    updateAgents(updated);

    // Send notification to Super Admin
    const notif: AppNotification = {
      id: "notif_" + Date.now(),
      title: "New Agent Verification Request",
      message: `${app.name} (${app.agencyName}) submitted an onboarding application.`,
      type: "agent",
      targetRole: "owner",
      timestamp: "Just now",
      read: false,
    };
    updateNotifications([notif, ...notifications]);
  };

  const handleUpdateAgentStatus = (id: string, newStatus: "approved" | "rejected") => {
    const updated = agents.map((a) => (a.id === id ? { ...a, status: newStatus } : a));
    updateAgents(updated);

    // If approved, update verified badge across properties matching agent name
    const targetAgent = agents.find((a) => a.id === id);
    if (targetAgent && newStatus === "approved") {
      const updatedProps = properties.map((p) => {
        if (p.agentName && p.agentName.toLowerCase().includes(targetAgent.name.toLowerCase())) {
          return { ...p, isAgentVerified: true };
        }
        return p;
      });
      updateProperties(updatedProps);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#fbf9f5] text-[#786953]">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Building2 className="animate-spin text-[#0f4c81]" size={22} />
          <span>Loading TrustRent Estate Environment...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#fbf9f5] relative overflow-x-hidden">
      {/* GLOBAL NAVBAR: Clicking logo takes to homepage */}
      <Navbar
        currentRole={userRole}
        session={session}
        onSignOut={handleSignOut}
        onNavigateHome={() => setUserRole("guest")}
        onSelectRole={handleSwitchRole}
        onOpenAuth={(mode, role) => {
          setAuthMode(mode);
          if (role) setAuthRoleTarget(role);
          setShowAuthModal(true);
        }}
        notifications={notifications}
        onMarkNotificationsRead={() => {
          const marked = notifications.map((n) => ({ ...n, read: true }));
          updateNotifications(marked);
        }}
      />

      {/* ========================================================= */}
      {/* VIEW 1: PUBLIC HOMEPAGE / MARKETPLACE */}
      {/* ========================================================= */}
      {userRole === "guest" && (
        <LandingPage
          properties={properties}
          onSelectProperty={(p) => {
            setSelectedId(p.id);
            // If logged in as tenant, go to tenant portal; otherwise suggest sign in/up
            if (session?.role === "tenant") {
              setUserRole("tenant");
            } else {
              setAuthRoleTarget("tenant");
              setUserRole("tenant");
            }
            showToast(`Viewing details for ${p.title || p.address}.`, "info");
          }}
          onApplyAgent={handleApplyAgent}
          onOpenAuth={(mode) => {
            setAuthMode(mode);
            setShowAuthModal(true);
          }}
        />
      )}

      {/* ========================================================= */}
      {/* AUTHENTICATION BARRIER FOR PROTECTED PORTALS */}
      {/* ========================================================= */}
      {userRole !== "guest" && (!session || session.role !== userRole) && (
        <div className="w-full flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="glass-modal w-full max-w-xl p-6 sm:p-10 rounded-3xl border border-white/80 shadow-2xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
            {/* Shield Icon Header */}
            <div className="mx-auto w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-[#0f4c81]/20 transition-transform hover:scale-105">
              {userRole === "owner" && (
                <div className="w-full h-full rounded-3xl bg-gradient-to-tr from-[#c4601a] to-[#ea580c] flex items-center justify-center">
                  <Shield size={32} />
                </div>
              )}
              {userRole === "agent" && (
                <div className="w-full h-full rounded-3xl bg-gradient-to-tr from-[#0284c7] to-[#0ea5e9] flex items-center justify-center">
                  <Briefcase size={32} />
                </div>
              )}
              {userRole === "tenant" && (
                <div className="w-full h-full rounded-3xl bg-gradient-to-tr from-[#0f4c81] to-[#2563eb] flex items-center justify-center">
                  <Lock size={32} />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[#0f4c81]/10 text-[#0f4c81]">
                Protected Realm & Authentication Required
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1b130a]">
                {userRole === "owner" && "Super Admin Command Center"}
                {userRole === "agent" && "Verified Real Estate Agent Portal"}
                {userRole === "tenant" && "Secure Tenancy & Lease Portal"}
              </h2>
              <p className="text-xs sm:text-sm text-[#786953] leading-relaxed max-w-md mx-auto">
                {userRole === "owner" &&
                  "Access to multi-location property records, tenancy ledgers, and revenue accounting is restricted to verified property owners."}
                {userRole === "agent" &&
                  "Mandated property marketing, 10% commission ledgers, and client viewings require verified agency authentication."}
                {userRole === "tenant" &&
                  "Lease countdown alerts, PDF receipts vault, caution deposit recovery, and direct landlord communication are private to tenants."}
              </p>
            </div>

            {/* Session Mismatch Warning Notice if signed into another role */}
            {session && session.role !== userRole && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs text-left flex items-start gap-2.5">
                <ShieldAlert size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Active Session Mismatch</p>
                  <p className="text-[11px] text-amber-800">
                    You are currently signed in as <strong>{session.name || session.email}</strong> ({session.role.toUpperCase()}). Please sign in with an authorized account for this portal or sign up.
                  </p>
                </div>
              </div>
            )}

            {/* Features Preview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left pt-2">
              {userRole === "owner" && (
                <>
                  <div className="p-3 rounded-2xl bg-white/70 border border-[#e6ddce] text-xs">
                    <Building2 size={16} className="text-[#c4601a] mb-1.5" />
                    <p className="font-bold text-[#1b130a]">Portfolio Tracking</p>
                    <p className="text-[10px] text-[#786953]">All properties in one view</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/70 border border-[#e6ddce] text-xs">
                    <TrendingUp size={16} className="text-[#166534] mb-1.5" />
                    <p className="font-bold text-[#1b130a]">Revenue & Expenses</p>
                    <p className="text-[10px] text-[#786953]">Cash flow & repairs ledger</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/70 border border-[#e6ddce] text-xs">
                    <Megaphone size={16} className="text-[#0f4c81] mb-1.5" />
                    <p className="font-bold text-[#1b130a]">Broadcast & Alerts</p>
                    <p className="text-[10px] text-[#786953]">Issue receipts & notices</p>
                  </div>
                </>
              )}
              {userRole === "agent" && (
                <>
                  <div className="p-3 rounded-2xl bg-white/70 border border-[#e6ddce] text-xs">
                    <ShieldCheck size={16} className="text-[#0284c7] mb-1.5" />
                    <p className="font-bold text-[#1b130a]">Verified Badge</p>
                    <p className="text-[10px] text-[#786953]">CAC & NIESV credentialed</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/70 border border-[#e6ddce] text-xs">
                    <Award size={16} className="text-[#ca8a04] mb-1.5" />
                    <p className="font-bold text-[#1b130a]">10% Commission</p>
                    <p className="text-[10px] text-[#786953]">Automated agency payout</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/70 border border-[#e6ddce] text-xs">
                    <Users size={16} className="text-[#0f4c81] mb-1.5" />
                    <p className="font-bold text-[#1b130a]">Mandate Listings</p>
                    <p className="text-[10px] text-[#786953]">Direct landlord partnership</p>
                  </div>
                </>
              )}
              {userRole === "tenant" && (
                <>
                  <div className="p-3 rounded-2xl bg-white/70 border border-[#e6ddce] text-xs">
                    <Clock size={16} className="text-[#0f4c81] mb-1.5" />
                    <p className="font-bold text-[#1b130a]">Glowing Timeline</p>
                    <p className="text-[10px] text-[#786953]">Pulsating countdown bar</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/70 border border-[#e6ddce] text-xs">
                    <FolderLock size={16} className="text-[#166534] mb-1.5" />
                    <p className="font-bold text-[#1b130a]">Receipts & Vault</p>
                    <p className="text-[10px] text-[#786953]">PDFs & defect photo proof</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/70 border border-[#e6ddce] text-xs">
                    <ShieldAlert size={16} className="text-[#c4601a] mb-1.5" />
                    <p className="font-bold text-[#1b130a]">Caution Recovery</p>
                    <p className="text-[10px] text-[#786953]">Protect refundable deposit</p>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setAuthMode("login");
                  setAuthRoleTarget(userRole);
                  setShowAuthModal(true);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0f4c81] to-[#1e5a92] text-white text-xs font-bold shadow-lg shadow-[#0f4c81]/25 hover:from-[#0a365c] hover:to-[#0f4c81] transition-all transform active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <Lock size={14} />
                <span>
                  Sign In to {userRole === "owner" ? "Super Admin" : userRole === "agent" ? "Agent Portal" : "Tenant Portal"}
                </span>
              </button>

              <button
                onClick={() => {
                  setAuthMode("signup");
                  setAuthRoleTarget(userRole);
                  setShowAuthModal(true);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white border border-[#e6ddce] text-[#1b130a] text-xs font-bold hover:bg-[#faf6ef] transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <UserCheck size={14} />
                <span>Create New Account</span>
              </button>
            </div>

            <div className="pt-2 border-t border-[#e6ddce]/60">
              <button
                onClick={() => setUserRole("guest")}
                className="text-xs text-[#786953] hover:text-[#0f4c81] font-semibold transition-colors flex items-center justify-center gap-1 mx-auto"
              >
                ← Return to Public Marketplace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: SUPER ADMIN SIDE (Property Owner / Landlord) */}
      {/* ========================================================= */}
      {userRole === "owner" && session && session.role === "owner" && (
        <div className="w-full flex-1 flex flex-col">
          {/* Super Admin Top Control Bar */}
          <div className="w-full bg-[#1b130a] text-white px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c4601a] animate-pulse" />
              <h2 className="font-display font-bold text-lg text-white">
                Super Admin Portal • {ownerProfile.companyName || "Property Owner Command Center"}
              </h2>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowAddProperty(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#c4601a] hover:bg-[#aa5014] text-white text-xs font-bold transition-all shadow-md"
              >
                <PlusCircle size={14} /> Add New Property
              </button>
            </div>
          </div>

          {/* Super Admin Navigation Tabs */}
          <div className="w-full px-4 lg:px-8 py-3 bg-white border-b border-[#e6ddce] flex items-center gap-2 overflow-x-auto">
            {[
              { id: "properties", label: "Properties Portfolio", icon: Building2 },
              { id: "directory", label: "Tenants Directory", icon: Users },
              { id: "revenue", label: "Revenue & Expense Ledger", icon: TrendingUp },
              { id: "announcements", label: "Broadcast Announcements", icon: Megaphone },
              { id: "agents", label: "Agent Approvals", icon: Award },
              { id: "chat", label: "Direct Two-Way Messaging", icon: MessageSquare },
              { id: "settings", label: "Profile & Settings", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = adminTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setAdminTab(tab.id as typeof adminTab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[#0f4c81] text-white shadow-md shadow-[#0f4c81]/20"
                      : "text-[#786953] hover:text-[#1b130a] hover:bg-[#faf6ef]"
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Super Admin Body Views */}
          <div className="w-full px-4 lg:px-8 py-6 flex-1">
            {adminTab === "properties" && (
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                <Sidebar
                  properties={properties}
                  selectedId={selectedId}
                  onSelectProperty={(id) => setSelectedId(id)}
                  onAddProperty={() => setShowAddProperty(true)}
                  searchQuery={searchQuery}
                />
                <div className="flex-1 w-full space-y-6">
                  {selectedProperty && (
                    <>
                      <PropertyHeader
                        property={selectedProperty}
                        onLogPayment={() => setShowAddPayment(true)}
                        onEditProperty={() => setShowEditProperty(true)}
                        onDeleteProperty={() => setDeletePropertyConfirm(true)}
                        onPrintStatement={() => {
                          if (selectedProperty.payments.length > 0) {
                            setViewingReceipt(selectedProperty.payments[0]);
                          } else {
                            showToast("Log at least one payment to generate a receipt.", "warning");
                          }
                        }}
                      />
                      <OverviewTab property={selectedProperty} />
                    </>
                  )}
                </div>
              </div>
            )}

            {adminTab === "directory" && (
              <AdminTenantDirectory
                properties={properties}
                onOpenChat={(propId) => {
                  setSelectedId(propId);
                  setAdminTab("chat");
                }}
                onIssueReceipt={(prop) => {
                  setSelectedId(prop.id);
                  setShowAdminIssueReceipt(true);
                }}
              />
            )}

            {adminTab === "revenue" && (
              <AdminRevenueExpenses
                properties={properties}
                onAddExpense={handleAddExpense}
              />
            )}

            {adminTab === "announcements" && (
              <AdminAnnouncements
                announcements={announcements}
                onAddAnnouncement={handleAddAnnouncement}
                onDeleteAnnouncement={(id) =>
                  updateAnnouncements(announcements.filter((a) => a.id !== id))
                }
              />
            )}

            {adminTab === "agents" && (
              <AdminAgentApprovals
                agents={agents}
                onUpdateStatus={handleUpdateAgentStatus}
              />
            )}

            {adminTab === "chat" && selectedProperty && (
              <TwoWayChat
                propertyId={selectedProperty.id}
                propertyAddress={selectedProperty.address}
                userRole="owner"
                userName={selectedProperty.landlordName}
                chats={chats}
                conversationSettings={selectedProperty.conversationSettings}
                onSendMessage={handleSendMessage}
                onToggleLock={handleToggleChatLock}
              />
            )}

            {adminTab === "settings" && (
              <OwnerProfileSettings
                profile={ownerProfile}
                onSave={handleSaveOwnerProfile}
              />
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 3: TENANT SIDE PORTAL */}
      {/* ========================================================= */}
      {userRole === "tenant" && session && session.role === "tenant" && (
        <div className="w-full flex-1 flex flex-col">
          {/* Tenant Top Bar */}
          <div className="w-full bg-[#0f4c81] text-white px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h2 className="font-display font-bold text-lg text-white">
                Tenant Portal • {selectedProperty?.address || "Active Lease"}
              </h2>
            </div>
            <div className="text-xs text-white/80">
              Logged in as: <strong>{tenantProfile.name}</strong> • Landlord: <strong>{selectedProperty?.landlordName}</strong> ({selectedProperty?.landlordPhone})
            </div>
          </div>

          {/* Tenant Navigation Tabs */}
          <div className="w-full px-4 lg:px-8 py-3 bg-white border-b border-[#e6ddce] flex items-center gap-2 overflow-x-auto">
            {[
              { id: "countdown", label: "Lease Timeline & Alerts", icon: Clock },
              { id: "vault", label: "Documents & PDF Receipts", icon: FolderLock },
              { id: "payments", label: "Payment History", icon: CreditCard },
              { id: "defects", label: "Move-in Defects & Photos", icon: Camera },
              { id: "caution", label: "Caution Fee Recovery", icon: ShieldAlert },
              { id: "chat", label: "Chat with Landlord", icon: MessageSquare },
              { id: "notes", label: "Notes & Letters", icon: FileText },
              { id: "profile", label: "Profile & Settings", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = tenantTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setTenantTab(tab.id as typeof tenantTab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[#0f4c81] text-white shadow-md shadow-[#0f4c81]/20"
                      : "text-[#786953] hover:text-[#1b130a] hover:bg-[#faf6ef]"
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tenant Body Views */}
          <div className="w-full px-4 lg:px-8 py-6 flex-1 space-y-6">
            {selectedProperty ? (
              <>
                {tenantTab === "countdown" && (
                  <div className="space-y-6">
                    {/* Glowing Pulsating Timeline Bar */}
                    <TenantLeaseCountdown
                      property={selectedProperty}
                      onSendRenewalInquiry={() => setTenantTab("chat")}
                    />
                    <OverviewTab property={selectedProperty} />
                  </div>
                )}

                {tenantTab === "vault" && (
                  <TenantDocumentsVault
                    property={selectedProperty}
                    onUpdateDocuments={(docs) => {
                      const updatedProp = { ...selectedProperty, documents: docs };
                      handleSaveProperty(updatedProp);
                    }}
                    onViewReceipt={(p) => setViewingReceipt(p)}
                  />
                )}

                {tenantTab === "payments" && (
                  <PaymentsTab
                    property={selectedProperty}
                    onAddPayment={() => setShowAddPayment(true)}
                    onDeletePayment={handleDeletePayment}
                    onTogglePaymentStatus={handleTogglePaymentStatus}
                    onViewReceipt={(p) => setViewingReceipt(p)}
                  />
                )}

                {tenantTab === "defects" && (
                  <DefectsTab
                    property={selectedProperty}
                    onUpdateDefects={(defects) => {
                      const updatedProp = { ...selectedProperty, defects };
                      handleSaveProperty(updatedProp);
                    }}
                  />
                )}

                {tenantTab === "caution" && (
                  <CautionTrackerTab
                    property={selectedProperty}
                    onUpdateCautionTracker={(tracker) => {
                      const updatedProp = { ...selectedProperty, cautionTracker: tracker };
                      handleSaveProperty(updatedProp);
                    }}
                  />
                )}

                {tenantTab === "chat" && (
                  <TwoWayChat
                    propertyId={selectedProperty.id}
                    propertyAddress={selectedProperty.address}
                    userRole="tenant"
                    userName={tenantProfile.name || "Tenant"}
                    chats={chats}
                    conversationSettings={selectedProperty.conversationSettings}
                    onSendMessage={handleSendMessage}
                    onToggleLock={handleToggleChatLock}
                  />
                )}

                {tenantTab === "notes" && (
                  <NotesTab
                    property={selectedProperty}
                    onSaveNotes={(notes) => {
                      const updatedProp = { ...selectedProperty, notes };
                      handleSaveProperty(updatedProp);
                    }}
                  />
                )}

                {tenantTab === "profile" && (
                  <TenantProfileSettings
                    profile={tenantProfile}
                    onSave={handleSaveTenantProfile}
                  />
                )}
              </>
            ) : (
              <div className="card p-12 text-center text-[#786953]">
                No property selected.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 4: AGENT SIDE PORTAL */}
      {/* ========================================================= */}
      {userRole === "agent" && session && session.role === "agent" && (
        <div className="w-full flex-1 flex flex-col">
          <AgentDashboard
            properties={properties}
            agentProfile={agentProfile}
            onSaveAgentProfile={handleSaveAgentProfile}
            onSelectProperty={(property) => {
              setSelectedId(property.id);
            }}
          />
        </div>
      )}

      {/* ========================================================= */}
      {/* GLOBAL MODALS */}
      {/* ========================================================= */}
      {showAuthModal && (
        <AuthModal
          initialMode={authMode}
          initialRole={authRoleTarget}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

      {showAddProperty && (
        <AddPropertyModal
          onClose={() => setShowAddProperty(false)}
          onAddProperty={handleAddProperty}
        />
      )}

      {showEditProperty && selectedProperty && (
        <EditPropertyModal
          property={selectedProperty}
          onClose={() => setShowEditProperty(false)}
          onSaveProperty={handleSaveProperty}
        />
      )}

      {showAddPayment && selectedProperty && (
        <AddPaymentModal
          property={selectedProperty}
          onClose={() => setShowAddPayment(false)}
          onAddPayment={handleAddPayment}
        />
      )}

      {showAdminIssueReceipt && selectedProperty && (
        <AdminIssueReceiptModal
          property={selectedProperty}
          onClose={() => setShowAdminIssueReceipt(false)}
          onReceiptIssued={handleIssueReceiptByOwner}
        />
      )}

      {viewingReceipt && selectedProperty && (
        <ReceiptModal
          property={selectedProperty}
          payment={viewingReceipt}
          onClose={() => setViewingReceipt(null)}
        />
      )}

      {deletePropertyConfirm && selectedProperty && (
        <DeleteConfirmModal
          title="Delete Property Record?"
          message={`Are you sure you want to permanently delete "${selectedProperty.address}" and all associated tenant records?`}
          onConfirm={handleDeleteSelectedProperty}
          onClose={() => setDeletePropertyConfirm(false)}
        />
      )}
    </div>
  );
}

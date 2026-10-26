"use client";

import React, { useState } from "react";
import {
  X,
  Lock,
  Mail,
  User,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Building,
  ShieldCheck,
  KeyRound,
} from "lucide-react";
import { UserRole } from "@/types/property";
import { useToast } from "@/components/common/Toast";
import { validateEmail, sanitizeInput, rateLimiter } from "@/lib/security";

interface AuthModalProps {
  initialMode: "login" | "signup" | "forgot";
  initialRole?: UserRole;
  onClose: () => void;
  onSuccess: (role: UserRole, userEmail: string, userName?: string) => void;
}

export function AuthModal({ initialMode, initialRole = "tenant", onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedRole, setSelectedRole] = useState<"tenant" | "agent" | "owner">(
    initialRole === "agent" ? "agent" : initialRole === "owner" ? "owner" : "tenant"
  );
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToast();

  // Password rules validation
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const passedCount = [
    hasMinLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
  ].filter(Boolean).length;

  const getStrengthText = () => {
    if (password.length === 0) return { label: "", color: "bg-gray-200", textCol: "text-gray-400" };
    if (passedCount <= 2) return { label: "Weak password", color: "bg-red-500", textCol: "text-red-500" };
    if (passedCount === 3 || passedCount === 4) return { label: "Moderate password", color: "bg-amber-500", textCol: "text-amber-500" };
    return { label: "Strong & secure password", color: "bg-green-600", textCol: "text-green-600" };
  };

  const strength = getStrengthText();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const sanitizedEmail = sanitizeInput(email);
    const sanitizedName = sanitizeInput(fullName);

    if (!validateEmail(sanitizedEmail)) {
      showToast("Security Check: Please provide a valid email address.", "error");
      return;
    }

    // Rate Limiting Protection against Brute Force & Credential Stuffing
    const rateCheck = rateLimiter.check(`auth_${sanitizedEmail.toLowerCase()}`, 5, 30000);
    if (!rateCheck.allowed) {
      showToast(
        `Security Alert: Too many failed attempts. Temporary lock for ${rateCheck.waitSeconds}s.`,
        "error"
      );
      return;
    }

    if (mode === "signup") {
      if (passedCount < 5) {
        showToast("Please ensure password satisfies all 5 security requirements.", "error");
        return;
      }
      rateLimiter.reset(`auth_${sanitizedEmail.toLowerCase()}`);
      const roleTitle =
        selectedRole === "owner"
          ? "Super Admin (Owner)"
          : selectedRole === "agent"
          ? "Verified House Agent"
          : "Tenant";
      showToast(`Account created successfully as ${roleTitle}!`, "success");
      onSuccess(selectedRole, sanitizedEmail, sanitizedName || sanitizedEmail.split("@")[0]);
    } else if (mode === "login") {
      if (!sanitizedEmail || !password) {
        showToast("Please enter email and password.", "error");
        return;
      }
      rateLimiter.reset(`auth_${sanitizedEmail.toLowerCase()}`);
      // If user explicitly picked a role via the tab or email hints
      let role: UserRole = selectedRole;
      if (sanitizedEmail.toLowerCase().includes("owner") || sanitizedEmail.toLowerCase().includes("chief") || sanitizedEmail.toLowerCase().includes("landlord")) {
        role = "owner";
      } else if (sanitizedEmail.toLowerCase().includes("agent") || sanitizedEmail.toLowerCase().includes("realtor") || sanitizedEmail.toLowerCase().includes("broker")) {
        role = "agent";
      }

      const roleTitle =
        role === "owner"
          ? "Super Admin"
          : role === "agent"
          ? "House Agent"
          : "Tenant";
      showToast(`Secure session authenticated. Logged in as ${roleTitle}.`, "success");
      onSuccess(role, sanitizedEmail, sanitizedName || sanitizedEmail.split("@")[0]);
    } else if (mode === "forgot") {
      showToast("Secure password reset link has been dispatched to your email address.", "info");
      setMode("login");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="glass-modal w-full max-w-md p-6 sm:p-8 rounded-3xl relative border border-white/70 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#786953] hover:text-[#1b130a] hover:bg-black/5 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0f4c81] to-[#2563eb] text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#0f4c81]/30">
            {mode === "login" && <Lock size={20} />}
            {mode === "signup" && <User size={20} />}
            {mode === "forgot" && <KeyRound size={20} />}
          </div>
          <h3 className="font-display font-bold text-2xl text-[#1b130a]">
            {mode === "login" && "Sign In to TrustRent"}
            {mode === "signup" && "Create an Account"}
            {mode === "forgot" && "Reset Password"}
          </h3>
          <p className="text-xs text-[#786953] mt-1">
            {mode === "login" && "Access your property portfolio or tenancy portal"}
            {mode === "signup" && "Join Nigeria's trusted rental management network"}
            {mode === "forgot" && "Enter your email to receive recovery instructions"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selector Tabs (Tenant, House Agent, Super Admin) */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#786953] block mb-1.5">
              {mode === "signup" ? "Select Account Type:" : "Sign In Portal:"}
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-white/60 rounded-2xl border border-[#e6ddce]">
              <button
                type="button"
                onClick={() => setSelectedRole("tenant")}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                  selectedRole === "tenant"
                    ? "bg-[#0f4c81] text-white shadow-sm"
                    : "text-[#786953] hover:text-[#1b130a] hover:bg-white/80"
                }`}
              >
                <User size={13} /> <span>Tenant</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("agent")}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                  selectedRole === "agent"
                    ? "bg-[#0284c7] text-white shadow-sm"
                    : "text-[#786953] hover:text-[#1b130a] hover:bg-white/80"
                }`}
              >
                <ShieldCheck size={13} /> <span>Agent</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("owner")}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                  selectedRole === "owner"
                    ? "bg-[#c4601a] text-white shadow-sm"
                    : "text-[#786953] hover:text-[#1b130a] hover:bg-white/80"
                }`}
              >
                <Building size={13} /> <span>Owner</span>
              </button>
            </div>
          </div>

          {mode === "signup" && (
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#786953] block mb-1">
                Full Name
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-3 text-[#786953]" />
                <input
                  type="text"
                  required
                  placeholder="Chief Emmanuel Eze / John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1b130a] focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/30 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#786953] block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-3 text-[#786953]" />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1b130a] focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/30 transition-all"
              />
            </div>
            {mode === "login" && (
              <p className="text-[10px] text-[#786953] mt-1 italic">
                💡 Tip: use an email with &apos;owner&apos; or &apos;chief&apos; to test Super Admin view.
              </p>
            )}
          </div>

          {mode !== "forgot" && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#786953]">
                  Password
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-[11px] text-[#0f4c81] hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>

              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-3 text-[#786953]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full glass-input rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#1b130a] focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-[#786953] hover:text-[#1b130a]"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Live Strong Password Checker */}
              {mode === "signup" && password.length > 0 && (
                <div className="mt-3 p-3 rounded-2xl bg-white/70 border border-white/60 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#786953]">Strength:</span>
                    <span className={`font-bold ${strength.textCol}`}>{strength.label}</span>
                  </div>

                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${(passedCount / 5) * 100}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
                    <span className={`flex items-center gap-1 ${hasMinLength ? "text-green-600 font-bold" : "text-gray-400"}`}>
                      <Check size={11} className={hasMinLength ? "stroke-[3]" : "opacity-40"} /> 8+ Characters
                    </span>
                    <span className={`flex items-center gap-1 ${hasUpper ? "text-green-600 font-bold" : "text-gray-400"}`}>
                      <Check size={11} className={hasUpper ? "stroke-[3]" : "opacity-40"} /> 1 Uppercase (A-Z)
                    </span>
                    <span className={`flex items-center gap-1 ${hasLower ? "text-green-600 font-bold" : "text-gray-400"}`}>
                      <Check size={11} className={hasLower ? "stroke-[3]" : "opacity-40"} /> 1 Lowercase (a-z)
                    </span>
                    <span className={`flex items-center gap-1 ${hasNumber ? "text-green-600 font-bold" : "text-gray-400"}`}>
                      <Check size={11} className={hasNumber ? "stroke-[3]" : "opacity-40"} /> 1 Number (0-9)
                    </span>
                    <span className={`flex items-center gap-1 col-span-2 ${hasSpecial ? "text-green-600 font-bold" : "text-gray-400"}`}>
                      <Check size={11} className={hasSpecial ? "stroke-[3]" : "opacity-40"} /> 1 Special Character (!@#$%^&*)
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#0f4c81] to-[#1e5a92] text-white text-xs font-bold shadow-lg shadow-[#0f4c81]/25 hover:from-[#0a365c] hover:to-[#0f4c81] transition-all transform active:scale-[0.99] mt-2"
          >
            {mode === "login" && "Sign In"}
            {mode === "signup" && "Create My Account"}
            {mode === "forgot" && "Send Reset Link"}
          </button>
        </form>

        {/* Toggle Mode Footer */}
        <div className="text-center mt-5 pt-4 border-t border-white/50 text-xs text-[#786953]">
          {mode === "login" ? (
            <p>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-[#0f4c81] font-bold hover:underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-[#0f4c81] font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


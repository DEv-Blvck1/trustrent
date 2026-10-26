import {
  Property,
  Announcement,
  ChatMessage,
  AgentApplication,
  AppNotification,
  TenantProfile,
  AgentProfile,
  OwnerProfile,
  UserSession,
} from "@/types/property";
import {
  SEED_PROPERTIES,
  SEED_ANNOUNCEMENTS,
  SEED_CHATS,
  SEED_AGENTS,
  SEED_NOTIFICATIONS,
  DEFAULT_TENANT_PROFILE,
  DEFAULT_AGENT_PROFILE,
  DEFAULT_OWNER_PROFILE,
  STORAGE_KEY_PROPERTIES,
  STORAGE_KEY_ANNOUNCEMENTS,
  STORAGE_KEY_CHATS,
  STORAGE_KEY_AGENTS,
  STORAGE_KEY_NOTIFICATIONS,
  STORAGE_KEY_TENANT_PROFILE,
  STORAGE_KEY_AGENT_PROFILE,
  STORAGE_KEY_OWNER_PROFILE,
  STORAGE_KEY_SESSION,
} from "./constants";

function getSafe<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    // Prototype pollution & injection defense
    const parsed = JSON.parse(item, (k, val) => {
      if (k === "__proto__" || k === "constructor" || k === "prototype") {
        return undefined;
      }
      return val;
    });
    return parsed;
  } catch {
    return fallback;
  }
}

function setSafe<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage error for " + key, e);
  }
}

export function loadProperties(): Property[] {
  return getSafe<Property[]>(STORAGE_KEY_PROPERTIES, SEED_PROPERTIES);
}

export function saveProperties(properties: Property[]): void {
  setSafe(STORAGE_KEY_PROPERTIES, properties);
}

export function loadAnnouncements(): Announcement[] {
  return getSafe<Announcement[]>(STORAGE_KEY_ANNOUNCEMENTS, SEED_ANNOUNCEMENTS);
}

export function saveAnnouncements(announcements: Announcement[]): void {
  setSafe(STORAGE_KEY_ANNOUNCEMENTS, announcements);
}

export function loadChats(): ChatMessage[] {
  return getSafe<ChatMessage[]>(STORAGE_KEY_CHATS, SEED_CHATS);
}

export function saveChats(chats: ChatMessage[]): void {
  setSafe(STORAGE_KEY_CHATS, chats);
}

export function loadAgents(): AgentApplication[] {
  return getSafe<AgentApplication[]>(STORAGE_KEY_AGENTS, SEED_AGENTS);
}

export function saveAgents(agents: AgentApplication[]): void {
  setSafe(STORAGE_KEY_AGENTS, agents);
}

export function loadNotifications(): AppNotification[] {
  return getSafe<AppNotification[]>(STORAGE_KEY_NOTIFICATIONS, SEED_NOTIFICATIONS);
}

export function saveNotifications(notifications: AppNotification[]): void {
  setSafe(STORAGE_KEY_NOTIFICATIONS, notifications);
}

export function loadTenantProfile(): TenantProfile {
  return getSafe<TenantProfile>(STORAGE_KEY_TENANT_PROFILE, DEFAULT_TENANT_PROFILE);
}

export function saveTenantProfile(profile: TenantProfile): void {
  setSafe(STORAGE_KEY_TENANT_PROFILE, profile);
}

export function loadAgentProfile(): AgentProfile {
  return getSafe<AgentProfile>(STORAGE_KEY_AGENT_PROFILE, DEFAULT_AGENT_PROFILE);
}

export function saveAgentProfile(profile: AgentProfile): void {
  setSafe(STORAGE_KEY_AGENT_PROFILE, profile);
}

export function loadOwnerProfile(): OwnerProfile {
  return getSafe<OwnerProfile>(STORAGE_KEY_OWNER_PROFILE, DEFAULT_OWNER_PROFILE);
}

export function saveOwnerProfile(profile: OwnerProfile): void {
  setSafe(STORAGE_KEY_OWNER_PROFILE, profile);
}

export function loadSession(): UserSession | null {
  return getSafe<UserSession | null>(STORAGE_KEY_SESSION, null);
}

export function saveSession(session: UserSession | null): void {
  setSafe(STORAGE_KEY_SESSION, session);
}

export function clearSession(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEY_SESSION);
    } catch {
      // storage unavailable
    }
  }
}

export function resetAllDataToSeed() {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(SEED_PROPERTIES));
    localStorage.setItem(STORAGE_KEY_ANNOUNCEMENTS, JSON.stringify(SEED_ANNOUNCEMENTS));
    localStorage.setItem(STORAGE_KEY_CHATS, JSON.stringify(SEED_CHATS));
    localStorage.setItem(STORAGE_KEY_AGENTS, JSON.stringify(SEED_AGENTS));
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEY_TENANT_PROFILE, JSON.stringify(DEFAULT_TENANT_PROFILE));
    localStorage.setItem(STORAGE_KEY_AGENT_PROFILE, JSON.stringify(DEFAULT_AGENT_PROFILE));
    localStorage.setItem(STORAGE_KEY_OWNER_PROFILE, JSON.stringify(DEFAULT_OWNER_PROFILE));
  }
}

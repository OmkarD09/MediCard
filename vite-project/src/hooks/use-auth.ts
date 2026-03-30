import { useMemo, useState } from "react";

type StoredUser = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: number;
};

type Session = {
  userId: string;
  email: string;
  createdAt: number;
};

const USERS_KEY = "medicard_users";
const SESSION_KEY = "medicard_session";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function readUsers(): Record<string, StoredUser> {
  if (typeof window === "undefined") return {};

  const raw = window.localStorage.getItem(USERS_KEY);
  if (!raw) return {};

  try {
    return JSON.parse(raw) as Record<string, StoredUser>;
  } catch {
    return {};
  }
}

function writeUsers(users: Record<string, StoredUser>) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readSession(): Session | null {
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

function writeSession(session: Session) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(() => {
    if (typeof window === "undefined") return null;
    return readSession();
  });

  const user = useMemo(() => {
    if (!session) return null;
    return { id: session.userId, email: session.email };
  }, [session]);

  const login = async (args: { email: string; password: string }) => {
    const email = normalizeEmail(args.email);
    const passwordHash = await sha256Hex(args.password);

    const users = readUsers();
    const stored = users[email];
    if (!stored || stored.passwordHash !== passwordHash) {
      throw new Error("Invalid email or password");
    }

    const nextSession: Session = {
      userId: stored.id,
      email: stored.email,
      createdAt: Date.now(),
    };

    writeSession(nextSession);
    setSession(nextSession);
  };

  const signup = async (args: { email: string; password: string }) => {
    const email = normalizeEmail(args.email);
    const users = readUsers();
    if (users[email]) {
      throw new Error("An account with this email already exists");
    }

    const passwordHash = await sha256Hex(args.password);
    const userId = crypto.randomUUID();

    users[email] = {
      id: userId,
      email,
      passwordHash,
      createdAt: Date.now(),
    };

    writeUsers(users);

    const nextSession: Session = {
      userId,
      email,
      createdAt: Date.now(),
    };

    writeSession(nextSession);
    setSession(nextSession);
  };

  const logout = () => {
    clearSession();
    setSession(null);
  };

  return {
    user,
    isAuthenticated: !!session,
    login,
    signup,
    logout,
  };
}


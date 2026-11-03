"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { emptyProgress, type Progress } from "@gai/learning";
import { newId, readJSON, removeKey, writeJSON } from "./storage";

/**
 * Hồ sơ người học trên máy này. Cả nhà dùng chung một điện thoại vẫn tách được tiến độ.
 * Trẻ em không cần email hay tài khoản.
 */
export type AgeGroup = "kid" | "adult";
export type Profile = { id: string; name: string; avatar: string; group: AgeGroup; createdAt: string };
export type Theme = "light" | "dark";

type Store = { profiles: Profile[]; activeId: string | null };

const PROFILES_KEY = "gai.profiles.v1";
const THEME_KEY = "gai.theme";
const progressKey = (id: string) => `gai.progress.${id}`;

export const AVATARS = ["🦊", "🐼", "🐯", "🐸", "🐧", "🦁", "🐨", "🐙", "🦄", "🐢", "🐝", "🦉"];

type Ctx = {
  ready: boolean;
  profiles: Profile[];
  active: Profile | null;
  isKid: boolean;
  addProfile: (p: Omit<Profile, "id" | "createdAt">) => void;
  updateProfile: (id: string, patch: Partial<Omit<Profile, "id">>) => void;
  switchProfile: (id: string) => void;
  removeProfile: (id: string) => void;
  progress: Progress;
  updateProgress: (fn: (p: Progress) => Progress) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
};

const ProfileContext = createContext<Ctx | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [store, setStore] = useState<Store>({ profiles: [], activeId: null });
  const [progress, setProgress] = useState<Progress>(emptyProgress());
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const s = readJSON<Store>(PROFILES_KEY, { profiles: [], activeId: null });
    setStore(s);
    if (s.activeId) setProgress({ ...emptyProgress(), ...readJSON(progressKey(s.activeId), emptyProgress()) });
    setThemeState(readJSON<string>(THEME_KEY, "light") === "dark" ? "dark" : "light");
    setReady(true);
  }, []);

  const save = useCallback((s: Store) => {
    setStore(s);
    writeJSON(PROFILES_KEY, s);
  }, []);

  const switchProfile = useCallback(
    (id: string) => {
      save({ ...store, activeId: id });
      setProgress({ ...emptyProgress(), ...readJSON(progressKey(id), emptyProgress()) });
    },
    [store, save],
  );

  const addProfile = useCallback(
    (p: Omit<Profile, "id" | "createdAt">) => {
      const profile: Profile = { ...p, id: newId(), createdAt: new Date().toISOString() };
      save({ profiles: [...store.profiles, profile], activeId: profile.id });
      setProgress(emptyProgress());
    },
    [store, save],
  );

  const updateProfile = useCallback(
    (id: string, patch: Partial<Omit<Profile, "id">>) =>
      save({ ...store, profiles: store.profiles.map((p) => (p.id === id ? { ...p, ...patch } : p)) }),
    [store, save],
  );

  const removeProfile = useCallback(
    (id: string) => {
      const profiles = store.profiles.filter((p) => p.id !== id);
      const activeId = store.activeId === id ? (profiles[0]?.id ?? null) : store.activeId;
      save({ profiles, activeId });
      removeKey(progressKey(id));
      removeKey(`gai.journal.${id}`);
      removeKey(`gai.seen.${id}`);
      if (activeId !== store.activeId)
        setProgress(activeId ? { ...emptyProgress(), ...readJSON(progressKey(activeId), emptyProgress()) } : emptyProgress());
    },
    [store, save],
  );

  const updateProgress = useCallback(
    (fn: (p: Progress) => Progress) => {
      setProgress((prev) => {
        const next = fn(prev);
        if (store.activeId) writeJSON(progressKey(store.activeId), next);
        return next;
      });
    },
    [store.activeId],
  );

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    writeJSON(THEME_KEY, t);
    if (t === "dark") document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
  }, []);

  const active = store.profiles.find((p) => p.id === store.activeId) ?? null;

  const value = useMemo<Ctx>(
    () => ({
      ready,
      profiles: store.profiles,
      active,
      isKid: active?.group === "kid",
      addProfile,
      updateProfile,
      switchProfile,
      removeProfile,
      progress,
      updateProgress,
      theme,
      setTheme,
    }),
    [ready, store.profiles, active, addProfile, updateProfile, switchProfile, removeProfile, progress, updateProgress, theme, setTheme],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfiles(): Ctx {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfiles phải dùng bên trong ProfileProvider");
  return ctx;
}

/** Ghi nhớ hướng dẫn nào đã xem (theo từng hồ sơ), để lần đầu tự mở, lần sau không làm phiền. */
export function useSeen(key: string): [boolean, () => void] {
  const { active, ready } = useProfiles();
  const storeKey = active ? `gai.seen.${active.id}` : null;
  const [seen, setSeen] = useState(true);

  useEffect(() => {
    if (!ready || !storeKey) return;
    setSeen(readJSON<string[]>(storeKey, []).includes(key));
  }, [ready, storeKey, key]);

  const markSeen = useCallback(() => {
    setSeen(true);
    if (!storeKey) return;
    const list = readJSON<string[]>(storeKey, []);
    if (!list.includes(key)) writeJSON(storeKey, [...list, key]);
  }, [storeKey, key]);

  return [seen, markSeen];
}

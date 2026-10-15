"use client";

import { useCallback, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
const memory = new Map<string, string>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null) memory.delete(event.key);
    onStoreChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

function readStore(key: string, fallback: string): string {
  if (memory.has(key)) return memory.get(key)!;
  try {
    const stored = localStorage.getItem(key);
    if (stored !== null) memory.set(key, stored);
    return stored ?? fallback;
  } catch {
    return fallback;
  }
}

function serverSnapshot(_key: string, fallback: string): string {
  return fallback;
}

export function useStoredState<T extends string>(
  key: string,
  fallback: T,
  isValid: (value: string) => value is T
): [T, (value: T) => void] {
  const raw = useSyncExternalStore(
    subscribe,
    () => readStore(key, fallback),
    () => serverSnapshot(key, fallback)
  );

  const value = isValid(raw) ? raw : fallback;

  const setValue = useCallback(
    (next: T) => {
      memory.set(key, next);
      try {
        localStorage.setItem(key, next);
      } catch {
        // localStorage unavailable — value still lives in the in-memory map
      }
      emit();
    },
    [key]
  );

  return [value, setValue];
}

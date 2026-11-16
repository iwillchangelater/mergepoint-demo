"use client";

import { useSyncExternalStore } from "react";
import { demoIssues, type Issue } from "./data";

type State = { nextNumber: number; issues: Issue[] };
const key = "mergepoint.pages.demo.v1";
const changeEvent = "mergepoint-demo:change";
const initial: State = { nextNumber: demoIssues.length + 1, issues: demoIssues };
let lastRaw: string | null | undefined;
let snapshot = initial;
let inMemoryOnly = false;

function read(): State {
  if (inMemoryOnly) return snapshot;
  try {
    const current = localStorage.getItem(key);
    if (current === lastRaw) return snapshot;
    lastRaw = current;
    const parsed: State | null = current && JSON.parse(current);
    snapshot = parsed && Array.isArray(parsed.issues) && Number.isSafeInteger(parsed.nextNumber)
      ? parsed : initial;
  } catch {
    snapshot = initial;
  }
  return snapshot;
}

function listen(callback: () => void) {
  window.addEventListener(changeEvent, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(changeEvent, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useDemo() {
  return useSyncExternalStore(listen, read, () => initial);
}

export function changeDemo(update: (state: State) => State) {
  snapshot = update(read());
  try {
    const serialized = JSON.stringify(snapshot);
    localStorage.setItem(key, serialized);
    lastRaw = serialized;
    inMemoryOnly = false;
  } catch {
    inMemoryOnly = true;
  }
  window.dispatchEvent(new Event(changeEvent));
}

"use client";

import { useEffect, useState } from "react";

export type AppearancePreference = "Dark" | "Light" | "System";
export type DensityPreference = "Comfortable" | "Compact";

const appearanceKey = "trackio-account-appearance";
const densityKey = "trackio-account-density";

export function readAccountPreferences() {
  const appearance = window.localStorage.getItem(appearanceKey);
  const density = window.localStorage.getItem(densityKey);
  return {
    appearance: appearance === "Light" || appearance === "System" ? appearance : "Dark" as AppearancePreference,
    density: density === "Compact" ? density : "Comfortable" as DensityPreference,
  };
}

export function saveAccountPreferences(appearance: AppearancePreference, density: DensityPreference) {
  window.localStorage.setItem(appearanceKey, appearance);
  window.localStorage.setItem(densityKey, density);
}

export function useResolvedAppearance(preference: AppearancePreference) {
  const [systemIsDark, setSystemIsDark] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => setSystemIsDark(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return preference === "System" ? (systemIsDark ? "dark" : "light") : preference.toLowerCase() as "dark" | "light";
}

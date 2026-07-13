import { DEFAULT_DATA } from "./routine.js";

const STORAGE_KEY = "daily-routine-data-v1";

function cloneDefaultData() {
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function normalizeData(data) {
  const defaults = cloneDefaultData();
  const normalized = {
    ...defaults,
    ...data,
    schedules: {
      ...defaults.schedules,
      ...(data?.schedules ?? {})
    },
    workouts: {
      ...defaults.workouts,
      ...(data?.workouts ?? {})
    }
  };

  Object.keys(defaults.schedules).forEach((dayKey) => {
    if (!Array.isArray(normalized.schedules[dayKey])) {
      normalized.schedules[dayKey] = defaults.schedules[dayKey];
    }

    if (
      !normalized.workouts[dayKey] ||
      typeof normalized.workouts[dayKey] !== "object"
    ) {
      normalized.workouts[dayKey] = defaults.workouts[dayKey];
    }
  });

  return normalized;
}

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initialData = cloneDefaultData();
      saveData(initialData);
      return initialData;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      throw new Error("Format data tidak valid.");
    }

    const normalized = normalizeData(parsed);
    saveData(normalized);
    return normalized;
  } catch (error) {
    console.error("Gagal membaca data:", error);
    return cloneDefaultData();
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetData() {
  const fresh = cloneDefaultData();
  saveData(fresh);
  return fresh;
}

export function exportData(data) {
  const payload = {
    app: "Daily Routine PWA",
    exportedAt: new Date().toISOString(),
    data
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);

  anchor.href = url;
  anchor.download = `daily-routine-backup-${date}.json`;
  anchor.click();

  URL.revokeObjectURL(url);
}

export async function importData(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const imported = parsed.data ?? parsed;

  if (
    !imported ||
    typeof imported !== "object" ||
    !imported.schedules ||
    !imported.workouts
  ) {
    throw new Error("File backup tidak dikenali.");
  }

  const normalized = normalizeData(imported);
  saveData(normalized);
  return normalized;
}

import { DAY_KEYS, DAY_LABELS, DEFAULT_DATA } from "./routine.js";
import {
  exportData,
  importData,
  loadData,
  resetData,
  saveData
} from "./storage.js";

const ORDERED_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday"
];

let appData = loadData();
let selectedEditorDay = "monday";
let statusTimer;

const elements = {
  todayDate: document.querySelector("#today-date"),
  liveClock: document.querySelector("#live-clock"),
  currentTitle: document.querySelector("#current-title"),
  currentTime: document.querySelector("#current-time"),
  nextTitle: document.querySelector("#next-title"),
  nextTime: document.querySelector("#next-time"),
  dayChip: document.querySelector("#day-chip"),
  timeline: document.querySelector("#timeline"),
  workoutName: document.querySelector("#workout-name"),
  workoutTime: document.querySelector("#workout-time"),
  workoutLink: document.querySelector("#workout-link"),
  weeklyList: document.querySelector("#weekly-list"),
  notionUrl: document.querySelector("#notion-url"),
  settingsStatus: document.querySelector("#settings-status"),
  exportButton: document.querySelector("#export-button"),
  importInput: document.querySelector("#import-input"),
  resetButton: document.querySelector("#reset-button"),
  persistButton: document.querySelector("#persist-button"),
  storageStatus: document.querySelector("#storage-status"),
  editorDaySelect: document.querySelector("#editor-day-select"),
  copyDaySelect: document.querySelector("#copy-day-select"),
  copyDayButton: document.querySelector("#copy-day-button"),
  activityEditorTitle: document.querySelector("#activity-editor-title"),
  activityEditorList: document.querySelector("#activity-editor-list"),
  editorWarning: document.querySelector("#editor-warning"),
  addActivityButton: document.querySelector("#add-activity-button"),
  workoutEditorName: document.querySelector("#workout-editor-name"),
  workoutEditorTime: document.querySelector("#workout-editor-time"),
  resetDayButton: document.querySelector("#reset-day-button")
};

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isValidTime(value) {
  if (!/^\d{2}:\d{2}$/.test(value ?? "")) {
    return false;
  }

  const [hours, minutes] = value.split(":").map(Number);
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}

function timeToMinutes(value) {
  if (!isValidTime(value)) {
    return Number.NaN;
  }

  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function getDuration(activity) {
  const start = timeToMinutes(activity[0]);
  let end = timeToMinutes(activity[1]);

  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return 0;
  }

  if (end <= start) {
    end += 1440;
  }

  return end - start;
}

function getUsableSchedule(dayKey) {
  return (appData.schedules[dayKey] ?? []).filter(
    (activity) =>
      Array.isArray(activity) &&
      isValidTime(activity[0]) &&
      isValidTime(activity[1])
  );
}

function formatRange(start, end) {
  if (!isValidTime(start) || !isValidTime(end)) {
    return "Jam belum lengkap";
  }

  return `${start.replace(":", ".")}–${end.replace(":", ".")}`;
}

function getActivityState(activity, nowMinutes) {
  const start = timeToMinutes(activity[0]);
  let end = timeToMinutes(activity[1]);
  let comparableNow = nowMinutes;

  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return "future";
  }

  if (end <= start) {
    end += 1440;
    if (comparableNow < start) {
      comparableNow += 1440;
    }
  }

  if (comparableNow >= start && comparableNow < end) {
    return "current";
  }

  if (comparableNow >= end) {
    return "past";
  }

  return "future";
}

function getCurrentAndNext(schedule, nowMinutes) {
  if (schedule.length === 0) {
    return { current: null, next: null };
  }

  const currentIndex = schedule.findIndex(
    (activity) => getActivityState(activity, nowMinutes) === "current"
  );

  if (currentIndex >= 0) {
    return {
      current: schedule[currentIndex],
      next: schedule[(currentIndex + 1) % schedule.length]
    };
  }

  const nextIndex = schedule.findIndex(
    (activity) => getActivityState(activity, nowMinutes) === "future"
  );

  return {
    current: null,
    next: schedule[nextIndex >= 0 ? nextIndex : 0]
  };
}

function renderToday() {
  const now = new Date();
  const dayKey = DAY_KEYS[now.getDay()];
  const schedule = getUsableSchedule(dayKey);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const { current, next } = getCurrentAndNext(schedule, nowMinutes);

  elements.todayDate.textContent = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(now);

  elements.liveClock.textContent = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(now).replace(":", ".");

  elements.dayChip.textContent = DAY_LABELS[dayKey];

  if (current) {
    elements.currentTitle.textContent = current[2]?.trim() || "Kegiatan tanpa nama";
    elements.currentTime.textContent = formatRange(current[0], current[1]);
  } else {
    elements.currentTitle.textContent = "Belum ada kegiatan aktif";
    elements.currentTime.textContent = schedule.length
      ? "Lihat jadwal berikutnya"
      : "Jadwal hari ini masih kosong";
  }

  elements.nextTitle.textContent =
    next?.[2]?.trim() || (next ? "Kegiatan tanpa nama" : "Tidak ada jadwal");
  elements.nextTime.textContent = next ? formatRange(next[0], next[1]) : "—";

  if (schedule.length === 0) {
    elements.timeline.innerHTML =
      '<div class="timeline-empty">Belum ada aktivitas untuk hari ini.</div>';
  } else {
    elements.timeline.innerHTML = schedule
      .map((activity) => {
        const state = getActivityState(activity, nowMinutes);
        const stateClass =
          state === "current"
            ? "is-current"
            : state === "past"
              ? "is-past"
              : "";

        return `
          <article class="timeline-item ${stateClass}">
            <time class="timeline-time">${activity[0].replace(":", ".")}</time>
            <span class="timeline-dot" aria-hidden="true"></span>
            <div>
              <div class="timeline-title">${escapeHtml(activity[2]?.trim() || "Kegiatan tanpa nama")}</div>
              <p class="timeline-subtitle">${formatRange(activity[0], activity[1])}</p>
            </div>
          </article>
        `;
      })
      .join("");
  }

  const workout = appData.workouts[dayKey] ?? {};
  elements.workoutName.textContent = workout.name?.trim() || "Tidak ada";
  elements.workoutTime.textContent = workout.time?.trim() || "—";
  elements.workoutLink.href = appData.notionUrl || "#";
  elements.workoutLink.hidden = !appData.notionUrl;
}

function getMainActivity(dayKey) {
  const schedule = getUsableSchedule(dayKey);
  const candidates = schedule.filter(
    (activity) => !activity[2]?.toLowerCase().includes("tidur")
  );

  if (candidates.length === 0) {
    return "Belum ada aktivitas";
  }

  const mainActivity = [...candidates].sort(
    (a, b) => getDuration(b) - getDuration(a)
  )[0];

  return mainActivity[2]?.trim() || "Kegiatan tanpa nama";
}

function renderWeekly() {
  elements.weeklyList.innerHTML = ORDERED_DAYS
    .map((dayKey) => {
      const workout = appData.workouts[dayKey]?.name?.trim() || "—";

      return `
        <article class="weekly-item">
          <div>
            <div class="weekly-day">${DAY_LABELS[dayKey]}</div>
            <p class="weekly-summary">${escapeHtml(getMainActivity(dayKey))}</p>
          </div>
          <span class="workout-pill">${escapeHtml(workout)}</span>
        </article>
      `;
    })
    .join("");
}

function createDayOptions(selectedDay, excludedDay = null) {
  return ORDERED_DAYS
    .filter((dayKey) => dayKey !== excludedDay)
    .map(
      (dayKey) =>
        `<option value="${dayKey}" ${dayKey === selectedDay ? "selected" : ""}>${DAY_LABELS[dayKey]}</option>`
    )
    .join("");
}

function getScheduleWarnings(schedule) {
  const warnings = [];

  schedule.forEach((activity, index) => {
    const position = index + 1;
    if (!activity[2]?.trim()) {
      warnings.push(`Aktivitas ${position} belum memiliki nama.`);
    }
    if (!isValidTime(activity[0]) || !isValidTime(activity[1])) {
      warnings.push(`Jam aktivitas ${position} belum lengkap.`);
    }
  });

  return warnings;
}

function renderEditor() {
  const schedule = appData.schedules[selectedEditorDay] ?? [];
  const workout = appData.workouts[selectedEditorDay] ?? { name: "", time: "" };
  const fallbackCopyDay = ORDERED_DAYS.find((day) => day !== selectedEditorDay);

  elements.editorDaySelect.innerHTML = createDayOptions(selectedEditorDay);
  elements.copyDaySelect.innerHTML = createDayOptions(
    fallbackCopyDay,
    selectedEditorDay
  );
  elements.activityEditorTitle.textContent = `Jadwal ${DAY_LABELS[selectedEditorDay]}`;
  elements.workoutEditorName.value = workout.name ?? "";
  elements.workoutEditorTime.value = workout.time ?? "";

  if (schedule.length === 0) {
    elements.activityEditorList.innerHTML =
      '<div class="activity-editor-empty">Belum ada aktivitas. Tekan “+ Tambah” untuk membuat jadwal.</div>';
  } else {
    elements.activityEditorList.innerHTML = schedule
      .map(
        (activity, index) => `
          <article class="activity-editor-item" data-index="${index}">
            <div class="activity-editor-fields">
              <div class="compact-field">
                <label for="activity-start-${index}">Mulai</label>
                <input
                  id="activity-start-${index}"
                  type="time"
                  value="${escapeAttribute(activity[0] ?? "")}"
                  data-field="start"
                  aria-label="Jam mulai aktivitas ${index + 1}"
                >
              </div>
              <div class="compact-field">
                <label for="activity-end-${index}">Selesai</label>
                <input
                  id="activity-end-${index}"
                  type="time"
                  value="${escapeAttribute(activity[1] ?? "")}"
                  data-field="end"
                  aria-label="Jam selesai aktivitas ${index + 1}"
                >
              </div>
              <div class="compact-field activity-title-field">
                <label for="activity-title-${index}">Nama aktivitas</label>
                <input
                  id="activity-title-${index}"
                  type="text"
                  value="${escapeAttribute(activity[2] ?? "")}"
                  data-field="title"
                  placeholder="Nama kegiatan"
                  aria-label="Nama aktivitas ${index + 1}"
                >
              </div>
            </div>

            <div class="activity-editor-actions">
              <span class="activity-position">${index + 1} / ${schedule.length}</span>
              <button
                type="button"
                class="icon-button"
                data-action="move-up"
                aria-label="Pindahkan aktivitas ke atas"
                title="Naik"
                ${index === 0 ? "disabled" : ""}
              >↑</button>
              <button
                type="button"
                class="icon-button"
                data-action="move-down"
                aria-label="Pindahkan aktivitas ke bawah"
                title="Turun"
                ${index === schedule.length - 1 ? "disabled" : ""}
              >↓</button>
              <button
                type="button"
                class="icon-button is-danger"
                data-action="delete"
                aria-label="Hapus aktivitas"
                title="Hapus"
              >×</button>
            </div>
          </article>
        `
      )
      .join("");
  }

  const warnings = getScheduleWarnings(schedule);
  elements.editorWarning.textContent = warnings.length
    ? warnings[0] + (warnings.length > 1 ? ` (+${warnings.length - 1} lainnya)` : "")
    : "";
}

function renderSettings() {
  elements.notionUrl.value = appData.notionUrl ?? "";
  renderEditor();
  updateStorageStatus();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function showStatus(message, isError = false) {
  clearTimeout(statusTimer);
  elements.settingsStatus.textContent = message;
  elements.settingsStatus.style.color = isError ? "var(--danger)" : "var(--accent)";

  statusTimer = window.setTimeout(() => {
    elements.settingsStatus.textContent = "";
  }, 2800);
}

function saveAndRefresh(message = "Perubahan tersimpan.") {
  saveData(appData);
  renderToday();
  renderWeekly();
  showStatus(message);
}

function updateEditorWarnings() {
  const schedule = appData.schedules[selectedEditorDay] ?? [];
  const warnings = getScheduleWarnings(schedule);
  elements.editorWarning.textContent = warnings.length
    ? warnings[0] + (warnings.length > 1 ? ` (+${warnings.length - 1} lainnya)` : "")
    : "";
}

async function updateStorageStatus() {
  if (!navigator.storage?.persisted) {
    elements.storageStatus.textContent = "Tidak didukung browser";
    elements.persistButton.disabled = true;
    return;
  }

  const isPersistent = await navigator.storage.persisted();
  elements.storageStatus.textContent = isPersistent
    ? "Persistent storage aktif"
    : "Best effort";
  elements.persistButton.disabled = isPersistent;
}

function setupNavigation() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });

      document.querySelectorAll(".view").forEach((view) => {
        view.classList.toggle("is-active", view.id === button.dataset.view);
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

function setupEditor() {
  elements.editorDaySelect.addEventListener("change", () => {
    selectedEditorDay = elements.editorDaySelect.value;
    renderEditor();
  });

  elements.activityEditorList.addEventListener("input", (event) => {
    const input = event.target.closest("input[data-field]");
    const item = event.target.closest(".activity-editor-item");

    if (!input || !item) {
      return;
    }

    const index = Number(item.dataset.index);
    const activity = appData.schedules[selectedEditorDay]?.[index];

    if (!activity) {
      return;
    }

    const fieldIndexes = { start: 0, end: 1, title: 2 };
    activity[fieldIndexes[input.dataset.field]] = input.value;
    saveAndRefresh(`Jadwal ${DAY_LABELS[selectedEditorDay]} tersimpan.`);
    updateEditorWarnings();
  });

  elements.activityEditorList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    const item = event.target.closest(".activity-editor-item");

    if (!button || !item) {
      return;
    }

    const schedule = appData.schedules[selectedEditorDay] ?? [];
    const index = Number(item.dataset.index);
    const action = button.dataset.action;

    if (action === "move-up" && index > 0) {
      [schedule[index - 1], schedule[index]] = [schedule[index], schedule[index - 1]];
    }

    if (action === "move-down" && index < schedule.length - 1) {
      [schedule[index + 1], schedule[index]] = [schedule[index], schedule[index + 1]];
    }

    if (action === "delete") {
      const activityName = schedule[index]?.[2]?.trim() || "aktivitas ini";
      const approved = window.confirm(`Hapus “${activityName}”?`);

      if (!approved) {
        return;
      }

      schedule.splice(index, 1);
    }

    saveAndRefresh(`Jadwal ${DAY_LABELS[selectedEditorDay]} tersimpan.`);
    renderEditor();
  });

  elements.addActivityButton.addEventListener("click", () => {
    const schedule = appData.schedules[selectedEditorDay] ?? [];
    const sleepIndex = schedule.findIndex((activity) => {
      const start = timeToMinutes(activity[0]);
      const end = timeToMinutes(activity[1]);
      return Number.isFinite(start) && Number.isFinite(end) && end <= start;
    });

    const insertIndex = sleepIndex >= 0 ? sleepIndex : schedule.length;
    schedule.splice(insertIndex, 0, ["12:00", "13:00", "Kegiatan baru"]);
    appData.schedules[selectedEditorDay] = schedule;

    saveAndRefresh(`Aktivitas baru ditambahkan ke ${DAY_LABELS[selectedEditorDay]}.`);
    renderEditor();

    const newItem = elements.activityEditorList.querySelector(
      `.activity-editor-item[data-index="${insertIndex}"]`
    );
    newItem?.scrollIntoView({ behavior: "smooth", block: "center" });
    newItem?.querySelector('[data-field="title"]')?.select();
  });

  elements.copyDayButton.addEventListener("click", () => {
    const sourceDay = elements.copyDaySelect.value;
    if (!sourceDay || sourceDay === selectedEditorDay) {
      return;
    }

    const approved = window.confirm(
      `Ganti jadwal ${DAY_LABELS[selectedEditorDay]} dengan salinan jadwal ${DAY_LABELS[sourceDay]}?`
    );

    if (!approved) {
      return;
    }

    appData.schedules[selectedEditorDay] = deepClone(
      appData.schedules[sourceDay] ?? []
    );

    saveAndRefresh(
      `Jadwal ${DAY_LABELS[sourceDay]} disalin ke ${DAY_LABELS[selectedEditorDay]}.`
    );
    renderEditor();
  });

  elements.workoutEditorName.addEventListener("input", () => {
    appData.workouts[selectedEditorDay] ??= { name: "", time: "" };
    appData.workouts[selectedEditorDay].name = elements.workoutEditorName.value;
    saveAndRefresh(`Workout ${DAY_LABELS[selectedEditorDay]} tersimpan.`);
  });

  elements.workoutEditorTime.addEventListener("input", () => {
    appData.workouts[selectedEditorDay] ??= { name: "", time: "" };
    appData.workouts[selectedEditorDay].time = elements.workoutEditorTime.value;
    saveAndRefresh(`Workout ${DAY_LABELS[selectedEditorDay]} tersimpan.`);
  });

  elements.resetDayButton.addEventListener("click", () => {
    const approved = window.confirm(
      `Reset jadwal dan workout ${DAY_LABELS[selectedEditorDay]} ke versi awal?`
    );

    if (!approved) {
      return;
    }

    appData.schedules[selectedEditorDay] = deepClone(
      DEFAULT_DATA.schedules[selectedEditorDay] ?? []
    );
    appData.workouts[selectedEditorDay] = deepClone(
      DEFAULT_DATA.workouts[selectedEditorDay] ?? { name: "", time: "" }
    );

    saveAndRefresh(`${DAY_LABELS[selectedEditorDay]} dikembalikan ke jadwal awal.`);
    renderEditor();
  });
}

function setupSettings() {
  elements.notionUrl.addEventListener("input", () => {
    appData.notionUrl = elements.notionUrl.value.trim();
    saveAndRefresh("URL Notion tersimpan.");
  });

  elements.exportButton.addEventListener("click", () => {
    exportData(appData);
    showStatus("Backup berhasil dibuat.");
  });

  elements.importInput.addEventListener("change", async (event) => {
    const [file] = event.target.files;
    if (!file) return;

    try {
      appData = await importData(file);
      renderAll();
      showStatus("Backup berhasil diimpor.");
    } catch (error) {
      showStatus(error.message || "Gagal mengimpor backup.", true);
    } finally {
      event.target.value = "";
    }
  });

  elements.resetButton.addEventListener("click", () => {
    const approved = window.confirm(
      "Reset seluruh data ke jadwal awal? Tindakan ini tidak bisa dibatalkan."
    );

    if (!approved) return;

    appData = resetData();
    selectedEditorDay = "monday";
    renderAll();
    showStatus("Semua data dikembalikan ke jadwal awal.");
  });

  elements.persistButton.addEventListener("click", async () => {
    if (!navigator.storage?.persist) {
      showStatus("Browser ini tidak mendukung persistent storage.", true);
      return;
    }

    const granted = await navigator.storage.persist();
    await updateStorageStatus();
    showStatus(
      granted
        ? "Penyimpanan berhasil dilindungi."
        : "Browser belum memberikan persistent storage.",
      !granted
    );
  });
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
      try {
        await navigator.serviceWorker.register("./service-worker.js");
      } catch (error) {
        console.error("Service worker gagal didaftarkan:", error);
      }
    });
  }
}

function renderAll() {
  renderToday();
  renderWeekly();
  renderSettings();
}

setupNavigation();
setupEditor();
setupSettings();
registerServiceWorker();
renderAll();

setInterval(renderToday, 30_000);

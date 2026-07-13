export const DEFAULT_DATA = {
  version: 1,
  notionUrl: "https://app.notion.com/p/WORKOUT-2e48a06552a780ef808beee073975800",
  workouts: {
    monday: { name: "Push", time: "16:10–17:10" },
    tuesday: { name: "Core", time: "16:10–17:10" },
    wednesday: { name: "Pull", time: "16:10–17:10" },
    thursday: { name: "Legs", time: "16:10–17:10" },
    friday: { name: "Superset", time: "16:10–17:10" },
    saturday: { name: "Jogging", time: "06:00–07:00" },
    sunday: { name: "Rest Day", time: "Recovery" }
  },
  schedules: {
    monday: [
      ["04:00", "05:00", "Bangun dan salat Subuh"],
      ["05:00", "07:00", "Waktu pagi fleksibel"],
      ["07:00", "08:00", "Mandi, sarapan, dan bersiap PKL"],
      ["08:00", "16:00", "PKL"],
      ["16:00", "16:10", "Persiapan workout"],
      ["16:10", "17:10", "Workout — Push"],
      ["17:10", "17:30", "Mandi"],
      ["17:30", "19:00", "Salat dan mengaji"],
      ["19:00", "21:00", "Free time"],
      ["21:00", "04:00", "Tidur"]
    ],
    tuesday: [
      ["04:00", "05:00", "Bangun dan salat Subuh"],
      ["05:00", "07:00", "Waktu pagi fleksibel"],
      ["07:00", "08:00", "Mandi, sarapan, dan bersiap PKL"],
      ["08:00", "16:00", "PKL"],
      ["16:00", "16:10", "Persiapan workout"],
      ["16:10", "17:10", "Workout — Core"],
      ["17:10", "17:30", "Mandi"],
      ["17:30", "19:00", "Salat dan mengaji"],
      ["19:00", "21:00", "Free time"],
      ["21:00", "04:00", "Tidur"]
    ],
    wednesday: [
      ["04:00", "05:00", "Bangun dan salat Subuh"],
      ["05:00", "07:00", "Waktu pagi fleksibel"],
      ["07:00", "08:00", "Mandi, sarapan, dan bersiap PKL"],
      ["08:00", "16:00", "PKL"],
      ["16:00", "16:10", "Persiapan workout"],
      ["16:10", "17:10", "Workout — Pull"],
      ["17:10", "17:30", "Mandi"],
      ["17:30", "19:00", "Salat dan mengaji"],
      ["19:00", "21:00", "Free time"],
      ["21:00", "04:00", "Tidur"]
    ],
    thursday: [
      ["04:00", "05:00", "Bangun dan salat Subuh"],
      ["05:00", "07:00", "Waktu pagi fleksibel"],
      ["07:00", "08:00", "Mandi, sarapan, dan bersiap PKL"],
      ["08:00", "16:00", "PKL"],
      ["16:00", "16:10", "Persiapan workout"],
      ["16:10", "17:10", "Workout — Legs"],
      ["17:10", "17:30", "Mandi"],
      ["17:30", "19:00", "Salat dan mengaji"],
      ["19:00", "21:00", "Free time"],
      ["21:00", "04:00", "Tidur"]
    ],
    friday: [
      ["04:00", "05:00", "Bangun dan salat Subuh"],
      ["05:00", "07:00", "Waktu pagi fleksibel"],
      ["07:00", "08:00", "Mandi, sarapan, dan bersiap PKL"],
      ["08:00", "16:00", "PKL"],
      ["16:00", "16:10", "Persiapan workout"],
      ["16:10", "17:10", "Workout — Superset"],
      ["17:10", "17:30", "Mandi"],
      ["17:30", "19:00", "Salat dan mengaji"],
      ["19:00", "21:00", "Free time"],
      ["21:00", "04:00", "Tidur"]
    ],
    saturday: [
      ["04:00", "05:00", "Bangun dan salat Subuh"],
      ["05:00", "06:00", "Waktu pagi fleksibel"],
      ["06:00", "07:00", "Jogging"],
      ["07:00", "08:00", "Mandi dan sarapan"],
      ["08:00", "10:00", "Belajar atau mengembangkan skill"],
      ["10:00", "12:00", "Project pribadi"],
      ["12:00", "14:00", "Makan, salat, dan istirahat"],
      ["14:00", "17:30", "Free time atau kegiatan luar"],
      ["17:30", "19:00", "Salat dan mengaji"],
      ["19:00", "21:00", "Free time"],
      ["21:00", "04:00", "Tidur"]
    ],
    sunday: [
      ["04:00", "05:00", "Bangun dan salat Subuh"],
      ["05:00", "07:00", "Tidur lagi atau pagi santai"],
      ["07:00", "08:00", "Mandi dan sarapan"],
      ["08:00", "10:00", "Membaca buku"],
      ["10:00", "12:00", "Free time"],
      ["12:00", "14:00", "Makan, salat, dan istirahat"],
      ["14:00", "17:00", "Self-reward — film atau aktivitas santai"],
      ["17:00", "17:30", "Rapikan barang seperlunya"],
      ["17:30", "19:00", "Salat dan mengaji"],
      ["19:00", "21:00", "Waktu santai"],
      ["21:00", "04:00", "Tidur"]
    ]
  }
};

export const DAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday"
];

export const DAY_LABELS = {
  monday: "Senin",
  tuesday: "Selasa",
  wednesday: "Rabu",
  thursday: "Kamis",
  friday: "Jumat",
  saturday: "Sabtu",
  sunday: "Minggu"
};

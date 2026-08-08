const STORAGE_KEY = "personal-agenda-items";
const MOOD_STORAGE_KEY = "ova-mood-entries";
const JOURNAL_STORAGE_KEY = "ova-moment-journal";
const CUSTOM_TAG_STORAGE_KEY = "ova-custom-tags";
const DEFAULT_CUSTOM_TAG_COLOR = "#4f9edb";

const DEFAULT_TAGS = [
  "learning",
  "health & lifestyle",
  "family care",
  "current job",
  "career",
  "social"
];

const TAG_CLASS_NAMES = {
  learning: "tag-learning",
  "health & lifestyle": "tag-health-lifestyle",
  "family care": "tag-family-care",
  "current job": "tag-current-job",
  career: "tag-career",
  social: "tag-social"
};

const TAG_BAR_CLASS_NAMES = {
  learning: "bar-learning",
  "health & lifestyle": "bar-health-lifestyle",
  "family care": "bar-family-care",
  "current job": "bar-current-job",
  career: "bar-career",
  social: "bar-social"
};

const TAG_DOT_COLORS = {
  learning: "#4f9edb",
  "health & lifestyle": "#49bca7",
  "family care": "#df7d73",
  "current job": "#7d86d9",
  career: "#c59a35",
  social: "#9a7ad6"
};

const TAG_KEYWORDS = {
  learning: ["learn", "study", "read", "course", "class", "book", "research", "practice", "exam", "language"],
  "health & lifestyle": ["doctor", "dentist", "gym", "workout", "walk", "sleep", "meal", "medicine", "health", "therapy", "clean", "grocery"],
  "family care": ["mom", "dad", "parent", "child", "kid", "school", "family", "home", "care", "appointment"],
  "current job": ["meeting", "proposal", "client", "manager", "report", "project", "deadline", "email", "presentation", "work"],
  career: ["resume", "interview", "portfolio", "network", "apply", "promotion", "mentor", "skill", "career", "linkedin"],
  social: ["friend", "dinner", "party", "coffee", "call", "birthday", "message", "visit", "social", "hangout"]
};

const STOP_WORDS = new Set([
  "about", "after", "again", "agenda", "allow", "also", "and", "are", "because", "been", "before",
  "call", "can", "check", "clean", "done", "due", "each", "entry", "for", "from", "have", "into",
  "daily", "here", "it", "its", "just", "later", "make", "monthly", "need", "next", "note", "notes", "now", "one", "ongoing", "open",
  "please", "point", "points", "really", "review", "some", "task", "talk", "that", "the", "then",
  "there", "these", "thing", "things", "this", "those", "time", "today", "todo", "very", "with", "work",
  "weekly", "will", "you", "your",
  "add", "apply", "book", "buy", "clarify", "completed", "cycle", "draft", "email", "follow", "learn",
  "message", "moved", "pay", "plan", "prepare", "read", "remember", "reminder", "research", "schedule",
  "send", "study", "take", "think", "update", "want", "write",
  "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"
]);

const TITLE_FILLER_WORDS = new Set([
  "add",
  "added",
  "adding",
  "this",
  "that",
  "these",
  "those",
  "it",
  "its",
  "there",
  "here",
  "thing",
  "things",
  "stuff",
  "something",
  "anything",
  "everything",
  "later",
  "maybe",
  "just",
  "really",
  "very"
]);

const form = document.querySelector("#agendaForm");
const titleInput = document.querySelector("#taskTitle");
const dueDateInput = document.querySelector("#dueDate");
const dueTimeInput = document.querySelector("#dueTime");
const urgentInput = document.querySelector("#taskUrgent");
const reminderTypeInput = document.querySelector("#reminderType");
const tagOptions = document.querySelector("#tagOptions");
const addTagButton = document.querySelector("#addTagButton");
const customTagPanel = document.querySelector("#customTagPanel");
const customTagInput = document.querySelector("#customTagInput");
const customTagColorInput = document.querySelector("#customTagColor");
const list = document.querySelector("#agendaList");
const emptyState = document.querySelector("#emptyState");
const template = document.querySelector("#agendaItemTemplate");
const aiSummary = document.querySelector("#aiSummary");
const aiMetrics = document.querySelector("#aiMetrics");
const clearDoneButton = document.querySelector("#clearDone");
const toggleOngoingListButton = document.querySelector("#toggleOngoingList");
const filterButtons = document.querySelectorAll(".filter-button");
const weekday = document.querySelector("#weekday");
const todayDate = document.querySelector("#todayDate");
const todayCard = document.querySelector(".today-card");
const moodButtons = document.querySelectorAll(".mood-picker button");
const journalForm = document.querySelector("#journalForm");
const journalInput = document.querySelector("#journalInput");
const accountPanel = document.querySelector(".account-panel");
const accountState = document.querySelector("#accountState");
const accountDetail = document.querySelector("#accountDetail");
const authForm = document.querySelector("#authForm");
const authEmailInput = document.querySelector("#authEmail");
const authPasswordInput = document.querySelector("#authPassword");
const signInButton = document.querySelector("#signInButton");
const createAccountButton = document.querySelector("#createAccountButton");
const signedInActions = document.querySelector("#signedInActions");
const syncNowButton = document.querySelector("#syncNowButton");
const signOutButton = document.querySelector("#signOutButton");
const authMessage = document.querySelector("#authMessage");

let items = normalizeItems(loadItems());
let moods = loadMoods();
let journals = loadJournals();
let customTags = loadCustomTags();
let selectedCustomTagColor = DEFAULT_CUSTOM_TAG_COLOR;
let currentFilter = "all";
let showOngoingInList = false;
let selectedKeyword = "";
let selectedCalendarDate = "";
let showJournalLog = false;
let todayCardClickCount = 0;
let todayCardClickTimer = 0;
let moodHeadingClickCount = 0;
let moodHeadingClickTimer = 0;
let cloud = { ready: false, user: null };
let cloudSaveTimer = 0;
let isApplyingCloudData = false;
saveItems();

function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function todayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function loadItems() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function loadMoods() {
  try {
    return JSON.parse(localStorage.getItem(MOOD_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function loadJournals() {
  try {
    return JSON.parse(localStorage.getItem(JOURNAL_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function loadCustomTags() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CUSTOM_TAG_STORAGE_KEY)) || [];
    return parsed.map(normalizeCustomTag).filter(Boolean);
  } catch {
    return [];
  }
}

function saveCustomTags() {
  localStorage.setItem(CUSTOM_TAG_STORAGE_KEY, JSON.stringify(customTags));
  queueCloudSave();
}

function normalizeTagName(value) {
  return String(value || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function normalizeCustomTag(value) {
  if (typeof value === "string") {
    const name = normalizeTagName(value);
    return name ? { name, color: DEFAULT_CUSTOM_TAG_COLOR } : null;
  }

  const name = normalizeTagName(value?.name);
  if (!name) return null;
  const color = isHexColor(value?.color) ? value.color.toLowerCase() : DEFAULT_CUSTOM_TAG_COLOR;
  return { name, color };
}

function normalizeJournalEntry(value) {
  const text = String(value?.text || "").trim();
  const createdAt = value?.createdAt || "";
  if (!text || Number.isNaN(new Date(createdAt).getTime())) return null;
  return {
    id: value.id || crypto.randomUUID(),
    text,
    createdAt
  };
}

function allTags() {
  const customNames = customTags.map((tag) => tag.name).filter((tag) => !DEFAULT_TAGS.includes(tag));
  return [...DEFAULT_TAGS, ...customNames];
}

function customTagColor(tagName) {
  return customTags.find((tag) => tag.name === tagName)?.color || DEFAULT_CUSTOM_TAG_COLOR;
}

function normalizeItems(rawItems) {
  return rawItems.map((item) => {
    const originalEntry = item.originalEntry || item.title || "";
    const storedSummary = item.summaryTitle || item.title || "";
    const needsCleanup = shouldRegenerateSummary(storedSummary, originalEntry);
    const summaryTitle = item.titleEdited && storedSummary && !needsCleanup
      ? storedSummary
      : needsCleanup
        ? summarizeEntry(originalEntry)
        : storedSummary;
    const reminderType = item.reminderType || "one-time";
    const dueDate = item.dueDate || item.date || (reminderType === "ongoing" ? "" : todayKey());
    const dueTime = item.dueTime || item.time || "";
    const tags = Array.isArray(item.tags) && item.tags.length ? item.tags : autoTag(originalEntry);

    return {
      id: item.id || crypto.randomUUID(),
      title: summaryTitle,
      summaryTitle,
      titleEdited: Boolean(item.titleEdited && !needsCleanup),
      originalEntry,
      entryDate: item.entryDate || localDateFromIso(item.createdAt) || todayKey(),
      dueDate,
      dueTime,
      tags,
      urgent: Boolean(item.urgent || item.priority === "high"),
      reminderType,
      followUps: Array.isArray(item.followUps) ? item.followUps : legacyFollowUps(item.notes),
      done: Boolean(item.done),
      createdAt: item.createdAt || new Date().toISOString()
    };
  });
}

function legacyFollowUps(notes) {
  if (!notes) return [];
  return [{
    id: crypto.randomUUID(),
    text: notes,
    createdAt: new Date().toISOString()
  }];
}

function localDateFromIso(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function saveItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  queueCloudSave();
}

function saveMoods() {
  localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(moods));
  queueCloudSave();
}

function saveJournals() {
  localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(journals));
  queueCloudSave();
}

function hasCloudConfig() {
  const config = window.OVA_FIREBASE_CONFIG;
  return Boolean(config && config.apiKey && config.projectId && config.appId);
}

function accountData() {
  return {
    items,
    moods,
    journals,
    customTags,
    schemaVersion: 1
  };
}

function applyAccountData(data) {
  if (!data) return;
  isApplyingCloudData = true;
  items = normalizeItems(Array.isArray(data.items) ? data.items : []);
  moods = data.moods && typeof data.moods === "object" ? data.moods : {};
  journals = Array.isArray(data.journals) ? data.journals.map(normalizeJournalEntry).filter(Boolean) : [];
  customTags = Array.isArray(data.customTags) ? data.customTags.map(normalizeCustomTag).filter(Boolean) : [];
  saveItems();
  saveMoods();
  saveJournals();
  saveCustomTags();
  isApplyingCloudData = false;
  renderTagOptions();
  renderDateHeader();
  render();
}

function queueCloudSave() {
  if (isApplyingCloudData || !cloud.ready || !cloud.user) return;
  window.clearTimeout(cloudSaveTimer);
  cloudSaveTimer = window.setTimeout(() => {
    saveCloudData().catch((error) => showAuthMessage(accountErrorMessage(error), true));
  }, 450);
}

async function saveCloudData() {
  if (!cloud.ready || !cloud.user) return;
  await cloud.setDoc(cloud.doc(cloud.db, "users", cloud.user.uid, "ova", "state"), {
    ...accountData(),
    ownerId: cloud.user.uid,
    updatedAt: cloud.serverTimestamp()
  }, { merge: true });
  showAuthMessage("Synced.", false);
}

async function loadCloudData() {
  if (!cloud.ready || !cloud.user) return;
  showAuthMessage("Loading your agenda...", false);
  const snapshot = await cloud.getDoc(cloud.doc(cloud.db, "users", cloud.user.uid, "ova", "state"));
  if (snapshot.exists()) {
    applyAccountData(snapshot.data());
    showAuthMessage("Synced from your account.", false);
    return;
  }
  await saveCloudData();
  showAuthMessage("Account ready. Local agenda copied in.", false);
}

function showAuthMessage(message, isError = false) {
  authMessage.textContent = message || "";
  accountPanel.classList.toggle("sync-error", Boolean(isError));
}

function renderAccountPanel() {
  const hasConfig = hasCloudConfig();
  accountPanel.classList.toggle("cloud-ready", hasConfig);
  accountPanel.classList.toggle("signed-in", Boolean(cloud.user));
  authForm.hidden = Boolean(cloud.user) || !hasConfig;
  signedInActions.hidden = !cloud.user;

  if (!hasConfig) {
    accountState.textContent = "Local mode";
    accountDetail.textContent = "Add Firebase config to enable sign-in.";
    showAuthMessage("Your data is saved on this device for now.", false);
    return;
  }

  if (!cloud.ready) {
    accountState.textContent = "Account";
    accountDetail.textContent = "Preparing sign-in...";
    return;
  }

  if (cloud.user) {
    accountState.textContent = "Signed in";
    accountDetail.textContent = cloud.user.email || "Account connected";
    return;
  }

  accountState.textContent = "Account";
  accountDetail.textContent = "Sign in to use this agenda anywhere.";
  showAuthMessage("", false);
}

async function initializeCloud() {
  renderAccountPanel();
  if (!hasCloudConfig()) return;

  try {
    const version = "12.16.0";
    const firebaseApp = await import(`https://www.gstatic.com/firebasejs/${version}/firebase-app.js`);
    const firebaseAuth = await import(`https://www.gstatic.com/firebasejs/${version}/firebase-auth.js`);
    const firebaseFirestore = await import(`https://www.gstatic.com/firebasejs/${version}/firebase-firestore.js`);
    const app = firebaseApp.initializeApp(window.OVA_FIREBASE_CONFIG);
    cloud = {
      ready: true,
      user: null,
      auth: firebaseAuth.getAuth(app),
      db: firebaseFirestore.getFirestore(app),
      onAuthStateChanged: firebaseAuth.onAuthStateChanged,
      createUserWithEmailAndPassword: firebaseAuth.createUserWithEmailAndPassword,
      signInWithEmailAndPassword: firebaseAuth.signInWithEmailAndPassword,
      signOut: firebaseAuth.signOut,
      doc: firebaseFirestore.doc,
      getDoc: firebaseFirestore.getDoc,
      setDoc: firebaseFirestore.setDoc,
      serverTimestamp: firebaseFirestore.serverTimestamp
    };

    cloud.onAuthStateChanged(cloud.auth, async (user) => {
      cloud.user = user;
      renderAccountPanel();
      if (!user) return;
      try {
        await loadCloudData();
      } catch (error) {
        showAuthMessage(accountErrorMessage(error), true);
      }
    });
  } catch (error) {
    cloud = { ready: false, user: null };
    renderAccountPanel();
    showAuthMessage("Sign-in could not load. Local mode still works.", true);
  }
}

function authCredentials() {
  return {
    email: authEmailInput.value.trim(),
    password: authPasswordInput.value
  };
}

async function signIn() {
  if (!cloud.ready) return;
  const { email, password } = authCredentials();
  if (!email || !password) {
    showAuthMessage("Enter email and password.", true);
    return;
  }
  showAuthMessage("Signing in...", false);
  try {
    await cloud.signInWithEmailAndPassword(cloud.auth, email, password);
    authPasswordInput.value = "";
  } catch (error) {
    showAuthMessage(accountErrorMessage(error), true);
  }
}

async function createAccount() {
  if (!cloud.ready) return;
  const { email, password } = authCredentials();
  if (!email || password.length < 6) {
    showAuthMessage("Use an email and 6+ character password.", true);
    return;
  }
  showAuthMessage("Creating account...", false);
  try {
    await cloud.createUserWithEmailAndPassword(cloud.auth, email, password);
    authPasswordInput.value = "";
  } catch (error) {
    showAuthMessage(accountErrorMessage(error), true);
  }
}

async function signOutAccount() {
  if (!cloud.ready) return;
  try {
    await cloud.signOut(cloud.auth);
    showAuthMessage("Signed out. Local copy remains here.", false);
  } catch (error) {
    showAuthMessage(accountErrorMessage(error), true);
  }
}

function accountErrorMessage(error) {
  const code = error?.code || "";
  if (code.includes("invalid-credential") || code.includes("wrong-password")) return "Email or password did not match.";
  if (code.includes("email-already-in-use")) return "That email already has an account.";
  if (code.includes("weak-password")) return "Password should be at least 6 characters.";
  if (code.includes("permission-denied")) return "Check the Firestore rules for this project.";
  if (code.includes("unauthorized-domain")) return "Add this website domain in Firebase Authentication settings.";
  return "Account sync had a problem. Local data is still safe.";
}

function formatDate(dateKey) {
  if (!dateKey) return "";
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(year, month - 1, day));
}

function formatDueDateTime(item) {
  if (!item.dueDate) return "No due date";
  const dateText = formatDate(item.dueDate);
  if (!item.dueTime) return dateText;
  const [year, month, day] = item.dueDate.split("-").map(Number);
  const [hour = 0, minute = 0] = item.dueTime.split(":").map(Number);
  return `${dateText} at ${new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(year, month - 1, day, hour, minute))}`;
}

function itemTimestamp(item) {
  if (!item.dueDate) return Number.POSITIVE_INFINITY;
  return new Date(`${item.dueDate}T${item.dueTime || "23:59"}`).getTime();
}

function isToday(item) {
  if (!item.dueDate) return false;
  return item.dueDate === todayKey();
}

function isUpcoming(item) {
  if (!item.dueDate) return false;
  return startOfDay(new Date(`${item.dueDate}T00:00`)) > startOfDay(new Date());
}

function isOverdue(item) {
  if (!item.dueDate) return false;
  return startOfDay(new Date(`${item.dueDate}T00:00`)) < startOfDay(new Date());
}

function isRepeating(item) {
  return item.reminderType !== "one-time";
}

function filteredItems() {
  const sorted = [...items].sort(compareAgendaItems);
  if (showOngoingInList) {
    return sorted.filter((item) => !item.done && item.reminderType === "ongoing");
  }

  const listItems = sorted.filter((item) => item.reminderType !== "ongoing");

  if (currentFilter === "today") return listItems.filter((item) => !item.done && isToday(item));
  if (currentFilter === "upcoming") return listItems.filter((item) => !item.done && isUpcoming(item));
  if (currentFilter === "done") return listItems.filter((item) => item.done);
  return listItems.filter((item) => !item.done);
}

function compareAgendaItems(a, b) {
  if (a.done !== b.done) return a.done ? 1 : -1;
  const timestampDifference = itemTimestamp(a) - itemTimestamp(b);
  if (timestampDifference) return timestampDifference;
  return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
}

function renderDateHeader() {
  const now = new Date();
  weekday.textContent = new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(now);
  todayDate.textContent = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(now);
  if (reminderTypeInput.value !== "ongoing" && !dueDateInput.value) dueDateInput.value = todayKey();
  updateDueDateRequirement();
  renderMoodPicker();
}

function updateDueDateRequirement() {
  const isOngoing = reminderTypeInput.value === "ongoing";
  dueDateInput.required = !isOngoing;
  dueTimeInput.disabled = isOngoing;
  if (isOngoing) {
    dueDateInput.value = "";
    dueTimeInput.value = "";
  } else if (!dueDateInput.value) {
    dueDateInput.value = todayKey();
  }
}

function selectedTags() {
  return [...tagOptions.querySelectorAll(".tag-option")]
    .filter((button) => button.getAttribute("aria-pressed") === "true")
    .map((button) => button.dataset.tag);
}

function clearSelectedTags() {
  tagOptions.querySelectorAll(".tag-option").forEach((button) => {
    button.setAttribute("aria-pressed", "false");
  });
}

function toggleTag(button) {
  const isPressed = button.getAttribute("aria-pressed") === "true";
  button.setAttribute("aria-pressed", String(!isPressed));
}

function renderTagOptions(selected = selectedTags()) {
  tagOptions.innerHTML = "";
  allTags().forEach((tag) => {
    const button = document.createElement("button");
    button.className = `tag-option ${TAG_CLASS_NAMES[tag] || "tag-custom"}`;
    button.type = "button";
    button.dataset.tag = tag;
    button.setAttribute("aria-pressed", String(selected.includes(tag)));
    button.textContent = toTitleCase(tag);
    if (!TAG_CLASS_NAMES[tag]) applyCustomTagColor(button, tag);
    button.addEventListener("click", () => toggleTag(button));
    tagOptions.appendChild(button);
  });
  tagOptions.appendChild(addTagButton);
}

function applyCustomTagColor(element, tagName) {
  const color = customTagColor(tagName);
  element.style.backgroundColor = colorToSoftBackground(color);
  element.style.color = color;
}

function showCustomTagInput() {
  customTagPanel.hidden = false;
  customTagInput.value = "";
  customTagColorInput.value = selectedCustomTagColor;
  customTagInput.focus();
}

function addCustomTag() {
  const tag = normalizeTagName(customTagInput.value);
  if (!tag) return;
  if (!allTags().includes(tag)) {
    customTags = [...customTags, { name: tag, color: selectedCustomTagColor }];
    saveCustomTags();
  }
  renderTagOptions([...selectedTags(), tag]);
  customTagInput.value = "";
  customTagPanel.hidden = true;
}

function toTitleCase(value) {
  return value.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function colorToSoftBackground(color) {
  const hex = color.replace("#", "");
  const red = parseInt(hex.slice(0, 2), 16);
  const green = parseInt(hex.slice(2, 4), 16);
  const blue = parseInt(hex.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, 0.14)`;
}

function isHexColor(value) {
  return /^#[0-9a-f]{6}$/i.test(String(value || ""));
}

function renderMoodPicker() {
  const todayMood = moods[todayKey()];
  moodButtons.forEach((button) => {
    button.classList.toggle("selected", Number(button.dataset.mood) === Number(todayMood));
  });
}

function setMood(score) {
  moods[todayKey()] = score;
  saveMoods();
  renderMoodPicker();
  generateLocalSummary();
}

function handleTodayCardClick(event) {
  if (journalForm.contains(event.target)) return;
  todayCardClickCount += 1;
  window.clearTimeout(todayCardClickTimer);
  todayCardClickTimer = window.setTimeout(() => {
    todayCardClickCount = 0;
  }, 900);
  if (todayCardClickCount >= 3) {
    todayCardClickCount = 0;
    revealJournalEntry();
  }
}

function revealJournalEntry() {
  journalForm.hidden = false;
  journalInput.value = "";
  journalInput.focus();
}

function hideJournalEntry() {
  journalInput.value = "";
  journalForm.hidden = true;
}

function addJournalEntry(event) {
  event.preventDefault();
  const text = journalInput.value.trim();
  if (!text) {
    hideJournalEntry();
    return;
  }
  journals = [
    {
      id: crypto.randomUUID(),
      text,
      createdAt: new Date().toISOString()
    },
    ...journals
  ];
  saveJournals();
  hideJournalEntry();
  generateLocalSummary();
}

function handleMoodHeadingClick(event) {
  event.stopPropagation();
  moodHeadingClickCount += 1;
  window.clearTimeout(moodHeadingClickTimer);
  moodHeadingClickTimer = window.setTimeout(() => {
    moodHeadingClickCount = 0;
  }, 900);
  if (moodHeadingClickCount >= 3) {
    moodHeadingClickCount = 0;
    showJournalLog = !showJournalLog;
    generateLocalSummary();
  }
}

function handleDocumentClick(event) {
  if (!showJournalLog) return;
  if (event.target.closest(".mood-block")) return;
  showJournalLog = false;
  generateLocalSummary();
}

function autoTag(text) {
  const haystack = text.toLowerCase();
  const matches = DEFAULT_TAGS.filter((tag) => TAG_KEYWORDS[tag].some((keyword) => haystack.includes(keyword)));
  return matches.length ? matches : ["current job"];
}

function summarizeEntry(text) {
  const cleaned = text
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^(i\s+need\s+to|need\s+to|please|remember\s+to|todo:?|to\s+do:?|i\s+should)\s+/i, "")
    .replace(/[.!?]+$/g, "");
  if (!cleaned) return "Untitled task";

  const normalized = normalizeTitleText(cleaned);
  const clauses = normalized
    .replace(/\s+and\s+(?=add|research|prepare|draft|write|send|call|book|schedule|review|update|study|learn|apply|email|message|pay|buy|clean|plan|think|clarify|check|follow up)\b/gi, ", ")
    .split(/\s*(?:,|;|\band then\b|\bthen\b)\s*/i)
    .map((part) => part.trim())
    .filter(Boolean);
  const primary = makeInfoLabel(clauses[0] || normalized);
  const secondary = clauses.slice(1).map(makeInfoLabel).find((part) => part && part !== primary);
  return compactTitle(secondary ? `${primary} + ${secondary}` : primary);
}

function shouldRegenerateSummary(summary, originalEntry) {
  if (!summary || summary === originalEntry) return true;
  if (summary.includes("...")) return true;
  if (/\band [A-Z]/.test(summary)) return true;
  if (/\band\b/.test(summary)) return true;
  if (/\babout\b/i.test(summary)) return true;
  if (containsTitleFiller(summary)) return true;
  return summary.split(/\s+/).length > 9;
}

function normalizeTitleText(text) {
  return text
    .replace(/\bCA\b/g, "California")
    .replace(/\bapi\b/gi, "API")
    .replace(/\s+/g, " ")
    .trim();
}

function makeInfoLabel(text) {
  const phrase = text
    .replace(/^(and|also|then|to)\s+/i, "")
    .replace(/\b(i\s+need\s+to|i\s+want\s+to|i\s+should|need\s+to|want\s+to|should)\b\s*/i, "")
    .replace(/\bthink\s+(about|through|of)\b/i, "plan")
    .replace(/\blook\s+into\b/i, "research")
    .replace(/\bfigure\s+out\b/i, "clarify")
    .replace(/\bfor\s+(the\s+)?next\s+role\b/gi, "")
    .replace(/\bwith\s+(the\s+)?(product|team|manager|client)\b/gi, "")
    .replace(/\babout\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  const actionVerbs = /^(add|research|prepare|draft|write|send|call|book|schedule|review|update|study|learn|apply|email|message|pay|buy|clean|plan|clarify|check|follow up)\s+/i;
  const label = phrase
    .replace(actionVerbs, "")
    .replace(/\bslides?\s+for\s+(.+)/i, "$1 slides")
    .replace(/\bportfolio\b/i, "portfolio update")
    .replace(/\s+/g, " ")
    .trim();

  return label.charAt(0).toUpperCase() + label.slice(1);
}

function compactTitle(rawTitle) {
  const cleaned = rawTitle
    .replace(/\bthe\s+/gi, "")
    .replace(/\bmy\s+/gi, "")
    .replace(/\ba\s+/gi, "")
    .replace(/\ban\s+/gi, "")
    .replace(/\s+\+\s+/g, " + ")
    .replace(/\s+/g, " ")
    .trim();
  const words = cleaned
    .split(" ")
    .filter((word) => word === "+" || !TITLE_FILLER_WORDS.has(word.toLowerCase().replace(/[^a-z0-9]/g, "")));
  const output = (words.length > 9 ? words.slice(0, 9) : words).join(" ")
    .replace(/\band ([A-Z])/g, (_, letter) => `and ${letter.toLowerCase()}`);
  return output ? output.charAt(0).toUpperCase() + output.slice(1) : "Untitled task";
}

function containsTitleFiller(title) {
  return title
    .split(/\s+/)
    .some((word) => TITLE_FILLER_WORDS.has(word.toLowerCase().replace(/[^a-z0-9]/g, "")));
}

function renderList() {
  const visibleItems = filteredItems();
  list.innerHTML = "";
  emptyState.hidden = visibleItems.length > 0;
  renderOngoingListToggle();

  visibleItems.forEach((item) => {
    const row = template.content.firstElementChild.cloneNode(true);
    row.classList.toggle("done", item.done);
    row.classList.toggle("urgent-item", item.urgent);
    row.classList.toggle("keyword-match", Boolean(selectedKeyword && itemHasKeyword(item, selectedKeyword)));
    row.dataset.id = item.id;
    const titleInput = row.querySelector(".summary-title-input");
    titleInput.value = item.summaryTitle || item.title;
    titleInput.addEventListener("change", () => updateSummaryTitle(item.id, titleInput.value));
    titleInput.addEventListener("blur", () => updateSummaryTitle(item.id, titleInput.value));
    titleInput.addEventListener("input", () => resizeSummaryTitle(titleInput));
    titleInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        updateSummaryTitle(item.id, titleInput.value);
        titleInput.blur();
      }
    });
    row.querySelector(".original-entry").textContent = item.originalEntry || item.title;
    renderItemMeta(row.querySelector(".item-meta"), item);

    renderStatusPills(row.querySelector(".status-pills"), item);
    renderFollowUps(row.querySelector(".follow-up-list"), item.followUps);

    const followUpForm = row.querySelector(".follow-up-form");
    const followUpInput = followUpForm.querySelector(".follow-up-input");
    followUpForm.addEventListener("submit", (event) => addFollowUp(event, item.id));
    followUpForm.querySelector(".follow-up-reveal").addEventListener("click", () => {
      followUpForm.classList.remove("collapsed");
      followUpInput.focus();
    });
    row.querySelector(".complete-toggle").addEventListener("click", () => completeItem(item.id));
    row.querySelector(".delete-button").addEventListener("click", () => deleteItem(item.id));
    list.appendChild(row);
    resizeSummaryTitle(titleInput);
  });
}

function renderOngoingListToggle() {
  const ongoingCount = items.filter((item) => !item.done && item.reminderType === "ongoing").length;
  toggleOngoingListButton.hidden = ongoingCount === 0;
  toggleOngoingListButton.setAttribute("aria-pressed", String(showOngoingInList));
  toggleOngoingListButton.textContent = showOngoingInList
    ? "Hide ongoing"
    : `Show ongoing${ongoingCount ? ` (${ongoingCount})` : ""}`;
}

function resizeSummaryTitle(input) {
  input.style.height = "auto";
  input.style.height = `${input.scrollHeight}px`;
}

function renderStatusPills(container, item) {
  container.innerHTML = "";
  if (item.urgent) container.appendChild(pill("Urgent", "urgent-pill"));
  container.appendChild(pill(reminderLabel(item.reminderType), "reminder-pill"));
}

function pill(text, className) {
  const span = document.createElement("span");
  span.className = `status-pill ${className}`;
  span.textContent = text;
  return span;
}

function renderItemMeta(container, item) {
  container.innerHTML = "";
  const text = document.createElement("span");
  text.className = "meta-text";
  text.textContent = item.reminderType === "ongoing" && !item.dueDate
    ? `Entered ${formatDate(item.entryDate)}. Ongoing.`
    : `Entered ${formatDate(item.entryDate)}. Due ${formatDueDateTime(item)}.`;

  const tags = document.createElement("span");
  tags.className = "meta-tags";
  renderTags(tags, item.tags);

  container.append(text, tags);
}

function renderTags(container, tags) {
  container.innerHTML = "";
  tags.forEach((tag) => {
    const span = document.createElement("span");
    span.className = `tag-chip ${TAG_CLASS_NAMES[tag] || "tag-custom"}`;
    if (!TAG_CLASS_NAMES[tag]) applyCustomTagColor(span, tag);
    span.textContent = tag;
    container.appendChild(span);
  });
}

function renderFollowUps(container, followUps) {
  container.innerHTML = "";
  if (!followUps.length) return;

  followUps.forEach((followUp) => {
    const entry = document.createElement("article");
    entry.className = "follow-up-entry";

    const stamp = document.createElement("time");
    stamp.dateTime = followUp.createdAt;
    stamp.textContent = formatTimestamp(followUp.createdAt);

    const text = document.createElement("p");
    text.textContent = followUp.text;

    entry.append(stamp, text);
    container.appendChild(entry);
  });
}

function formatTimestamp(value) {
  const date = new Date(value);
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function formatJournalTimestamp(value) {
  const date = new Date(value);
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function reminderLabel(type) {
  const labels = {
    "one-time": "One-time",
    ongoing: "Ongoing",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly"
  };
  return labels[type] || "One-time";
}

function addItem(event) {
  event.preventDefault();
  const originalEntry = titleInput.value.trim();
  const summaryTitle = summarizeEntry(originalEntry);
  const tags = selectedTags();
  const createdAt = new Date().toISOString();
  const reminderType = reminderTypeInput.value;
  if (reminderType !== "ongoing" && !dueDateInput.value) {
    dueDateInput.reportValidity();
    return;
  }

  items.push({
    id: crypto.randomUUID(),
    title: summaryTitle,
    summaryTitle,
    originalEntry,
    entryDate: localDateFromIso(createdAt) || todayKey(),
    dueDate: reminderType === "ongoing" ? "" : dueDateInput.value,
    dueTime: reminderType === "ongoing" ? "" : dueTimeInput.value,
    tags: tags.length ? tags : autoTag(originalEntry),
    urgent: urgentInput.getAttribute("aria-pressed") === "true",
    reminderType,
    followUps: [],
    titleEdited: false,
    done: false,
    createdAt
  });

  saveItems();
  form.reset();
  clearSelectedTags();
  urgentInput.setAttribute("aria-pressed", "false");
  reminderTypeInput.value = "one-time";
  updateDueDateRequirement();
  titleInput.focus();
  render();
}

function updateSummaryTitle(id, value) {
  const summaryTitle = value.trim() || "Untitled task";
  items = items.map((item) => item.id === id ? { ...item, title: summaryTitle, summaryTitle, titleEdited: true } : item);
  saveItems();
  render();
}

function completeItem(id) {
  items = items.map((item) => {
    if (item.id !== id) return item;
    if (item.reminderType === "ongoing" && !item.done) {
      return { ...item, done: true };
    }
    if (isRepeating(item) && !item.done) {
      const next = nextDueDate(item);
      return {
        ...item,
        dueDate: next,
        followUps: [
          ...item.followUps,
          {
            id: crypto.randomUUID(),
            text: `Completed this cycle. Next reminder moved to ${formatDate(next)}.`,
            createdAt: new Date().toISOString()
          }
        ]
      };
    }
    return { ...item, done: !item.done };
  });
  saveItems();
  render();
}

function nextDueDate(item) {
  if (!item.dueDate) return todayKey();
  const [year, month, day] = item.dueDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (item.reminderType === "daily") date.setDate(date.getDate() + 1);
  if (item.reminderType === "weekly") date.setDate(date.getDate() + 7);
  if (item.reminderType === "monthly") date.setMonth(date.getMonth() + 1);
  if (item.reminderType === "ongoing") date.setDate(date.getDate() + 1);

  const next = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return startOfDay(new Date(`${next}T00:00`)) < startOfDay(new Date()) ? todayKey() : next;
}

function addFollowUp(event, id) {
  event.preventDefault();
  const input = event.currentTarget.querySelector(".follow-up-input");
  const text = input.value.trim();
  if (!text) return;

  items = items.map((item) => item.id === id
    ? {
        ...item,
        followUps: [
          ...item.followUps,
          { id: crypto.randomUUID(), text, createdAt: new Date().toISOString() }
        ]
      }
    : item);

  saveItems();
  render();
}

function deleteItem(id) {
  items = items.filter((item) => item.id !== id);
  saveItems();
  render();
}

function clearDone() {
  items = items.filter((item) => !item.done);
  saveItems();
  render();
}

function relativeTiming(item) {
  if (!item.dueDate) return "no due date";
  const now = startOfDay(new Date());
  const target = startOfDay(new Date(`${item.dueDate}T00:00`));
  const days = Math.round((target - now) / 86400000);
  if (days < 0) return `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} overdue`;
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  return `in ${days} days`;
}

function generateLocalSummary() {
  const active = items.filter((item) => !item.done).sort((a, b) => itemTimestamp(a) - itemTimestamp(b));
  const ongoing = active.filter((item) => item.reminderType === "ongoing");
  const planned = active.filter((item) => item.reminderType !== "ongoing");
  const overdue = planned.filter(isOverdue);
  const today = planned.filter(isToday);
  const urgent = planned.filter((item) => item.urgent);
  const repeating = planned.filter(isRepeating);
  const nextThree = planned.slice(0, 3);
  const tagStats = summarizeTags(items);
  const keywordStats = summarizeKeywords(active);
  const moodStats = summarizeMoods();

  if (!items.length) {
    aiSummary.innerHTML = [
      summaryBlock("Nothing to summarize yet", "Add a few agenda items with due dates. Tags can be selected or inferred from the task.", "summary-overview-block")
    ].join("");
    aiMetrics.innerHTML = moodTrajectoryBlock(moodStats);
    bindMoodJournalToggle();
    return;
  }

  const overview = planned.length
    ? `You have ${planned.length} planned item${planned.length === 1 ? "" : "s"}. ${today.length} ${today.length === 1 ? "is" : "are"} due today, ${overdue.length} ${overdue.length === 1 ? "is" : "are"} overdue, and ${repeating.length} ${repeating.length === 1 ? "is" : "are"} repeating.`
    : "No dated or scheduled items need attention right now.";

  const focusItems = nextThree.length
    ? nextThree.map((item) => `${item.summaryTitle || item.title} (${relativeTiming(item)}${item.urgent ? ", urgent" : ""}; ${item.tags.join(", ")})`)
    : ["Review tomorrow's priorities or add the next thing that needs attention."];

  aiSummary.innerHTML = [
    summaryBlock("Summary", overview, "summary-overview-block"),
    listBlock("Suggested focus", focusItems, "suggested-focus-block"),
    ongoingBlock(ongoing),
    calendarBlock(planned)
  ].join("");

  aiMetrics.innerHTML = [
    tagDistributionBlock(tagStats, items.length),
    keywordNetworkBlock(keywordStats),
    moodTrajectoryBlock(moodStats)
  ].join("");
  bindKeywordCloud();
  bindMoodJournalToggle();
  bindCalendarDays();
}

function summarizeTags(active) {
  const counts = new Map();
  active.forEach((item) => item.tags.forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1)));
  const trackedTags = [...new Set([...allTags(), ...counts.keys()])];

  return trackedTags.map((tag) => ({
    tag,
    count: counts.get(tag) || 0
  })).sort((a, b) => b.count - a.count || trackedTags.indexOf(a.tag) - trackedTags.indexOf(b.tag));
}

function summarizeKeywords(active) {
  const terms = new Map();
  const termsByItem = new Map();

  active.forEach((item) => {
    const uniqueTerms = uniqueItemTerms(item);
    termsByItem.set(item.id, uniqueTerms);
    uniqueTerms.forEach((term) => {
      const current = terms.get(term.key) || { ...term, count: 0, items: new Set(), score: 0 };
      current.count += 1;
      current.score += term.weight;
      current.items.add(item.id);
      terms.set(term.key, current);
    });
  });

  const nodes = [...terms.values()]
    .filter((term) => term.label.length > 2)
    .sort((a, b) => b.score - a.score || b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, 14)
    .map((term) => ({ ...term, items: [...term.items] }));

  const nodeKeys = new Set(nodes.map((node) => node.key));
  const links = new Map();
  termsByItem.forEach((itemTerms) => {
    const present = itemTerms.filter((term) => nodeKeys.has(term.key));
    present.forEach((source, sourceIndex) => {
      present.slice(sourceIndex + 1).forEach((target) => {
        const key = [source.key, target.key].sort().join("::");
        const current = links.get(key) || { source: source.key, target: target.key, count: 0 };
        current.count += 1;
        links.set(key, current);
      });
    });
  });

  return {
    nodes,
    links: [...links.values()].sort((a, b) => b.count - a.count).slice(0, 24)
  };
}

function uniqueItemTerms(item) {
  const tokens = itemWords(item);
  const terms = new Map();

  tokens.forEach((token) => addTerm(terms, token.label, 1));
  tokens.slice(0, -1).forEach((token, index) => {
    const next = tokens[index + 1];
    if (!token || !next || token === next) return;
    addTerm(terms, `${token.label} ${next.label}`, 1.65);
  });

  return [...terms.values()]
    .sort((a, b) => b.weight - a.weight || a.label.localeCompare(b.label))
    .slice(0, 16);
}

function addTerm(terms, label, weight) {
  const words = keywordWords(label);
  if (!words.length) return;
  const key = words.length > 1 ? [...words].sort().join(" ") : words[0];
  const current = terms.get(key) || { key, label: termDisplayLabel(words), weight: 0 };
  current.weight += weight;
  terms.set(key, current);
}

function itemWords(item) {
  const followUpText = item.followUps.map((followUp) => followUp.text).join(" ");
  const text = `${item.summaryTitle || item.title} ${item.originalEntry || ""} ${followUpText}`.toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[’']/g, "");
  const matches = text.match(/[a-z][a-z0-9']{2,}/g) || [];
  return matches
    .map(normalizeKeyword)
    .filter((word) => word && !STOP_WORDS.has(word) && word.length > 2)
    .map((word) => ({ key: word, label: toDisplayTerm(word), weight: 1 }));
}

function normalizeKeyword(value) {
  return keywordWords(value).join(" ").trim();
}

function keywordWords(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map((word) => stemKeyword(word))
    .filter((word) => word && !STOP_WORDS.has(word) && word.length > 2);
}

function stemKeyword(word) {
  if (word.length > 5 && word.endsWith("ies")) return `${word.slice(0, -3)}y`;
  if (word.length > 5 && word.endsWith("ing")) {
    const stemmed = word.slice(0, -3);
    return /(.)\1$/.test(stemmed) ? stemmed.slice(0, -1) : stemmed;
  }
  if (word.length > 5 && word.endsWith("ed")) return word.slice(0, -2);
  if (word.length > 4 && word.endsWith("s")) return word.slice(0, -1);
  return word;
}

function toDisplayTerm(value) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function termDisplayLabel(words) {
  if (words.length === 2) {
    if (words.includes("career")) return toDisplayTerm(["career", ...words.filter((word) => word !== "career")].join(" "));
    if (words.includes("appointment")) return toDisplayTerm([...words.filter((word) => word !== "appointment"), "appointment"].join(" "));
    if (words.includes("salary") && words.includes("base")) return "Base Salary";
    if (words.includes("salary") && words.includes("benefit")) return "Salary Benefit";
  }
  return toDisplayTerm(words.join(" "));
}

function itemHasKeyword(item, keyword) {
  return uniqueItemTerms(item).some((term) => term.key === keyword);
}

function tagDistributionBlock(tagStats, activeCount) {
  const rows = tagStats.map(({ tag, count }) => {
    const percent = activeCount ? Math.round((count / activeCount) * 100) : 0;
    return `
      <div class="tag-stat ${escapeHtml(TAG_BAR_CLASS_NAMES[tag] || "bar-custom")}">
        <div class="tag-stat-top">
          <span>${escapeHtml(tag)}</span>
          <strong>${count} / ${activeCount || 0}</strong>
        </div>
        <div class="tag-meter" aria-hidden="true">
          <span style="width: ${percent}%"></span>
        </div>
      </div>
    `;
  }).join("");

  return `<section class="summary-block tag-distribution-block"><div class="tag-distribution">${rows}</div></section>`;
}

function ongoingBlock(ongoingItems) {
  if (!ongoingItems.length) {
    return `<section class="summary-block ongoing-block compact-block"><h3>Ongoing</h3><p>No continuously ongoing items.</p></section>`;
  }

  const rows = ongoingItems.slice(0, 5).map((item) => `
    <li>
      <span>${escapeHtml(item.summaryTitle || item.title)}</span>
      ${item.urgent ? "<strong>!</strong>" : ""}
    </li>
  `).join("");
  const more = ongoingItems.length > 5 ? `<p class="ongoing-more">+${ongoingItems.length - 5} more ongoing item${ongoingItems.length - 5 === 1 ? "" : "s"}.</p>` : "";

  return `
    <section class="summary-block ongoing-block">
      <h3>Ongoing</h3>
      <ul>${rows}</ul>
      ${more}
    </section>
  `;
}

function calendarBlock(plannedItems) {
  const [year, month] = todayKey().split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const monthLabel = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(firstDay);
  const itemsByDay = new Map();

  plannedItems.forEach((item) => {
    if (!item.dueDate || !item.dueDate.startsWith(`${year}-${String(month).padStart(2, "0")}`)) return;
    const day = Number(item.dueDate.slice(-2));
    const dayItems = itemsByDay.get(day) || [];
    dayItems.push(item);
    itemsByDay.set(day, dayItems);
  });

  const blanks = Array.from({ length: firstDay.getDay() }, () => `<span class="calendar-cell empty"></span>`).join("");
  const days = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayItems = itemsByDay.get(day) || [];
    const dots = dayItems.slice(0, 3).map((item) => {
      const tag = item.tags[0] || "";
      return `<span style="background:${escapeHtml(tagDotColor(tag))}"></span>`;
    }).join("");
    const more = dayItems.length > 3 ? `<em>+</em>` : "";
    const title = dayItems.length ? `${dayItems.length} item${dayItems.length === 1 ? "" : "s"}` : "";
    return `
      <button class="calendar-cell${dayItems.length ? " has-items" : ""}${dateKey === todayKey() ? " today" : ""}${dateKey === selectedCalendarDate ? " selected" : ""}" type="button" data-date="${dateKey}" title="${escapeHtml(title)}">
        <b>${day}</b>
        <i>${dots}${more}</i>
      </button>
    `;
  }).join("");

  return `
    <section class="summary-block calendar-block">
      <h3>${escapeHtml(monthLabel)}</h3>
      <div class="calendar-weekdays" aria-hidden="true">
        <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
      </div>
      <div class="calendar-grid" aria-label="Month view calendar">${blanks}${days}</div>
      ${calendarDayDetails(plannedItems)}
    </section>
  `;
}

function tagDotColor(tag) {
  return TAG_DOT_COLORS[tag] || customTagColor(tag);
}

function calendarDayDetails(plannedItems) {
  if (!selectedCalendarDate) return "";
  const dayItems = plannedItems
    .filter((item) => item.dueDate === selectedCalendarDate)
    .sort((a, b) => itemTimestamp(a) - itemTimestamp(b));
  const label = formatDate(selectedCalendarDate);

  if (!dayItems.length) {
    return `<div class="calendar-details"><strong>${escapeHtml(label)}</strong><p>No scheduled entries.</p></div>`;
  }

  const rows = dayItems.map((item) => `
    <li>
      <span>${escapeHtml(item.summaryTitle || item.title)}</span>
      <small>${escapeHtml(item.dueTime || "")}</small>
    </li>
  `).join("");

  return `
    <div class="calendar-details">
      <strong>${escapeHtml(label)}</strong>
      <ul>${rows}</ul>
    </div>
  `;
}

function summarizeMoods() {
  const entries = Object.entries(moods)
    .map(([date, score]) => ({ date, score: Number(score) }))
    .filter((entry) => !Number.isNaN(entry.score))
    .sort((a, b) => a.date.localeCompare(b.date));
  const currentYear = String(new Date().getFullYear());
  const recentCutoff = startOfDay(new Date());
  recentCutoff.setDate(recentCutoff.getDate() - 29);
  const yearly = entries.filter((entry) => entry.date.startsWith(currentYear));
  const monthly = entries.filter((entry) => startOfDay(new Date(`${entry.date}T00:00`)) >= recentCutoff);
  const yearlyMonthly = averageMoodsByMonth(yearly);
  const average = yearly.length
    ? yearly.reduce((sum, entry) => sum + entry.score, 0) / yearly.length
    : 0;
  const monthAverage = monthly.length
    ? monthly.reduce((sum, entry) => sum + entry.score, 0) / monthly.length
    : 0;

  return {
    entries,
    monthly,
    yearly,
    yearlyMonthly,
    monthAverage,
    average,
    latest: entries[entries.length - 1]
  };
}

function averageMoodsByMonth(entries) {
  const monthBuckets = new Map();
  entries.forEach((entry) => {
    const monthKey = entry.date.slice(0, 7);
    const bucket = monthBuckets.get(monthKey) || { total: 0, count: 0 };
    bucket.total += entry.score;
    bucket.count += 1;
    monthBuckets.set(monthKey, bucket);
  });

  return [...monthBuckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([monthKey, bucket]) => ({
      date: `${monthKey}-01`,
      score: bucket.total / bucket.count,
      count: bucket.count
    }));
}

function moodTrajectoryBlock({ monthly, yearly, yearlyMonthly, monthAverage, average, latest }) {
  if (!yearly.length) {
    return `
      <section class="summary-block mood-block">
        <h3 class="mood-heading" title="Hidden journal log">Mood trajectory</h3>
        <p>Choose a mood in today's card to start a monthly and yearly mood record.</p>
        ${journalLogBlock()}
      </section>
    `;
  }

  const monthChart = moodChartSvg(monthly, "month");
  const yearChart = moodChartSvg(yearlyMonthly, "year");
  const latestText = latest ? `${latest.score > 0 ? "+" : ""}${latest.score}` : "0";
  const monthAverageText = `${monthAverage >= 0 ? "+" : ""}${monthAverage.toFixed(1)}`;
  const averageText = `${average >= 0 ? "+" : ""}${average.toFixed(1)}`;

  return `
    <section class="summary-block mood-block">
      <h3 class="mood-heading" title="Hidden journal log">Mood trajectory</h3>
      <p class="mood-chart-label">Recent 30 days</p>
      <div class="mood-chart" aria-label="Monthly mood trajectory from -6 to 6">
        ${monthChart}
      </div>
      <p class="mood-chart-label">This year</p>
      <div class="mood-chart mood-chart-year" aria-label="Yearly mood trajectory from -6 to 6">
        ${yearChart}
      </div>
      <p class="mood-stats">Latest ${escapeHtml(latestText)}. Month avg ${escapeHtml(monthAverageText)}. Year avg ${escapeHtml(averageText)} from ${yearly.length} check-in${yearly.length === 1 ? "" : "s"}.</p>
      ${journalLogBlock()}
    </section>
  `;
}

function journalLogBlock() {
  if (!showJournalLog) return "";
  if (!journals.length) {
    return `<div class="journal-log" aria-label="Moment journal log"><p>No journal moments yet.</p></div>`;
  }

  const rows = journals
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((entry) => `
      <article class="journal-log-entry">
        <time datetime="${escapeHtml(entry.createdAt)}">${escapeHtml(formatJournalTimestamp(entry.createdAt))}</time>
        <p>${escapeHtml(entry.text)}</p>
      </article>
    `).join("");

  return `<div class="journal-log" aria-label="Moment journal log">${rows}</div>`;
}

function moodChartSvg(entries, scope) {
  const geometry = moodChartGeometry(entries);
  const points = sparklinePoints(entries, geometry);
  const dots = sparklineDots(entries, geometry);
  const axis = timelineAxis(entries, scope, geometry);

  return `
    <svg
      viewBox="0 0 ${geometry.width} 90"
      role="img"
      aria-label="${scope === "year" ? "Yearly" : "Monthly"} mood trajectory"
      style="--mood-axis-font: ${geometry.fontSize}px; --mood-chart-width: ${geometry.width};"
    >
      <line x1="0" y1="45" x2="${geometry.width}" y2="45"></line>
      ${axis}
      <polyline points="${points}"></polyline>
      ${dots}
    </svg>
  `;
}

function moodChartGeometry(entries) {
  const count = Math.max(entries.length, 1);
  const width = Math.min(520, Math.max(220, 160 + count * 22));
  const left = 10;
  const right = width - 10;
  const pointRadius = count > 18 ? 1.8 : count > 10 ? 2.2 : 2.8;
  const fontSize = count > 18 ? 7 : count > 10 ? 8 : 10;
  return { count, width, left, right, span: right - left, pointRadius, fontSize };
}

function sparklinePoints(entries, geometry = moodChartGeometry(entries)) {
  if (entries.length === 1) {
    const y = moodY(entries[0].score);
    return `${geometry.left},${y} ${geometry.right},${y}`;
  }

  return entries.map((entry, index) => {
    const x = geometry.left + (index / (entries.length - 1)) * geometry.span;
    return `${x.toFixed(1)},${moodY(entry.score)}`;
  }).join(" ");
}

function sparklineDots(entries, geometry = moodChartGeometry(entries)) {
  if (!entries.length) return "";
  const points = entries.length === 1
    ? [{ x: geometry.width / 2, y: moodY(entries[0].score) }]
    : entries.map((entry, index) => ({
        x: geometry.left + (index / (entries.length - 1)) * geometry.span,
        y: moodY(entry.score)
      }));

  return points.map((point) => `<circle class="mood-point" cx="${Number(point.x).toFixed(1)}" cy="${point.y}" r="${geometry.pointRadius}"></circle>`).join("");
}

function timelineAxis(entries, scope, geometry = moodChartGeometry(entries)) {
  if (!entries.length) return "";
  const labels = timelineLabels(entries, scope, geometry);
  return labels.map(({ x, label }) => `
    <g class="mood-tick">
      <line x1="${x}" y1="78" x2="${x}" y2="82"></line>
      <text x="${x}" y="89">${escapeHtml(label)}</text>
    </g>
  `).join("");
}

function timelineLabels(entries, scope, geometry = moodChartGeometry(entries)) {
  if (!entries.length) return [];
  const first = entries[0];
  if (scope === "month") {
    return [{ x: geometry.width / 2, label: shortTimelineLabel(first.date, scope) }];
  }
  const last = entries[entries.length - 1];
  if (entries.length === 1) return [{ x: geometry.width / 2, label: shortTimelineLabel(first.date, scope) }];
  const labels = [
    { x: geometry.left, label: shortTimelineLabel(first.date, scope) },
    { x: geometry.right, label: shortTimelineLabel(last.date, scope) }
  ];
  if (entries.length >= 7) {
    const middleIndex = Math.floor((entries.length - 1) / 2);
    labels.splice(1, 0, {
      x: geometry.left + (middleIndex / (entries.length - 1)) * geometry.span,
      label: shortTimelineLabel(entries[middleIndex].date, scope)
    });
  }
  return labels;
}

function shortTimelineLabel(dateKey, scope) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (scope === "year") {
    return new Intl.DateTimeFormat(undefined, { month: "short" }).format(date);
  }
  return new Intl.DateTimeFormat(undefined, { month: "long" }).format(date);
}

function moodY(score) {
  const clamped = Math.max(-6, Math.min(6, score));
  return (82 - ((clamped + 6) / 12) * 74).toFixed(1);
}

function keywordNetworkBlock(keywordGraph) {
  const keywordNodes = keywordGraph.nodes || [];
  if (!keywordNodes.length) {
    return `<section class="summary-block keyword-block"><h3>Keyword cloud</h3><div class="keyword-cloud"></div></section>`;
  }

  const max = Math.max(...keywordNodes.map((item) => item.count));
  const min = Math.min(...keywordNodes.map((item) => item.count));
  const range = Math.max(1, max - min);
  const colors = ["#2f79b8", "#268a79", "#bb5d54", "#5964b9", "#9f7620", "#7b5cb5", "#357c68", "#b44f7a"];
  const words = keywordNodes.map((item, index) => {
    const selected = selectedKeyword === item.key ? " selected" : "";
    const frequencyWeight = (item.count - min) / range;
    const rankWeight = 1 - (index / Math.max(keywordNodes.length - 1, 1));
    const scoreWeight = Math.min(item.score / 12, 1);
    const size = 0.82 + rankWeight * 0.72 + frequencyWeight * 0.4 + scoreWeight * 0.28;
    const color = colors[index % colors.length];
    const title = `${item.label}: ${item.count} active entr${item.count === 1 ? "y" : "ies"}`;
    return `
      <button
        class="keyword-word${selected}"
        type="button"
        data-key="${escapeHtml(item.key)}"
        aria-label="${escapeHtml(title)}"
        title="${escapeHtml(title)}"
        style="--word-size: ${size.toFixed(2)}rem; --word-color: ${color}; --word-order: ${index};"
      >
        <span>${escapeHtml(item.label)}</span>
        <small>${item.count}</small>
      </button>
    `;
  }).join("");

  return `
    <section class="summary-block keyword-block">
      <h3>Keyword cloud</h3>
      <div class="keyword-cloud" aria-label="Keyword frequency cloud">${words}</div>
      ${selectedKeywordBlock()}
    </section>
  `;
}

function selectedKeywordBlock() {
  if (!selectedKeyword) {
    return "";
  }

  const related = items
    .filter((item) => !item.done && itemHasKeyword(item, selectedKeyword))
    .sort((a, b) => itemTimestamp(a) - itemTimestamp(b));
  const label = keywordLabel(selectedKeyword);

  if (!related.length) {
    return `<div class="keyword-related"><strong>${escapeHtml(label)}</strong><p>No active entries match this keyword now.</p></div>`;
  }

  const rows = related.slice(0, 5).map((item) => `
    <li>
      <span>${escapeHtml(item.summaryTitle || item.title)}</span>
      <small>${escapeHtml(relativeTiming(item))}</small>
    </li>
  `).join("");
  const more = related.length > 5 ? `<p class="keyword-more">+${related.length - 5} more highlighted in the agenda list.</p>` : "";

  return `
    <div class="keyword-related">
      <strong>${escapeHtml(label)}</strong>
      <ul>${rows}</ul>
      ${more}
    </div>
  `;
}

function keywordLabel(key) {
  const graph = summarizeKeywords(items.filter((item) => !item.done));
  const match = graph.nodes.find((node) => node.key === key);
  return match ? match.label : toDisplayTerm(key);
}

function bindKeywordCloud() {
  aiMetrics.querySelectorAll(".keyword-word").forEach((button) => {
    button.addEventListener("click", () => selectKeyword(button.dataset.key));
  });
}

function bindMoodJournalToggle() {
  aiMetrics.querySelectorAll(".mood-heading").forEach((heading) => {
    heading.addEventListener("click", handleMoodHeadingClick);
  });
}

function bindCalendarDays() {
  aiSummary.querySelectorAll(".calendar-cell[data-date]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedCalendarDate = selectedCalendarDate === button.dataset.date ? "" : button.dataset.date;
      generateLocalSummary();
    });
  });
}

function selectKeyword(keyword) {
  selectedKeyword = selectedKeyword === keyword ? "" : keyword;
  renderList();
  generateLocalSummary();
}

function summaryBlock(title, text, className = "") {
  return `<section class="summary-block ${escapeHtml(className)}"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></section>`;
}

function listBlock(title, entries, className = "") {
  const listItems = entries.map((entry) => `<li>${escapeHtml(entry)}</li>`).join("");
  return `<section class="summary-block ${escapeHtml(className)}"><h3>${escapeHtml(title)}</h3><ul>${listItems}</ul></section>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function render() {
  renderList();
  generateLocalSummary();
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((next) => next.classList.toggle("active", next === button));
    renderList();
  });
});

form.addEventListener("submit", addItem);
clearDoneButton.addEventListener("click", clearDone);
toggleOngoingListButton.addEventListener("click", () => {
  showOngoingInList = !showOngoingInList;
  renderList();
});
signInButton.addEventListener("click", signIn);
createAccountButton.addEventListener("click", createAccount);
syncNowButton.addEventListener("click", () => {
  saveCloudData().catch((error) => showAuthMessage(accountErrorMessage(error), true));
});
signOutButton.addEventListener("click", signOutAccount);
authForm.addEventListener("submit", (event) => {
  event.preventDefault();
  signIn();
});
urgentInput.addEventListener("click", () => {
  const isPressed = urgentInput.getAttribute("aria-pressed") === "true";
  urgentInput.setAttribute("aria-pressed", String(!isPressed));
});
reminderTypeInput.addEventListener("change", updateDueDateRequirement);
addTagButton.addEventListener("click", showCustomTagInput);
customTagColorInput.addEventListener("input", () => {
  selectedCustomTagColor = customTagColorInput.value;
});
customTagInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addCustomTag();
  }
  if (event.key === "Escape") {
    customTagPanel.hidden = true;
  }
});
customTagInput.addEventListener("blur", () => {
  window.setTimeout(() => {
    if (!customTagInput.value.trim() && !customTagPanel.contains(document.activeElement)) {
      customTagPanel.hidden = true;
    }
  }, 0);
});
todayCard.addEventListener("click", handleTodayCardClick);
document.addEventListener("click", handleDocumentClick);
journalForm.addEventListener("submit", addJournalEntry);
journalInput.addEventListener("keydown", (event) => {
  if (event.key === "Escape") hideJournalEntry();
});
journalInput.addEventListener("blur", () => {
  window.setTimeout(() => {
    if (!journalInput.value.trim() && !journalForm.contains(document.activeElement)) hideJournalEntry();
  }, 0);
});
moodButtons.forEach((button) => button.addEventListener("click", () => setMood(Number(button.dataset.mood))));

renderTagOptions();
renderDateHeader();
render();
initializeCloud();

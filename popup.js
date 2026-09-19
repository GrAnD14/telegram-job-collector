// =============================================================
// Telegram Job Collector 2.9.2
// Публичные Telegram-каналы и группы -> фильтр -> Telegram Bot API
// Без Telegram User API и без ИИ.
// =============================================================

// ------------------ ФИЛЬТРЫ ------------------

const VACANCY_MARKERS = [
  "вакансия", "ищем", "требуется", "требуются", "нанимаем", "приглашаем",
  "обязанност", "требован", "условия", "кого ищут", "что делать",
  "что предстоит делать", "что нужно делать", "задачи", "что предлагаем",
  "мы предлагаем", "оплата", "зарплата", "отклик", "отклики",
  "пишите в лс", "контакт для отклика", "грейд", "стек"
];

const STRONG_VACANCY_MARKERS = [
  "обязанност", "требован", "условия", "что делать", "что предстоит делать",
  "что нужно делать", "кого ищут", "что предлагаем", "мы предлагаем",
  "мы ждем", "мы ждём", "задачи", "оплата", "зарплата", "откликнуться",
  "отклики", "пишите в лс", "контакт для отклика", "грейд", "стек"
];

const REMOTE_WORDS = [
  "удален", "удалён", "удаленно", "удалённо", "удаленная", "удалённая",
  "remote", "дистанцион", "из дома", "work from home", "wfh"
];

const REMOTE_NEGATIVE_PATTERNS = [
  /без\s+(?:возможности\s+)?удал[её]н[а-яё]*(?:\s+(?:работ[а-яё]*|формат[а-яё]*))?/i,
  /удал[её]н[а-яё]*(?:\s+(?:работ[а-яё]*|формат[а-яё]*))?\s+(?:не\s+предусмотрен[а-яё]*|нет|отсутствует)/i,
  /не\s+предусмотрен[а-яё]*\s+удал[её]н[а-яё]*/i,
  /(?:^|\s)не\s+удал[её]н[а-яё]*/i,
  /только\s+(?:на\s+месте(?:\s+работодателя)?|в\s+офисе|офис)/i,
  /работа\s+только\s+(?:на\s+месте(?:\s+работодателя)?|в\s+офисе)/i,
  /исключительно\s+(?:в\s+офисе|на\s+месте)/i,
  /офисн\w+\s+формат\s+без\s+удал/i
];

const HYBRID_WORDS = [
  "гибрид", "гибридный", "гибридная", "частично удал",
  "дня в офисе", "дней в офисе", "несколько дней в офисе"
];

const BEGINNER_WORDS = [
  "без опыта", "опыт не требуется", "можно без опыта", "junior", "джун",
  "стажер", "стажёр", "trainee", "готовы обучить", "обучение с нуля",
  "научим", "хочешь получить аналогичный опыт", "хотите получить аналогичный опыт"
];

const ROLE_WORDS = [
  "оператор", "поддержк", "техподдерж", "service desk", "helpdesk",
  "чат", "модератор", "контент", "ассистент", "помощник",
  "администратор", "делопроизвод", "документооборот", "документовед",
  "frontend", "фронтенд", "javascript", "react", "версталь",
  "тестиров", "qa", "маркетолог", "smm", "customer service"
];

const SENIOR_WORDS = [
  "senior", "сеньор", "lead", "teamlead", "team lead", "тимлид",
  "руководитель", "head of", "ведущий разработчик", "директор"
];

const MIDDLE_WORDS = ["middle", "мидл"];

const STRONG_EXPERIENCE_WORDS = [
  "strong experience", "proven experience", "extensive experience",
  "solid experience", "значительный опыт", "глубокий опыт", "опытный специалист"
];

const HARD_SCAM_PHRASES = [
  "выкуп товара за свои", "выкуп товаров за свои", "выкупать товары за свои",
  "внести депозит для работы", "страховой взнос", "гарантийный взнос",
  "оплатить доступ к работе", "оплатить трудоустройство",
  "пополнить баланс для работы", "переводить деньги со своей карты",
  "принимать платежи на свою карту", "использовать личную банковскую карту",
  "сообщить код из смс", "сообщить код из sms", "передать код из смс",
  "оформить сим-карту на себя", "оформить банковскую карту на себя"
];

const UNPAID_PHRASES = [
  "неоплачиваемая стажировка", "стажировка без оплаты",
  "работа без оплаты", "работа за опыт"
];

const COLD_SALES_WORDS = [
  "холодные звонки", "холодный обзвон", "активные продажи",
  "поиск новых клиентов", "исходящие продажи"
];

const COMMISSION_ONLY_WORDS = [
  "только процент", "без оклада", "оплата только процент",
  "доход только с продаж"
];

// Реклама каналов/папок и не-вакансии. Это жёсткий reject.
const AD_POST_PATTERNS = [
  /t\.me\/addlist\//i,
  /забрат[ьъ]\s+папк/i,
  /папк[а-яё]*\s+(?:telegram|телеграм)?\s*канал/i,
  /канал[а-яё]*\s+с\s+ваканси/i,
  /где\s+(?:их\s+)?находить\s+(?:вакансии\s+)?раньше/i,
  /вместо\s+десятков\s+.*подписок/i,
  /доступ\s+закроем/i,
  /подборк[а-яё]*\s+(?:telegram|телеграм)?\s*канал/i,
  /подпиш(?:ись|итесь).*канал/i
];


const DIGEST_WORDS = [
  "подборка вакансий", "дайджест вакансий", "вакансии недели",
  "топ вакансий", "список вакансий"
];

const APPLY_WORDS = [
  "отклик", "откликнуться", "apply", "respond", "подать заявку",
  "написать", "резюме", "вакансия"
];


// Публичные группы Telegram не имеют /s/-ленты, но Telegram официально
// отдаёт отдельные публичные сообщения через Post Widget.
// Для двух нужных пользователю групп есть bootstrap-ID, чтобы расширение
// могло автоматически найти актуальный хвост истории без User API.
const PUBLIC_GROUP_BOOTSTRAP = {
  edmarketclubjob: 460939,
  vakansii_infobiz: 324366
};

const GROUP_DISCOVERY_RADIUS = 4;
const GROUP_DISCOVERY_MAX_STEPS = 18;
const GROUP_DISCOVERY_INITIAL_STEP = 256;

// v2.9: резервный поиск для групп с очень разреженными публичными Post Widgets.
// В отличие от старого binary-search он НИКОГДА не считает одну пустую точку
// доказательством конца истории. Rescue включается только если быстрый поиск
// остановился на сообщении старше выбранного периода.
//
// Первые ~49 тыс. ID проверяются сеткой 1/8, следующие ~32 тыс. — 1/16.
// Это намеренно дороже старого алгоритма, но включается только для stale-групп.
const GROUP_SPARSE_NEAR_BAND_WIDTH = 4096;
const GROUP_SPARSE_NEAR_BANDS = 12;
const GROUP_SPARSE_NEAR_STRIDE = 8;
const GROUP_SPARSE_FAR_BAND_WIDTH = 8192;
const GROUP_SPARSE_FAR_BANDS = 4;
const GROUP_SPARSE_FAR_STRIDE = 16;
const GROUP_SPARSE_LOCAL_SWEEP_RADIUS = 24;
const GROUP_SPARSE_DISCOVERY_CONCURRENCY = 12;
const GROUP_SPARSE_DISCOVERY_MAX_PROBES = 10000;
const GROUP_SPARSE_RECENT_EMPTY_BANDS_TO_STOP = 3;

const GROUP_BACKSCAN_LIMIT = 2200;
const GROUP_BATCH_SIZE = 6;
const GROUP_BATCH_DELAY_MS = 90;
const GROUP_OLD_POSTS_TO_STOP = 4;
const GROUP_MAX_MISSES_IN_ROW = 120;

const MAX_PAGES_PER_CHANNEL = 80;
const REQUEST_DELAY_MS = 250;
const TELEGRAM_MESSAGE_LIMIT = 4096;

// ------------------ DOM ------------------

const botTokenEl = document.getElementById("botToken");
const chatIdEl = document.getElementById("chatId");
const detectChatBtn = document.getElementById("detectChatBtn");
const testBotBtn = document.getElementById("testBotBtn");
const channelsEl = document.getElementById("channels");
const daysBackEl = document.getElementById("daysBack");
const minScoreEl = document.getElementById("minScore");
const requireRemoteEl = document.getElementById("requireRemote");
const sendOnlyNewEl = document.getElementById("sendOnlyNew");
const saveBtn = document.getElementById("saveBtn");
const scanBtn = document.getElementById("scanBtn");
const auditBtn = document.getElementById("auditBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const uncertainCountEl = document.getElementById("uncertainCount");
const rejectedCountEl = document.getElementById("rejectedCount");
const reviewCountEl = document.getElementById("reviewCount");
const auditSummaryEl = document.getElementById("auditSummary");
const auditResultsEl = document.getElementById("auditResults");
const auditViewEl = document.getElementById("auditView");
const exportAuditBtn = document.getElementById("exportAuditBtn");
const clearAuditBtn = document.getElementById("clearAuditBtn");
const auditDetailsEl = document.getElementById("auditDetails");
const statusEl = document.getElementById("status");
const checkedCountEl = document.getElementById("checkedCount");
const matchedCountEl = document.getElementById("matchedCount");
const sentCountEl = document.getElementById("sentCount");
const resultsEl = document.getElementById("results");
const sourceStatusEl = document.getElementById("sourceStatus");

// ------------------ УТИЛИТЫ ------------------

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function normalize(text) {
  return (text || "")
    .toLowerCase()
    .replaceAll("ё", "е")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/@\w+/g, " ")
    .replace(/[^a-zа-я0-9]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasAny(text, words) {
  const n = normalize(text);
  return words.some(word => n.includes(normalize(word)));
}

function countAny(text, words) {
  const n = normalize(text);
  return words.reduce((sum, word) => sum + (n.includes(normalize(word)) ? 1 : 0), 0);
}

function exactFingerprint(text) {
  const s = normalize(text);
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}

function hashString(text) {
  let h = 2166136261;
  for (const ch of text) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}

function escapeHtml(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function cleanText(text) {
  return (text || "")
    .replace(/\r/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractChannel(value) {
  let v = (value || "").trim();
  if (!v) return null;

  if (v.includes("t.me/+") || v.includes("joinchat/")) {
    return { error: "Приватная invite-ссылка не поддерживается: " + v };
  }

  v = v.replace(/^https?:\/\/t\.me\/s\//i, "");
  v = v.replace(/^https?:\/\/t\.me\//i, "");
  v = v.replace(/^@/, "");

  const parts = v.split(/[?#]/)[0].split("/").filter(Boolean);
  const channel = (parts[0] || "").trim();
  const seedId = /^\d+$/.test(parts[1] || "") ? Number(parts[1]) : null;

  if (!/^[A-Za-z0-9_]{5,}$/.test(channel)) {
    return { error: "Не удалось распознать источник: " + value };
  }

  return { channel, seedId };
}

function formatAge(dateIso) {
  if (!dateIso) return "дата не указана";
  const ms = new Date(dateIso).getTime();
  if (!Number.isFinite(ms)) return "дата не указана";
  const days = Math.max(0, Math.floor((Date.now() - ms) / 86400000));
  if (days === 0) return "сегодня";
  if (days === 1) return "1 день назад";
  if (days >= 2 && days <= 4) return `${days} дня назад`;
  return `${days} дней назад`;
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

// ------------------ HTML TELEGRAM -> СТРУКТУРНЫЙ ТЕКСТ ------------------

function nodeToStructuredText(root) {
  if (!root) return "";

  const blockTags = new Set(["DIV", "P", "SECTION", "ARTICLE", "BLOCKQUOTE", "PRE"]);

  function walk(node) {
    if (node.nodeType === 3) return node.nodeValue || ""; // Text
    if (node.nodeType !== 1) return "";

    const tag = node.tagName;
    if (tag === "BR") return "\n";

    let inner = "";
    for (const child of node.childNodes) inner += walk(child);

    if (tag === "LI") return `\n• ${inner.trim()}\n`;
    if (tag === "UL" || tag === "OL") return `\n${inner}\n`;
    if (blockTags.has(tag)) return `\n${inner}\n`;

    return inner;
  }

  return cleanText(walk(root))
    .replace(/\n[•·]\s*/g, "\n• ")
    .replace(/(?:^|\n)\s*[—–-]\s+/g, "\n• ")
    .trim();
}

function extractLinksFromNode(node) {
  if (!node) return [];
  const result = [];
  for (const a of node.querySelectorAll("a[href]")) {
    const href = a.getAttribute("href") || "";
    const text = cleanText(a.textContent || "");
    if (!href) continue;
    result.push({ text, url: href });
  }
  return result;
}

// ------------------ ИЗВЛЕЧЕНИЕ ПОЛЕЙ ------------------

function classifyWorkFormat(text) {
  const raw = cleanText(text);

  // Сильные отрицания удалёнки имеют приоритет.
  if (REMOTE_NEGATIVE_PATTERNS.some(pattern => pattern.test(raw))) {
    return {
      isRemote: false,
      certainty: "explicit_nonremote",
      label: "только офис / на месте",
      reason: "явно указано, что удалённого формата нет"
    };
  }

  const explicitHybrid =
    /гибрид[а-яё]*/i.test(raw) ||
    /\b\d+\s*(?:дн(?:я|ей)?|раз(?:а)?)\s+в\s+(?:недел[а-яё]*\s+)?офис/i.test(raw) ||
    /(?:частично|иногда)\s+в\s+офис/i.test(raw);

  const mostlyRemote =
    /преимущественно\s+удал[её]н/i.test(raw) ||
    /в\s+основном\s+удал[её]н/i.test(raw) ||
    /удал[её]н[а-яё]*.{0,80}(?:встреч|мероприят|офис).{0,40}(?:иногда|периодически|по необходимости|важно находиться)/i.test(raw) ||
    /важно\s+находиться\s+в\s+[А-ЯA-ZЁ][^.\n]{1,40}.{0,120}(?:встреч|мероприят|офис)/i.test(raw);

  const fullyRemote =
    /полностью\s+удал[её]н/i.test(raw) ||
    /100\s*%\s*удал/i.test(raw) ||
    /удал[её]нн?ая\s+работа/i.test(raw) ||
    /удал[её]нн?ый\s+формат\s+работы/i.test(raw) ||
    /\bremote\b/i.test(raw) ||
    /\bwfh\b/i.test(raw) ||
    /дистанционн[а-яё]*\s+работ/i.test(raw);

  const anyRemote = hasAny(raw, REMOTE_WORDS);

  const explicitOffice =
    /офисн[а-яё]*\s+формат(?:\s+работы)?/i.test(raw) ||
    /(?:работа|занятость)\s+(?:полностью\s+)?в\s+офисе/i.test(raw) ||
    /работа\s+на\s+месте\s+работодателя/i.test(raw);

  if (mostlyRemote) {
    return {
      isRemote: true,
      certainty: "explicit_remote",
      label: "преимущественно удалённо, возможны очные встречи",
      reason: "удалёнка преобладает, но есть очные активности"
    };
  }

  const mostlyOfficeHybrid =
    /(?:1|один)\s+(?:день|раз)\s+в\s+недел[а-яё]*\s*[—–-]?\s*удал/i.test(raw) ||
    /(?:4|четыре)\s+(?:дн[яей]+)\s+в\s+офис/i.test(raw);

  if ((explicitHybrid || explicitOffice) && anyRemote) {
    if (mostlyOfficeHybrid) {
      return {
        isRemote: false,
        certainty: "explicit_nonremote",
        label: "гибрид, преимущественно офис",
        reason: "удалёнка только небольшую часть недели"
      };
    }

    return {
      isRemote: true,
      certainty: "explicit_remote",
      label: "гибрид / частично удалённо",
      reason: "есть удалённая часть и офис"
    };
  }

  if (fullyRemote || anyRemote) {
    return {
      isRemote: true,
      certainty: "explicit_remote",
      label: "удалённо",
      reason: "есть явная удалёнка"
    };
  }

  if (explicitHybrid || hasAny(raw, HYBRID_WORDS)) {
    return {
      isRemote: false,
      certainty: "explicit_nonremote",
      label: "гибрид",
      reason: "гибрид без подтверждённой удалённой части"
    };
  }

  if (explicitOffice) {
    return {
      isRemote: false,
      certainty: "explicit_nonremote",
      label: "только офис / на месте",
      reason: "явно указан офисный формат"
    };
  }

  return {
    isRemote: false,
    certainty: "unknown",
    label: "не указано",
    reason: "формат работы не указан"
  };
}
function stripLeadingTags(line) {
  return line.replace(/^(?:\s*#\S+\s*)+/u, "").trim();
}

function isMetadataHeading(line) {
  return /^(?:где|з\/?п|зп|зарплата|доход|оклад|условия|обязанности|что делать|кого ищут|требования|контакт|контакты|стек|грейд|формат|график|опыт)\s*[:—–-]?/i.test(line);
}

function extractTitle(text) {
  const lines = cleanText(text).split("\n").map(x => x.trim()).filter(Boolean);

  for (const original of lines.slice(0, 16)) {
    let candidate = original
      .replace(/^[*`_]+|[*`_]+$/g, "")
      .replace(/^[-—–•🔥⭐💼📌✅📣\s]+/, "")
      .trim();

    // Рамки/разделители вида ╭──────── ✦ ────────╮ не являются заголовком.
    if (!/[A-Za-zА-Яа-яЁё0-9]/.test(candidate)) continue;
    if (/^[╭╰╮╯─━═_\s✦◆◇★☆•·]+$/u.test(candidate)) continue;

    if (/^(?:#\S+\s*)+$/u.test(candidate)) continue;
    candidate = stripLeadingTags(candidate);
    if (!candidate) continue;

    candidate = candidate
      .replace(/^(?:вакансия|ищем|ищу|требуется|требуются|позиция)\s*[:—–-]?\s*/i, "")
      .trim();

    if (!candidate || /^вакансия$/i.test(candidate)) continue;
    if (isMetadataHeading(candidate)) continue;
    if (candidate.length < 3 || candidate.length > 160) continue;

    if (/^(?:вакансии есть|где .*вакансии|как найти работу|ищете работу)/i.test(candidate)) continue;

    return candidate;
  }

  const m = cleanText(text).match(/^(.{3,100}?)(?=Грейд\s*:|Стек\s*:|Обязанности\s*:|Требования\s*:)/i);
  if (m) {
    const candidate = m[1].trim();
    if (/[A-Za-zА-Яа-яЁё0-9]/.test(candidate)) return candidate;
  }

  return "Вакансия";
}
function extractSalary(text) {
  const t = cleanText(text);

  const money = String.raw`(?:\d{1,3}(?:[ \u00a0]\d{3})+|\d{2,3}\s*[кk]|[1-9]\d{4,7})`;
  const currency = String.raw`(?:₽|руб(?:\.|лей|ля)?|р\.?|RUR|RUB)`;

  const normalizeSalary = value => value
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s*([–—-])\s*/g, " $1 ")
    .trim();

  const hasNegotiable =
    /(?:зарплат[а-яё]*|з\/?п|доход|оклад|уровень оплаты).{0,80}(?:по договор[её]нности|обсуждается|индивидуально)/is.test(t) ||
    /(?:уровень|зп|зарплата).{0,50}обсуждается индивидуально/is.test(t);

  const basePlusVariable = t.match(new RegExp(
    String.raw`(?:оклад|фикс(?:ированный)?\s+оклад|фикс)\s*[:—–-]?\s*((?:от|до)\s*)?(${money})\s*(${currency})?.{0,100}?(?:\+|плюс)\s*(?:прозрачн[а-яё]*\s+)?(?:kpi|кпи|переменн[а-яё]*\s+часть|процент|%)`,
    "i"
  ));

  const totalIncome = t.match(new RegExp(
    String.raw`(?:суммарн[а-яё]*\s+доход|доход|зарабатывать)\s*(?:от|до)?\s*(${money})\s*(${currency})`,
    "i"
  ));

  if (basePlusVariable && !/испытательн[а-яё]*/i.test(t)) {
    let summary = normalizeSalary(basePlusVariable[0]);
    if (totalIncome && !normalize(summary).includes(normalize(totalIncome[0]))) {
      summary += `; ${normalizeSalary(totalIncome[0])}`;
    }
    return summary;
  }

  if (/(?:оклад).{0,45}(?:\+|плюс).{0,35}(?:процент|%)/i.test(t)) {
    return "оклад + процент (сумма не указана)";
  }

  const probation = t.match(new RegExp(
    String.raw`(?:на\s+испытательн[а-яё]*\s+срок[а-яё]*).{0,80}?(${money})\s*(${currency})`,
    "i"
  ));
  const afterProbation = t.match(new RegExp(
    String.raw`(?:дальше|после\s+испытательн[а-яё]*\s+срок[а-яё]*).{0,80}?(${money})\s*(?:(${currency}))?.{0,80}?(?:\+|плюс)\s*(?:прозрачн[а-яё]*\s+)?(?:kpi|кпи|процент|%)`,
    "i"
  ));
  const futureIncome = t.match(new RegExp(
    String.raw`(?:возможност[а-яё]*\s+зарабатывать|доход).{0,60}?(?:от|до)\s*(${money})\s*(${currency})`,
    "i"
  ));

  if (probation || afterProbation) {
    const parts = [];
    if (probation) parts.push(`на испытательном сроке ${normalizeSalary(probation[1] + " " + probation[2])}`);
    if (afterProbation) {
      const cur = afterProbation[2] || probation?.[2] || "₽";
      parts.push(`далее ${normalizeSalary(afterProbation[1] + " " + cur)} + KPI`);
    }
    if (futureIncome) parts.push(`потенциально ${normalizeSalary(futureIncome[0].replace(/^.*?(от|до)/i, "$1"))}`);
    return parts.join("; ");
  }

  const rangeRegex = new RegExp(
    String.raw`(?:^|\n|\s)((?:от|до)\s*)?(${money})\s*[–—-]\s*(${money})\s*(${currency})(?=$|\n|\s|[.,;])`,
    "i"
  );
  const range = t.match(rangeRegex);
  if (range) return normalizeSalary(`${range[1] || ""}${range[2]} – ${range[3]} ${range[4]}`);

  const labelled = t.match(new RegExp(
    String.raw`(?:зарплата|з\/?п|зп|доход|оклад|оплата)\s*[:—–-]?\s*((?:от|до)\s*)?(${money})(?:\s*[–—-]\s*(${money}))?\s*(${currency})?`,
    "i"
  ));
  if (labelled) {
    const start = `${labelled[1] || ""}${labelled[2]}`;
    const end = labelled[3] ? ` – ${labelled[3]}` : "";
    const cur = labelled[4] ? ` ${labelled[4]}` : "";
    return normalizeSalary(start + end + cur);
  }

  const standalone = t.match(new RegExp(
    String.raw`(?:^|\n)\s*((?:от|до)\s*)?(${money})\s*(${currency})\s*(?=$|\n)`,
    "i"
  ));
  if (standalone) return normalizeSalary(`${standalone[1] || ""}${standalone[2]} ${standalone[3]}`);

  if (hasNegotiable) return "по договорённости";
  return "не указана";
}
function extractSchedule(text) {
  const t = cleanText(text);

  const explicit = t.match(/\b(?:график\s*[:—–-]?\s*)?(\d\s*\/\s*\d)\b/i);
  if (explicit) {
    const schedule = explicit[1].replace(/\s/g, "");
    const workDays = Number(schedule.split("/")[0]);
    return { schedule, workDays: Number.isFinite(workDays) ? workDays : null, detail: "" };
  }

  const flexibleHours = t.match(/гибк[а-яё]*\s+график[^.\n]{0,80}?(?:смен[аы]\s*)?(?:от\s*)?(\d{1,2})\s*час/i);
  if (flexibleHours) {
    return {
      schedule: `гибкий, смены от ${flexibleHours[1]} ч.`,
      workDays: null,
      detail: ""
    };
  }

  if (/гибк[а-яё]*\s+график/i.test(t)) {
    return { schedule: "гибкий", workDays: null, detail: "" };
  }

  const weekly = t.match(/(\d)\s*(?:рабочих?\s*)?(?:дней|дня)\s*(?:в\s*)?недел/i);
  if (weekly) {
    return {
      schedule: `${weekly[1]} дней в неделю`,
      workDays: Number(weekly[1]),
      detail: ""
    };
  }

  if (/пн\s*[-–—]\s*пт|понедельник.{0,15}пятниц/i.test(t)) {
    return { schedule: "5/2", workDays: 5, detail: "" };
  }

  return { schedule: "не указан", workDays: null, detail: "" };
}

function formatSchedule(schedule) {
  if (schedule.schedule === "не указан") return "не указан";
  if (schedule.workDays == null) return schedule.schedule;
  const daysText = schedule.workDays === 1 ? "1 рабочий день" : `${schedule.workDays} рабочих дней`;
  return `${schedule.schedule} — ${daysText}`;
}

function extractWorkHours(text) {
  const t = cleanText(text);

  let m = t.match(/(?:с\s*)?(2[0-3]|[01]?\d)[:.]([0-5]\d)\s*(?:до|[-–—])\s*(2[0-3]|[01]?\d)[:.]([0-5]\d)/i);
  if (m) {
    return `${m[1].padStart(2, "0")}:${m[2]}–${m[3].padStart(2, "0")}:${m[4]}`;
  }

  m = t.match(/с\s+(2[0-3]|[01]?\d)\s+(?:до|[-–—])\s*(2[0-3]|[01]?\d)(?:\s+(?:по|мск|москве|московскому времени))?/i);
  if (m) {
    return `${m[1].padStart(2, "0")}:00–${m[2].padStart(2, "0")}:00`;
  }

  return "не указано";
}

function extractCompany(text) {
  const t = cleanText(text);
  const lines = t.split("\n").map(x => x.trim()).filter(Boolean);

  const cleanCandidate = raw => {
    let candidate = stripLeadingTags(String(raw || ""))
      .trim()
      .replace(/^[«"]|[»"]$/g, "")
      .replace(/[.,;:]+$/g, "")
      .replace(/\s{2,}/g, " ");

    const n = normalize(candidate);
    const badExact = new Set([
      "crm", "crm система", "crm системе", "crm системы",
      "система", "системе", "команда", "команде", "офис", "офисе",
      "продажи", "продажах", "маркетинг", "маркетинге",
      "клиенты", "клиентами", "работа", "удаленно", "удалённо",
      "проект", "стартап"
    ]);

    if (!candidate || candidate.length < 2 || candidate.length > 100) return "";
    if (badExact.has(n)) return "";
    if (/^(?:crm|amo?crm|bitrix|битрикс)[\s-]*(?:систем[а-яё]*)?$/i.test(candidate)) return "";
    if (/^(?:москва|подмосковье|россия|удаленно|удалённо)$/i.test(candidate)) return "";
    return candidate;
  };

  for (const line of lines) {
    const explicit = line.match(/^(?:компания|работодатель|где)\s*[:—–-]\s*(.{2,100})$/i);
    if (explicit) {
      const c = cleanCandidate(explicit[1]);
      if (c) return c;
    }
  }

  for (const line of lines) {
    const m = line.match(
      /^([A-ZА-ЯЁ0-9][A-Za-zА-Яа-яЁё0-9&._+ "'«»()/-]{1,90}?)\s+[—–-]\s+.{0,85}?(?:компан[а-яё]*|платформ[а-яё]*|студи[а-яё]*|сервис[а-яё]*|агентств[а-яё]*|стартап[а-яё]*|бренд[а-яё]*|групп[а-яё]*|онлайн-школ[а-яё]*|школ[а-яё]*)/i
    );
    if (m) {
      const c = cleanCandidate(m[1]);
      if (c) return c;
    }
  }

  for (const line of lines) {
    const m = line.match(
      /^((?:группа|компания|проект|бренд|студия)\s+[A-ZА-ЯЁ0-9][^\n,.!?;:]{1,70})\s+[—–-]\s+/i
    );
    if (m) {
      const c = cleanCandidate(m[1]);
      if (c) return c;
    }
  }

  for (const line of lines) {
    const m = line.match(/(?:в\s+компани(?:ю|и))\s+[«"]?([^«»",.;:]{2,80})[»"]?/i);
    if (m) {
      const c = cleanCandidate(m[1]);
      if (c) return c;
    }
  }

  const app = t.match(/\bfor\s+([A-Z][A-Za-z0-9._-]{2,40})\s+(?:app|application|company|team)\b/i);
  if (app) {
    const c = cleanCandidate(app[1]);
    if (c) return c;
  }

  const firstLine = lines[0] || "";
  const titleMatch = firstLine.match(/\s+в\s+([A-ZА-ЯЁ][A-Za-zА-Яа-яЁё0-9&._+ -]{1,70}?)(?=[.,]|$)/);
  if (titleMatch) {
    const c = cleanCandidate(titleMatch[1]);
    if (c) return c;
  }

  return "не указана";
}
function extractRequiredExperienceYears(text) {
  const t = cleanText(text);
  const lines = t.split("\n").map(x => x.replace(/^[•·—–-]\s*/, "").trim()).filter(Boolean);

  // 1) Сначала ищем в секции требований.
  const requirementHeaders = /^(?:требования|кого ищут|кого мы ищем|мы жд[её]м|что ожидаем от кандидата|кандидат)\s*[:—–-]?$/i;
  const stopHeaders = /^(?:условия|мы предлагаем|что предлагаем|обязанности|задачи|что делать|о нас|как проходит отбор)\s*[:—–-]?$/i;

  let inRequirements = false;
  const requirementLines = [];

  for (const line of lines) {
    if (requirementHeaders.test(line)) {
      inRequirements = true;
      continue;
    }
    if (inRequirements && stopHeaders.test(line)) break;
    if (inRequirements) requirementLines.push(line);
  }

  const candidates = requirementLines.length ? requirementLines : lines;

  for (const line of candidates) {
    // Не принимаем возраст/стаж компании за опыт кандидата.
    if (/^(?:у\s+нас|компани[яи]|бренд[ау]?)\b.{0,30}\b\d+\s+(?:год|года|лет)/i.test(line)) continue;

    // «Опыт в маркетинге от 3 лет», «опыт работы 2 года».
    let m = line.match(
      /опыт(?:\s+работы)?[^.\n]{0,70}?(?:(?:от|не\s+менее|минимум)\s+)?(\d+)(?:\s*-\s*(?:го|х))?\s*\+?\s*(?:год(?:а)?|лет)/i
    );

    // «От 3 лет опыта ...».
    if (!m) {
      m = line.match(
        /(?:от|не\s+менее|минимум)\s+(\d+)\s*\+?\s*(?:год(?:а)?|лет)\s+(?:опыта|практики)/i
      );
    }

    // «3+ года в B2B-маркетинге».
    if (!m) {
      m = line.match(/^(\d+)\s*\+\s*(?:год(?:а)?|лет)\s+(?:в|опыта|практики)/i);
    }

    if (m) {
      const n = Number(m[1]);
      if (n >= 0 && n <= 20) return n;
    }

    if (/(?:опыт|стаж)[^.\n]{0,50}?(?:от|не\s+менее|минимум)\s+одного\s+года/i.test(line)) return 1;
    if (/(?:опыт|стаж)[^.\n]{0,50}?(?:от|не\s+менее|минимум)\s+года/i.test(line)) return 1;
  }

  return null;
}
function extractExperience(text) {
  const t = cleanText(text);

  if (/без\s+опыта|опыт\s+не\s+требуется|резюме\s+не\s+обязательно/i.test(t)) {
    return "без опыта";
  }

  if (/(?:\bjunior\b|джун|стаж[её]р|\btrainee\b)/i.test(t)) {
    return "Junior / начальный уровень";
  }

  const months = t.match(/опыт(?:\s+работы)?[^\n.]{0,55}?(?:от|не\s+менее|минимум)\s+(\d+)\s*месяц/i);
  if (months) return `от ${months[1]} мес.`;

  const years = extractRequiredExperienceYears(t);
  if (Number.isFinite(years)) {
    return `от ${years} ${years === 1 ? "года" : "лет"}`;
  }

  if (/хоч(?:ешь|ете)\s+получить\s+аналогичн[а-яё]*\s+опыт/i.test(t)) {
    return "опыт желателен, готовы рассматривать без полного опыта";
  }

  if (/готовы\s+обучить|обучим\s+с\s+нуля|обучение\s+с\s+нуля/i.test(t)) {
    return "возможно без опыта, предусмотрено обучение";
  }

  if (hasAny(t, STRONG_EXPERIENCE_WORDS)) {
    return "требуется сильный опыт (срок не указан)";
  }

  const requiredExperiencePatterns = [
    /специалист\s+с\s+опытом/i,
    /с\s+практическим\s+опытом/i,
    /требуется\s+опыт/i,
    /необходим\s+опыт/i,
    /обязателен\s+опыт/i,
    /опыт\s+обязателен/i,
    /кандидат[а-яё]*\s+с\s+опытом/i
  ];

  if (requiredExperiencePatterns.some(p => p.test(t))) {
    return "опыт обязателен, срок не указан";
  }

  return "не указан";
}
function extractContacts(text, links = []) {
  const found = [];
  const t = cleanText(text);

  for (const m of t.matchAll(/(?<![\w.])@[A-Za-z0-9_]{5,32}\b/g)) found.push(m[0]);
  for (const m of t.matchAll(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi)) found.push(m[0]);
  for (const m of t.matchAll(/(?:\+7|8)[\s()\-]*\d{3}[\s()\-]*\d{3}[\s\-]*\d{2}[\s\-]*\d{2}\b/g)) found.push(m[0].replace(/\s+/g, " "));

  for (const link of links) {
    if (/^(?:mailto:|tel:)/i.test(link.url)) found.push(link.url.replace(/^(?:mailto:|tel:)/i, ""));
  }

  return unique(found).slice(0, 6);
}

function extractApplyLink(links = [], originalLink = "", contacts = [], sourceChannel = "") {
  const originalChannel = (() => {
    const m = originalLink.match(/^https?:\/\/t\.me\/([^/]+)\//i);
    return m ? m[1].toLowerCase() : "";
  })();

  const username = contacts.find(x => /^@[A-Za-z0-9_]{5,32}$/.test(x));
  if (username) return `https://t.me/${username.slice(1)}`;

  const candidates = links.filter(x => {
    if (!x.url || x.url === originalLink) return false;
    if (!/^https?:\/\//i.test(x.url)) return false;

    try {
      const u = new URL(x.url);
      if (u.hostname === "t.me") {
        const path = u.pathname.replace(/^\/+|\/+$/g, "");
        if (!path) return false;

        const root = path.split("/")[0].toLowerCase();
        if (root === originalChannel || root === String(sourceChannel || "").toLowerCase()) {
          if (path.split("/").length === 1 && !/bot$/i.test(root)) return false;
        }
      }
    } catch (_) {
      return false;
    }

    return true;
  });

  const preferred = candidates.find(x =>
    /отклик|apply|резюме|написать|связаться|respond|submit/i.test(x.text || "")
  );
  if (preferred) return preferred.url;

  const botLink = candidates.find(x => /https?:\/\/t\.me\/[A-Za-z0-9_]+bot(?:\?|$)/i.test(x.url));
  if (botLink) return botLink.url;

  return "";
}
function splitSections(text) {
  const lines = cleanText(text).split("\n").map(x => x.trim()).filter(Boolean);
  const sections = { intro: [], duties: [], requirements: [], conditions: [], other: [] };
  let current = "intro";

  const headingMap = [
    [/^(?:обязанности|что делать|задачи|чем предстоит заниматься)\s*[:—–-]?$/i, "duties"],
    [/^(?:требования|кого ищут|мы жд[её]м|кто нам нужен)\s*[:—–-]?$/i, "requirements"],
    [/^(?:условия|мы предлагаем|что предлагаем)\s*[:—–-]?$/i, "conditions"]
  ];

  const salaryValue = normalize(extractSalary(text));
  const workFormat = classifyWorkFormat(text);
  const schedule = formatSchedule(extractSchedule(text));
  const hours = extractWorkHours(text);
  const contacts = extractContacts(text, []);

  for (let line of lines) {
    line = line.replace(/\*\*/g, "").replace(/`/g, "").trim();
    if (!line) continue;
    if (/^(?:#\S+\s*)+$/u.test(line)) continue;

    let switched = false;
    for (const [pattern, section] of headingMap) {
      if (pattern.test(line)) {
        current = section;
        switched = true;
        break;
      }
    }
    if (switched) continue;

    const plain = line.replace(/^[•·—–-]\s*/, "").trim();
    const normalizedPlain = normalize(plain);

    if (/^(?:контакт|контакты|для отклика|откликнуться)\s*[:—–-]?/i.test(plain)) continue;
    if (contacts.some(c => normalizedPlain === normalize(c))) continue;

    if (/^(?:зарплата|заработная\s+плата|з\/?п|зп|доход|оклад|оплата|фикс(?:ированный)?\s+оклад)\s*[:—–-]?/i.test(plain)) continue;

    if (
      salaryValue !== "не указана" &&
      plain.length <= 100 &&
      /(?:\d{1,3}(?:[ \u00a0]\d{3})+|[1-9]\d{4,7}|\d{2,3}\s*[кk]).{0,30}(?:₽|руб|р\.|RUR|RUB)/i.test(plain)
    ) continue;

    if (
      plain.length < 180 &&
      /удал[её]нн?[а-яё]*\s+работ/i.test(plain) &&
      /(?:з\/?п|зп|зарплат|оклад|оплат|уровень).{0,60}(?:обсужд|договор[её]н|индивидуальн)/i.test(plain)
    ) continue;

    // Не удаляем настоящие обязанности "Работа с документами", "Работа с ИИ" и т.д.
    if (
      workFormat.label !== "не указано" &&
      plain.length < 160 &&
      (
        /^формат\s*[:—–-]\s*(?:удал|дистанц|гибрид|офис)/i.test(plain) ||
        /^работа\s*[:—–-]\s*(?:удал|дистанц|гибрид|офис)/i.test(plain) ||
        /^полностью\s+удал[её]н/i.test(plain) ||
        /^удал[её]нн?[а-яё]*\s+формат\s+работ/i.test(plain)
      )
    ) continue;

    if (
      salaryValue !== "не указана" &&
      plain.length < 190 &&
      (
        /испытательн[а-яё]*\s+срок[а-яё]*.{0,50}(?:оклад|₽|руб|RUR|RUB)/i.test(plain) ||
        /(?:дальше|после\s+испытательн[а-яё]*).{0,60}(?:\+|плюс)\s*(?:kpi|кпи|процент|%)/i.test(plain) ||
        /(?:возможност[а-яё]*\s+зарабатывать|суммарн[а-яё]*\s+доход).{0,60}(?:₽|руб|RUR|RUB)/i.test(plain)
      )
    ) continue;

    if (schedule !== "не указан" && plain.length < 120 && /^график\s*[:—–-]?/i.test(plain)) continue;

    if (
      hours !== "не указано" &&
      plain.length < 120 &&
      /^(?:время|рабочее\s+время|на\s+связи)\s*[:—–-]?/i.test(plain)
    ) continue;

    sections[current].push(line);
  }

  return sections;
}
function sanitizeUnicode(text = "") {
  const input = String(text);
  let result = "";

  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);

    // High surrogate: keep it only when followed by a valid low surrogate.
    if (code >= 0xD800 && code <= 0xDBFF) {
      const next = input.charCodeAt(i + 1);
      if (next >= 0xDC00 && next <= 0xDFFF) {
        result += input[i] + input[i + 1];
        i++;
      } else {
        result += "\uFFFD";
      }
      continue;
    }

    // Lone low surrogate is not valid Unicode.
    if (code >= 0xDC00 && code <= 0xDFFF) {
      result += "\uFFFD";
      continue;
    }

    result += input[i];
  }

  return result;
}

function safeUnicodeSlice(text, maxLength) {
  const input = sanitizeUnicode(text);
  let end = Math.min(input.length, Math.max(0, maxLength));

  // Never cut between the two UTF-16 code units of an emoji/non-BMP character.
  if (end > 0 && end < input.length) {
    const lastCode = input.charCodeAt(end - 1);
    if (lastCode >= 0xD800 && lastCode <= 0xDBFF) end--;
  }

  return input.slice(0, end);
}

function smartTruncate(text, maxLength) {
  const cleaned = sanitizeUnicode(cleanText(text));
  if (cleaned.length <= maxLength) return cleaned;

  const candidate = safeUnicodeSlice(cleaned, maxLength);

  // Сначала пытаемся закончить на переносе строки.
  const lastBreak = candidate.lastIndexOf("\n");
  if (lastBreak >= Math.floor(maxLength * 0.68)) {
    return candidate.slice(0, lastBreak).trimEnd() + "\n…";
  }

  // Потом на конце предложения.
  const sentenceEnds = [...candidate.matchAll(/[.!?](?=\s|$)/g)];
  if (sentenceEnds.length) {
    const last = sentenceEnds[sentenceEnds.length - 1].index + 1;
    if (last >= Math.floor(maxLength * 0.68)) {
      return candidate.slice(0, last).trimEnd() + " …";
    }
  }

  // В крайнем случае — по последнему пробелу.
  const lastSpace = candidate.lastIndexOf(" ");
  const cut = lastSpace >= Math.floor(maxLength * 0.7) ? lastSpace : maxLength;
  return candidate.slice(0, cut).trimEnd() + "…";
}

function renderDescription(text) {
  const title = extractTitle(text);
  const sections = splitSections(text);

  // Удаляем заголовок из intro один раз.
  if (sections.intro.length && normalize(sections.intro[0]) === normalize(title)) sections.intro.shift();
  while (sections.intro.length && /^(?:#\S+\s*)+$/u.test(sections.intro[0])) sections.intro.shift();

  const parts = [];
  const renderLines = lines => lines.map(line => {
    if (/^[•·—–-]\s*/.test(line)) return `• ${line.replace(/^[•·—–-]\s*/, "")}`;
    return line;
  }).join("\n");

  if (sections.intro.length) parts.push(renderLines(sections.intro));
  if (sections.duties.length) parts.push(`Обязанности:\n${renderLines(sections.duties)}`);
  if (sections.requirements.length) parts.push(`Требования:\n${renderLines(sections.requirements)}`);
  if (sections.conditions.length) parts.push(`Условия:\n${renderLines(sections.conditions)}`);
  if (sections.other.length) parts.push(renderLines(sections.other));

  let result = cleanText(parts.join("\n\n"));
  if (!result) result = cleanText(text);
  return smartTruncate(result, 2200);
}

// ------------------ КРИТЕРИЙ «ЭТО ВАКАНСИЯ» ------------------

function isAdvertisingPost(text, links = []) {
  if (AD_POST_PATTERNS.some(p => p.test(text))) return true;
  if (links.some(x => /t\.me\/addlist\//i.test(x.url))) return true;
  return false;
}



function isServiceOfferPost(text) {
  const t = cleanText(text);

  // В смешанных чатах #помогу почти всегда означает предложение своих услуг,
  // а не вакансию работодателя.
  if (/#помогу(?=\s|#|$)/iu.test(t)) return true;

  const hardSignals = [
    /веду\s+под\s+ключ\s+(?:ваш|проекты?)/i,
    /оказыва[юем]{1,3}\s+[^.\n]{0,80}\s+услуг/i,
    /беру\s+(?:в\s+работу\s+)?\d+\s+проект/i,
    /хочу\s+порекомендовать\s+[^.\n]{1,100}\s+как\s+специалист/i,
    /порекомендова(?:ть|л[аи]?)\s+[^.\n]{1,100}\s+как\s+специалист/i,
    /работали\s+со\s+специалистом[^.\n]{0,100}(?:рекоменд|качест|оператив)/i
  ];

  if (hardSignals.some(pattern => pattern.test(t))) return true;

  const selfIntro =
    /(?:меня\s+зовут|(?:^|\n)\s*я\s+[А-ЯA-ZЁ][а-яёa-z-]{1,30}\s*[—–-]\s*|привет[,!.\s]+я\s+)/i.test(t);

  const serviceOffer =
    /(?:что\s+(?:я\s+)?делаю|что\s+сделаю|с\s+чем\s+могу\s+помочь|помогаю\s+(?:бизнесу|экспертам|компаниям)|делаю\s+(?:лендинг|сайт|дизайн|бот|контент)|создаю\s+(?:лендинг|сайт|бот|контент)|для\s+связи\s*[:—–-]?\s*@)/i.test(t);

  return selfIntro && serviceOffer;
}

function isJobseekerPost(text) {
  const t = cleanText(text);

  const hardSignals = [
    /#резюме(?=\s|#|$)/iu,
    /#соискател[ья](?=\s|#|$)/iu,
    /ищу\s+(?:удал[её]нн?[а-яё]*\s+)?работ[уы]/i,
    /ищу\s+(?:позици[а-яё]*|ваканси[а-яё]*)/i,
    /ищу\s+(?:новый\s+)?проект\s+(?:для|на|в|по)\s+/i,
    /ищу\s+проект\s+для\s+сотрудничеств/i,
    /ищу\s+проект[а-яё]*\s+вдолгую/i
  ];

  if (hardSignals.some(pattern => pattern.test(t))) return true;

  // Остальные сигналы должны идти сочетанием, чтобы "меня зовут" внутри
  // нормальной вакансии не считалось резюме.
  const weakSignals = [
    /меня\s+зовут/i,
    /чем\s+могу\s+быть\s+полез/i,
    /что\s+(?:я\s+)?могу\s+взять\s+на\s+себя/i,
    /могу\s+взять\s+на\s+себя/i,
    /мои\s+сильн[а-яё]*\s+сторон/i,
    /готов[аы]?\s+к\s+(?:долгосрочн[а-яё]*\s+)?сотрудничеств/i,
    /мой\s+опыт/i,
    /открыт[аы]?\s+к\s+(?:новым\s+)?(?:проектам|заказам|предложениям)/i
  ];

  return weakSignals.filter(pattern => pattern.test(t)).length >= 2;
}

function hasEmployerHiringCue(text) {
  const t = cleanText(text);

  const explicitVacancyTag =
    /#ваканси[яи](?=\s|#|$)/iu.test(t);

  const pluralHiring =
    /(?:^|\n|\s)(?:ищем|нанимаем|приглашаем|требуется|требуются)\s+/iu.test(t);

  // "Ищу менеджера/специалиста..." — обычный способ написать вакансию от
  // первого лица. Но "ищу работу/позицию/вакансию/проект" сюда не попадает.
  const singularHiringRole =
    /(?:^|\n)\s*(?:#\S+\s*)*ищу\s+(?!(?:работ[уы]|позици[а-яё]*|ваканси[а-яё]*|проект(?:\s|$)))(?:[A-Za-zА-Яа-яЁё][^\n]{2,100})/iu.test(t);

  const needPerson =
    /(?:^|\n|\s)(?:нужен|нужна|нужны)\s+(?:человек|специалист|менеджер|маркетолог|сценарист|копирайтер|дизайнер|ассистент|оператор|продюсер|разработчик|монтаж[её]р|аналитик|рекрутер|администратор|smm)/iu.test(t);

  return explicitVacancyTag || pluralHiring || singularHiringRole || needPerson;
}

function hasEmployerStructure(text, links = []) {
  const t = cleanText(text);

  const hasTasks =
    /(?:обязанност|задачи\s*:|что\s+(?:нужно|предстоит)\s+делать|что\s+делать)/iu.test(t);

  const hasRequirements =
    /(?:требован|кого\s+(?:мы\s+)?ищем|что\s+важно|наш\s+идеальн[а-яё]*\s+кандидат)/iu.test(t);

  const hasOffer =
    /(?:условия\s*:|что\s+(?:мы\s+)?предлагаем|оплата\s*:|зарплат|зп\s*:|доход\s*:|фикс\s*\+|оклад\s*\+)/iu.test(t);

  const hasApply =
    /(?:отклик|отклики|пишите\s+(?:в\s+)?лс|для\s+связи|контакт|заполн(?:ите|ить)\s+анкет|пришлите\s+(?:резюме|портфолио|примеры|тестовое))/iu.test(t) ||
    extractContacts(t, links).length > 0;

  return { hasTasks, hasRequirements, hasOffer, hasApply };
}

function vacancyConfidence(text, links = []) {
  const title = extractTitle(text);
  const strongCount = countAny(text, STRONG_VACANCY_MARKERS);
  const markerCount = countAny(text, VACANCY_MARKERS);
  const hasTitle = title !== "Вакансия" && title.length >= 3;
  const workFormat = classifyWorkFormat(text);
  const hasSalary = extractSalary(text) !== "не указана";
  const hasExperience = extractExperience(text) !== "не указан";
  const hasContact = extractContacts(text, links).length > 0;
  const hasEmploymentData = hasSalary || hasExperience || workFormat.label !== "не указано";
  const hasHiringCue = hasEmployerHiringCue(text);
  const structure = hasEmployerStructure(text, links);

  // Очевидная вакансия из публичного чата:
  // работодатель прямо ищет человека + есть хотя бы два независимых блока
  // "задачи / требования / условия / отклик".
  const structureCount = [
    structure.hasTasks,
    structure.hasRequirements,
    structure.hasOffer,
    structure.hasApply
  ].filter(Boolean).length;

  if (hasTitle && hasHiringCue && structureCount >= 2) return true;

  // Явная вакансия / найм + удалёнка + любой сильный дополнительный признак.
  if (
    hasTitle &&
    hasHiringCue &&
    workFormat.isRemote &&
    (structureCount >= 1 || hasSalary || hasContact)
  ) {
    return true;
  }

  // Должность + явная удалёнка + зарплата + контакт = очевидная вакансия,
  // даже если автор оформил её нестандартно.
  if (hasTitle && workFormat.isRemote && hasSalary && hasContact) return true;

  // Короткое, но полноценное объявление.
  if (hasTitle && hasHiringCue && hasContact && (hasSalary || hasEmploymentData)) return true;

  // Обычная длинная вакансия: заголовок + структурные признаки.
  if (hasTitle && strongCount >= 1 && markerCount >= 2) return true;

  // Короткий агрегатор.
  if (hasTitle && strongCount >= 2 && hasEmploymentData) return true;

  // Вакансия с полноценными условиями, даже если нет слова «вакансия».
  if (hasTitle && strongCount >= 1 && hasEmploymentData && cleanText(text).length >= 180) return true;

  return false;
}

function isNetworkPartnerScheme(text) {
  const t = normalize(text);
  const partner = /команд[ауеы] партнер|команд[ауеы] партн[её]р|партнерск[а-я]*\s+команд|партн[её]рск[а-я]*\s+команд/i.test(text);
  const turnover = /товарооборот|личн[а-я]*\s+оборот|структурн[а-я]*\s+оборот/i.test(text);
  const cashback = /кешб[эе]к|cashback/i.test(text);
  const activityIncome = /доход\s+зависит\s+от\s+(?:активности|личного\s+результата|товарооборота)/i.test(text);
  const participation = /условия\s+участия/i.test(text);
  const percentage = /процент\s+от\s+(?:созданного\s+вами\s+)?товарооборота/i.test(text);

  const hits = [partner, turnover, cashback, activityIncome, participation, percentage].filter(Boolean).length;
  return hits >= 3 || (partner && turnover && (cashback || percentage));
}

// Personal exclusions and risk heuristics are independent of the priority score.
function riskFilterText(text) {
  return cleanText(String(text || "").normalize("NFKC")
    .replace(/[\u200b-\u200d\u2060\ufeff]/g, "")
    .replace(/[\\*_\x60]/g, ""));
}

function hasTradingMention(text) {
  return /(?:^|[^\p{L}\p{N}])(?:трейдинг[а-яё]*|трединг[а-яё]*|трейдер[а-яё]*|тредер[а-яё]*|trading|traiding|trader|traders)(?=$|[^\p{L}\p{N}])/iu.test(riskFilterText(text));
}

const SIMPLE_JOB_HIGH_SALARY_RUB = 90000;

function suspiciousSimpleJob(text) {
  const raw = riskFilterText(text);
  // Inspect the salary clause, not phone numbers, company turnover or annual bonuses.
  const salaryClause = raw.match(/(?:зарплата|з\/?п|оклад|доход|оплата)\s*[:—–-]?\s*([^\n]+)/i)?.[0];
  if (!salaryClause || /(?:в|за)\s*год|годов|\b(?:usd|eur|annual)\b|[$€]/i.test(salaryClause)) return null;
  const normalizedSalaryClause = salaryClause
    .replace(/(\d+)\s*тыс(?:яч[а-яё]*)?\.?/gi, "$1к")
    .replace(/(\d{2,3})\s*[–—-]\s*(\d{2,3})\s*([кk])/gi, "$1$3 – $2$3");
  const salary = extractSalary(normalizedSalaryClause);
  const amounts = [...salary.matchAll(/\d{1,3}(?:[ \u00a0]\d{3})+|\d+(?:[.,]\d+)?\s*[кk]|\d{4,}/gi)]
    .map(match => {
      const value = match[0].replace(/\s/g, "").replace(",", ".");
      return parseFloat(value) * (/[кk]$/i.test(value) ? 1000 : 1);
    });
  // Use the lower end of a range, so "30–100k" is not treated as a 100k promise.
  if (!amounts.length || Math.min(...amounts) < SIMPLE_JOB_HIGH_SALARY_RUB) return null;

  const duties = raw.match(/(?:обязанности|задачи|что (?:нужно|предстоит) делать|что делать)(?:\s*:\s*|[ \t]*\n)([\s\S]*?)(?=(?:требования|условия|что предлагаем|мы предлагаем|контакты|отклик)(?:\s*:|[ \t]*\n)|$)/i)?.[1]?.trim();
  if (!duties) return null;
  const itemSeparator = /[•▪▫●]|\n\s*(?:[-—–]|\d+[.)])\s*/;
  const items = duties.split(itemSeparator.test(duties) ? itemSeparator : /\n|;/)
    .map(x => x.replace(/^[\s—–\-\d.)]+/, "").trim()).filter(Boolean);
  if (!items.length || items.length > 3 || duties.split(/\s+/).length > 70) return null;
  const simpleSignals = [
    /отвечать.{0,50}(?:чат|сообщени|клиент)/i,
    /готов[а-яё]*\s+(?:ответ|шаблон)|по\s+(?:шаблон|скрипт)/i,
    /передавать.{0,60}(?:коллег|специалист|руководител)/i,
    /(?:записывать|фиксировать).{0,60}(?:разговор|результат|обращени)/i,
    /(?:вносить|вводить|переносить|копировать).{0,40}(?:данные|текст|таблиц)/i
  ].filter(pattern => pattern.test(duties.replace(/\s+/g, " "))).length;
  if (simpleSignals < 2) return null;

  const beginner = /без\s+опыта|опыт\s+не\s+(?:нужен|требуется)|научим\s+(?:всему|с\s+нуля)/i.test(raw);
  const flexible = /(?:смены?|работа|занятость)\s*(?:от\s*)?[1-4]\s*(?:ч(?:ас)?[а-яё]*\.?)|для\s+совмещения/i.test(raw);
  const quickHire = /резюме\s+не\s+(?:обязательно|нужно)|быстр[а-яё]*\s+при[её]м|(?:выход|начать)\s+(?:сегодня|завтра)/i.test(raw);
  const unknownCompany = /компания\s*:\s*(?:не\s+указана|неизвестна)/i.test(raw) || extractCompany(raw) === "не указана";
  if (!beginner || !(flexible || quickHire || unknownCompany)) return null;
  return "подозрительная вакансия: высокая зарплата за короткий список простых обязанностей без опыта";
}

function analyzePost(text, dateIso, settings, links = []) {
  const reasons = [];
  const warnings = [];
  let score = 0;

  const rejected = (reject, extra = {}) => ({
    accepted: false,
    uncertain: false,
    decision: "rejected",
    score: extra.score ?? 0,
    potentialScore: extra.potentialScore ?? null,
    reasons,
    warnings,
    reject,
    uncertainReason: null
  });

  if (hasTradingMention(text)) {
    return rejected("исключённая сфера: трейдинг / trading / traiding");
  }

  const simpleJobRisk = suspiciousSimpleJob(text);
  if (simpleJobRisk) return rejected(simpleJobRisk);

  if (isAdvertisingPost(text, links)) {
    return rejected("реклама каналов/подборки, а не вакансия");
  }

  if (isServiceOfferPost(text)) {
    return rejected("реклама услуг/самопрезентация, а не вакансия");
  }

  if (isJobseekerPost(text)) {
    return rejected("это пост соискателя, а не вакансия работодателя");
  }

  if (hasAny(text, DIGEST_WORDS)) {
    return rejected("подборка вакансий, а не отдельная вакансия");
  }

  if (!vacancyConfidence(text, links)) {
    return rejected("недостаточно признаков отдельной вакансии");
  }

  const workFormat = classifyWorkFormat(text);
  const formatUnknown = workFormat.certainty === "unknown";

  score += 20;
  reasons.push("+20: пост похож на отдельную вакансию");

  if (settings.requireRemote) {
    // Явно офисные / гибридные без подтверждённой удалённой части —
    // это настоящий reject, а не "формат неясен".
    if (!workFormat.isRemote && !formatUnknown) {
      return rejected(workFormat.reason);
    }

    if (workFormat.isRemote) {
      score += 30;
      reasons.push(`+30: ${workFormat.label}`);
    }
  } else if (workFormat.isRemote) {
    score += 20;
    reasons.push(`+20: ${workFormat.label}`);
  }

  const experience = extractExperience(text);
  if (
    experience === "без опыта" ||
    experience === "Junior / начальный уровень" ||
    experience.startsWith("возможно без опыта") ||
    experience.startsWith("опыт желателен")
  ) {
    score += 25;
    reasons.push("+25: подходит новичку / обучение возможно");
  }

  if (hasAny(text, ROLE_WORDS)) {
    score += 10;
    reasons.push("+10: приоритетное направление");
  }

  if (extractSalary(text) !== "не указана") {
    score += 5;
    reasons.push("+5: условия оплаты указаны");
  }

  if (hasAny(extractTitle(text), SENIOR_WORDS)) {
    score -= 40;
    warnings.push("-40: senior/lead/руководящая позиция");
  }

  if (hasAny(extractTitle(text), MIDDLE_WORDS)) {
    score -= 20;
    warnings.push("-20: middle-позиция");
  }

  const requiredYears = extractRequiredExperienceYears(text);
  if (Number.isFinite(requiredYears) && requiredYears >= 3) {
    const penalty = requiredYears >= 5 ? 35 : 25;
    score -= penalty;
    warnings.push(`-${penalty}: требуется от ${requiredYears} лет опыта`);
  }

  if (hasAny(text, STRONG_EXPERIENCE_WORDS)) {
    score -= 25;
    warnings.push("-25: явно требуется сильный подтверждённый опыт");
  }

  if (hasAny(text, COLD_SALES_WORDS)) {
    score -= 15;
    warnings.push("-15: холодные/активные продажи");
  }

  if (hasAny(text, COMMISSION_ONLY_WORDS)) {
    score -= 20;
    warnings.push("-20: похоже на работу без фиксированного оклада");
  }

  if (hasAny(text, HARD_SCAM_PHRASES)) {
    return rejected("сильный признак мошеннической схемы");
  }

  if (hasAny(text, UNPAID_PHRASES)) {
    return rejected("неоплачиваемая работа/стажировка");
  }

  if (isNetworkPartnerScheme(text)) {
    return rejected("партнёрская/сетевая схема вместо обычной вакансии");
  }

  const dt = dateIso ? new Date(dateIso) : null;
  if (dt && !Number.isNaN(dt.getTime())) {
    const age = Date.now() - dt.getTime();
    if (age <= 86400000) score += 10;
    else if (age <= 3 * 86400000) score += 5;
  }

  score = Math.max(0, Math.min(100, score));

  // Ключевая логика v2.8:
  // если формат просто НЕ УКАЗАН, оцениваем, прошла бы вакансия порог,
  // если бы удалёнка подтвердилась. Такие вакансии не отправляем автоматически,
  // но и не теряем.
  if (settings.requireRemote && formatUnknown) {
    const potentialScore = Math.max(0, Math.min(100, score + 30));

    if (potentialScore >= settings.minScore) {
      return {
        accepted: false,
        uncertain: true,
        decision: "uncertain_format",
        score,
        potentialScore,
        reasons: [...reasons, "+30 потенциально: если подтвердится удалёнка"],
        warnings,
        reject: null,
        uncertainReason: "формат работы не указан — требуется проверить вручную"
      };
    }

    return rejected("низкий приоритет", { score, potentialScore });
  }

  const accepted = score >= settings.minScore;

  return {
    accepted,
    uncertain: false,
    decision: accepted ? "accepted" : "rejected",
    score,
    potentialScore: null,
    reasons,
    warnings,
    reject: accepted ? null : "низкий приоритет",
    uncertainReason: null
  };
}
function parseTelegramHtml(htmlText) {
  const doc = new DOMParser().parseFromString(htmlText, "text/html");
  const nodes = [...doc.querySelectorAll(".tgme_widget_message")];

  return nodes.map(node => {
    const postRef = node.getAttribute("data-post") || "";
    const timeEl = node.querySelector("time[datetime]");
    const textNode = node.querySelector(".tgme_widget_message_text");
    const date = timeEl?.getAttribute("datetime") || "";
    const text = nodeToStructuredText(textNode);
    const links = extractLinksFromNode(node);

    let link = "";
    let id = null;
    if (postRef.includes("/")) {
      link = "https://t.me/" + postRef;
      id = Number(postRef.split("/").pop());
    }

    return { postRef, link, id, date, text, links };
  }).filter(x => x.link && Number.isFinite(x.id));
}

function parseTelegramEmbedHtml(htmlText, channel, id) {
  const doc = new DOMParser().parseFromString(htmlText, "text/html");
  const node = doc.querySelector(".tgme_widget_message");
  if (!node) return null;

  const postRef = node.getAttribute("data-post") || `${channel}/${id}`;
  const timeEl = node.querySelector("time[datetime]");
  const textNode = node.querySelector(".tgme_widget_message_text");
  const date = timeEl?.getAttribute("datetime") || "";
  const text = nodeToStructuredText(textNode);
  const links = extractLinksFromNode(node);

  // Виджет публичного сообщения должен содержать либо дату, либо контент/медиа.
  const hasMedia = !!node.querySelector(
    ".tgme_widget_message_photo_wrap, .tgme_widget_message_video, .tgme_widget_message_document"
  );
  if (!date && !text && !hasMedia) return null;

  return {
    postRef,
    link: `https://t.me/${channel}/${id}`,
    id: Number(id),
    date,
    text,
    links
  };
}

function detectTelegramPageType(htmlText) {
  const doc = new DOMParser().parseFromString(htmlText, "text/html");
  const feedPosts = doc.querySelectorAll(".tgme_widget_message").length;
  if (feedPosts > 0) return "channel_feed";

  const extra = cleanText(doc.querySelector(".tgme_page_extra")?.textContent || "");
  const body = cleanText(doc.body?.textContent || "");
  const looksGroup =
    /\bmembers?\b/i.test(extra) ||
    /участник/i.test(extra) ||
    /\bonline\b/i.test(extra) ||
    /view\s+in\s+group/i.test(body);

  return looksGroup ? "public_group" : "unknown";
}
async function fetchTelegramPage(url, retries = 2) {
  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        method: "GET",
        cache: "no-store",
        credentials: "omit"
      });

      if (response.ok) return await response.text();

      if (response.status === 429 || response.status >= 500) {
        const retryAfter = Number(response.headers.get("Retry-After") || 0);
        const waitMs = retryAfter > 0 ? retryAfter * 1000 : 600 * (attempt + 1);
        lastError = new Error(`t.me вернул HTTP ${response.status}`);
        if (attempt < retries) {
          await sleep(waitMs);
          continue;
        }
      }

      throw new Error(`t.me вернул HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await sleep(450 * (attempt + 1));
        continue;
      }
    }
  }

  throw lastError || new Error("Не удалось загрузить t.me.");
}
// ------------------ BOT API ------------------

function validateBotToken(token) {
  return /^\d{5,}:[A-Za-z0-9_-]{20,}$/.test((token || "").trim());
}

async function botApi(token, method, payload = null) {
  if (!validateBotToken(token)) throw new Error("Bot token выглядит некорректно.");
  const options = { method: payload ? "POST" : "GET", headers: {} };
  if (payload) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(payload);
  }
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, options);
  const data = await response.json();
  if (!response.ok || !data.ok) throw new Error(data.description || `Bot API HTTP ${response.status}`);
  return data.result;
}

async function detectChatId() {
  const token = botTokenEl.value.trim();
  statusEl.textContent = "Ищу личный чат...\nОткрой бота в Telegram и отправь /start.";
  const updates = await botApi(token, "getUpdates");
  const privateChats = [];
  for (const update of updates) {
    const message = update.message || update.edited_message || update.channel_post || update.edited_channel_post;
    const chat = message?.chat;
    if (chat?.type === "private" && chat?.id) privateChats.push({ chatId: String(chat.id), date: message.date || 0 });
  }
  if (!privateChats.length) throw new Error("Личный чат не найден. Отправь боту /start и повтори.");
  privateChats.sort((a, b) => b.date - a.date);
  chatIdEl.value = privateChats[0].chatId;
  await saveSettings();
  statusEl.textContent = `Chat ID найден: ${privateChats[0].chatId}\nНастройки сохранены.`;
}

async function sendTelegramMessage(token, chatId, text) {
  const safeText = safeUnicodeSlice(text, TELEGRAM_MESSAGE_LIMIT);

  return await botApi(token, "sendMessage", {
    chat_id: chatId,
    text: safeText,
    parse_mode: "HTML",
    disable_web_page_preview: true
  });
}

// ------------------ ДУБЛИКАТЫ ------------------

function duplicateKey(post) {
  const title = normalize(extractTitle(post.text));
  const company = normalize(extractCompany(post.text));
  const salary = normalize(extractSalary(post.text));
  const contacts = normalize(extractContacts(post.text, post.links).join(" "));

  // При известной компании/контакте это устойчивее полного текста.
  if (company && company !== "не указана") return hashString(`t:${title}|c:${company}|s:${salary}`);
  if (contacts) return hashString(`t:${title}|contact:${contacts}|s:${salary}`);

  const tokens = normalize(post.text)
    .split(" ")
    .filter(x => x.length >= 4 && !["работа", "вакансия", "удаленная", "удаленно", "компания", "требования", "условия"].includes(x))
    .slice(0, 24)
    .join(" ");

  return hashString(`t:${title}|s:${salary}|x:${tokens}`);
}

// ------------------ ФОРМАТ СООБЩЕНИЯ ------------------

function buildVacancyMessage(post) {
  const title = extractTitle(post.text);
  const company = extractCompany(post.text);
  const workFormat = classifyWorkFormat(post.text).label;
  const schedule = formatSchedule(extractSchedule(post.text));
  const hours = extractWorkHours(post.text);
  const salary = extractSalary(post.text);
  const experience = extractExperience(post.text);
  const description = renderDescription(post.text);
  const contacts = extractContacts(post.text, post.links);
  const applyLink = extractApplyLink(post.links, post.link, contacts, post.channel);

  const header = [
    `💼 <b>${escapeHtml(title)}</b>`,
    "",
    `🏢 Компания: ${escapeHtml(company)}`,
    `🏠 Формат: ${escapeHtml(workFormat)}`,
    `📅 График: ${escapeHtml(schedule)}`,
    `🕒 Время: ${escapeHtml(hours)}`,
    `💰 Зарплата: ${escapeHtml(salary)}`,
    `🧑 Опыт: ${escapeHtml(experience)}`,
    `📆 Опубликовано: ${escapeHtml(formatAge(post.date))}`,
    ""
  ];

  const footer = [];
  if (contacts.length) {
    footer.push("", `📨 <b>Контакт:</b> ${escapeHtml(contacts.join(" · "))}`);
  }
  if (applyLink) {
    footer.push(`📨 <a href="${escapeHtml(applyLink)}">Откликнуться</a>`);
  }
  footer.push(`🔗 <a href="${escapeHtml(post.link)}">Открыть оригинал</a>`);

  const fixedLength = [...header, ...footer].join("\n").length + 50;
  const maxDescription = Math.max(500, TELEGRAM_MESSAGE_LIMIT - fixedLength);
  const safeDescription = smartTruncate(description, maxDescription);

  return [...header, "📝 <b>Описание вакансии</b>", escapeHtml(safeDescription), ...footer].join("\n");
}


// ------------------ АУДИТ ФИЛЬТРА ------------------

let currentAudit = null;

function classifyRejectCode(reject = "") {
  const r = normalize(reject);
  if (!r) return "none";
  if (r.includes("исключенная сфера")) return "excluded_trading";
  if (r.includes("подозрительная вакансия")) return "suspicious_simple_job";
  if (r.includes("реклама каналов") || r.includes("подборки")) return "advertising";
  if (r.includes("пост соискателя")) return "jobseeker";
  if (r.includes("недостаточно признаков")) return "vacancy_confidence";
  if (r.includes("явная удаленка не найдена") || r.includes("явная удалёнка не найдена")) return "remote_not_found";
  if (r.includes("удаленного формата нет") || r.includes("удалённого формата нет") ||
      r.includes("гибрид без подтвержденной") || r.includes("гибрид без подтверждённой")) return "not_remote";
  if (r.includes("мошенничес")) return "hard_scam";
  if (r.includes("неоплачиваем")) return "unpaid";
  if (r.includes("реклама услуг") || r.includes("самопрезентация")) return "service_offer";
  if (r.includes("партнерская/сетевая") || r.includes("партнёрская/сетевая")) return "network_scheme";
  if (r.includes("явно указан офисный формат")) return "not_remote";
  if (r.includes("низкий приоритет")) return "low_score";
  if (r.includes("нет текстового описания")) return "no_text";
  return "other";
}

function reviewPriorityFor(post, analysis) {
  if (analysis.decision === "uncertain_format" || analysis.uncertain) {
    return {
      level: "uncertain",
      note: `полноценная вакансия; формат не указан; если подтвердится удалёнка, балл ${analysis.potentialScore ?? "—"}`
    };
  }

  if (analysis.accepted) {
    return { level: "accepted", note: "прошло фильтр" };
  }

  const code = classifyRejectCode(analysis.reject);
  if (code === "excluded_trading") {
    return { level: "low", note: "исключено по личному фильтру сферы деятельности" };
  }
  if (code === "suspicious_simple_job") {
    return { level: "medium", note: "сочетание признаков риска; не отправляется автоматически, доступно для проверки" };
  }
  const text = post.text || "";
  const title = extractTitle(text);
  const workFormat = classifyWorkFormat(text);
  const markerCount = countAny(text, VACANCY_MARKERS);
  const strongCount = countAny(text, STRONG_VACANCY_MARKERS);
  const hasRole = hasAny(text, ROLE_WORDS);
  const hasSalary = extractSalary(text) !== "не указана";
  const contacts = extractContacts(text, post.links || []);
  const hasTitle = title !== "Вакансия" && title.length >= 3;

  if (["advertising", "jobseeker", "service_offer", "hard_scam", "unpaid", "not_remote", "network_scheme"].includes(code)) {
    return { level: "low", note: "жёсткое правило; обычно ручная проверка не нужна" };
  }

  if (code === "no_text") {
    return {
      level: "medium",
      note: "нет доступного текста — вакансия могла быть только на изображении"
    };
  }

  let points = 0;
  const signals = [];

  if (hasTitle) {
    points += 2;
    signals.push("есть название");
  }
  if (hasRole) {
    points += 2;
    signals.push("есть профиль должности");
  }
  if (workFormat.isRemote) {
    points += 2;
    signals.push("найдена удалёнка");
  }
  if (hasSalary) {
    points += 1;
    signals.push("есть оплата");
  }
  if (contacts.length) {
    points += 1;
    signals.push("есть контакт");
  }
  if (markerCount >= 2) {
    points += 2;
    signals.push("несколько признаков вакансии");
  }
  if (strongCount >= 1) {
    points += 1;
  }

  if (code === "low_score") {
    points += 3;
    signals.push("отсев только по баллам");
  }

  if (code === "vacancy_confidence") {
    if (hasRole || hasSalary || contacts.length || workFormat.isRemote) points += 3;
    signals.push("не прошёл критерий «это отдельная вакансия»");
  }

  if (points >= 8) return { level: "high", note: signals.join("; ") };
  if (points >= 5) return { level: "medium", note: signals.join("; ") };
  return { level: "low", note: signals.join("; ") || "мало признаков подходящей вакансии" };
}
function buildAuditRecord(post, analysis, channel) {
  const priority = reviewPriorityFor(post, analysis);
  const text = cleanText(post.text || "");
  const decision =
    analysis.decision ||
    (analysis.accepted ? "accepted" : (analysis.uncertain ? "uncertain_format" : "rejected"));

  return {
    link: post.link,
    channel,
    date: post.date || "",
    title: text ? extractTitle(text) : "Нет текстового описания",
    company: text ? extractCompany(text) : "не указана",
    workFormat: text ? classifyWorkFormat(text).label : "не указано",
    salary: text ? extractSalary(text) : "не указана",
    experience: text ? extractExperience(text) : "не указан",
    contacts: text ? extractContacts(text, post.links || []) : [],
    score: analysis.score ?? 0,
    potentialScore: analysis.potentialScore ?? null,
    filterStatus: decision,
    rejectCode: decision === "uncertain_format"
      ? "uncertain_format"
      : classifyRejectCode(analysis.reject),
    rejectReason: decision === "uncertain_format"
      ? (analysis.uncertainReason || "формат работы не указан")
      : (analysis.reject || ""),
    reasons: [...(analysis.reasons || [])],
    warnings: [...(analysis.warnings || [])],
    reviewPriority: priority.level,
    reviewNote: priority.note,
    deliveryStatus:
      decision === "accepted"
        ? "pending"
        : decision === "uncertain_format"
          ? "format_unclear"
          : "not_applicable",
    text: smartTruncate(text, 2400)
  };
}
function auditPriorityRank(item) {
  if (item.filterStatus === "uncertain_format") return 0;
  if (item.reviewPriority === "high") return 1;
  if (item.reviewPriority === "medium") return 2;
  if (item.reviewPriority === "low") return 3;
  if (item.filterStatus === "accepted") return 4;
  return 5;
}
function buildAuditSnapshot(entries, counters, settings, channels, mode, sourceStatuses = []) {
  const reasonCounts = {};
  const channelCounts = {};

  for (const entry of entries) {
    if (entry.filterStatus === "rejected") {
      const key = entry.rejectReason || "неизвестная причина";
      reasonCounts[key] = (reasonCounts[key] || 0) + 1;
    }

    channelCounts[entry.channel] ||= {
      checked: 0,
      accepted: 0,
      uncertain: 0,
      rejected: 0,
      review: 0
    };

    channelCounts[entry.channel].checked++;

    if (entry.filterStatus === "accepted") {
      channelCounts[entry.channel].accepted++;
    } else if (entry.filterStatus === "uncertain_format") {
      channelCounts[entry.channel].uncertain++;
    } else {
      channelCounts[entry.channel].rejected++;
    }

    if (["high", "medium"].includes(entry.reviewPriority)) {
      channelCounts[entry.channel].review++;
    }
  }

  const counts = {
    checked: counters.checked,
    analyzed: entries.length,
    accepted: entries.filter(x => x.filterStatus === "accepted").length,
    uncertain: entries.filter(x => x.filterStatus === "uncertain_format").length,
    rejected: entries.filter(x => x.filterStatus === "rejected").length,
    reviewHigh: entries.filter(x => x.filterStatus === "rejected" && x.reviewPriority === "high").length,
    reviewMedium: entries.filter(x => x.filterStatus === "rejected" && x.reviewPriority === "medium").length,
    sent: entries.filter(x => x.deliveryStatus === "sent").length,
    wouldSend: entries.filter(x => x.deliveryStatus === "would_send").length,
    duplicateInScan: entries.filter(x => x.deliveryStatus === "duplicate_in_scan").length,
    alreadySent: entries.filter(x => x.deliveryStatus === "already_sent").length
  };

  const ordered = [...entries].sort((a, b) => {
    const pa = auditPriorityRank(a);
    const pb = auditPriorityRank(b);
    if (pa !== pb) return pa - pb;
    const da = a.date ? new Date(a.date).getTime() : 0;
    const db = b.date ? new Date(b.date).getTime() : 0;
    return db - da;
  });

  return {
    schemaVersion: 3,
    extensionVersion: "2.9.0",
    scannedAt: new Date().toISOString(),
    mode,
    settings: {
      channels: [...channels],
      daysBack: settings.daysBack,
      minScore: settings.minScore,
      requireRemote: settings.requireRemote,
      sendOnlyNew: settings.sendOnlyNew
    },
    counts,
    rejectReasons: reasonCounts,
    channels: channelCounts,
    sourceStatuses: sourceStatuses.map(x => ({ ...x })),
    entries: ordered,
    storageNote: ""
  };
}
async function saveAuditSnapshot(snapshot) {
  // chrome.storage.local имеет ограничение объёма. Сначала сохраняем максимум,
  // при ошибке постепенно уменьшаем число записей, отдавая приоритет сомнительным отказам.
  const limits = [1500, 1000, 700, 400, 200];
  let lastError = null;

  for (const limit of limits) {
    const reduced = {
      ...snapshot,
      entries: snapshot.entries.slice(0, limit),
      storageNote: snapshot.entries.length > limit
        ? `В интерфейсе сохранены первые ${limit} из ${snapshot.entries.length} записей. Сомнительные отказы имеют приоритет.`
        : ""
    };

    try {
      await chrome.storage.local.set({ lastAudit: reduced });
      currentAudit = reduced;
      return reduced;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Не удалось сохранить аудит.");
}

function renderAudit(audit) {
  currentAudit = audit || null;
  auditResultsEl.textContent = "";

  if (!audit) {
    auditSummaryEl.textContent = "Аудит ещё не запускался.";
    uncertainCountEl.textContent = "0";
    rejectedCountEl.textContent = "0";
    reviewCountEl.textContent = "0";
    return;
  }

  const c = audit.counts || {};
  const reviewTotal = (c.reviewHigh || 0) + (c.reviewMedium || 0);

  uncertainCountEl.textContent = String(c.uncertain || 0);
  rejectedCountEl.textContent = String(c.rejected || 0);
  reviewCountEl.textContent = String(reviewTotal);

  const topReasons = Object.entries(audit.rejectReasons || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([reason, count]) => `• ${count} — ${reason}`)
    .join("\n");

  auditSummaryEl.textContent =
    `Режим: ${audit.mode === "audit" ? "аудит без отправки" : "поиск и отправка"}\n` +
    `Проверено: ${c.checked || 0} • Подходит: ${c.accepted || 0} • Формат ?: ${c.uncertain || 0} • Отклонено: ${c.rejected || 0}\n` +
    `Другие сомнительные отказы: HIGH ${c.reviewHigh || 0} • MEDIUM ${c.reviewMedium || 0}\n` +
    (topReasons ? `\nОсновные причины настоящего отказа:\n${topReasons}` : "") +
    (audit.storageNote ? `\n\n${audit.storageNote}` : "");

  const view = auditViewEl.value || "uncertain";
  let items = audit.entries || [];

  if (view === "uncertain") {
    items = items.filter(x => x.filterStatus === "uncertain_format");
  } else if (view === "review") {
    items = items.filter(x =>
      x.filterStatus === "rejected" &&
      (x.reviewPriority === "high" || x.reviewPriority === "medium")
    );
  } else if (view === "rejected") {
    items = items.filter(x => x.filterStatus === "rejected");
  }

  for (const item of items.slice(0, 200)) {
    const box = document.createElement("div");

    if (item.filterStatus === "uncertain_format") {
      box.className = "result audit-result audit-uncertain";
    } else {
      box.className =
        `result audit-result audit-${item.filterStatus === "accepted" ? "accepted" : item.reviewPriority}`;
    }

    const titleRow = document.createElement("div");

    const badge = document.createElement("span");
    badge.className = "audit-badge";

    if (item.filterStatus === "accepted") badge.textContent = "PASSED";
    else if (item.filterStatus === "uncertain_format") badge.textContent = "FORMAT ?";
    else badge.textContent = String(item.reviewPriority || "low").toUpperCase();

    const link = document.createElement("a");
    link.className = "audit-title";
    link.href = item.link;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = item.title || item.link;

    titleRow.append(badge, link);

    const meta = document.createElement("div");
    meta.className = "meta";

    const scoreText = item.filterStatus === "uncertain_format" && item.potentialScore != null
      ? `балл ${item.score} • если удалёнка: ${item.potentialScore}`
      : `балл ${item.score}`;

    meta.textContent =
      `@${item.channel} • ${formatAge(item.date)} • ${scoreText}` +
      (item.deliveryStatus && item.deliveryStatus !== "not_applicable"
        ? ` • ${item.deliveryStatus}`
        : "");

    const reason = document.createElement("div");
    reason.className = "audit-reason";

    if (item.filterStatus === "accepted") {
      reason.textContent = "Фильтр: подходит и может быть отправлено.";
    } else if (item.filterStatus === "uncertain_format") {
      reason.textContent =
        "Статус: полноценная вакансия, но формат работы не указан. Автоматически не отправлена.";
    } else {
      reason.textContent = `Причина отказа: ${item.rejectReason || "не указана"}`;
    }

    const facts = document.createElement("div");
    facts.className = "audit-facts";
    facts.textContent =
      `Формат: ${item.workFormat} • ЗП: ${item.salary} • Опыт: ${item.experience}` +
      (item.reviewNote ? `\nКомментарий: ${item.reviewNote}` : "");

    const preview = document.createElement("div");
    preview.className = "audit-preview";
    preview.textContent = smartTruncate(item.text || "", 500);

    box.append(titleRow, meta, reason, facts);
    if (preview.textContent) box.append(preview);
    auditResultsEl.appendChild(box);
  }

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "hint";

    if (view === "uncertain") {
      empty.textContent = "Вакансий с неуказанным форматом не найдено.";
    } else if (view === "review") {
      empty.textContent = "Других сомнительных отказов не найдено.";
    } else {
      empty.textContent = "Для выбранного режима записей нет.";
    }

    auditResultsEl.appendChild(empty);
  }
}
function downloadAuditJson() {
  if (!currentAudit) throw new Error("Сначала запусти аудит или обычный поиск.");

  // Защита от случайной утечки: Bot Token и Chat ID в currentAudit никогда не записываются.
  const payload = JSON.stringify(currentAudit, null, 2);
  const blob = new Blob([payload], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  a.href = url;
  a.download = `telegram-job-audit-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}



// ------------------ ПУБЛИЧНЫЕ ГРУППЫ ------------------

async function getPublicGroupState() {
  const data = await chrome.storage.local.get(["publicGroupState"]);
  return data.publicGroupState && typeof data.publicGroupState === "object"
    ? data.publicGroupState
    : {};
}

async function savePublicGroupState(state) {
  await chrome.storage.local.set({ publicGroupState: state });
}

async function fetchPublicGroupPost(channel, id) {
  if (!Number.isFinite(Number(id)) || Number(id) <= 0) return null;

  const url = `https://t.me/${channel}/${Number(id)}?embed=1&mode=tme`;
  try {
    const html = await fetchTelegramPage(url, 1);
    return parseTelegramEmbedHtml(html, channel, Number(id));
  } catch (_) {
    return null;
  }
}

function groupProbeOffsets(radius = GROUP_DISCOVERY_RADIUS) {
  const offsets = [0];
  for (let i = 1; i <= radius; i++) {
    offsets.push(-i, i);
  }
  return offsets;
}

async function findExistingGroupPostNear(channel, centerId, radius = GROUP_DISCOVERY_RADIUS, probeFn = fetchPublicGroupPost) {
  const offsets = groupProbeOffsets(radius);

  for (const offset of offsets) {
    const id = Number(centerId) + offset;
    if (id <= 0) continue;
    const post = await probeFn(channel, id);
    if (post) return post;
  }

  return null;
}

async function findLatestPublicGroupIdDenseFast(channel, seedId, probeFn = fetchPublicGroupPost) {
  let seed = Number(seedId);
  if (!Number.isFinite(seed) || seed <= 0) {
    throw new Error("для публичной группы нужен bootstrap ID сообщения");
  }

  // Старый быстрый путь оставлен без изменения по смыслу: он отлично работает
  // на группах с плотными ID (например @vakansii_infobiz).
  let basePost = await findExistingGroupPostNear(channel, seed, 24, probeFn);
  if (!basePost) {
    throw new Error(
      "не удалось открыть bootstrap-сообщение группы. " +
      "Вставь вместо ссылки на группу ссылку на любое её публичное сообщение."
    );
  }

  let lower = basePost.id;
  let upper = null;
  let step = GROUP_DISCOVERY_INITIAL_STEP;

  for (let i = 0; i < GROUP_DISCOVERY_MAX_STEPS; i++) {
    const candidate = lower + step;
    const found = await findExistingGroupPostNear(channel, candidate, GROUP_DISCOVERY_RADIUS, probeFn);

    if (found) {
      lower = Math.max(lower, found.id);
      step *= 2;
      continue;
    }

    upper = candidate + GROUP_DISCOVERY_RADIUS;
    break;
  }

  if (upper == null) upper = lower + step;

  let safety = 0;
  while (upper - lower > 24 && safety++ < 28) {
    const mid = Math.floor((lower + upper) / 2);
    const found = await findExistingGroupPostNear(channel, mid, GROUP_DISCOVERY_RADIUS, probeFn);

    if (found) {
      lower = Math.max(lower, found.id);
    } else {
      upper = mid - GROUP_DISCOVERY_RADIUS;
    }
  }

  let latest = lower;
  const finalStart = Math.max(1, lower - 8);
  const finalEnd = Math.max(lower + 32, upper + 8);

  for (let id = finalStart; id <= finalEnd; id++) {
    const post = await probeFn(channel, id);
    if (post && post.id > latest) latest = post.id;
  }

  const latestPost = await probeFn(channel, latest) ||
    await findExistingGroupPostNear(channel, latest, 12, probeFn) ||
    basePost;

  return {
    latestId: Number(latestPost?.id || latest),
    latestPost,
    method: "dense_fast"
  };
}

function groupChannelHash(channel) {
  let h = 2166136261;
  const s = String(channel || "").toLowerCase();
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function buildSparseGridProbeIds(startId, endId, stride, phase = 0) {
  const start = Math.max(1, Math.floor(startId));
  const end = Math.max(start, Math.floor(endId));
  const step = Math.max(1, Math.floor(stride));
  const normalizedPhase = ((Math.floor(phase) % step) + step) % step;
  const ids = [];

  let first = start + ((normalizedPhase - (start % step) + step) % step);
  for (let id = first; id <= end; id += step) ids.push(id);

  // Края диапазона проверяем всегда, независимо от фазы сетки.
  for (let i = 0; i < Math.min(step, end - start + 1); i++) {
    ids.push(start + i);
    ids.push(end - i);
  }

  return [...new Set(ids)].sort((a, b) => a - b);
}

async function probeSparseGroupBand(
  channel,
  startId,
  endId,
  stride,
  phase,
  budget,
  probeFn = fetchPublicGroupPost
) {
  if (budget.remaining <= 0 || endId < startId) return [];

  let ids = buildSparseGridProbeIds(startId, endId, stride, phase);
  if (ids.length > budget.remaining) ids = ids.slice(0, budget.remaining);
  budget.remaining -= ids.length;
  budget.used += ids.length;

  const posts = await mapWithConcurrency(
    ids,
    GROUP_SPARSE_DISCOVERY_CONCURRENCY,
    id => probeFn(channel, id)
  );

  return posts
    .filter(Boolean)
    .sort((a, b) => a.id - b.id);
}

function groupPostTimeMs(post) {
  const ms = post?.date ? new Date(post.date).getTime() : NaN;
  return Number.isFinite(ms) ? ms : null;
}

async function sweepAroundSparseHit(
  channel,
  post,
  budget,
  probeFn = fetchPublicGroupPost
) {
  if (!post || budget.remaining <= 0) return post;

  const start = Math.max(1, post.id - GROUP_SPARSE_LOCAL_SWEEP_RADIUS);
  const end = post.id + GROUP_SPARSE_LOCAL_SWEEP_RADIUS;
  let ids = [];
  for (let id = start; id <= end; id++) {
    if (id !== post.id) ids.push(id);
  }

  if (ids.length > budget.remaining) ids = ids.slice(0, budget.remaining);
  budget.remaining -= ids.length;
  budget.used += ids.length;

  const neighbors = await mapWithConcurrency(
    ids,
    GROUP_SPARSE_DISCOVERY_CONCURRENCY,
    id => probeFn(channel, id)
  );

  const found = [post, ...neighbors.filter(Boolean)].sort((a, b) => a.id - b.id);
  return found[found.length - 1] || post;
}

async function rescueSparsePublicGroupTail(
  channel,
  startPost,
  cutoffMs,
  probeFn = fetchPublicGroupPost
) {
  const budget = {
    used: 0,
    remaining: GROUP_SPARSE_DISCOVERY_MAX_PROBES
  };

  let bestPost = startPost;
  let cursor = Number(startPost.id) + 1;
  let recentFound = groupPostTimeMs(startPost) != null && groupPostTimeMs(startPost) >= cutoffMs;
  let emptyBandsAfterRecent = 0;
  let bandsScanned = 0;
  const channelHash = groupChannelHash(channel);

  const bandPlan = [
    ...Array.from({ length: GROUP_SPARSE_NEAR_BANDS }, () => ({
      width: GROUP_SPARSE_NEAR_BAND_WIDTH,
      stride: GROUP_SPARSE_NEAR_STRIDE
    })),
    ...Array.from({ length: GROUP_SPARSE_FAR_BANDS }, () => ({
      width: GROUP_SPARSE_FAR_BAND_WIDTH,
      stride: GROUP_SPARSE_FAR_STRIDE
    }))
  ];

  for (let bandIndex = 0; bandIndex < bandPlan.length; bandIndex++) {
    if (budget.remaining <= 0) break;

    const { width, stride } = bandPlan[bandIndex];
    const start = cursor;
    const end = cursor + width - 1;

    // Фаза меняется между диапазонами и зависит от канала. Так мы не застреваем
    // на одном и том же остатке ID в разреженной группе.
    const phase = (channelHash + bandIndex * 5) % stride;
    let posts = await probeSparseGroupBand(
      channel,
      start,
      end,
      stride,
      phase,
      budget,
      probeFn
    );

    bandsScanned++;

    if (posts.length) {
      let newest = posts[posts.length - 1];
      newest = await sweepAroundSparseHit(channel, newest, budget, probeFn);
      if (!bestPost || newest.id > bestPost.id) bestPost = newest;

      const newestTime = groupPostTimeMs(newest);
      if (newestTime != null && newestTime >= cutoffMs) {
        recentFound = true;
        emptyBandsAfterRecent = 0;
      } else if (recentFound) {
        emptyBandsAfterRecent = 0;
      }
    } else if (recentFound) {
      emptyBandsAfterRecent++;
      if (emptyBandsAfterRecent >= GROUP_SPARSE_RECENT_EMPTY_BANDS_TO_STOP) {
        cursor = end + 1;
        break;
      }
    }

    // ВАЖНО: пустой диапазон не означает «дальше сообщений нет».
    cursor = end + 1;
  }

  return {
    latestId: Number(bestPost?.id || startPost.id),
    latestPost: bestPost,
    method: "sparse_rescue",
    diagnostics: {
      probesUsed: budget.used,
      bandsScanned,
      recentFound,
      maxForwardIdChecked: Math.max(Number(startPost.id), cursor - 1)
    }
  };
}

async function findLatestPublicGroupId(
  channel,
  seedId,
  cutoffMs = null,
  probeFn = fetchPublicGroupPost
) {
  const fast = await findLatestPublicGroupIdDenseFast(channel, seedId, probeFn);

  if (!Number.isFinite(Number(cutoffMs))) return fast;

  const fastTime = groupPostTimeMs(fast.latestPost);
  if (fastTime != null && fastTime >= cutoffMs) {
    return fast;
  }

  // Только для проблемных разреженных групп: быстрый поиск остановился на
  // старом сообщении, значит запускаем дорогостоящий, но устойчивый rescue.
  const rescue = await rescueSparsePublicGroupTail(
    channel,
    fast.latestPost,
    cutoffMs,
    probeFn
  );

  return rescue.latestId >= fast.latestId ? rescue : fast;
}

async function mapWithConcurrency(items, limit, mapper) {
  const result = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (true) {
      const index = cursor++;
      if (index >= items.length) return;
      result[index] = await mapper(items[index], index);
    }
  }

  const workers = Array.from(
    { length: Math.max(1, Math.min(limit, items.length || 1)) },
    () => worker()
  );

  await Promise.all(workers);
  return result;
}

async function scanPublicGroup(channel, seedId, settings, cutoffMs, counters, auditEntries, groupState) {
  const accepted = [];
  const state = groupState[channel] || {};
  const bootstrap =
    Number(seedId) ||
    Number(state.lastKnownId) ||
    Number(PUBLIC_GROUP_BOOTSTRAP[channel.toLowerCase()]);

  if (!Number.isFinite(bootstrap) || bootstrap <= 0) {
    return {
      accepted,
      status: {
        channel,
        type: "public_group",
        state: "needs_seed",
        checked: 0,
        note: "Нужна одна ссылка на публичное сообщение группы, например https://t.me/group/123456"
      }
    };
  }

  statusEl.textContent =
    `@${channel}: публичная группа\nИщу актуальный ID сообщения...\nПроверено: ${counters.checked}`;

  const discovery = await findLatestPublicGroupId(channel, bootstrap, cutoffMs);
  const latestId = Number(discovery.latestId);
  const latestPost = discovery.latestPost || null;
  const latestPostMs = groupPostTimeMs(latestPost);

  state.lastKnownId = latestId;
  state.lastKnownDate = latestPost?.date || state.lastKnownDate || null;
  state.lastDiscoveryMethod = discovery.method || "unknown";
  state.lastDiscoveryAt = new Date().toISOString();
  groupState[channel] = state;
  await savePublicGroupState(groupState);

  const seenLinks = new Set();
  let scannedIds = 0;
  let oldHits = 0;
  let missesInRow = 0;
  let stoppedByLimit = false;
  let minDate = null;

  for (
    let high = latestId;
    high > 0 && scannedIds < GROUP_BACKSCAN_LIMIT;
    high -= GROUP_BATCH_SIZE
  ) {
    const ids = [];
    for (let offset = 0; offset < GROUP_BATCH_SIZE; offset++) {
      const id = high - offset;
      if (id > 0) ids.push(id);
    }

    statusEl.textContent =
      `@${channel}: публичная группа\n` +
      `Сообщения ${ids[ids.length - 1]}–${ids[0]}\n` +
      `Проверено: ${counters.checked}`;

    const posts = await mapWithConcurrency(
      ids,
      GROUP_BATCH_SIZE,
      id => fetchPublicGroupPost(channel, id)
    );

    scannedIds += ids.length;

    let batchHasFresh = false;
    let batchHasOld = false;

    for (const post of posts.filter(Boolean).sort((a, b) => b.id - a.id)) {
      missesInRow = 0;
      if (seenLinks.has(post.link)) continue;
      seenLinks.add(post.link);

      const dtMs = post.date ? new Date(post.date).getTime() : NaN;

      if (Number.isFinite(dtMs)) {
        minDate = minDate == null ? dtMs : Math.min(minDate, dtMs);

        if (dtMs < cutoffMs) {
          oldHits++;
          batchHasOld = true;
          continue;
        }

        batchHasFresh = true;
        oldHits = 0;
      }

      counters.checked++;
      checkedCountEl.textContent = String(counters.checked);

      let analysis;
      if (!post.text) {
        analysis = {
          accepted: false,
          uncertain: false,
          decision: "rejected",
          score: 0,
          reasons: [],
          warnings: [],
          reject: "нет текстового описания",
          uncertainReason: null
        };
      } else {
        analysis = analyzePost(post.text, post.date, settings, post.links);
      }

      const auditRecord = buildAuditRecord(post, analysis, channel);
      auditRecord.sourceType = "public_group";
      auditEntries.push(auditRecord);

      if (analysis.accepted) {
        accepted.push({
          ...post,
          analysis,
          channel,
          sourceType: "public_group",
          fingerprint: exactFingerprint(post.text),
          duplicateKey: duplicateKey(post)
        });
      }
    }

    const missingCount = posts.filter(x => !x).length;
    if (missingCount === posts.length) missesInRow += posts.length;
    else missesInRow = 0;

    // ID идут по времени вперёд. После нескольких реальных старых сообщений
    // можно надёжно остановиться.
    if (batchHasOld && !batchHasFresh && oldHits >= GROUP_OLD_POSTS_TO_STOP) break;

    // Защита от странной/редкой истории или неправильного bootstrap.
    if (missesInRow >= GROUP_MAX_MISSES_IN_ROW) break;

    await sleep(GROUP_BATCH_DELAY_MS);
  }

  if (scannedIds >= GROUP_BACKSCAN_LIMIT) stoppedByLimit = true;

  const checkedHere = auditEntries.filter(x => x.channel === channel).length;
  const newestIsFresh = latestPostMs != null && latestPostMs >= cutoffMs;
  let sourceState = "ok";
  let sourceNote = "Публичная группа прочитана через Telegram Post Widget.";

  if (stoppedByLimit) {
    sourceState = "partial";
    sourceNote = `Достигнут защитный лимит ${GROUP_BACKSCAN_LIMIT} ID; история может быть неполной.`;
  } else if (checkedHere === 0 && !newestIsFresh) {
    sourceState = "stale";
    sourceNote =
      "Автопоиск не нашёл публичное сообщение за выбранный период. " +
      "Группа не считается успешно проверенной; при необходимости вставь ссылку на любое свежее сообщение этой группы.";
  } else if (checkedHere === 0 && newestIsFresh) {
    sourceState = "warning";
    sourceNote =
      "Свежий хвост группы найден, но в выбранном периоде не удалось получить текстовые сообщения для анализа.";
  }

  if (checkedHere > 0) {
    state.lastSuccessfulAt = new Date().toISOString();
    groupState[channel] = state;
    await savePublicGroupState(groupState);
  }

  return {
    accepted,
    status: {
      channel,
      type: "public_group",
      state: sourceState,
      checked: checkedHere,
      latestId,
      latestDate: latestPost?.date || null,
      discoveryMethod: discovery.method || "unknown",
      discoveryProbes: discovery.diagnostics?.probesUsed || 0,
      discoveryBands: discovery.diagnostics?.bandsScanned || 0,
      scannedIds,
      note: sourceNote
    }
  };
}

// ------------------ СКАНИРОВАНИЕ ------------------

async function scanBroadcastChannel(channel, settings, cutoffMs, counters, auditEntries, firstHtml = null) {
  const accepted = [];
  const pageLinksSeen = new Set();
  let before = null;
  let previousOldestId = null;
  let totalParsed = 0;

  for (let page = 0; page < MAX_PAGES_PER_CHANNEL; page++) {
    const url = before ? `https://t.me/s/${channel}?before=${before}` : `https://t.me/s/${channel}`;
    statusEl.textContent = `Проверяю @${channel}\nСтраница ${page + 1}\nПроверено: ${counters.checked}`;

    const html = page === 0 && firstHtml != null ? firstHtml : await fetchTelegramPage(url);
    const posts = parseTelegramHtml(html);
    if (!posts.length) break;

    totalParsed += posts.length;

    let oldestId = Infinity;
    let oldestDateMs = Infinity;
    let hasDatedPost = false;

    for (const post of posts) {
      oldestId = Math.min(oldestId, post.id);
      if (pageLinksSeen.has(post.link)) continue;
      pageLinksSeen.add(post.link);

      const dtMs = post.date ? new Date(post.date).getTime() : NaN;
      if (Number.isFinite(dtMs)) {
        hasDatedPost = true;
        oldestDateMs = Math.min(oldestDateMs, dtMs);
        if (dtMs < cutoffMs) continue;
      }

      counters.checked++;
      checkedCountEl.textContent = String(counters.checked);

      let analysis;
      if (!post.text) {
        analysis = {
          accepted: false,
          uncertain: false,
          decision: "rejected",
          score: 0,
          reasons: [],
          warnings: [],
          reject: "нет текстового описания",
          uncertainReason: null
        };
      } else {
        analysis = analyzePost(post.text, post.date, settings, post.links);
      }

      const auditRecord = buildAuditRecord(post, analysis, channel);
      auditRecord.sourceType = "channel";
      auditEntries.push(auditRecord);

      if (analysis.accepted) {
        accepted.push({
          ...post,
          analysis,
          channel,
          sourceType: "channel",
          fingerprint: exactFingerprint(post.text),
          duplicateKey: duplicateKey(post)
        });
      }
    }

    if (!Number.isFinite(oldestId)) break;
    if (hasDatedPost && oldestDateMs < cutoffMs) break;
    if (oldestId === previousOldestId) break;

    previousOldestId = oldestId;
    before = oldestId;
    await sleep(REQUEST_DELAY_MS);
  }

  return {
    accepted,
    status: {
      channel,
      type: "channel",
      state: "ok",
      checked: auditEntries.filter(x => x.channel === channel).length,
      parsed: totalParsed,
      note: totalParsed
        ? "Обычная публичная /s/-лента."
        : "Свежих сообщений в доступной /s/-ленте не найдено."
    }
  };
}

async function scanTelegramSource(source, settings, cutoffMs, counters, auditEntries, groupState) {
  const channel = source.channel;

  // Сначала проверяем обычную /s/-ленту.
  const feedUrl = `https://t.me/s/${channel}`;
  const feedHtml = await fetchTelegramPage(feedUrl);
  const feedPosts = parseTelegramHtml(feedHtml);

  if (feedPosts.length) {
    return await scanBroadcastChannel(
      channel,
      settings,
      cutoffMs,
      counters,
      auditEntries,
      feedHtml
    );
  }

  // Если /s/ не дал сообщений, проверяем корневую страницу.
  const rootHtml = await fetchTelegramPage(`https://t.me/${channel}`);
  const pageType = detectTelegramPageType(rootHtml);

  if (pageType === "public_group") {
    return await scanPublicGroup(
      channel,
      source.seedId,
      settings,
      cutoffMs,
      counters,
      auditEntries,
      groupState
    );
  }

  return {
    accepted: [],
    status: {
      channel,
      type: "unknown",
      state: "no_feed",
      checked: 0,
      note: "Telegram не отдал публичную /s/-ленту и страница не распознана как публичная группа."
    }
  };
}
// ------------------ STORAGE ------------------

async function getSettingsFromUi() {
  return {
    botToken: botTokenEl.value.trim(),
    chatId: chatIdEl.value.trim(),
    channels: channelsEl.value.trim(),
    daysBack: Math.max(1, Math.min(30, Number(daysBackEl.value) || 7)),
    minScore: Math.max(0, Math.min(100, Number(minScoreEl.value) || 45)),
    requireRemote: requireRemoteEl.checked,
    sendOnlyNew: sendOnlyNewEl.checked
  };
}

async function saveSettings() {
  const settings = await getSettingsFromUi();
  await chrome.storage.local.set(settings);
  if (statusEl) statusEl.textContent = "Настройки сохранены.";
}

async function loadSettings() {
  const data = await chrome.storage.local.get([
    "botToken", "chatId", "channels", "daysBack", "minScore",
    "requireRemote", "sendOnlyNew", "lastResults", "lastAudit"
  ]);
  botTokenEl.value = data.botToken || "";
  chatIdEl.value = data.chatId || "";
  channelsEl.value = data.channels || "";
  daysBackEl.value = data.daysBack ?? 7;
  minScoreEl.value = data.minScore ?? 45;
  requireRemoteEl.checked = data.requireRemote ?? true;
  sendOnlyNewEl.checked = data.sendOnlyNew ?? true;
  renderResults(data.lastResults || []);
  renderAudit(data.lastAudit || null);
  renderSourceStatuses(data.lastAudit?.sourceStatuses || []);
}

async function getHistory() {
  const data = await chrome.storage.local.get(["sentLinks", "sentFingerprints", "sentDuplicateKeys"]);
  return {
    sentLinks: new Set(data.sentLinks || []),
    sentFingerprints: new Set(data.sentFingerprints || []),
    sentDuplicateKeys: new Set(data.sentDuplicateKeys || [])
  };
}

async function saveHistory(sentLinks, sentFingerprints, sentDuplicateKeys) {
  await chrome.storage.local.set({
    sentLinks: [...sentLinks].slice(-10000),
    sentFingerprints: [...sentFingerprints].slice(-10000),
    sentDuplicateKeys: [...sentDuplicateKeys].slice(-10000)
  });
}

// ------------------ UI ------------------

function renderResults(results) {
  resultsEl.textContent = "";
  for (const item of results.slice(0, 50)) {
    const box = document.createElement("div");
    box.className = "result";
    const link = document.createElement("a");
    link.href = item.link;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = item.title || item.link;
    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = `@${item.channel} • ${formatAge(item.date)}`;
    box.append(link, meta);
    resultsEl.appendChild(box);
  }
}


function renderSourceStatuses(statuses = []) {
  sourceStatusEl.textContent = "";

  if (!statuses.length) {
    sourceStatusEl.textContent = "Проверка ещё не запускалась.";
    return;
  }

  for (const s of statuses) {
    const row = document.createElement("div");
    const stateClass =
      s.state === "ok" ? "source-ok" :
      s.state === "error" ? "source-error" :
      "source-warn";

    row.className = `source-row ${stateClass}`;

    const title = document.createElement("b");
    title.textContent = `@${s.channel}`;

    const type =
      s.type === "public_group" ? "публичная группа" :
      s.type === "channel" ? "канал" :
      "не определён";

    const details = document.createElement("span");
    details.textContent =
      ` — ${type}; ${s.checked || 0} постов в окне.` +
      (s.latestId ? ` Последний ID: ${s.latestId}.` : "") +
      (s.latestDate ? ` Дата найденного хвоста: ${s.latestDate}.` : "") +
      (s.discoveryMethod === "sparse_rescue"
        ? ` Разреженный поиск: ${s.discoveryProbes || 0} проб, ${s.discoveryBands || 0} диапазонов.`
        : "") +
      (s.note ? ` ${s.note}` : "") +
      (s.error ? ` Ошибка: ${s.error}` : "");

    row.append(title, details);
    sourceStatusEl.appendChild(row);
  }
}

// ------------------ ГЛАВНЫЙ ПОИСК ------------------

async function runScan(sendMode) {
  scanBtn.disabled = true;
  auditBtn.disabled = true;
  saveBtn.disabled = true;
  detectChatBtn.disabled = true;
  testBotBtn.disabled = true;

  checkedCountEl.textContent = "0";
  matchedCountEl.textContent = "0";
  uncertainCountEl.textContent = "0";
  rejectedCountEl.textContent = "0";
  reviewCountEl.textContent = "0";
  sentCountEl.textContent = "0";

  try {
    const settings = await getSettingsFromUi();

    if (sendMode) {
      if (!validateBotToken(settings.botToken)) {
        throw new Error("Сначала вставь токен бота от BotFather.");
      }
      if (!/^-?\d+$/.test(settings.chatId)) {
        throw new Error("Не указан Chat ID. Нажми «Найти Chat ID».");
      }
    }

    const rawChannels = settings.channels.split(/\r?\n/).map(x => x.trim()).filter(Boolean);
    if (!rawChannels.length) throw new Error("Добавь хотя бы один публичный Telegram-канал.");

    const sources = [];
    const errors = [];
    const sourceKeys = new Set();

    for (const raw of rawChannels) {
      const parsed = extractChannel(raw);

      if (parsed?.channel) {
        const key = parsed.channel.toLowerCase();
        const existing = sources.find(x => x.channel.toLowerCase() === key);

        // Если один и тот же источник указан несколько раз, сохраняем direct seed,
        // если он есть хотя бы в одной строке.
        if (existing) {
          if (parsed.seedId) existing.seedId = parsed.seedId;
        } else {
          sources.push(parsed);
          sourceKeys.add(key);
        }
      }

      if (parsed?.error) errors.push(parsed.error);
    }

    if (!sources.length) {
      throw new Error(errors.join("\n") || "Нет корректных Telegram-источников.");
    }

    const channels = sources.map(x => x.channel);

    await chrome.storage.local.set(settings);

    // История нужна и в аудите: она позволяет отличить "фильтр отверг"
    // от "фильтр принял, но вакансия уже была отправлена".
    const history = await getHistory();
    const cutoffMs = Date.now() - settings.daysBack * 86400000;
    const counters = { checked: 0 };
    const candidates = [];
    const auditEntries = [];
    const sourceStatuses = [];
    const groupState = await getPublicGroupState();

    for (let i = 0; i < sources.length; i++) {
      const source = sources[i];
      const channel = source.channel;

      statusEl.textContent =
        `${sendMode ? "Сканирую" : "Аудит"} @${channel} (${i + 1}/${sources.length})...`;

      try {
        const result = await scanTelegramSource(
          source,
          settings,
          cutoffMs,
          counters,
          auditEntries,
          groupState
        );

        candidates.push(...result.accepted);
        sourceStatuses.push(result.status);
      } catch (error) {
        const status = {
          channel,
          type: "unknown",
          state: "error",
          checked: 0,
          note: "",
          error: error.message
        };
        sourceStatuses.push(status);
        errors.push(`@${channel}: ${error.message}`);
      }

      renderSourceStatuses(sourceStatuses);
      await sleep(REQUEST_DELAY_MS);
    }

    await savePublicGroupState(groupState);

    candidates.sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return da - db;
    });

    matchedCountEl.textContent = String(candidates.length);

    const auditByLink = new Map(auditEntries.map(x => [x.link, x]));

    let sent = 0;
    const sessionLinks = new Set();
    const sessionFingerprints = new Set();
    const sessionDuplicateKeys = new Set();
    const lastResults = [];

    for (const post of candidates) {
      const auditRecord = auditByLink.get(post.link);

      if (
        sessionLinks.has(post.link) ||
        sessionFingerprints.has(post.fingerprint) ||
        sessionDuplicateKeys.has(post.duplicateKey)
      ) {
        if (auditRecord) auditRecord.deliveryStatus = "duplicate_in_scan";
        continue;
      }

      sessionLinks.add(post.link);
      sessionFingerprints.add(post.fingerprint);
      sessionDuplicateKeys.add(post.duplicateKey);

      if (settings.sendOnlyNew && (
        history.sentLinks.has(post.link) ||
        history.sentFingerprints.has(post.fingerprint) ||
        history.sentDuplicateKeys.has(post.duplicateKey)
      )) {
        if (auditRecord) auditRecord.deliveryStatus = "already_sent";
        continue;
      }

      lastResults.unshift({
        link: post.link,
        channel: post.channel,
        date: post.date,
        title: extractTitle(post.text)
      });

      if (!sendMode) {
        if (auditRecord) auditRecord.deliveryStatus = "would_send";
        continue;
      }

      statusEl.textContent = `Отправляю вакансии...\n${sent + 1} / ${candidates.length}`;
      await sendTelegramMessage(settings.botToken, settings.chatId, buildVacancyMessage(post));
      sent++;

      if (auditRecord) auditRecord.deliveryStatus = "sent";

      history.sentLinks.add(post.link);
      history.sentFingerprints.add(post.fingerprint);
      history.sentDuplicateKeys.add(post.duplicateKey);

      sentCountEl.textContent = String(sent);
      await sleep(150);
    }

    if (sendMode) {
      await saveHistory(history.sentLinks, history.sentFingerprints, history.sentDuplicateKeys);
    }

    const auditSnapshot = buildAuditSnapshot(
      auditEntries,
      counters,
      settings,
      channels,
      sendMode ? "send" : "audit",
      sourceStatuses
    );
    const storedAudit = await saveAuditSnapshot(auditSnapshot);
    renderAudit(storedAudit);

    uncertainCountEl.textContent = String(storedAudit.counts.uncertain || 0);
    rejectedCountEl.textContent = String(storedAudit.counts.rejected || 0);
    reviewCountEl.textContent = String(
      (storedAudit.counts.reviewHigh || 0) + (storedAudit.counts.reviewMedium || 0)
    );

    await chrome.storage.local.set({
      lastResults: lastResults.slice(0, 100),
      lastScanAt: new Date().toISOString()
    });
    renderResults(lastResults);

    const c = storedAudit.counts;
    let finalStatus =
      `${sendMode ? "Готово." : "Аудит завершён. Ничего не отправлялось."}\n` +
      `Проверено постов: ${c.checked}\n` +
      `Подходит: ${c.accepted}\n` +
      `Формат не указан: ${c.uncertain || 0}\n` +
      `Отклонено фильтром: ${c.rejected}\n` +
      `Нужно проверить вручную: ${(c.reviewHigh || 0) + (c.reviewMedium || 0)}` +
      ` (HIGH ${c.reviewHigh || 0}, MEDIUM ${c.reviewMedium || 0})`;

    if (sendMode) finalStatus += `\nОтправлено новых: ${sent}`;
    else finalStatus += `\nБыло бы отправлено новых: ${c.wouldSend || 0}`;

    const groupCount = sourceStatuses.filter(x => x.type === "public_group").length;
    const channelCount = sourceStatuses.filter(x => x.type === "channel").length;
    const sourceErrors = sourceStatuses.filter(x => x.state === "error").length;
    finalStatus += `\nИсточники: каналов ${channelCount}, публичных групп ${groupCount}`;
    if (sourceErrors) finalStatus += `, ошибок ${sourceErrors}`;
    finalStatus += `.\nПодробности — в «Статус источников».`;

    if (errors.length) finalStatus += `\n\nОшибки источников:\n${errors.join("\n")}`;

    statusEl.textContent = finalStatus;

    if (!sendMode && auditDetailsEl) auditDetailsEl.open = true;
  } catch (error) {
    statusEl.textContent = "Ошибка: " + error.message;
  } finally {
    scanBtn.disabled = false;
    auditBtn.disabled = false;
    saveBtn.disabled = false;
    detectChatBtn.disabled = false;
    testBotBtn.disabled = false;
  }
}

// ------------------ СОБЫТИЯ ------------------

saveBtn.addEventListener("click", saveSettings);

detectChatBtn.addEventListener("click", async () => {
  detectChatBtn.disabled = true;
  try { await detectChatId(); }
  catch (error) { statusEl.textContent = "Ошибка: " + error.message; }
  finally { detectChatBtn.disabled = false; }
});

testBotBtn.addEventListener("click", async () => {
  testBotBtn.disabled = true;
  try {
    const token = botTokenEl.value.trim();
    const chatId = chatIdEl.value.trim();
    if (!chatId) throw new Error("Сначала определи Chat ID.");
    await sendTelegramMessage(token, chatId, "✅ <b>Telegram Job Collector подключён.</b>\n\nТестовое сообщение доставлено.");
    statusEl.textContent = "Тестовое сообщение отправлено.";
  } catch (error) {
    statusEl.textContent = "Ошибка: " + error.message;
  } finally {
    testBotBtn.disabled = false;
  }
});

scanBtn.addEventListener("click", () => runScan(true));
auditBtn.addEventListener("click", () => runScan(false));

auditViewEl.addEventListener("change", () => renderAudit(currentAudit));

exportAuditBtn.addEventListener("click", () => {
  try {
    downloadAuditJson();
    statusEl.textContent = "Аудит JSON скачан. Его можно прислать мне для проверки ложных отсевов.";
  } catch (error) {
    statusEl.textContent = "Ошибка: " + error.message;
  }
});

clearAuditBtn.addEventListener("click", async () => {
  await chrome.storage.local.remove(["lastAudit"]);
  currentAudit = null;
  renderAudit(null);
  renderSourceStatuses([]);
  statusEl.textContent = "Аудит очищен.";
});

clearHistoryBtn.addEventListener("click", async () => {
  await chrome.storage.local.remove(["sentLinks", "sentFingerprints", "sentDuplicateKeys", "lastResults"]);
  renderResults([]);
  checkedCountEl.textContent = "0";
  matchedCountEl.textContent = "0";
  uncertainCountEl.textContent = "0";
  sentCountEl.textContent = "0";
  statusEl.textContent = "История отправки очищена. Старые вакансии смогут прийти снова.";
});

loadSettings().catch(error => {
  statusEl.textContent = "Ошибка загрузки настроек: " + error.message;
});

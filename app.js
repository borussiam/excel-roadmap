const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRJ4fqUN6kglRSCIj2HIX7xPAG8rsvifVbHqWvx9_Z9ZyVkofPRWDO2w_C3EqHbefFgkEPCA5tMSL2r/pub?output=csv";

const state = {
  rows: [],
  filtered: [],
  view: "list",
};

const els = {
  cards: document.querySelector("#cards"),
  emptyState: document.querySelector("#emptyState"),
  searchInput: document.querySelector("#searchInput"),
  categoryFilter: document.querySelector("#categoryFilter"),
  levelFilter: document.querySelector("#levelFilter"),
  statusFilter: document.querySelector("#statusFilter"),
  sortSelect: document.querySelector("#sortSelect"),
  resetBtn: document.querySelector("#resetBtn"),
  viewButtons: document.querySelectorAll(".view-btn"),
  totalCount: document.querySelector("#totalCount"),
  doneCount: document.querySelector("#doneCount"),
  progressCount: document.querySelector("#progressCount"),
  todoCount: document.querySelector("#todoCount"),
  visibleCount: document.querySelector("#visibleCount"),
  rateText: document.querySelector("#rateText"),
  progressFill: document.querySelector("#progressFill"),
  loadInfo: document.querySelector("#loadInfo"),
};

function parseCsv(text) {
  const cleanText = text.replace(/^\uFEFF/, "");
  const rows = [];
  let row = [];
  let value = "";
  let insideQuote = false;

  for (let i = 0; i < cleanText.length; i += 1) {
    const char = cleanText[i];
    const next = cleanText[i + 1];

    if (char === '"' && insideQuote && next === '"') {
      value += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      insideQuote = !insideQuote;
      continue;
    }

    if (char === "," && !insideQuote) {
      row.push(value);
      value = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !insideQuote) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(value);
      if (row.some((cell) => cell.trim() !== "")) rows.push(row);
      row = [];
      value = "";
      continue;
    }

    value += char;
  }

  row.push(value);
  if (row.some((cell) => cell.trim() !== "")) rows.push(row);

  const headers = rows.shift().map((header) => header.trim());
  return rows.map((cells) => {
    const item = {};
    headers.forEach((header, index) => {
      item[header] = (cells[index] ?? "").trim();
    });
    return normalizeRow(item);
  });
}

function normalizeRow(row) {
  const status = row["상태"] || "미시작";
  const rawNumber = row["번호"] || "";
  const numericNumber = Number(String(rawNumber).replace(/\D/g, ""));
  const displayNumber = row["표시번호"] || (Number.isFinite(numericNumber) ? `[${String(numericNumber).padStart(4, "0")}]` : rawNumber);

  return {
    ...row,
    번호값: Number.isFinite(numericNumber) ? numericNumber : 0,
    표시번호값: displayNumber,
    대분류값: row["대분류"] || row["섹션명"] || "미분류",
    난이도값: row["난이도"] || "미분류",
    난이도순서값: Number(row["난이도순서"] || 999),
    상태값: status,
    상태정규화: normalizeStatus(status),
    주제명값: row["주제명"] || "제목 없음",
    검색문자열: [
      rawNumber,
      displayNumber,
      row["대분류"],
      row["섹션명"],
      row["난이도"],
      row["주제명"],
      row["메모"],
    ].join(" ").toLowerCase(),
  };
}

function normalizeStatus(status) {
  return String(status || "미시작").replace(/\s/g, "");
}

function statusClass(status) {
  const normalized = normalizeStatus(status);
  if (normalized === "완료") return "badge--done";
  if (normalized === "진행중") return "badge--progress";
  if (normalized === "보류") return "badge--hold";
  return "badge--todo";
}

function statusRank(status) {
  const normalized = normalizeStatus(status);
  if (normalized === "진행중") return 1;
  if (normalized === "미시작") return 2;
  if (normalized === "보류") return 3;
  if (normalized === "완료") return 4;
  return 5;
}

function uniqueValues(rows, key) {
  return [...new Set(rows.map((row) => row[key]).filter(Boolean))];
}

function fillSelect(select, values) {
  const first = select.querySelector("option[value='']");
  select.innerHTML = "";
  select.appendChild(first || new Option("전체", ""));

  values.forEach((value) => {
    const option = new Option(value, value);
    select.appendChild(option);
  });
}

function initFilters() {
  const categories = uniqueValues(state.rows, "대분류값").sort((a, b) => a.localeCompare(b, "ko"));
  const levels = uniqueValues(state.rows, "난이도값").sort((a, b) => {
    const aOrder = state.rows.find((row) => row.난이도값 === a)?.난이도순서값 ?? 999;
    const bOrder = state.rows.find((row) => row.난이도값 === b)?.난이도순서값 ?? 999;
    return aOrder - bOrder;
  });
  const statuses = ["미시작", "진행중", "완료", "보류"];

  fillSelect(els.categoryFilter, categories);
  fillSelect(els.levelFilter, levels);
  fillSelect(els.statusFilter, statuses);
}

function updateStats(rows) {
  const total = rows.length;
  const done = rows.filter((row) => row.상태정규화 === "완료").length;
  const progress = rows.filter((row) => row.상태정규화 === "진행중").length;
  const todo = rows.filter((row) => row.상태정규화 === "미시작" || !row.상태정규화).length;
  const rate = total ? Math.round((done / total) * 100) : 0;

  els.totalCount.textContent = total.toLocaleString("ko-KR");
  els.doneCount.textContent = done.toLocaleString("ko-KR");
  els.progressCount.textContent = progress.toLocaleString("ko-KR");
  els.todoCount.textContent = todo.toLocaleString("ko-KR");
  els.rateText.textContent = `${rate}%`;
  els.progressFill.style.width = `${rate}%`;
}

function applyFilters() {
  const query = els.searchInput.value.trim().toLowerCase();
  const category = els.categoryFilter.value;
  const level = els.levelFilter.value;
  const status = els.statusFilter.value
  ? normalizeStatus(els.statusFilter.value)
  : "";

  let result = state.rows.filter((row) => {
    const matchesQuery = !query || row.검색문자열.includes(query);
    const matchesCategory = !category || row.대분류값 === category;
    const matchesLevel = !level || row.난이도값 === level;
    const matchesStatus = !status || row.상태정규화 === status;
    return matchesQuery && matchesCategory && matchesLevel && matchesStatus;
  });

  result = sortRows(result, els.sortSelect.value);
  state.filtered = result;
  renderCards(result);
}

function sortRows(rows, mode) {
  const sorted = [...rows];

  if (mode === "difficulty") {
    sorted.sort((a, b) => (a.난이도순서값 - b.난이도순서값) || (a.번호값 - b.번호값));
    return sorted;
  }

  if (mode === "category") {
    sorted.sort((a, b) => {
      const majorA = Number(a["대분류번호"] || 999);
      const majorB = Number(b["대분류번호"] || 999);
      return (majorA - majorB) || (a.번호값 - b.번호값);
    });
    return sorted;
  }

  if (mode === "status") {
    sorted.sort((a, b) => (statusRank(a.상태값) - statusRank(b.상태값)) || (a.번호값 - b.번호값));
    return sorted;
  }

  if (mode === "recent") {
    sorted.sort((a, b) => {
      const dateA = Date.parse(a["학습일"] || "1900-01-01");
      const dateB = Date.parse(b["학습일"] || "1900-01-01");
      return dateB - dateA || a.번호값 - b.번호값;
    });
    return sorted;
  }

  sorted.sort((a, b) => a.번호값 - b.번호값);
  return sorted;
}

function renderCards(rows) {
  els.visibleCount.textContent = rows.length.toLocaleString("ko-KR");
  els.emptyState.hidden = rows.length > 0;

  if (state.view === "list") {
    els.cards.className = "cards topic-list";
    els.cards.innerHTML = `
      <div class="topic-list__head" role="row">
        <span>#</span>
        <span>주제</span>
        <span>대분류</span>
        <span>상태</span>
        <span>학습일</span>
        <span>링크</span>
      </div>
      ${rows.map(listTemplate).join("")}
    `;
    return;
  }

  els.cards.className = "cards";
  els.cards.innerHTML = rows.map(cardTemplate).join("");
}

function renderDifficultyBadge(row) {
  const level = row.난이도값 || "미분류";
  const order = Number(row.난이도순서값);

  if (!Number.isFinite(order) || order < 1 || order > 30) {
    return `<span class="badge">${escapeHtml(level)}</span>`;
  }

  return `
    <img
      class="difficulty-badge"
      src="img/${order}.svg"
      alt="${escapeAttribute(level)}"
      title="${escapeAttribute(level)}"
      loading="lazy"
    />
  `;
}

function formatCategory(row) {
  const majorNo = row["대분류번호"];
  const category = row.대분류값 || row["대분류"] || row["섹션명"] || "미분류";

  if (majorNo !== undefined && majorNo !== null && String(majorNo).trim() !== "") {
    return `${majorNo}: ${category}`;
  }

  return category;
}

function listTemplate(row) {
  const link = row["대화링크"] || "";
  const learnedAt = row["학습일"] || "-";
  const desc = row["한줄설명"] || "";
  const category = formatCategory(row);

  return `
    <article class="topic-list__row" title="${escapeAttribute(desc)}">
      <div class="topic-list__id">
        ${renderDifficultyBadge(row)}
        <span class="topic-list__number">${escapeHtml(row.표시번호값)}</span>
      </div>

      <div class="topic-list__title">
        <span class="topic-list__title-text">${escapeHtml(row.주제명값)}</span>
      </div>

      <div class="topic-list__category">
        ${escapeHtml(category)}
      </div>

      <div class="topic-list__status">
        <span class="badge ${statusClass(row.상태값)}">${escapeHtml(row.상태값)}</span>
      </div>

      <div class="topic-list__date">
        ${escapeHtml(learnedAt)}
      </div>

      <div class="topic-list__link">
        ${link
          ? `<a class="plain-link" href="${escapeAttribute(link)}" target="_blank" rel="noopener noreferrer">열기</a>`
          : `<span class="muted-text">없음</span>`}
      </div>
    </article>
  `;
}

function cardTemplate(row) {
  const link = row["대화링크"] || "";
  const memo = row["메모"] || "";
  const learnedAt = row["학습일"] || "-";
  const nextReview = row["다음복습일"] || "-";

  return `
    <article class="card">
      <div class="card__top">
        <span class="topic-id">${escapeHtml(row.표시번호값)}</span>
        <div class="badges">
          ${renderDifficultyBadge(row)}
          <span class="badge ${statusClass(row.상태값)}">${escapeHtml(row.상태값)}</span>
        </div>
      </div>
      <h3>${escapeHtml(row.주제명값)}</h3>
      <div class="card__meta">
        <span>${escapeHtml(row.대분류값)}</span>
        <span>학습일: ${escapeHtml(learnedAt)} · 다음 복습: ${escapeHtml(nextReview)}</span>
      </div>
      ${memo ? `<p class="card__memo">${escapeHtml(memo)}</p>` : ""}
      <div class="card__actions">
        ${link
          ? `<a class="link-btn" href="${escapeAttribute(link)}" target="_blank" rel="noopener noreferrer">대화 열기</a>`
          : `<span class="link-btn link-btn--disabled">대화 링크 없음</span>`}
      </div>
    </article>
  `;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

function bindEvents() {
  [
    els.searchInput,
    els.categoryFilter,
    els.levelFilter,
    els.statusFilter,
    els.sortSelect,
  ].forEach((el) => el.addEventListener("input", applyFilters));

  els.viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view;

      els.viewButtons.forEach((btn) => {
        btn.classList.toggle("is-active", btn === button);
      });

      renderCards(state.filtered);
    });
  });

  els.resetBtn.addEventListener("click", () => {
    els.searchInput.value = "";
    els.categoryFilter.value = "";
    els.levelFilter.value = "";
    els.statusFilter.value = "";
    els.sortSelect.value = "number";
    applyFilters();
  });
}

async function loadData() {
  try {
    const response = await fetch(CSV_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const csvText = await response.text();
    const rows = parseCsv(csvText).filter((row) => row["주제명"]);

    state.rows = rows;
    updateStats(rows);
    initFilters();
    bindEvents();
    applyFilters();

    const now = new Date();
    els.loadInfo.textContent = `CSV 연결됨 · ${now.toLocaleString("ko-KR")} 기준`;
  } catch (error) {
    console.error(error);
    els.loadInfo.textContent = "데이터를 불러오지 못했습니다.";
    els.cards.innerHTML = `
      <article class="empty">
        <h2>CSV 데이터를 읽지 못했습니다.</h2>
        <p>app.js의 CSV_URL이 맞는지, Google Sheets가 웹에 게시되어 있는지 확인하세요.</p>
      </article>
    `;
  }
}

loadData();

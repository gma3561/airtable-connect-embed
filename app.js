import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm";

const TABLE_NAME = "에어테이블_임시";
const PAGE_SIZE = 20;

/**
 * Persist and load settings safely in localStorage
 */
const settings = {
  get() {
    try {
      const url = localStorage.getItem("sb_url") || "";
      const key = localStorage.getItem("sb_key") || "";
      return { url, key };
    } catch {
      return { url: "", key: "" };
    }
  },
  set({ url, key }) {
    localStorage.setItem("sb_url", url);
    localStorage.setItem("sb_key", key);
  },
};

function createSupabase() {
  const { url, key } = settings.get();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (...args) => fetch(...args) },
  });
}

function $(sel) { return document.querySelector(sel); }

function renderSkeleton(count = 6) {
  const list = $("#list");
  list.innerHTML = Array.from({ length: count }).map(() => (
    `<div class="card skeleton" style="height:68px;border-radius:12px"></div>`
  )).join("");
}

function toText(value) {
  if (value == null) return "";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function buildFilters({ search, type, status }) {
  const filters = [];
  if (search) {
    const escaped = search.replace(/[%_]/g, (m) => `\\${m}`);
    filters.push({ col: "fields->>\uB9E4\uBB3C\uBA85", op: "ilike", val: `%${escaped}%` }); // 매물명
    filters.push({ col: "fields->>\uB3D9", op: "ilike", val: `%${escaped}%` }); // 동
  }
  if (type) {
    filters.push({ col: "fields->>\uB9E4\uBB3C\uC885\uB958", op: "eq", val: type });
  }
  if (status) {
    filters.push({ col: "fields->>\uB9E4\uBB3C\uC0C1\uD0DC", op: "eq", val: status });
  }
  return filters;
}

async function fetchPage(sb, { page, search, type, status }) {
  let query = sb.from(TABLE_NAME).select("id, createdTime, fields");

  const filters = buildFilters({ search, type, status });
  // Combine as AND across filters; for search across two columns, do OR using .or
  if (search) {
    const escaped = search.replace(/[%_]/g, (m) => `\\${m}`);
    query = query.or(
      `fields->>\uB9E4\uBB3C\uBA85.ilike.%25${escaped}%25,fields->>\uB3D9.ilike.%25${escaped}%25`
    );
  }
  if (type) query = query.eq("fields->>\uB9E4\uBB3C\uC885\uB958", type);
  if (status) query = query.eq("fields->>\uB9E4\uBB3C\uC0C1\uD0DC", status);

  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  query = query.order("createdTime", { ascending: false }).range(from, to);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

function renderList(rows) {
  const list = $("#list");
  if (!rows.length) {
    list.innerHTML = `<div class="card"><div class="title">결과가 없습니다</div><div class="sub">필터를 조정하거나 다른 키워드를 시도하세요.</div></div>`;
    return;
  }
  list.innerHTML = rows.map((r) => {
    const f = r.fields || {};
    const name = toText(f["매물명"]) || "(이름 없음)";
    const type = toText(f["매물종류"]) || "-";
    const status = toText(f["매물상태"]) || "-";
    const agent = toText(f["담당자"]) || "-";
    return `
      <article class="card" data-id="${r.id}">
        <div>
          <div class="title">${name}</div>
          <div class="sub">${type} · ${status} · 담당: ${agent}</div>
        </div>
        <div class="actions">
          <button class="btn" data-action="open">상세</button>
        </div>
      </article>
    `;
  }).join("");
}

function openDetail(row) {
  const f = row.fields || {};
  const dialog = $("#detailDialog");
  dialog.innerHTML = `
    <div class="detail-header">
      <div style="font-weight:700">${toText(f["매물명"]) || "상세"}</div>
      <button id="closeDetailBtn" class="icon-btn">닫기</button>
    </div>
    <div class="detail-body">
      ${Object.keys(f).map((k) => (
        `<div style="margin:8px 0"><div style="font-size:12px;color:#475569">${k}</div><div>${toText(f[k])}</div></div>`
      )).join("")}
    </div>
  `;
  dialog.showModal();
  $("#closeDetailBtn").addEventListener("click", () => dialog.close());
}

function wireInteractions(state) {
  $("#openSettingsBtn").addEventListener("click", () => {
    const { url, key } = settings.get();
    $("#sbUrlInput").value = url;
    $("#sbKeyInput").value = key;
    $("#settingsDialog").showModal();
  });
  $("#saveSettingsBtn").addEventListener("click", (e) => {
    e.preventDefault();
    const url = $("#sbUrlInput").value.trim();
    const key = $("#sbKeyInput").value.trim();
    settings.set({ url, key });
    $("#settingsDialog").close();
    location.reload();
  });

  $("#list").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action='open']");
    if (!btn) return;
    const card = e.target.closest(".card");
    const id = card?.dataset?.id;
    const row = state.rows.find((r) => r.id === id);
    if (row) openDetail(row);
  });

  $("#searchInput").addEventListener("input", () => { state.search = $("#searchInput").value; refresh(state, true); });
  $("#typeFilter").addEventListener("change", () => { state.type = $("#typeFilter").value; refresh(state, true); });
  $("#statusFilter").addEventListener("change", () => { state.status = $("#statusFilter").value; refresh(state, true); });
  $("#loadMoreBtn").addEventListener("click", () => { state.page += 1; load(state); });
}

async function load(state) {
  const sb = createSupabase();
  if (!sb) {
    renderSetupRequired();
    return;
  }
  try {
    if (state.page === 0) renderSkeleton();
    const rows = await fetchPage(sb, state);
    if (state.page === 0) state.rows = rows; else state.rows.push(...rows);
    renderList(state.rows);
  } catch (err) {
    console.error(err);
    renderError(err);
  }
}

function refresh(state, resetPage = false) {
  if (resetPage) {
    state.page = 0;
    state.rows = [];
  }
  load(state);
}

function renderSetupRequired() {
  const list = $("#list");
  list.innerHTML = `
    <div class="card">
      <div class="title">Supabase 설정 필요</div>
      <div class="sub">오른쪽 상단 톱니(⚙️) 버튼을 눌러 URL과 Anon Key를 입력하세요.</div>
      <div style="margin-top:8px">권장 URL: <code>https://lpezbycikzbzijawtyem.supabase.co</code></div>
    </div>
  `;
}

function renderError(err) {
  const list = $("#list");
  list.innerHTML = `
    <div class="card">
      <div class="title">오류가 발생했습니다</div>
      <div class="sub">${toText(err.message || err)}</div>
    </div>
  `;
}

(function main(){
  const state = { page: 0, rows: [], search: "", type: "", status: "" };
  wireInteractions(state);
  load(state);
})();

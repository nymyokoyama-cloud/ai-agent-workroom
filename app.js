const state = {
  query: "",
  category: "すべて",
  agent: "すべて",
  sort: "new"
};

const cases = window.AGENT_WORKS_CASES || [];
const caseGrid = document.querySelector("[data-case-grid]");
const countLabel = document.querySelector("[data-count]");
const searchInput = document.querySelector("[data-search]");
const heroForm = document.querySelector("[data-hero-form]");
const heroSearchInput = document.querySelector("[data-hero-search]");
const categoryRow = document.querySelector("[data-categories]");
const agentRow = document.querySelector("[data-agents]");
const emptyState = document.querySelector("[data-empty]");
const modal = document.querySelector("[data-modal]");
const modalPanel = document.querySelector("[data-modal-panel]");
const modalClose = document.querySelector("[data-modal-close]");
const hero = document.querySelector("[data-hero]");
const heroStage = document.querySelector("[data-hero-stage]");
const revealTargets = new Set();

function uniqueValues(key) {
  return ["すべて", ...Array.from(new Set(cases.map((item) => item[key]))).sort((a, b) => a.localeCompare(b, "ja"))];
}

function createChip(label, type) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "chip";
  button.textContent = label;
  button.dataset.value = label;
  button.setAttribute("aria-pressed", state[type] === label ? "true" : "false");
  button.addEventListener("click", () => {
    state[type] = label;
    render();
  });
  return button;
}

function renderChips() {
  categoryRow.replaceChildren(...uniqueValues("category").map((label) => createChip(label, "category")));
  agentRow.replaceChildren(...uniqueValues("agent").map((label) => createChip(label, "agent")));
}

function filteredCases() {
  const q = state.query.trim().toLowerCase();
  return cases.filter((item) => {
    const matchesCategory = state.category === "すべて" || item.category === state.category;
    const matchesAgent = state.agent === "すべて" || item.agent === state.agent;
    const searchable = [
      item.title,
      item.agent,
      item.category,
      item.purpose,
      item.result,
      item.fit,
      item.tags.join(" ")
    ].join(" ").toLowerCase();
    return matchesCategory && matchesAgent && (!q || searchable.includes(q));
  });
}

function renderCard(item, index) {
  const article = document.createElement("article");
  article.className = "work-card glass-panel";
  article.dataset.reveal = "";
  article.style.setProperty("--reveal-delay", `${Math.min(index * 55, 440)}ms`);
  article.innerHTML = `
    <div class="work-card__meta">
      <span>${escapeHtml(item.agent)}</span>
      <span>${escapeHtml(item.category)}</span>
    </div>
    <h3>${escapeHtml(item.title)}</h3>
    <p>${escapeHtml(item.result)}</p>
    <div class="tag-list">
      ${item.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
    </div>
    <button type="button" class="card-action" data-open="${escapeHtml(item.id)}">事例を見る</button>
  `;
  article.querySelector("[data-open]").addEventListener("click", () => openModal(item));
  return article;
}

function render() {
  renderChips();
  const list = filteredCases();
  countLabel.textContent = `${list.length}件`;
  caseGrid.replaceChildren(...list.map(renderCard));
  emptyState.hidden = list.length !== 0;
  observeRevealTargets(caseGrid.querySelectorAll("[data-reveal]"));
}

function setQuery(value) {
  state.query = value;
  if (searchInput.value !== value) searchInput.value = value;
  if (heroSearchInput.value !== value) heroSearchInput.value = value;
  render();
}

function openModal(item) {
  modalPanel.innerHTML = `
    <div class="modal-top">
      <div>
        <p class="eyebrow">${escapeHtml(item.agent)} / ${escapeHtml(item.category)}</p>
        <h2>${escapeHtml(item.title)}</h2>
      </div>
      <button type="button" class="icon-button" aria-label="閉じる" data-modal-close-inline>×</button>
    </div>
    <dl class="case-detail">
      ${detailRow("作業の目的", item.purpose)}
      ${detailRow("できたこと", item.result)}
      ${detailRow("必要だった入力", item.input)}
      ${detailRow("人間が確認したところ", item.humanCheck)}
      ${detailRow("向いている人", item.fit)}
      ${detailRow("注意点", item.caution)}
    </dl>
    <div class="modal-footer">
      <div class="tag-list">
        ${item.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
      </div>
      <a href="${escapeAttribute(item.link)}" target="_blank" rel="ugc nofollow noopener noreferrer" class="primary-link">${escapeHtml(item.linkLabel)}</a>
    </div>
  `;
  modal.hidden = false;
  document.body.classList.add("is-modal-open");
  modalPanel.querySelector("[data-modal-close-inline]").addEventListener("click", closeModal);
}

function detailRow(label, value) {
  return `
    <div>
      <dt>${escapeHtml(label)}</dt>
      <dd>${escapeHtml(value)}</dd>
    </div>
  `;
}

function closeModal() {
  modal.hidden = true;
  document.body.classList.remove("is-modal-open");
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
  return escapeHtml(value).replaceAll("`", "&#096;");
}

searchInput.addEventListener("input", (event) => {
  setQuery(event.target.value);
});

heroSearchInput.addEventListener("input", (event) => {
  setQuery(event.target.value);
});

heroForm.addEventListener("submit", (event) => {
  event.preventDefault();
  setQuery(heroSearchInput.value);
  document.querySelector("#cases").scrollIntoView({ behavior: "smooth", block: "start" });
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

modalClose.addEventListener("click", closeModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) closeModal();
});

function updateHeroProgress() {
  if (!hero || !heroStage) return;
  const rect = hero.getBoundingClientRect();
  const travel = Math.max(1, hero.offsetHeight - window.innerHeight);
  const progress = Math.min(1, Math.max(0, -rect.top / travel));
  hero.style.setProperty("--hero-progress", progress.toFixed(4));
  heroStage.style.setProperty("--hero-progress", progress.toFixed(4));
}

const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" })
  : null;

function observeRevealTargets(targets) {
  targets.forEach((target) => {
    if (revealTargets.has(target)) return;
    revealTargets.add(target);
    if (revealObserver) {
      revealObserver.observe(target);
    } else {
      target.classList.add("is-visible");
    }
  });
}

window.addEventListener("scroll", updateHeroProgress, { passive: true });
window.addEventListener("resize", updateHeroProgress);
observeRevealTargets(document.querySelectorAll("[data-reveal]"));
updateHeroProgress();
render();

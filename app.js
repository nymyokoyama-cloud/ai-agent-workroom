const state = {
  query: "",
  category: "すべて",
  sort: "new"
};

const cases = window.AGENT_WORKS_CASES || [];
const caseGrid = document.querySelector("[data-case-grid]");
const popularGrid = document.querySelector("[data-popular-grid]");
const heroShowcase = document.querySelector("[data-hero-showcase]");
const categoryStrip = document.querySelector("[data-category-strip]");
const countLabel = document.querySelector("[data-count]");
const searchInput = document.querySelector("[data-search]");
const categoryRow = document.querySelector("[data-categories]");
const sortButtons = Array.from(document.querySelectorAll("[data-sort]"));
const emptyState = document.querySelector("[data-empty]");

function uniqueCategories() {
  return ["すべて", ...Array.from(new Set(cases.map((item) => item.category))).sort((a, b) => a.localeCompare(b, "ja"))];
}

function categoryCounts() {
  return cases.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});
}

function filteredCases() {
  const q = state.query.trim().toLowerCase();
  const list = cases.filter((item) => {
    const matchesCategory = state.category === "すべて" || item.category === state.category;
    const searchable = [
      item.title,
      item.agent,
      item.category,
      item.purpose,
      item.result,
      item.summary,
      item.fit,
      item.author,
      item.tags.join(" ")
    ].join(" ").toLowerCase();
    return matchesCategory && (!q || searchable.includes(q));
  });

  return list.sort((a, b) => {
    if (state.sort === "popular") return getLikeScore(b) - getLikeScore(a);
    if (state.sort === "recommended") return Number(Boolean(b.recommended)) - Number(Boolean(a.recommended)) || getLikeScore(b) - getLikeScore(a);
    return cases.indexOf(b) - cases.indexOf(a);
  });
}

function getLikeScore(item) {
  return Number(item.likes || 0) + (window.AgentWorkroomLikes?.isLiked(item.id) ? 1 : 0);
}

function renderChips() {
  categoryRow.replaceChildren(...uniqueCategories().map((label) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip";
    button.textContent = label;
    button.setAttribute("aria-pressed", state.category === label ? "true" : "false");
    button.addEventListener("click", () => {
      state.category = label;
      render();
    });
    return button;
  }));
}

function renderCategoryStrip() {
  const counts = categoryCounts();
  categoryStrip.replaceChildren(...Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([name, count], index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "category-card";
      button.innerHTML = `
        <span class="category-icon">${String(index + 1).padStart(2, "0")}</span>
        <span>
          <strong>${escapeHtml(name)}</strong>
          <small>${count}件の作品</small>
        </span>
      `;
      button.addEventListener("click", () => {
        state.category = name;
        document.querySelector("#works").scrollIntoView({ behavior: "smooth", block: "start" });
        render();
      });
      return button;
    }));
}

function renderHeroShowcase() {
  const items = cases.filter((item) => item.featured).slice(0, 3);
  heroShowcase.replaceChildren(...items.map((item, index) => {
    const card = document.createElement("a");
    card.className = `hero-work-card hero-work-card--${index + 1}`;
    card.href = item.detailUrl;
    card.innerHTML = `
      <img src="${escapeAttribute(item.image)}" alt="${escapeAttribute(item.imageAlt)}" loading="${index === 0 ? "eager" : "lazy"}">
      <span class="featured-badge">${index === 0 ? "Featured" : item.category}</span>
      <span class="image-count">1/${item.galleryCount}</span>
      <span class="hero-card-body">
        <small>${escapeHtml(item.category)}</small>
        <strong>${escapeHtml(item.title)}</strong>
        <span>${escapeHtml(item.summary)}</span>
      </span>
    `;
    return card;
  }));
}

function renderPopular() {
  const items = [...cases].sort((a, b) => getLikeScore(b) - getLikeScore(a)).slice(0, 3);
  popularGrid.replaceChildren(...items.map((item) => renderWorkCard(item, true)));
}

function renderWorkCard(item, compact = false) {
  const article = document.createElement("article");
  article.className = `work-card${compact ? " work-card--compact" : ""}`;
  article.innerHTML = `
    <a class="work-image" href="${escapeAttribute(item.detailUrl)}" aria-label="${escapeAttribute(item.title)} の詳細を見る">
      <img src="${escapeAttribute(item.image)}" alt="${escapeAttribute(item.imageAlt)}" loading="lazy" width="1200" height="760">
      <span class="image-count">1/${item.galleryCount}</span>
      ${item.recommended ? '<span class="featured-badge">Recommended</span>' : ""}
    </a>
    <div class="work-body">
      <div class="work-meta">
        <span>${escapeHtml(item.category)}</span>
        <span>${escapeHtml(item.timeAgo)}</span>
      </div>
      <h3><a href="${escapeAttribute(item.detailUrl)}">${escapeHtml(item.title)}</a></h3>
      <p>${escapeHtml(item.summary)}</p>
      <div class="metric-box">
        <span>${escapeHtml(item.metricLabel)}</span>
        <strong>${escapeHtml(item.before)} <span>→</span> ${escapeHtml(item.after)}</strong>
      </div>
      <div class="tag-list">
        ${item.tags.slice(0, 3).map((tag) => `<span># ${escapeHtml(tag)}</span>`).join("")}
      </div>
    </div>
    <div class="card-footer">
      <div class="author">
        <span class="avatar">${escapeHtml(item.author.slice(1, 3).toUpperCase())}</span>
        <span>
          <strong>${escapeHtml(item.author)}</strong>
          <small>${escapeHtml(item.role)}</small>
        </span>
      </div>
      <div class="card-actions">
        <button type="button" class="like-button" data-like-id="${escapeAttribute(item.id)}" data-like-base="${Number(item.likes || 0)}" aria-label="${escapeAttribute(item.title)} にいいね">Like <span data-like-count>${Number(item.likes || 0)}</span></button>
        <a class="detail-button" href="${escapeAttribute(item.detailUrl)}">詳細を見る</a>
      </div>
    </div>
  `;
  return article;
}

function render() {
  renderChips();
  renderCategoryStrip();
  renderHeroShowcase();
  renderPopular();

  const list = filteredCases();
  countLabel.textContent = `${list.length}件`;
  caseGrid.replaceChildren(...list.map((item) => renderWorkCard(item)));
  emptyState.hidden = list.length !== 0;
  sortButtons.forEach((button) => {
    button.setAttribute("aria-pressed", state.sort === button.dataset.sort ? "true" : "false");
  });
  window.AgentWorkroomLikes?.hydrate();
}

function setQuery(value) {
  state.query = value;
  render();
}

searchInput.addEventListener("input", (event) => setQuery(event.target.value));

sortButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.sort = button.dataset.sort;
    render();
  });
});

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

render();

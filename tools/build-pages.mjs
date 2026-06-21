import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const siteUrl = "https://ai-agent-workroom.pages.dev";
const dataSource = fs.readFileSync(path.join(root, "data.js"), "utf8");
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(dataSource, sandbox);

const cases = sandbox.window.AGENT_WORKS_CASES || [];

function html(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function relAsset(value) {
  return html(String(value).replace("./", "../../"));
}

function detailBox(title, body) {
  return `
          <article class="detail-box">
            <h3>${html(title)}</h3>
            <p>${html(body)}</p>
          </article>`;
}

function relatedCards(item) {
  const related = cases
    .filter((candidate) => candidate.id !== item.id)
    .sort((a, b) => Number(b.category === item.category) - Number(a.category === item.category) || Number(b.likes) - Number(a.likes))
    .slice(0, 3);

  return related.map((candidate) => `
          <a class="related-card" href="../${html(candidate.id)}/">
            <img src="${relAsset(candidate.image)}" alt="${html(candidate.imageAlt)}" loading="lazy" width="1200" height="760">
            <span>${html(candidate.title)}</span>
          </a>`).join("");
}

function pageHtml(item) {
  const title = `${item.title} | AI Agent Workroom`;
  const description = `${item.summary} AIエージェントで実際にできた制作物・運用事例の詳細ページです。`;

  return `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${html(title)}</title>
    <meta name="description" content="${html(description)}">
    <link rel="canonical" href="${siteUrl}/works/${html(item.id)}/">
    <meta property="og:title" content="${html(item.title)}">
    <meta property="og:description" content="${html(item.summary)}">
    <meta property="og:type" content="article">
    <meta property="og:image" content="${siteUrl}/${html(item.image.replace("./", ""))}">
    <link rel="icon" href="../../favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="../../styles.css">
  </head>
  <body class="detail-page">
    <header class="site-header">
      <a class="brand" href="../../" aria-label="AI Agent Workroom トップ">
        <span class="brand-mark">A</span>
        <span>AI Agent Workroom</span>
      </a>
      <nav class="top-nav" aria-label="主要メニュー">
        <a href="../../#works">作品を探す</a>
        <a href="../../#categories">カテゴリー</a>
        <a href="../../#popular">人気</a>
        <a href="../../#guide">ガイド</a>
      </nav>
      <div class="header-actions">
        <a class="ghost-button" href="../../#guide">ログイン</a>
        <a class="primary-button" href="../../#guide">投稿する</a>
      </div>
    </header>

    <main class="detail-main">
      <a class="back-link" href="../../#works">作品一覧へ戻る</a>

      <section class="detail-hero">
        <figure class="detail-image">
          <img src="${relAsset(item.image)}" alt="${html(item.imageAlt)}" width="1200" height="760">
          <span class="image-count">1/${html(item.galleryCount)}</span>
          ${item.recommended ? '<span class="featured-badge">Recommended</span>' : ""}
        </figure>

        <div class="detail-summary">
          <p class="eyebrow">${html(item.category)} / ${html(item.agent)}</p>
          <h1>${html(item.title)}</h1>
          <p class="detail-lead">${html(item.summary)}</p>
          <div class="metric-box">
            <span>${html(item.metricLabel)}</span>
            <strong>${html(item.before)} <span>→</span> ${html(item.after)}</strong>
          </div>
          <div class="tag-list">
            ${item.tags.map((tag) => `<span># ${html(tag)}</span>`).join("")}
          </div>
          <div class="author">
            <span class="avatar">${html(item.author.slice(1, 3).toUpperCase())}</span>
            <span>
              <strong>${html(item.author)}</strong>
              <small>${html(item.role)}</small>
            </span>
          </div>
          <div class="detail-actions">
            <button type="button" class="like-button" data-like-id="${html(item.id)}" data-like-base="${Number(item.likes || 0)}">Like <span data-like-count>${Number(item.likes || 0)}</span></button>
            <a class="primary-button" href="${html(item.link)}" rel="ugc nofollow noopener noreferrer">${html(item.linkLabel)}</a>
          </div>
        </div>
      </section>

      <section class="detail-section" aria-labelledby="detail-content-title">
        <div class="section-title">
          <p class="eyebrow">Work detail</p>
          <h2 id="detail-content-title">制作物の詳細</h2>
        </div>
        <div class="detail-grid">
          ${detailBox("作業の目的", item.purpose)}
          ${detailBox("できたこと", item.result)}
          ${detailBox("必要だった入力", item.input)}
          ${detailBox("人間が確認したところ", item.humanCheck)}
          ${detailBox("向いている人", item.fit)}
          ${detailBox("注意点", item.caution)}
        </div>
      </section>

      <section class="detail-section" aria-labelledby="related-title">
        <div class="section-title row-title">
          <div>
            <p class="eyebrow">Related works</p>
            <h2 id="related-title">関連する作品</h2>
          </div>
          <a class="text-link" href="../../#works">一覧へ戻る</a>
        </div>
        <div class="related-grid">
${relatedCards(item)}
        </div>
      </section>
    </main>

    <script src="../../likes.js"></script>
  </body>
</html>
`;
}

fs.rmSync(path.join(root, "works"), { recursive: true, force: true });

for (const item of cases) {
  const dir = path.join(root, "works", item.id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), pageHtml(item));
}

const urls = [
  `${siteUrl}/`,
  ...cases.map((item) => `${siteUrl}/works/${item.id}/`)
];

fs.writeFileSync(path.join(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join("\n")}
</urlset>
`);

console.log(`Generated ${cases.length} work pages and sitemap.xml`);

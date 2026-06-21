# AI Agent Workroom

AIエージェントで実際にできた作業を集める、静的な「できたことログ」MVPです。

## 公開方法

Cloudflare Pagesで公開する場合は、このディレクトリをGitHubリポジトリにしてPagesへ接続します。

## Repository

https://github.com/nymyokoyama-cloud/ai-agent-workroom

## Live Site

https://ai-agent-workroom.pages.dev

## Cloudflare Pages

- Project: `ai-agent-workroom`
- Production URL: https://ai-agent-workroom.pages.dev
- Framework preset: None
- Build command: 空欄
- Build output directory: `/`
- Production branch: `main`

## 更新フロー

ローカルで編集して `main` へpushすると、Cloudflare Pagesが自動で本番へ反映します。

```bash
git add .
git commit -m "Update workroom cases"
git push
```

## 手動公開する場合

GitHub連携を使わずCloudflare Pagesへ手動アップロードする場合は、この設定で公開します。

- Framework preset: None
- Build command: 空欄
- Build output directory: `/`

Git連携前に試すだけなら、Cloudflare PagesのDirect Uploadでも公開できます。

## 編集する場所

- `data.js`: 掲載事例のデータ
- `index.html`: ページ構造
- `styles.css`: デザイン
- `app.js`: 検索、絞り込み、詳細モーダル
- `assets/agent-works-hero.png`: OGP兼ヒーロー画像

## 掲載方針

- 掲載するのは「AIエージェントで実際にできたこと」
- 詳しい手順やプロンプト全文は載せない
- 投稿者リンクは1本だけ
- 個人情報、APIキー、非公開URL、管理画面情報は載せない
- 初期は運営事例だけで育て、事例数が増えてから一般投稿を検討する

## 次の拡張候補

- 事例カテゴリの追加
- 検索流入を狙う個別事例ページ化
- 投稿フォームの追加
- Supabaseなどを使った承認制投稿
- ACS Developerやnote記事への導線強化

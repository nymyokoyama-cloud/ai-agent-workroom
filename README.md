# AI Agent Workroom

AIエージェントで実際にできた作業を集める、静的な「できたことログ」MVPです。2026-06-21に、黒背景の作品ギャラリー型サイトへリデザインしました。

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
node tools/build-pages.mjs
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
- `app.js`: 検索、絞り込み、人気順、おすすめ順、カード描画
- `likes.js`: ローカル保存のいいねUI
- `tools/build-pages.mjs`: `data.js` から詳細ページとサイトマップを生成
- `assets/workroom-dark-hero.png`: OGP兼ヒーロー背景画像
- `assets/work-previews/`: 作品カード用サムネイル

## デザイン方針

- 夜に布団の中で見ても眩しくない黒背景を基調にする
- 添付参考のような、青い発光とクリエイティブな作品カードUIに寄せる
- 一覧カードには投稿者画像相当の制作物サムネイル、概要、タグ、投稿者、いいね数を表示する
- 「詳細を見る」で個別ページへ移動し、ページ数を増やしてSEO資産化する
- いいね数、人気順、おすすめ順、将来のピックアップ掲載枠を想定した構造にする

## 掲載方針

- 掲載するのは「AIエージェントで実際にできたこと」
- 詳しい手順やプロンプト全文は載せない
- 投稿者リンクは1本だけ
- 個人情報、APIキー、非公開URL、管理画面情報は載せない
- 初期は運営事例だけで育て、事例数が増えてから一般投稿を検討する

## 次の拡張候補

- 事例カテゴリの追加
- 検索流入を狙う個別事例ページを増やす
- 投稿フォームの追加
- Supabaseなどを使った承認制投稿
- ACS Developerやnote記事への導線強化

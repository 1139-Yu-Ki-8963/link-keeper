import 'dotenv/config'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '../app/generated/prisma/client'

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? 'file:./dev.db' })
const db = new PrismaClient({ adapter })

const CATEGORIES = ['知識', '情報']
const TYPES = ['記事', 'リポジトリ', '書籍', '動画', 'ツール', 'テンプレート']
const STATUSES = ['未読', '後で挑戦', '実践済み']
// CC 構成要素 7 + 記事テーマ 4。ポータル設計ガイドの分類に準拠
const TOPICS = [
  'CLAUDE.md',
  'Rules',
  'Skills',
  'Hooks',
  'Agents',
  'Workflow',
  'MCP',
  'テスト',
  'デザイン',
  'チーム・CI',
  'コード品質',
  'ドキュメント改善',
]

const RESOURCES: Array<{
  title: string
  description: string | null
  memo?: string | null
  url: string
  category: string
  type: string
  topic: string
  status: string | null
  pinned: boolean
}> = [
  {
    title: 'Claude Codeのスキルを書くときに便利だった3つの組み込みツール',
    description:
      'Claude Code でスキル（SKILL.md）を書くときに役立つ、3つの組み込みツールの使いどころを実例とともに紹介。スキル作成を効率化したい人向けの実践的なノウハウ記事。',
    memo: null,
    url: 'https://zenn.dev/sonicgarden/articles/claude-code-skill-building-tools',
    category: '情報',
    type: '記事',
    topic: 'Skills',
    status: '未読',
    pinned: false,
  },
  {
    title: 'Claude Codeの失敗をチームルールに昇格させる仕組み',
    description:
      'Claude Code が起こした失敗を、その場の注意で終わらせずチーム共有のルールへ反映し、再発を防ぐ運用の仕組みを解説した記事。',
    memo: null,
    url: 'https://zenn.dev/dely_jp/articles/5bc3e9cf62d776',
    category: '情報',
    type: '記事',
    topic: 'Rules',
    status: '未読',
    pinned: false,
  },
  {
    title: 'DB・ドメインは分離、Claude設定は共通化 ── git worktreeで並列開発環境をセットアップする',
    description:
      'git worktree で複数作業を並行させつつ、DB・ドメインは分離し Claude 設定は共通化する並列開発環境の構築手順。',
    memo: null,
    url: 'https://zenn.dev/sonicgarden/articles/4af20794b8a0f7',
    category: '情報',
    type: '記事',
    topic: 'CLAUDE.md',
    status: '未読',
    pinned: false,
  },
  {
    title: 'ルール準拠を自動チェックする（後編）— Claude Codeに『オレたち流』を守らせる',
    description:
      '独自コーディング規約への準拠を自動チェックし、Claude Code にチーム流のルールを守らせる仕組みの実装（後編）。',
    memo: null,
    url: 'https://zenn.dev/sonicgarden/articles/claude-code-custom-rules-part3',
    category: '情報',
    type: '記事',
    topic: 'Hooks',
    status: '未読',
    pinned: false,
  },
  {
    title: 'Claude Codeで始めるコード品質の見える化',
    description:
      'Claude Code を使ってコード品質を計測・可視化し、改善につなげる始め方を紹介した記事。',
    memo: null,
    url: 'https://zenn.dev/nexta_/articles/claude-code-quality-metrics',
    category: '情報',
    type: '記事',
    topic: 'Workflow',
    status: '未読',
    pinned: false,
  },
  {
    title: 'Claude Code Skills のアンチパターン — 「なぜ Skills か」から考え直す設計の落とし穴',
    description:
      'Claude Code Skills を作る際に陥りがちなアンチパターンを、「なぜ Skills を使うのか」という前提から問い直して整理した設計上の注意点。',
    url: 'https://qiita.com/nogataka/items/ea4e7d78651d6ed46796',
    category: '情報',
    type: '記事',
    topic: 'Skills',
    status: '未読',
    pinned: false,
  },
  {
    title: 'AI時代のE2Eテスト、PlaywrightとVibiumをどう使い分けるか',
    description:
      'AI時代のE2Eテストについて、従来型の Playwright と新興の Vibium の特徴を比較し、使い分けの指針を示した記事。',
    url: 'https://zenn.dev/tokium_dev/articles/b0df516ba8750d',
    category: '情報',
    type: '記事',
    topic: 'テスト',
    status: '未読',
    pinned: false,
  },
  {
    title:
      'スペック文書を「読みたくなるHTML」に変換するClaude Codeスキルを作った話（スキル本文付き）',
    description:
      'スペック文書を「読みたくなるHTML」へ変換する Claude Code スキルを自作した過程の紹介（スキル本文付き）。',
    url: 'https://zenn.dev/spacemarket/articles/6c4992227d0b0d',
    category: '情報',
    type: '記事',
    topic: 'Skills',
    status: '未読',
    pinned: false,
  },
  {
    title: 'Claude Agents！機能が多い！でもここだけ抑えたら便利に使える！',
    description:
      '機能が多い Claude Agents について、まず押さえておくと便利になる要点を絞って解説した入門記事。',
    url: 'https://zenn.dev/nana/articles/3fd7e9dffeb831',
    category: '情報',
    type: '記事',
    topic: 'Agents',
    status: '未読',
    pinned: false,
  },
  {
    title: 'Claude Codeのスキルが毎日勝手に改善されていく仕組みを作った',
    description: 'Claude Code のスキルが毎日自動で改善されていく仕組みを構築した事例の解説。',
    url: 'https://zenn.dev/sonicgarden/articles/claude-code-self-improving-loop',
    category: '情報',
    type: '記事',
    topic: 'Skills',
    status: '未読',
    pinned: false,
  },
  {
    title: '実践フルAIコーディング',
    description: 'AI を全面的に活用した「フルAIコーディング」の実践的な進め方をまとめた記事。',
    url: 'https://zenn.dev/erukiti/articles/2512-full-ai-cofing',
    category: '情報',
    type: '記事',
    topic: 'Workflow',
    status: '未読',
    pinned: false,
  },
  {
    title: 'AI開発の現実解はレベル7やで ― Agentic Engineering 8レベルでチームの立ち位置を測る',
    description:
      'AI開発の成熟度を Agentic Engineering の8レベルで捉え、チームが今どの段階にいるかを測るための枠組みを示した記事。',
    url: 'https://zenn.dev/masayan1126/articles/agentic-engineering-8-levels',
    category: '知識',
    type: '記事',
    topic: 'チーム・CI',
    status: null,
    pinned: false,
  },
  {
    title: 'E2Eテストのカバレッジはどう定義する？「全量」をチームの合意で決めるための考え方',
    description:
      'E2Eテストのカバレッジをどう定義するか、「全量」をチームの合意で決めるための考え方を整理した記事。',
    url: 'https://magicpod.com/blog/e2e-test-coverage/',
    category: '知識',
    type: '記事',
    topic: 'テスト',
    status: null,
    pinned: false,
  },
  {
    title:
      'Claude CodeでPRレビューを自動化する設計と実装 ── 「AIレビューだけでマージ」を実現するまで',
    description:
      'Claude Code で PR レビューを自動化し、「AIレビューだけでマージ」を実現するまでの設計と実装を解説。',
    url: 'https://qiita.com/nogataka/items/ceae4e70fc4cca2e2c9e',
    category: '情報',
    type: '記事',
    topic: 'Workflow',
    status: null,
    pinned: false,
  },
  {
    title: '全PRの83%をAIレビューだけでマージできるようにした',
    description: 'AIレビューを活用して全PRの83%を自動マージできるようにした取り組みの紹介。',
    url: 'https://zenn.dev/kauche/articles/e051583461c181',
    category: '情報',
    type: '記事',
    topic: 'チーム・CI',
    status: null,
    pinned: false,
  },
  {
    title: '深夜のE2Eテスト失敗をClaude Codeが自動修正してPRを作る仕組みの構築',
    description:
      '深夜に失敗したE2Eテストを Claude Code が自動修正し、PR まで作る仕組みの構築事例。',
    url: 'https://tech.kickflow.co.jp/entry/2026/04/03/113600',
    category: '情報',
    type: '記事',
    topic: 'テスト',
    status: null,
    pinned: false,
  },
  {
    title: 'PlaywrightのCIが80分→35分に：実行時間ベースのバランスドシャーディングを自作した話',
    description:
      'Playwright の CI 実行時間を80分から35分へ短縮した、実行時間ベースのバランスドシャーディング自作の解説。',
    url: 'https://tech.kickflow.co.jp/entry/2026/03/13/080220',
    category: '知識',
    type: '記事',
    topic: 'テスト',
    status: '未読',
    pinned: false,
  },
  {
    title: 'Claude Code Skills 共有管理 — 4つのAIツールを1リポジトリで統一する方法',
    description:
      '複数のAIコーディングツール間でスキルをsymlinkで一元管理し、保守コストを減らす手法を解説。Nix/home-managerによる配布自動化まで踏み込んでいる。',
    url: 'https://www.playpark.co.jp/blog/multi-agent-skills-sharing',
    category: '情報',
    type: '記事',
    topic: 'Skills',
    status: null,
    pinned: false,
  },
  {
    title: 'Claude CodeからPull Requestのレビュー操作を便利に行うClaude Skillsを作った',
    description:
      'インラインコメントの行ズレ・既存コメント取得・返信の3課題をSkills化で解決。diff取得時に行番号を明示表示することで正確な行指定を実現している。',
    memo: 'PRレビューのインラインコメントを正しい行へ付けるには、diff取得時に行番号を明示表示する手法が鍵',
    url: 'https://blog.shibayu36.org/entry/2025/12/17/173000',
    category: '情報',
    type: '記事',
    topic: 'Skills',
    status: null,
    pinned: false,
  },
  {
    title:
      'Claude Codeの使用率がステータスラインに表示できるようになったので表示用のスクリプトを作った話',
    description:
      'rate_limitsフィールドを使い、コンテキスト使用率と5時間・7日間の消費量をステータスバーに表示するPythonスクリプト5パターンを紹介。',
    url: 'https://nyosegawa.com/posts/claude-code-statusline-rate-limits/',
    category: '情報',
    type: '記事',
    topic: 'CLAUDE.md',
    status: null,
    pinned: false,
  },
  {
    title: 'design.md',
    description: 'AIエージェントにデザインシステムを伝えるための構造化フォーマット仕様',
    url: 'https://github.com/google-labs-code/design.md',
    category: '知識',
    type: 'リポジトリ',
    topic: 'デザイン',
    status: null,
    pinned: false,
  },
  {
    title: 'textlint-rule-preset-ja-technical-writing',
    description: '日本語技術文書向けのtextlintルールプリセット',
    url: 'https://github.com/textlint-ja/textlint-rule-preset-ja-technical-writing',
    category: '知識',
    type: 'リポジトリ',
    topic: 'ドキュメント改善',
    status: null,
    pinned: false,
  },
  {
    title: 'textlint-rule-preset-ai-writing',
    description: 'AI特有の文体パターンを検出し自然な日本語表現を促すtextlintプリセット',
    url: 'https://github.com/textlint-ja/textlint-rule-preset-ai-writing',
    category: '知識',
    type: 'リポジトリ',
    topic: 'ドキュメント改善',
    status: null,
    pinned: false,
  },
  {
    title: 'supabase/agent-skills',
    description: 'AIエージェントがSupabaseを操作するためのスキル集',
    url: 'https://github.com/supabase/agent-skills',
    category: '情報',
    type: 'リポジトリ',
    topic: 'Agents',
    status: null,
    pinned: false,
  },
  {
    title: 'awesome-design-md-jp',
    description: '日本語UIをAIエージェントに正しく作らせるためのDESIGN.md集',
    url: 'https://github.com/kzhrknt/awesome-design-md-jp',
    category: '情報',
    type: 'リポジトリ',
    topic: 'デザイン',
    status: null,
    pinned: false,
  },
  {
    title: 'mizchi/skills',
    description: 'mizchiによるAIエージェント向けスキル集（APM配信）',
    url: 'https://github.com/mizchi/skills',
    category: '情報',
    type: 'リポジトリ',
    topic: 'Skills',
    status: null,
    pinned: false,
  },
  {
    title: 'Material Symbols and Icons - Google Fonts',
    description: null,
    memo: 'Googleが提供するマテリアルデザインのアイコンフォントライブラリ。SVG・PNG・フォント形式でダウンロードでき、Webアプリや資料のアイコン選定に使える。',
    url: 'https://fonts.google.com/icons',
    category: '知識',
    type: 'ツール',
    topic: 'デザイン',
    status: null,
    pinned: false,
  },
  {
    title: '日本語技術文書の文章規範',
    description:
      '日本語で技術書の章・記事・解説文を書くときの文章規範。整形・段落構成・論証の厳密さ・冗長の排除を定める。',
    memo: null,
    url: 'https://gist.github.com/k16shikano/fd287c3133457c4fd8f5601d34aa817d',
    category: '知識',
    type: '記事',
    topic: 'ドキュメント改善',
    status: null,
    pinned: false,
  },
  {
    title: '入門から実践 -「ループエンジニアリング」',
    description: 'Claude Code のループエンジニアリングを入門から実践まで体系的に解説した記事。',
    memo: null,
    url: 'https://qiita.com/Syoitu/items/97ed37e7ba9c38dc75d8',
    category: '情報',
    type: '記事',
    topic: 'Workflow',
    status: null,
    pinned: false,
  },
  {
    title: 'もうプロンプトを書くな──「Loop Engineering」という新しいパラダイムの正体',
    description: 'プロンプト単発実行から「Loop Engineering」へのパラダイム転換を論じた記事。',
    memo: null,
    url: 'https://zenn.dev/acrosstudioblog/articles/38509c0473683a',
    category: '情報',
    type: '記事',
    topic: 'Workflow',
    status: null,
    pinned: false,
  },
]

async function main() {
  for (const [i, name] of CATEGORIES.entries()) {
    await db.category.upsert({
      where: { name },
      update: { sortOrder: i },
      create: { name, sortOrder: i },
    })
  }
  for (const [i, name] of TYPES.entries()) {
    await db.resourceType.upsert({
      where: { name },
      update: { sortOrder: i },
      create: { name, sortOrder: i },
    })
  }
  for (const [i, name] of TOPICS.entries()) {
    await db.topic.upsert({
      where: { name },
      update: { sortOrder: i },
      create: { name, sortOrder: i },
    })
  }
  for (const [i, name] of STATUSES.entries()) {
    await db.status.upsert({
      where: { name },
      update: { sortOrder: i },
      create: { name, sortOrder: i },
    })
  }

  const cat = Object.fromEntries((await db.category.findMany()).map((x) => [x.name, x.id]))
  const type = Object.fromEntries((await db.resourceType.findMany()).map((x) => [x.name, x.id]))
  const topic = Object.fromEntries((await db.topic.findMany()).map((x) => [x.name, x.id]))
  const status = Object.fromEntries((await db.status.findMany()).map((x) => [x.name, x.id]))

  let created = 0
  for (const r of RESOURCES) {
    if (await db.resource.findFirst({ where: { url: r.url } })) continue
    await db.resource.create({
      data: {
        title: r.title,
        description: r.description,
        memo: r.memo ?? null,
        url: r.url,
        pinned: r.pinned,
        categoryId: cat[r.category],
        typeId: type[r.type],
        topicId: topic[r.topic],
        statusId: r.status ? status[r.status] : null,
      },
    })
    created++
  }

  const total = await db.resource.count()
  console.log(
    `seed 完了: Category ${CATEGORIES.length} / Type ${TYPES.length} / Topic ${TOPICS.length} / Status ${STATUSES.length} / Resource ${total}件（新規 ${created}件）`,
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())

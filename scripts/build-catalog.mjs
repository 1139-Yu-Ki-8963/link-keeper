import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const catalogPath = resolve(rootDir, "docs/リソース蓄積簿.md");
const indexPath = resolve(rootDir, "index.html");

const START_MARKER = "/*CATALOG-DATA-START*/";
const END_MARKER = "/*CATALOG-DATA-END*/";

/**
 * テーブル行（`| a | b | ... |`）をセル配列にパースする。
 * ヘッダ行・セパレータ行（`---` を含む）は呼び出し側でスキップ済みの前提。
 */
function parseRow(line) {
  const trimmed = line.trim();
  const withoutEdges = trimmed.replace(/^\|/, "").replace(/\|$/, "");
  return withoutEdges.split("|").map((cell) => cell.trim());
}

function isTableRow(line) {
  return line.trim().startsWith("|");
}

function isSeparatorRow(line) {
  return /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?$/.test(line.trim());
}

/**
 * カンマ区切りの複数値セルを配列にパースする。空セル・未定義は空配列。
 */
function parseMultiValue(cell) {
  return (cell ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseCatalog(markdown) {
  const lines = markdown.split(/\r?\n/);

  const categories = [];
  const types = [];
  const tools = [];
  const mechanisms = [];
  const themes = [];
  const resources = [];

  let section = null;
  let headerSeen = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("### カテゴリ")) {
      section = "categories";
      headerSeen = false;
      continue;
    }
    if (trimmed.startsWith("### 種類")) {
      section = "types";
      headerSeen = false;
      continue;
    }
    if (trimmed.startsWith("### 対象ツール")) {
      section = "tools";
      headerSeen = false;
      continue;
    }
    if (trimmed.startsWith("### 仕組み")) {
      section = "mechanisms";
      headerSeen = false;
      continue;
    }
    if (trimmed.startsWith("### テーマ")) {
      section = "themes";
      headerSeen = false;
      continue;
    }
    if (trimmed.startsWith("## リソース一覧")) {
      section = "resources";
      headerSeen = false;
      continue;
    }
    if (trimmed.startsWith("#")) {
      // 他の見出しに入ったらセクションを離脱する
      section = null;
      continue;
    }

    if (!section || !isTableRow(line)) {
      continue;
    }

    if (!headerSeen) {
      // このテーブルの最初のテーブル行はヘッダ行
      headerSeen = true;
      continue;
    }

    if (isSeparatorRow(line)) {
      continue;
    }

    const cells = parseRow(line);

    if (section === "categories") {
      const [name] = cells;
      if (name) categories.push(name);
    } else if (section === "types") {
      const [name] = cells;
      if (name) types.push(name);
    } else if (section === "tools") {
      const [name] = cells;
      if (name) tools.push(name);
    } else if (section === "mechanisms") {
      const [name] = cells;
      if (name) mechanisms.push(name);
    } else if (section === "themes") {
      const [name] = cells;
      if (name) themes.push(name);
    } else if (section === "resources") {
      const [title, url, description, memo, category, type, tool, mechanism, theme] =
        cells;
      if (title) {
        resources.push({
          title,
          url: url ?? "",
          description: description ?? "",
          memo: memo ?? "",
          category: category ?? "",
          type: type ?? "",
          tools: parseMultiValue(tool),
          mechanisms: parseMultiValue(mechanism),
          themes: parseMultiValue(theme),
        });
      }
    }
  }

  return { categories, types, tools, mechanisms, themes, resources };
}

function main() {
  const markdown = readFileSync(catalogPath, "utf-8");
  const { categories, types, tools, mechanisms, themes, resources } =
    parseCatalog(markdown);

  const vocab = { categories, types, tools, mechanisms, themes };

  const dataBlock = `const VOCAB = ${JSON.stringify(vocab, null, 2)};\n\nconst RESOURCES = ${JSON.stringify(resources, null, 2)};`;

  const html = readFileSync(indexPath, "utf-8");
  const startIdx = html.indexOf(START_MARKER);
  const endIdx = html.indexOf(END_MARKER);

  if (startIdx === -1 || endIdx === -1) {
    throw new Error(
      `index.html に ${START_MARKER} / ${END_MARKER} マーカーが見つかりません`,
    );
  }

  const before = html.slice(0, startIdx + START_MARKER.length);
  const after = html.slice(endIdx);
  const newHtml = `${before}\n${dataBlock}\n${after}`;

  writeFileSync(indexPath, newHtml, "utf-8");

  console.log(`build 完了: ${resources.length} 件のリソースを埋め込みました`);
}

main();

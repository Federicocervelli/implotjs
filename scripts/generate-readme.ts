import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";

const SRC = path.resolve("src/index.ts");
const OUT = path.resolve("README.md");

const program = ts.createProgram([SRC], {
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.ESNext,
});
const sourceFile = program.getSourceFile(SRC)!;

function nodeText(node: ts.Node): string {
  return node.getText(sourceFile);
}

function getJSDoc(node: ts.Node): string {
  const docs = ts.getJSDocCommentsAndTags(node);
  if (!docs.length) return "";
  return docs
    .map((d) => {
      if (ts.isJSDoc(d)) {
        return d.comment
          ? typeof d.comment === "string"
            ? d.comment
            : d.comment.map((c) => (ts.isJSDocText(c) ? c.text : "")).join("")
          : "";
      }
      return "";
    })
    .join("\n")
    .trim();
}

interface SymbolDoc {
  name: string;
  signature: string;
  docs: string;
}

const exportedConsts: SymbolDoc[] = [];
const exportedTypes: SymbolDoc[] = [];
let chartInterface: ts.InterfaceDeclaration | null = null;

function visit(node: ts.Node) {
  if (ts.isVariableStatement(node) && node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
    for (const decl of node.declarationList.declarations) {
      if (ts.isIdentifier(decl.name)) {
        exportedConsts.push({
          name: decl.name.text,
          signature: nodeText(node).replace(/export const /, "const "),
          docs: getJSDoc(node),
        });
      }
    }
  }
  if ((ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) && node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
    if (node.name.text === "ImPlotChart") {
      chartInterface = node;
    } else {
      exportedTypes.push({
        name: node.name.text,
        signature: nodeText(node).replace(/export (type|interface) /, "$1 "),
        docs: getJSDoc(node),
      });
    }
  }
  ts.forEachChild(node, visit);
}

visit(sourceFile);

// Compact enum listing: just name + first few keys
function compactEnum(items: SymbolDoc[]): string {
  return items
    .map((i) => {
      const keys = i.signature.match(/\{([^}]*)\}/s);
      const preview = keys ? keys[1].replace(/\s+/g, " ").trim().slice(0, 80) + (keys[1].length > 80 ? "…" : "") : "";
      return `- **${i.name}** — \`${preview}\``;
    })
    .join("\n");
}

// Group consts
const flagGroups: Record<string, string[]> = {
  "Plot & Axis": [
    "ImPlotFlags",
    "ImPlotAxisFlags",
    "ImPlotSubplotFlags",
    "ImPlotLegendFlags",
    "ImPlotMouseTextFlags",
    "ImPlotDragToolFlags",
    "ImPlotItemFlags",
  ],
  "Plot Types": [
    "ImPlotLineFlags",
    "ImPlotScatterFlags",
    "ImPlotBubblesFlags",
    "ImPlotPolygonFlags",
    "ImPlotStairsFlags",
    "ImPlotShadedFlags",
    "ImPlotBarsFlags",
    "ImPlotBarGroupsFlags",
    "ImPlotErrorBarsFlags",
    "ImPlotStemsFlags",
    "ImPlotInfLinesFlags",
    "ImPlotPieChartFlags",
    "ImPlotHeatmapFlags",
    "ImPlotHistogramFlags",
    "ImPlotDigitalFlags",
    "ImPlotImageFlags",
    "ImPlotTextFlags",
    "ImPlotDummyFlags",
  ],
  Style: ["ImPlotCond", "ImPlotScale", "ImPlotMarker", "ImPlotColormap", "ImPlotLocation", "ImPlotBin", "ImPlotCol", "ImPlotStyleVar", "ImPlotProp", "ImPlotTheme"],
  Other: ["ImAxis", "ImPlotColormapScaleFlags"],
};

const groupMap = new Map<string, string>();
for (const [group, names] of Object.entries(flagGroups)) {
  for (const n of names) groupMap.set(n, group);
}

const byGroup: Record<string, SymbolDoc[]> = {};
const misc: SymbolDoc[] = [];
for (const c of exportedConsts) {
  const g = groupMap.get(c.name);
  if (g) {
    byGroup[g] ??= [];
    byGroup[g].push(c);
  } else {
    misc.push(c);
  }
}
if (misc.length) byGroup["Other"] = misc;

const flagsMarkdown = Object.entries(byGroup)
  .filter(([, items]) => items.length)
  .map(([title, items]) => `#### ${title}\n\n${compactEnum(items)}`)
  .join("\n\n");

// Extract chart methods, skip properties
const chartMethods: SymbolDoc[] = [];
if (chartInterface) {
  for (const member of chartInterface.members) {
    if (ts.isMethodSignature(member) || ts.isCallSignatureDeclaration(member)) {
      const sig = nodeText(member).trim().replace(/;$/, "");
      const name = sig.split(/[\(:]/)[0].trim();
      chartMethods.push({ name, signature: sig, docs: getJSDoc(member) });
    }
  }
}

const groups: Record<string, string[]> = {
  Lifecycle: ["mount", "start", "stop", "destroy", "clear", "reset", "resize", "requestRender", "render"],
  "Plot Containers": ["beginPlot", "endPlot", "beginLegendPopup", "endLegendPopup", "beginAlignedPlots", "endAlignedPlots", "beginSubplots", "endSubplots"],
  Setup: ["setupAxis", "setupAxisLimits", "setupAxisFormat", "setupAxisTicks", "setupAxisScale", "setupAxisLimitsConstraints", "setupAxisZoomConstraints", "setupAxisLinks", "setupAxes", "setupAxesLimits", "setupLegend", "setupMouseText", "setupFinish"],
  "Next Frame": ["setNextAxisLimits", "setNextAxisToFit", "setNextAxisLinks", "setNextAxesLimits", "setNextAxesToFit"],
  Plotting: ["plotLine", "plotScatter", "plotBubbles", "plotPolygon", "plotLineG", "plotScatterG", "plotStairsG", "plotBarsG", "plotDigitalG", "plotStairs", "plotShaded", "plotBars", "plotBarGroups", "plotErrorBars", "plotStems", "plotInfLines", "plotPieChart", "plotHeatmap", "plotHistogram", "plotHistogram2D", "plotDigital", "plotImage", "plotText", "plotDummy"],
  Interaction: ["dragPoint", "dragLineX", "dragLineY", "dragRect", "annotation", "tagX", "tagY"],
  "Plot State": ["setAxis", "setAxes", "hideNextItem", "cancelPlotSelection"],
  Style: ["pushStyleColor", "popStyleColor", "pushStyleVar", "popStyleVar", "setNextLineStyle", "setNextFillStyle", "setNextMarkerStyle", "setNextErrorBarStyle", "getLastItemColor", "getStyleColorName", "getMarkerName", "nextMarker", "getNextMarker", "getStyle"],
  Debug: ["showStyleEditor", "showStyleSelector", "showColormapSelector", "showInputMapSelector", "showUserGuide", "showMetricsWindow"],
  Colormap: ["addColormap", "getColormapCount", "getColormapName", "getColormapIndex", "getColormapSize", "getColormapColor", "nextColormapColor", "getNextColormapColor", "bustColorCache", "pushColormap", "popColormap", "sampleColormap", "colormapScale", "colormapSlider", "colormapButton"],
  Input: ["mapInputDefault", "mapInputReverse"],
  Query: ["getPlotState", "getPlotMousePos", "getPlotLimits", "isPlotHovered", "isAxisHovered", "isLegendEntryHovered", "isSubplotsHovered", "pushPlotClipRect", "popPlotClipRect", "isPlotSelected", "getPlotSelection", "pixelsToPlot", "plotToPixels"],
};

const itemsByName = new Map(chartMethods.map((m) => [m.name, m]));
const used = new Set<string>();
let chartTables = "";

for (const [title, names] of Object.entries(groups)) {
  const items: SymbolDoc[] = [];
  for (const n of names) {
    const item = itemsByName.get(n);
    if (item) {
      items.push(item);
      used.add(n);
    }
  }
  if (!items.length) continue;
  const rows = items.map((i) => `| \`${i.signature}\` | ${i.docs.replace(/\n/g, " ")} |`).join("\n");
  chartTables += `### ${title}\n\n| Signature | Description |\n|---|---|\n${rows}\n\n`;
}

const missed = chartMethods.filter((m) => !used.has(m.name));
if (missed.length) {
  const rows = missed.map((i) => `| \`${i.signature}\` | ${i.docs.replace(/\n/g, " ")} |`).join("\n");
  chartTables += `### Other\n\n| Signature | Description |\n|---|---|\n${rows}\n\n`;
}

const typesMd = exportedTypes
  .map((t) => `**${t.name}**\n\n\`\`\`ts\n${t.signature}\n\`\`\``)
  .join("\n\n");

const readme = `# implotjs

[![npm version](https://img.shields.io/npm/v/implotjs.svg)](https://www.npmjs.com/package/implotjs)
[![license](https://img.shields.io/npm/l/implotjs.svg)](https://github.com/Federicocervelli/implotjs/blob/master/LICENSE)

Managed-canvas JavaScript/TypeScript wrapper around Dear ImGui + [ImPlot](https://github.com/epezent/implot), compiled to WebAssembly.

Each \`ImPlotChart\` owns its own canvas-backed runtime. The API is chart-oriented and mirrors ImPlot naming, but does not expose raw ImGui objects or the Emscripten module.

## Installation

\`\`\`bash
npm install implotjs
# or
bun add implotjs
\`\`\`

## Quick start

\`\`\`html
<canvas id="app" width="1280" height="720"></canvas>
\`\`\`

\`\`\`js
import { ImPlotChart, ImPlotLocation, ImPlotCol } from "implotjs";

const chart = new ImPlotChart({
  canvas: document.querySelector("#app"),
  width: 1280,
  height: 720,
});

await chart.mount();

const xs = Float64Array.from({ length: 200 }, (_, i) => i / 20);
const sin = Float64Array.from(xs, (x) => Math.sin(x));

chart
  .pushStyleColor(ImPlotCol.PlotBg, [0, 0, 0, 0])
  .beginPlot("Sine wave")
  .setupAxes("x", "y")
  .setupLegend(ImPlotLocation.NorthEast)
  .plotLine("sin(x)", xs, sin)
  .endPlot()
  .popStyleColor();

await chart.start();
\`\`\`

The canvas is transparent by default. Control the page background with CSS and use \`pushStyleColor(ImPlotCol.PlotBg, [0, 0, 0, 0])\` for a transparent plot background.

## API Reference

> Auto-generated from \`src/index.ts\`. Run \`bun run generate:readme\` to refresh.

### \`ImPlotChart\`

\`\`\`ts
class ImPlotChart {
  constructor(options?: ImPlotChartOptions);
}
\`\`\`

${chartTables}
### Types

${typesMd}

### Constants

${flagsMarkdown}

---

## Build from source

Prerequisites: Bun, CMake 3.20+, Python 3, Emscripten.

\`\`\`bash
bun install
bun run build
\`\`\`

Build artifacts are written to \`dist/\`:

- \`dist/index.js\` — ES module entrypoint
- \`dist/index.d.ts\` — TypeScript declarations
- \`dist/implotjs.js\` — Emscripten JS loader
- \`dist/implotjs.wasm\` — WASM runtime (~1.1 MB)

## Development

\`\`\`bash
bun run start           # serve repo root on :8000
bun run package:test    # pack → install into test/ → smoke test
bun run start:test      # same + serve test app on :8001
\`\`\`

## Third-Party Notices

This repository includes the following upstream projects as git submodules:

- **Dear ImGui** — <https://github.com/ocornut/imgui> (MIT)
- **ImPlot** — <https://github.com/epezent/implot> (MIT)

The original license texts are preserved in \`vendor/imgui/LICENSE.txt\` and \`vendor/implot/LICENSE\`.
`;

fs.writeFileSync(OUT, readme, "utf-8");
console.log(`README.md generated (${Math.round(fs.statSync(OUT).size / 1024)} KB, ${readme.split("\n").length} lines)`);

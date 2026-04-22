# implotjs

`implotjs` is a managed-canvas JavaScript/TypeScript wrapper around a hidden Dear ImGui + [ImPlot](https://github.com/epezent/implot) WASM runtime.

The public API is chart-oriented and near ImPlot naming, but it does not expose ImGui objects or the raw Emscripten module. Each `ImPlotChart` owns its own canvas-backed runtime.

## Current API shape

```js
import {
  ImPlotChart,
  ImPlotFlags,
  ImPlotLocation,
  ImPlotLegendFlags,
  ImPlotCol,
} from "implotjs";

const chart = new ImPlotChart({
  canvas: document.querySelector("#app"),
  width: 1280,
  height: 720,
  autoStart: false,
});

await chart.mount();

chart
  .pushStyleColor(ImPlotCol.PlotBg, [0, 0, 0, 0])
  .beginPlot("Signals")
  .setupAxes("t", "value")
  .setupLegend(ImPlotLocation.NorthEast, ImPlotLegendFlags.None)
  .plotLine("sin", Float64Array.from([0, 0.5, 0.8, 1.0]))
  .plotScatter("samples", [0, 1, 2, 3], [0, 0.5, 0.8, 1.0])
  .endPlot()
  .popStyleColor();

await chart.start();
```

The canvas is transparent by default, so you can control the page background with plain CSS and use `pushStyleColor(ImPlotCol.PlotBg, [0, 0, 0, 0])` to make the plot background transparent as well.

## Supported features

- All standard plot types: `plotLine`, `plotScatter`, `plotStairs`, `plotShaded`, `plotBars`, `plotBarGroups`, `plotErrorBars`, `plotStem`, `plotInfLines`, `plotPieChart`, `plotHeatmap`, `plotHistogram`, `plotDigital`, `plotImage`, `plotText`, `plotDummy`, `plotBubbles`, `plotPolygon`
- Getter variants: `plotLineG`, `plotScatterG`, `plotStairsG`, `plotBarsG`, `plotDigitalG` (JS callback → C++)
- Axes & setup: `setupAxes`, `setupAxis`, `setupAxisLimits`, `setupAxisTicks`, `setupAxisLinks`, `setupAxisScale` (with custom transform callbacks), `setupAxisFormat` (with custom formatter callbacks), `setupLegend`, `setupMouseText`, `setupFinish`
- Next-frame helpers: `setNextAxisLimits`, `setNextAxisLinks`, `setNextLineStyle`, `setNextFillStyle`, `setNextMarkerStyle`, `setNextErrorBarStyle`
- Subplots: `beginSubplots` / `endSubplots`
- Aligned plots: `beginAlignedPlots` / `endAlignedPlots`
- Plot interaction: `isPlotHovered`, `isPlotSelected`, `isSubplotsHovered`, `getPlotMousePos`, `getPlotLimits`, `getPlotSelection`, `cancelPlotSelection`, `hideNextItem`, `getLastItemColor`, `getLastItemID`
- Legend interaction: `beginLegendPopup` / `endLegendPopup`, `isLegendEntryHovered`
- Annotations & tags: `plotAnnotation`, `plotTag`
- Drag points & lines: `dragPointX`, `dragPointXY`, `dragLineX`, `dragLineY`
- Colormaps: `colormapScale`, `pushColormap` / `popColormap`, `getColormapIndex`, `getColormapSize`, `getColormapColor`, `nextColormapColor`, `bustColorCache`
- Style: `pushStyleColor` / `popStyleColor`, `pushStyleVar` / `popStyleVar`, `getStyleColor`, `getStyleColorU32`, `getStyle`, `getStyleColorName`, `getMarkerName`, `nextMarker`
- Custom rendering: `pushPlotClipRect` / `popPlotClipRect`
- Debug windows: `showStyleEditor`, `showStyleSelector`, `showColormapSelector`, `showInputMapSelector`, `showUserGuide`, `showMetricsWindow`

## Prerequisites

- Bun
- CMake 3.20+
- Python 3
- Emscripten

If `emcmake` is not already on your `PATH`, the build script also checks `${EMSDK}/emsdk_env.sh` and `~/emsdk/emsdk_env.sh`.

## Build

```bash
bun run build
```

The generated artifacts are written to `dist/`:

- `dist/index.js`
- `dist/index.d.ts`
- `dist/implotjs.js`
- `dist/implotjs.wasm`

## Run the example

Start a local static server from the repo root:

```bash
bun run start
```

Then open:

```text
http://localhost:8000/examples/basic.html
```

## Test the packaged tarball

Generate the real package tarball, install it into the `test/` consumer app, and run a smoke check against the installed package:

```bash
bun run package:test
```

This writes the tarball to `test/.packages/implotjs.tgz`, installs it through `test/package.json`, and verifies the packaged entrypoint and runtime assets from `test/node_modules/implotjs`.

To manually inspect the browser-side test app after that:

```bash
bun run start:test
```

`start:test` refreshes the packaged tarball and reinstalls the `test/` consumer app before starting the HTTP server, so it always serves the latest packaged build.

Then open:

```text
http://localhost:8001/index.html
```

## Notes

- `dist/` contains the publishable runtime assets. `build/` is only the disposable compiler workspace.
- `vendor/imgui` and `vendor/implot` are git submodules that track the upstream projects used to build the WASM runtime.
- `prepack` rebuilds the runtime, so packed/published artifacts always include the current JS/TS entrypoints and WASM payloads.
- `ImDrawIdx` is configured as `unsigned int`, matching ImPlot's recommended high-density rendering setup.
- `src/index.ts` is the single source of truth for the wrapper API; `dist/index.js` and `dist/index.d.ts` are generated from it during build.

## Third-Party Notices

This repository includes the following upstream projects as git submodules:

- **Dear ImGui** — <https://github.com/ocornut/imgui> (MIT)
- **ImPlot** — <https://github.com/epezent/implot> (MIT)

The original license texts are preserved in `vendor/imgui/LICENSE.txt` and `vendor/implot/LICENSE`.

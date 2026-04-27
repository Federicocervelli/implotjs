# implotjs

[![npm version](https://img.shields.io/npm/v/implotjs.svg)](https://www.npmjs.com/package/implotjs)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/Federicocervelli/implotjs/blob/master/LICENSE)

Managed-canvas JavaScript/TypeScript wrapper around Dear ImGui + [ImPlot](https://github.com/epezent/implot), compiled to WebAssembly.

Each `ImPlotChart` owns its own canvas-backed runtime. The API is chart-oriented and mirrors ImPlot naming, but does not expose raw ImGui objects or the Emscripten module.

## Installation

```bash
npm install implotjs
# or
bun add implotjs
```

## Quick start

```html
<canvas id="app" width="1280" height="720"></canvas>
```

```js
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
```

The canvas is transparent by default. Control the page background with CSS and use `pushStyleColor(ImPlotCol.PlotBg, [0, 0, 0, 0])` for a transparent plot background.

## API Reference

> Auto-generated from `src/index.ts`. Run `bun run generate:readme` to refresh.

### `ImPlotChart`

```ts
class ImPlotChart {
  constructor(options?: ImPlotChartOptions);
}
```

### Lifecycle

| Signature | Description |
|---|---|
| `mount(): Promise<this>` |  |
| `start(): Promise<this>` |  |
| `stop(): this` |  |
| `destroy(): this` |  |
| `clear(): this` |  |
| `reset(): this` |  |
| `resize(width: number, height: number): this` |  |
| `requestRender(): this` |  |
| `render(): Promise<this>` |  |

### Plot Containers

| Signature | Description |
|---|---|
| `beginPlot(title: string, size?: Vec2, flags?: number): this` |  |
| `endPlot(): this` |  |
| `beginLegendPopup(label: string, mouseButton?: number): this` |  |
| `endLegendPopup(): this` |  |
| `beginAlignedPlots(groupId: string, vertical?: boolean): this` |  |
| `endAlignedPlots(): this` |  |
| `beginSubplots(title: string, rows: number, cols: number, size: Vec2, flags?: number): this` |  |
| `endSubplots(): this` |  |

### Setup

| Signature | Description |
|---|---|
| `setupAxis(axis: number, label?: string | null, flags?: number): this` |  |
| `setupAxisLimits(axis: number, min: number, max: number, cond?: number): this` |  |
| `setupAxisFormat(axis: number, formatter: (value: number) => string): this` |  |
| `setupAxisTicks(axis: number, min: number, max: number, count: number, keepDefault?: boolean): this` |  |
| `setupAxisScale(axis: number, forward: (value: number) => number, inverse: (value: number) => number): this` |  |
| `setupAxisLimitsConstraints(axis: number, min: number, max: number): this` |  |
| `setupAxisZoomConstraints(axis: number, min: number, max: number): this` |  |
| `setupAxisLinks(axis: number, min: number, max: number): this` |  |
| `setupAxes(xLabel: string | null, yLabel: string | null, xFlags?: number, yFlags?: number): this` |  |
| `setupAxesLimits(xMin: number, xMax: number, yMin: number, yMax: number, cond?: number): this` |  |
| `setupLegend(location: number, flags?: number): this` |  |
| `setupMouseText(location: number, flags?: number): this` |  |
| `setupFinish(): this` |  |

### Next Frame

| Signature | Description |
|---|---|
| `setNextAxisLimits(axis: number, min: number, max: number, cond?: number): this` |  |
| `setNextAxisToFit(axis: number): this` |  |
| `setNextAxisLinks(axis: number, min: number, max: number): this` |  |
| `setNextAxesLimits(xMin: number, xMax: number, yMin: number, yMax: number, cond?: number): this` |  |
| `setNextAxesToFit(): this` |  |

### Plotting

| Signature | Description |
|---|---|
| `plotLine(label: string, xs: NumericArray, ys: NumericArray, flags?: number): this` |  |
| `plotScatter(label: string, xs: NumericArray, ys: NumericArray, flags?: number): this` |  |
| `plotBubbles(label: string, xs: NumericArray, ys: NumericArray, szs: NumericArray, flags?: number): this` |  |
| `plotPolygon(label: string, xs: NumericArray, ys: NumericArray, flags?: number): this` |  |
| `plotLineG(label: string, getter: (idx: number) => PlotPoint, count: number, flags?: number): this` |  |
| `plotScatterG(label: string, getter: (idx: number) => PlotPoint, count: number, flags?: number): this` |  |
| `plotStairsG(label: string, getter: (idx: number) => PlotPoint, count: number, flags?: number): this` |  |
| `plotBarsG(label: string, getter: (idx: number) => PlotPoint, count: number, barSize: number, flags?: number): this` |  |
| `plotDigitalG(label: string, getter: (idx: number) => PlotPoint, count: number, flags?: number): this` |  |
| `plotStairs(label: string, xs: NumericArray, ys: NumericArray, flags?: number): this` |  |
| `plotShaded(label: string, xs: NumericArray, ys1: NumericArray, ys2: NumericArray, flags?: number): this` |  |
| `plotBars(label: string, xs: NumericArray, ys: NumericArray, barSize: number, flags?: number): this` |  |
| `plotBarGroups(labels: string[], valuesMatrix: NumericArray | number[][], groupSize?: number, shift?: number, flags?: number): this` |  |
| `plotErrorBars(label: string, xs: NumericArray, ys: NumericArray, neg: NumericArray, pos: NumericArray, flags?: number): this` |  |
| `plotStems(label: string, xs: NumericArray, ys: NumericArray, ref?: number, flags?: number): this` |  |
| `plotInfLines(label: string, values: NumericArray, flags?: number): this` |  |
| `plotPieChart(labels: string[], values: NumericArray, x: number, y: number, radius: number, labelFormat?: string, angle0?: number, flags?: number): this` |  |
| `plotHeatmap(label: string, values: NumericArray, rows: number, cols: number, scaleMin?: number, scaleMax?: number, labelFormat?: string, bounds?: Bounds, flags?: number): this` |  |
| `plotHistogram(label: string, values: NumericArray, bins?: number, barScale?: number, range?: { min: number; max: number } | null, flags?: number): this` |  |
| `plotHistogram2D(label: string, xs: NumericArray, ys: NumericArray, xBins?: number, yBins?: number, range?: PlotRect | null, flags?: number): this` |  |
| `plotDigital(label: string, xs: NumericArray, ys: NumericArray, flags?: number): this` |  |
| `plotImage(label: string, textureId: number, bounds: Bounds, uv0?: Vec2, uv1?: Vec2, tintColor?: Color, flags?: number): this` |  |
| `plotText(text: string, x: number, y: number, pixelOffset?: Vec2, flags?: number): this` |  |
| `plotDummy(label: string, flags?: number): this` |  |

### Interaction

| Signature | Description |
|---|---|
| `dragPoint(id: number, point: DragPointState, color?: Color, size?: number, flags?: number): this` |  |
| `dragLineX(id: number, state: ScalarState, color?: Color, thickness?: number, flags?: number): this` |  |
| `dragLineY(id: number, state: ScalarState, color?: Color, thickness?: number, flags?: number): this` |  |
| `dragRect(id: number, rect: DragRectState, color?: Color, flags?: number): this` |  |
| `annotation(x: number, y: number, text: string, color?: Color, pixelOffset?: Vec2, clamp?: boolean): this` |  |
| `tagX(x: number, text: string, color?: Color): this` |  |
| `tagY(y: number, text: string, color?: Color): this` |  |

### Plot State

| Signature | Description |
|---|---|
| `setAxis(axis: number): this` |  |
| `setAxes(xAxis: number, yAxis: number): this` |  |
| `hideNextItem(hidden?: boolean, cond?: number): this` |  |
| `cancelPlotSelection(): this` |  |

### Style

| Signature | Description |
|---|---|
| `pushStyleColor(idx: number, color: Color): this` |  |
| `popStyleColor(count?: number): this` |  |
| `pushStyleVar(idx: number, value: number | Vec2): this` |  |
| `popStyleVar(count?: number): this` |  |
| `setNextLineStyle(color?: Color, weight?: number): this` |  |
| `setNextFillStyle(color?: Color, alpha?: number): this` |  |
| `setNextMarkerStyle(marker?: number, size?: number, fill?: Color, weight?: number, outline?: Color): this` |  |
| `setNextErrorBarStyle(color?: Color, size?: number, weight?: number): this` |  |
| `getLastItemColor(): number[]` |  |
| `getStyleColorName(idx: number): string | null` |  |
| `getMarkerName(idx: number): string | null` |  |
| `nextMarker(): this` |  |
| `getNextMarker(): number | null` |  |
| `getStyle(): ImPlotStyleSnapshot` |  |

### Debug

| Signature | Description |
|---|---|
| `showStyleEditor(): this` |  |
| `showStyleSelector(label: string): this` |  |
| `showColormapSelector(label: string): this` |  |
| `showInputMapSelector(label: string): this` |  |
| `showUserGuide(): this` |  |
| `showMetricsWindow(): this` |  |

### Colormap

| Signature | Description |
|---|---|
| `addColormap(name: string, colors: Color[], qualitative?: boolean): number` |  |
| `getColormapCount(): number` |  |
| `getColormapName(cmap: number): string | null` |  |
| `getColormapIndex(name: string): number` |  |
| `getColormapSize(cmap?: number): number` |  |
| `getColormapColor(idx: number, cmap?: number): number[]` |  |
| `nextColormapColor(): this` |  |
| `getNextColormapColor(): number[] | null` |  |
| `bustColorCache(title?: string | null): this` |  |
| `pushColormap(cmap: number | string): this` |  |
| `popColormap(count?: number): this` |  |
| `sampleColormap(t: number, cmap?: number): number[]` |  |
| `colormapScale(label: string, min: number, max: number, size?: Vec2, format?: string, flags?: number, cmap?: number): this` |  |
| `colormapSlider(label: string, state: ColormapSliderState, format?: string, cmap?: number): this` |  |
| `colormapButton(label: string, size?: Vec2, cmap?: number): this` |  |

### Input

| Signature | Description |
|---|---|
| `mapInputDefault(): this` |  |
| `mapInputReverse(): this` |  |

### Query

| Signature | Description |
|---|---|
| `getPlotState(title?: string | null): CapturedPlotState | null` |  |
| `getPlotMousePos(title?: string | null): PlotPoint | null` |  |
| `getPlotLimits(title?: string | null): PlotRect | null` |  |
| `isPlotHovered(title?: string | null): boolean` |  |
| `isAxisHovered(axis: number, title?: string | null): boolean` |  |
| `isLegendEntryHovered(label: string): boolean` |  |
| `isSubplotsHovered(): boolean` |  |
| `pushPlotClipRect(expand?: number): this` |  |
| `popPlotClipRect(): this` |  |
| `isPlotSelected(title?: string | null): boolean` |  |
| `getPlotSelection(title?: string | null): PlotRect | null` |  |
| `pixelsToPlot(pixel: Vec2 | PlotPoint, title?: string | null, xAxis?: number, yAxis?: number): PlotPoint | null` |  |
| `plotToPixels(point: Vec2 | PlotPoint, title?: string | null, xAxis?: number, yAxis?: number): PlotPoint | null` |  |


### Types

**NumericArray**

```ts
type NumericArray =
  | number[]
  | Float32Array
  | Float64Array
  | Int8Array
  | Uint8Array
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array;
```

**Color**

```ts
type Color = [number, number, number, number];
```

**Vec2**

```ts
type Vec2 = [number, number];
```

**PlotPoint**

```ts
interface PlotPoint {
  x: number;
  y: number;
}
```

**PlotRect**

```ts
interface PlotRect {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}
```

**Bounds**

```ts
interface Bounds {
  min: Vec2 | PlotPoint;
  max: Vec2 | PlotPoint;
}
```

**DragPointState**

```ts
interface DragPointState extends PlotPoint {}
```

**ScalarState**

```ts
interface ScalarState {
  value: number;
}
```

**DragRectState**

```ts
interface DragRectState {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
```

**ColormapSliderState**

```ts
interface ColormapSliderState {
  t: number;
  changed?: boolean;
  color?: number[];
}
```

**ImPlotStyleSnapshot**

```ts
interface ImPlotStyleSnapshot {
  plotDefaultSize: Vec2;
  plotMinSize: Vec2;
  plotBorderSize: number;
  minorAlpha: number;
  majorTickLen: Vec2;
  minorTickLen: Vec2;
  majorTickSize: Vec2;
  minorTickSize: Vec2;
  majorGridSize: Vec2;
  minorGridSize: Vec2;
  plotPadding: Vec2;
  labelPadding: Vec2;
  legendPadding: Vec2;
  legendInnerPadding: Vec2;
  legendSpacing: Vec2;
  mousePosPadding: Vec2;
  annotationPadding: Vec2;
  fitPadding: Vec2;
  digitalPadding: number;
  digitalSpacing: number;
  colors: Color[];
  colormap: number;
  useLocalTime: boolean;
  useISO8601: boolean;
  use24HourClock: boolean;
}
```

**ImPlotChartOptions**

```ts
interface ImPlotChartOptions {
  canvas?: HTMLCanvasElement;
  width?: number;
  height?: number;
  title?: string;
  flags?: number;
  theme?: number;
  autoStart?: boolean;
  locateFile?: (path: string, prefix?: string) => string;
  moduleOverrides?: Record<string, unknown>;
}
```

**CapturedPlotState**

```ts
interface CapturedPlotState {
  title: string;
  pos: number[];
  size: number[];
  mousePos: PlotPoint;
  limits: PlotRect;
  hovered: boolean;
  selected: boolean;
  selection: PlotRect;
  axisHovered: Record<number, boolean>;
  axisScales: Record<number, number>;
}
```

### Constants

#### Other

- **ImAxis** — `X1: 0, X2: 1, X3: 2, Y1: 3, Y2: 4, Y3: 5, COUNT: 6,`
- **ImPlotColormapScaleFlags** — `None: 0, NoLabel: 1 << 0, Opposite: 1 << 1, Invert: 1 << 2,`

#### Plot & Axis

- **ImPlotFlags** — `None: 0, NoTitle: 1 << 0, NoLegend: 1 << 1, NoMouseText: 1 << 2, NoInputs: 1 << …`
- **ImPlotAxisFlags** — `None: 0, NoLabel: 1 << 0, NoGridLines: 1 << 1, NoTickMarks: 1 << 2, NoTickLabels…`
- **ImPlotSubplotFlags** — `None: 0, NoTitle: 1 << 0, NoLegend: 1 << 1, NoMenus: 1 << 2, NoResize: 1 << 3, N…`
- **ImPlotLegendFlags** — `None: 0, NoButtons: 1 << 0, NoHighlightItem: 1 << 1, NoHighlightAxis: 1 << 2, No…`
- **ImPlotMouseTextFlags** — `None: 0, NoAuxAxes: 1 << 0, NoFormat: 1 << 1, ShowAlways: 1 << 2,`
- **ImPlotDragToolFlags** — `None: 0, NoCursors: 1 << 0, NoFit: 1 << 1, NoInputs: 1 << 2, Delayed: 1 << 3,…`
- **ImPlotItemFlags** — `None: 0, NoLegend: 1 << 0, NoFit: 1 << 1,`

#### Plot Types

- **ImPlotLineFlags** — `None: 0, Segments: 1 << 10, Loop: 1 << 11, SkipNaN: 1 << 12, NoClip: 1 << 13, Sh…`
- **ImPlotScatterFlags** — `None: 0, NoClip: 1 << 10`
- **ImPlotBubblesFlags** — `None: 0`
- **ImPlotPolygonFlags** — `None: 0, Concave: 1 << 10`
- **ImPlotStairsFlags** — `None: 0, PreStep: 1 << 10, Shaded: 1 << 11`
- **ImPlotShadedFlags** — `None: 0`
- **ImPlotBarsFlags** — `None: 0, Horizontal: 1 << 10`
- **ImPlotBarGroupsFlags** — `None: 0, Horizontal: 1 << 10, Stacked: 1 << 11`
- **ImPlotErrorBarsFlags** — `None: 0, Horizontal: 1 << 10`
- **ImPlotStemsFlags** — `None: 0, Horizontal: 1 << 10`
- **ImPlotInfLinesFlags** — `None: 0, Horizontal: 1 << 10`
- **ImPlotPieChartFlags** — `None: 0, Normalize: 1 << 10, IgnoreHidden: 1 << 11, Exploding: 1 << 12, NoSliceB…`
- **ImPlotHeatmapFlags** — `None: 0, ColMajor: 1 << 10`
- **ImPlotHistogramFlags** — `None: 0, Horizontal: 1 << 10, Cumulative: 1 << 11, Density: 1 << 12, NoOutliers:…`
- **ImPlotDigitalFlags** — `None: 0`
- **ImPlotImageFlags** — `None: 0`
- **ImPlotTextFlags** — `None: 0, Vertical: 1 << 10`
- **ImPlotDummyFlags** — `None: 0`

#### Style

- **ImPlotCond** — `None: 0, Always: 1, Once: 2`
- **ImPlotScale** — `Linear: 0, Time: 1, Log10: 2, SymLog: 3,`
- **ImPlotMarker** — `None: -2, Auto: -1, Circle: 0, Square: 1, Diamond: 2, Up: 3, Down: 4, Left: 5, R…`
- **ImPlotColormap** — `Deep: 0, Dark: 1, Pastel: 2, Paired: 3, Viridis: 4, Plasma: 5, Hot: 6, Cool: 7, …`
- **ImPlotLocation** — `Center: 0, North: 1 << 0, South: 1 << 1, West: 1 << 2, East: 1 << 3, NorthWest: …`
- **ImPlotBin** — `Sqrt: -1, Sturges: -2, Rice: -3, Scott: -4,`
- **ImPlotCol** — `FrameBg: 0, PlotBg: 1, PlotBorder: 2, LegendBg: 3, LegendBorder: 4, LegendText: …`
- **ImPlotStyleVar** — `PlotDefaultSize: 0, PlotMinSize: 1, PlotBorderSize: 2, MinorAlpha: 3, MajorTickL…`
- **ImPlotProp** — `LineColor: 0, LineColors: 1, LineWeight: 2, FillColor: 3, FillColors: 4, FillAlp…`
- **ImPlotTheme** — `Auto: 0, Classic: 1, Dark: 2, Light: 3,`

---

## Build from source

Prerequisites: Bun, CMake 3.20+, Python 3, Emscripten.

```bash
bun install
bun run build
```

Build artifacts are written to `dist/`:

- `dist/index.js` — ES module entrypoint
- `dist/index.d.ts` — TypeScript declarations
- `dist/implotjs.js` — Emscripten JS loader
- `dist/implotjs.wasm` — WASM runtime (~1.1 MB)

## Development

```bash
bun run start           # serve repo root on :8000
bun run package:test    # pack → install into test/ → smoke test
bun run start:test      # same + serve test app on :8001
```

## Third-Party Notices

This repository includes the following upstream projects as git submodules:

- **Dear ImGui** — <https://github.com/ocornut/imgui> (MIT)
- **ImPlot** — <https://github.com/epezent/implot> (MIT)

The original license texts are preserved in `vendor/imgui/LICENSE.txt` and `vendor/implot/LICENSE`.

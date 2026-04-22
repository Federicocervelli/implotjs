# ImPlotJS Wrapper Discrepancies

This document tracks gaps between the vendored **ImPlot v1.0** API and the JavaScript/TypeScript wrapper (`src/index.ts` + `src/native/main.cpp`).

## In Scope (Fixable within the managed-canvas abstraction)

### 1. Enum Constants

| Enum | Issue | Current Value | Expected Value |
|------|-------|---------------|----------------|
| `ImPlotMarker.None` | Off-by-one | `-1` | `-2` |
| `ImPlotMarker.Circle` | Off-by-one (no `Auto` entry) | `0` | should start after `Auto: -1` |
| `ImPlotLegendFlags.Reverse` | Missing | — | `1 << 7` |
| `ImPlotPieChartFlags.NoSliceBorder` | Missing | — | `1 << 13` |
| `ImPlotCol` | Not exported | — | `0` through `ImPlotCol_COUNT-1` |
| `ImPlotStyleVar` | Not exported | — | `0` through `ImPlotStyleVar_COUNT-1` |
| `ImPlotProp` | Not exported | — | `0` through `ImPlotProp_Flags` |

### 2. Missing Plot Types

| Function | Overloads | Notes |
|----------|-----------|-------|
| `PlotBubbles` | `values+szs` and `xs+ys+szs` | New in v1.0 |
| `PlotPolygon` | `xs+ys` | New in v1.0 |

### 3. Setup / Axes

| Function | Issue |
|----------|-------|
| `SetupAxisTicks(values, labels)` | JS accepts label strings but the C++ binding ignores them; only the value-based overload is wired. |
| `SetupAxisLinks` | Missing entirely. |
| `SetNextAxisLinks` | Missing entirely. |

### 4. Legend Interaction

| Function | Status |
|----------|--------|
| `BeginLegendPopup` | Missing |
| `EndLegendPopup` | Missing |
| `IsLegendEntryHovered` | Missing |

### 5. Plot Utils

| Function | Status |
|----------|--------|
| `IsSubplotsHovered` | Missing |

### 6. Style & Colormap Helpers

| Function | Status |
|----------|--------|
| `GetStyleColorName` | Missing |
| `GetMarkerName` | Missing |
| `NextMarker` | Missing |
| `GetColormapIndex` | Missing |
| `GetColormapSize` | Missing |
| `GetColormapColor` | Missing |
| `NextColormapColor` | Missing |
| `BustColorCache` | Missing |
| `GetStyle` (basic read access) | Missing |

## Out of Scope (Requires JS↔C++ callbacks or breaks the managed-canvas model)

### Getter-Based Plots (`Plot*G`)

`PlotLineG`, `PlotScatterG`, `PlotStairsG`, `PlotShadedG`, `PlotBarsG`, and `PlotDigitalG` require an `ImPlotGetter` callback invoked from C++ for every data point. Synchronous JS callbacks from WASM are not practical in this architecture.

### Custom Axis Transforms

`SetupAxisScale(axis, forward, inverse)` requires C++→JS callbacks for every tick. Out of scope for the same reason as getter plots.

### Custom Axis Formatters

`SetupAxisFormat(axis, formatter)` requires an `ImPlotFormatter` callback. Out of scope.

### Drag & Drop

`BeginDragDropTargetPlot`, `BeginDragDropSourcePlot`, etc. involve ImGui payload types and complex lifetime management that does not map cleanly to a JS wrapper.

### Custom Plot Rendering

`GetPlotDrawList`, `PushPlotClipRect`, `PopPlotClipRect` expose raw ImGui draw-list access. This breaks the managed-canvas abstraction and is not wrapped.

### Aligned Plots

`BeginAlignedPlots` / `EndAlignedPlots` are lower-level alignment helpers. They can be revisited if there is user demand.

### Debug / Editor Windows

`ShowDemoWindow`, `ShowStyleEditor`, `ShowStyleSelector`, `ShowColormapSelector`, `ShowInputMapSelector`, `ShowUserGuide`, and `ShowMetricsWindow` are debug/editor utilities, not part of the core plotting API surface.

## Notes

- The old `SetNextLineStyle`, `SetNextFillStyle`, `SetNextMarkerStyle`, and `SetNextErrorBarStyle` helpers were obsoleted in ImPlot v1.0 in favor of `ImPlotSpec`. The wrapper currently emulates them in C++ via a global `PendingPlotStyle`. Full `ImPlotSpec` exposure (per-vertex colors, `Offset`, `Stride`, etc.) is not yet implemented and is tracked separately.

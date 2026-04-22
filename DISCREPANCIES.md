# ImPlotJS Wrapper Discrepancies

This document tracks gaps between the vendored **ImPlot v1.0** API and the JavaScript/TypeScript wrapper (`src/index.ts` + `src/native/main.cpp`).

## In Scope (Fixable within the managed-canvas abstraction)

All in-scope items have been resolved. See commit history for details.

### 1. Enum Constants ✅

| Enum | Issue | Fix |
|------|-------|-----|
| `ImPlotMarker.None` | Off-by-one (`-1`) | Corrected to `-2`; added `Auto: -1` |
| `ImPlotLegendFlags.Reverse` | Missing | Added `1 << 7` |
| `ImPlotPieChartFlags.NoSliceBorder` | Missing | Added `1 << 13` |
| `ImPlotCol` | Not exported | Full enum exported |
| `ImPlotStyleVar` | Not exported | Full enum exported |
| `ImPlotProp` | Not exported | Full enum exported |

### 2. Missing Plot Types ✅

- `PlotBubbles` (`plotBubbles(values, szs)` and `plotBubbles(xs, ys, szs)`)
- `PlotPolygon` (`plotPolygon(xs, ys)`)

### 3. Setup / Axes ✅

- `SetupAxisTicks(values, labels)` — labels are now passed through to C++.
- `SetupAxisLinks(axis, min, max)` — added with persistent WASM memory during plot lifetime.
- `SetNextAxisLinks(axis, min, max)` — added with persistent WASM memory until next `EndPlot`.

### 4. Legend Interaction ✅

- `beginLegendPopup(label, mouseButton)` / `endLegendPopup()` — container nodes (supports future popup content).
- `isLegendEntryHovered(label)` — synchronous query.

### 5. Plot Utils ✅

- `isSubplotsHovered()` — captured during render.

### 6. Style & Colormap Helpers ✅

- `getStyleColorName(idx)` — synchronous.
- `getMarkerName(idx)` — synchronous.
- `nextMarker()` command + `getNextMarker()` getter.
- `getColormapIndex(name)` — synchronous.
- `getColormapSize(cmap?)` — synchronous.
- `getColormapColor(idx, cmap?)` — synchronous.
- `nextColormapColor()` command + `getNextColormapColor()` getter.
- `bustColorCache(title?)` — synchronous/runtime action.
- `getStyle()` — full struct snapshot (`ImPlotStyleSnapshot`).

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

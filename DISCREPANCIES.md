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
- `Plot*G` getter variants (`plotLineG`, `plotScatterG`, `plotStairsG`, `plotBarsG`, `plotDigitalG`) with JS callback bridge

### 3. Setup / Axes ✅

- `SetupAxisTicks(values, labels)` — labels are now passed through to C++.
- `SetupAxisLinks(axis, min, max)` — added with persistent WASM memory during plot lifetime.
- `SetNextAxisLinks(axis, min, max)` — added with persistent WASM memory until next `EndPlot`.
- `SetupAxisScale(axis, forward, inverse)` — custom transform callbacks via EM_JS bridge.
- `SetupAxisFormat(axis, formatter)` — custom formatter callback via EM_JS bridge.

### 4. Legend Interaction ✅

- `beginLegendPopup(label, mouseButton)` / `endLegendPopup()` — container nodes (supports future popup content).
- `isLegendEntryHovered(label)` — synchronous query.

### 5. Plot Utils ✅

- `isSubplotsHovered()` — captured during render.
- `beginAlignedPlots(groupId, vertical?)` / `endAlignedPlots()` — alignment helpers.
- `pushPlotClipRect(expand?)` / `popPlotClipRect()` — custom rendering clip rect.

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

### 7. Debug / Editor Windows ✅

- `showStyleEditor()`
- `showStyleSelector(label)`
- `showColormapSelector(label)`
- `showInputMapSelector(label)`
- `showUserGuide()`
- `showMetricsWindow()`

`ShowDemoWindow` is intentionally excluded because it requires compiling `implot_demo.cpp`, which would bloat the WASM binary with demo-only code.

## Out of Scope (Requires JS↔C++ callbacks or breaks the managed-canvas model)

### Drag & Drop

`BeginDragDropTargetPlot`, `BeginDragDropSourcePlot`, etc. involve ImGui payload types and complex lifetime management that does not map cleanly to a JS wrapper.

### Raw Draw List Access

`GetPlotDrawList` exposes the raw `ImDrawList*` pointer. While `PushPlotClipRect`/`PopPlotClipRect` are exposed for basic custom rendering, the full draw-list API (lines, triangles, text, etc.) would require wrapping the entire `ImDrawList` interface and is not practical for this wrapper.

## Size Optimization

The WASM binary has been reduced from ~1.64MB to ~1.11MB (32% reduction) through:

- `-Oz` + `-flto=full` (aggressive size-focused LTO)
- `-fno-exceptions` / `-fno-rtti`
- `-ffunction-sections` / `-fdata-sections` with `--gc-sections`
- `-fvisibility=hidden`
- `-sMALLOC=emmalloc` (smaller allocator)
- `-sENVIRONMENT=web` (removes Node.js support code)
- `IMGUI_DISABLE_OBSOLETE_*` / `IMPLOT_DISABLE_OBSOLETE_*` macros

**Note:** `--closure 1` was attempted for JS minification but caused a runtime `table index is out of bounds` error by mangling Emscripten's internal function table management. It was reverted.

Further reductions would require more invasive changes (e.g. replacing SDL2 with a minimal HTML5 backend, or pre-baking the font atlas to strip `stb_truetype`).

## Notes

- The old `SetNextLineStyle`, `SetNextFillStyle`, `SetNextMarkerStyle`, and `SetNextErrorBarStyle` helpers were obsoleted in ImPlot v1.0 in favor of `ImPlotSpec`. The wrapper currently emulates them in C++ via a global `PendingPlotStyle`. Full `ImPlotSpec` exposure (per-vertex colors, `Offset`, `Stride`, etc.) is not yet implemented and is tracked separately.

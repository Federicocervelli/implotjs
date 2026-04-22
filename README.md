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
} from "../dist/index.js";

const chart = new ImPlotChart({
  canvas: document.querySelector("#app"),
  width: 1200,
  height: 720,
  autoStart: false,
});

await chart.mount();

chart
  .beginPlot("Signals", [-1, 0], ImPlotFlags.None)
  .setupAxes("t", "value")
  .setupLegend(ImPlotLocation.NorthEast, ImPlotLegendFlags.None)
  .plotLine("sin", Float64Array.from([0, 0.5, 0.8, 1.0]))
  .plotScatter("samples", [0, 1, 2, 3], [0, 0.5, 0.8, 1.0])
  .endPlot();

await chart.start();
```

## Current scope

This implementation covers the main deterministic ImPlot plotting/setup/style surface and exports ImPlot-like enum/flag constants. Internally, rendering is still immediate-mode; the wrapper stores a persistent plot tree and replays it on each render.

Callback-driven features from the C++ API are still intentionally out of scope:

- custom getter callbacks (`PlotLineG`, `PlotScatterG`, etc.)
- custom formatter callbacks
- custom transform callbacks
- drag-and-drop payload interop

`plotImage` is wired through as a low-level texture-id call, but typical browser-side image-to-texture convenience helpers are not provided yet.

Interactive charts need an active render loop. Use `await chart.start()` to begin continuous rendering, or call `await chart.render()` manually when you only want to draw a single frame.

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

`start:test` now refreshes the packaged tarball and reinstalls the `test/` consumer app before starting the HTTP server, so it always serves the latest packaged build.

Then open:

```text
http://localhost:8001/index.html
```

## Notes

- `dist/` contains the publishable runtime assets. `build/` is only the disposable compiler workspace.
- `vendor/imgui` and `vendor/implot` are git submodules that track the upstream projects used to build the WASM runtime.
- `prepack` rebuilds the runtime, so packed/published artifacts always include the current JS/TS entrypoints and WASM payloads.
- `ImDrawIdx` is configured as `unsigned int`, matching ImPlot's recommended high-density rendering setup.
- `src/index.ts` is now the single source of truth for the wrapper API; `dist/index.js` and `dist/index.d.ts` are generated from it during build.

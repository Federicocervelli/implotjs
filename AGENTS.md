# implotjs

Managed-canvas JS/TS wrapper around Dear ImGui + ImPlot WASM runtime.

## Build

```bash
bun run build   # builds WASM runtime + compiles TypeScript → dist/
```

`build` runs `scripts/build-wasm.sh` (cmake + emcmake, then `tsc`).

Emscripten must be on PATH or via `${EMSDK}/emsdk_env.sh` / `~/emsdk/emsdk_env.sh`.

## Source of truth

- `src/index.ts` → TypeScript wrapper API (generates `dist/index.js`, `dist/index.d.ts`)
- `src/native/main.cpp` → C++ entrypoint for WASM
- `dist/implotjs.js`, `dist/implotjs.wasm` → compiled WASM runtime

## Vendor submodules

`vendor/imgui/` and `vendor/implot/` are git submodules tracking upstream.

## Testing the package

```bash
bun run package:test   # pack → install into test/ → run smoke test
bun run start:test     # same + serve test/ consumer app on :8001
```

The `test/` dir is a consumer app that installs from the tarball, not linked source.

## Example dev server

```bash
bun run start   # serves repo root on :8000
```

## No lint/typecheck scripts

Only TypeScript compilation (tsc) runs as part of build. No dedicated lint or typecheck commands.
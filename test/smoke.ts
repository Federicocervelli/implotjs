import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { ImPlotChart, ImPlotFlags, ImPlotLocation } from "implotjs";

const testDir = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(testDir, "node_modules/implotjs");
const requiredFiles = [
  "README.md",
  "THIRD_PARTY_NOTICES.md",
  "dist/index.js",
  "dist/index.d.ts",
  "dist/implotjs.js",
  "dist/implotjs.wasm",
];

for (const relativePath of requiredFiles) {
  const absolutePath = resolve(packageRoot, relativePath);
  if (!existsSync(absolutePath)) {
    throw new Error(`Missing packaged file: ${relativePath}`);
  }
}

const entrySource = await Bun.file(resolve(packageRoot, "dist/index.js")).text();

if (!entrySource.includes('import createNativeModule from "./implotjs.js";')) {
  throw new Error("The packaged entrypoint does not import the colocated Emscripten module.");
}

if (!entrySource.includes("new URL(`./${path}`, import.meta.url).toString();")) {
  throw new Error("The packaged entrypoint does not resolve colocated runtime assets.");
}

if (typeof ImPlotChart !== "function") {
  throw new Error("ImPlotChart was not exported from the installed package.");
}

if (ImPlotFlags.None !== 0 || ImPlotLocation.Center !== 0 || ImPlotLocation.NorthEast !== ((1 << 0) | (1 << 3))) {
  throw new Error("Installed package exports do not match the expected API surface.");
}

console.log("Package smoke test passed.");

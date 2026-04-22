#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_DIR="${ROOT_DIR}/build/emscripten"
DIST_DIR="${ROOT_DIR}/dist"
EM_CACHE_DIR="${ROOT_DIR}/build/emcache"
DEFAULT_EMSDK_CACHE="${EMSDK:-$HOME/emsdk}/upstream/emscripten/cache"

if command -v emcmake >/dev/null 2>&1; then
    :
elif [ -f "${EMSDK:-$HOME/emsdk}/emsdk_env.sh" ]; then
    # shellcheck disable=SC1090
    source "${EMSDK:-$HOME/emsdk}/emsdk_env.sh"
else
    echo "Unable to find emcmake or emsdk_env.sh. Set EMSDK or add Emscripten to PATH." >&2
    exit 1
fi

mkdir -p "${BUILD_DIR}" "${DIST_DIR}" "${EM_CACHE_DIR}"

export EM_CACHE="${EM_CACHE:-${EM_CACHE_DIR}}"

if [ "${EM_CACHE}" != "${DEFAULT_EMSDK_CACHE}" ] && [ -d "${DEFAULT_EMSDK_CACHE}" ]; then
    mkdir -p "${EM_CACHE}/ports/sdl2" "${EM_CACHE}/build/sdl2" "${EM_CACHE}/sysroot/include/SDL2" "${EM_CACHE}/sysroot/lib/wasm32-emscripten" "${EM_CACHE}/sysroot/lib/cmake/SDL2" "${EM_CACHE}/sysroot/bin"

    for port_zip in "${DEFAULT_EMSDK_CACHE}/ports"/sdl2*.zip; do
        [ -e "${port_zip}" ] || continue
        cp -f "${port_zip}" "${EM_CACHE}/ports/"
    done

    if [ -d "${DEFAULT_EMSDK_CACHE}/ports/sdl2" ]; then
        cp -Rf "${DEFAULT_EMSDK_CACHE}/ports/sdl2/." "${EM_CACHE}/ports/sdl2/"
    fi

    if [ -d "${DEFAULT_EMSDK_CACHE}/build/sdl2" ]; then
        cp -Rf "${DEFAULT_EMSDK_CACHE}/build/sdl2/." "${EM_CACHE}/build/sdl2/"
    fi

    if [ -d "${DEFAULT_EMSDK_CACHE}/sysroot/include/SDL2" ]; then
        cp -Rf "${DEFAULT_EMSDK_CACHE}/sysroot/include/SDL2/." "${EM_CACHE}/sysroot/include/SDL2/"
    fi

    if [ -f "${DEFAULT_EMSDK_CACHE}/sysroot/lib/wasm32-emscripten/libSDL2.a" ]; then
        cp -f "${DEFAULT_EMSDK_CACHE}/sysroot/lib/wasm32-emscripten/libSDL2.a" "${EM_CACHE}/sysroot/lib/wasm32-emscripten/libSDL2.a"
    fi

    if [ -d "${DEFAULT_EMSDK_CACHE}/sysroot/lib/cmake/SDL2" ]; then
        cp -Rf "${DEFAULT_EMSDK_CACHE}/sysroot/lib/cmake/SDL2/." "${EM_CACHE}/sysroot/lib/cmake/SDL2/"
    fi

    if [ -f "${DEFAULT_EMSDK_CACHE}/sysroot/bin/sdl2-config" ]; then
        cp -f "${DEFAULT_EMSDK_CACHE}/sysroot/bin/sdl2-config" "${EM_CACHE}/sysroot/bin/sdl2-config"
    fi
fi

emcmake cmake -S "${ROOT_DIR}" -B "${BUILD_DIR}" -DCMAKE_BUILD_TYPE=Release
cmake --build "${BUILD_DIR}" --parallel

cp "${BUILD_DIR}/dist/implotjs.js" "${DIST_DIR}/implotjs.js"
cp "${BUILD_DIR}/dist/implotjs.wasm" "${DIST_DIR}/implotjs.wasm"

if [ -x "${ROOT_DIR}/node_modules/.bin/tsc" ]; then
    "${ROOT_DIR}/node_modules/.bin/tsc" --project "${ROOT_DIR}/tsconfig.json"
elif command -v tsc >/dev/null 2>&1; then
    tsc --project "${ROOT_DIR}/tsconfig.json"
else
    echo "TypeScript is required to compile src/index.ts. Run 'bun install' to install devDependencies first." >&2
    exit 1
fi

echo "WASM artifacts written to ${DIST_DIR}"

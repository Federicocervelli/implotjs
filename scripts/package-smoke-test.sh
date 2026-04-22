#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEST_DIR="${ROOT_DIR}/test"
PACKAGE_DIR="${TEST_DIR}/.packages"
PACKAGE_FILE="${PACKAGE_DIR}/implotjs.tgz"
TMP_DIR="${ROOT_DIR}/build/tmp"

mkdir -p "${PACKAGE_DIR}" "${TMP_DIR}"

export TMPDIR="${TMP_DIR}"

bun pm pack --filename "${PACKAGE_FILE}"

cd "${TEST_DIR}"
rm -rf "${TEST_DIR}/node_modules" "${TEST_DIR}/bun.lock"
bun install --force
bun run smoke

#!/usr/bin/env bash
# SessionStart hook: ensure simplicio-cli is installed. Tolerant of offline envs.
command -v simplicio >/dev/null 2>&1 && exit 0
python3 -m pip install --quiet --disable-pip-version-check simplicio-cli >/dev/null 2>&1 || true

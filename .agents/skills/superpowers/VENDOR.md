# Superpowers (vendored)

Superpowers is an agentic skills framework: a complete software-development
methodology built on a set of composable skills (brainstorming, writing plans,
test-driven development, systematic debugging, code review workflows, and more).

This directory is a verbatim vendored copy of the upstream skills library. The
individual skills under `skills/` are exposed to agents working on this repo via
symlinks in `.claude/skills/`.

## Provenance

- Upstream: https://github.com/obra/superpowers
- Version: 5.1.0
- Commit: f2cbfbefebbfef77321e4c9abc9e949826bea9d7
- License: MIT (see `LICENSE`)

## Updating

Re-vendor by replacing `skills/` with the upstream `skills/` tree at the desired
release, refresh the commit/version above, and recompute the entry in
`skills-lock.json`.

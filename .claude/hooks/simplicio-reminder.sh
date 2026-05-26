#!/usr/bin/env bash
# PreToolUse hook: injects a mandatory reminder to route source-code changes
# through simplicio-cli. Fires only for code files so docs/config edits are quiet.
f=$(jq -r '.tool_input.file_path // empty' 2>/dev/null)
case "$f" in
  *.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs|*.vue|*.css|*.scss|*.html)
    printf '%s' '{"hookSpecificOutput":{"hookEventName":"PreToolUse","additionalContext":"REGRA OBRIGATORIA deste projeto: alteracoes de codigo devem ser geradas/validadas pelo simplicio-cli antes de editar. Use: simplicio task <objetivo> --stack electron-ts --target <arquivo> --criteria <criterios>. Rode simplicio smoke se ainda nao validou o provedor. Detalhes em CLAUDE.md."}}'
    ;;
esac

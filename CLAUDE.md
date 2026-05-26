# CLAUDE.md

Guidance for Claude Code when working in this repository.

## REGRA OBRIGATÓRIA: usar o simplicio-cli para codificar

**É OBRIGATÓRIO usar o [`simplicio-cli`](https://github.com/wesleysimplicio/simplicio-cli)
antes de qualquer alteração de código neste projeto.** Antes de editar arquivos de
código-fonte, a mudança deve ser gerada/validada pelo `simplicio-cli`.

Fluxo obrigatório, nesta ordem:

1. **Validar o provedor** (uma vez por ambiente, ou se ainda não validou):
   ```bash
   simplicio smoke
   ```
2. **Indexar a base** (na primeira vez ou após mudanças grandes de estrutura):
   ```bash
   simplicio index --stack electron-ts
   ```
3. **Executar a tarefa de código** com o objetivo, o alvo e os critérios:
   ```bash
   simplicio task "<objetivo>" \
     --stack electron-ts \
     --target <caminho/do/arquivo> \
     --criteria "<critérios de aceite>" \
     --constraints "<restrições, ex.: build passa>"
   ```

O `--stack` deste repositório é **`electron-ts`** (app Electron + TypeScript).

Só edite o código manualmente (Edit/Write) para **aplicar/ajustar o diff produzido
pelo `simplicio-cli`** ou em arquivos que não são código (docs, configuração).

## Setup do simplicio-cli

- Instalação: `pip install simplicio-cli` (também instalado automaticamente por um
  hook `SessionStart` — ver `.claude/settings.json`).
- Configuração via variáveis de ambiente (ver `.env.example`):
  - `SIMPLICIO_MODEL` — modelo LLM a usar.
  - `SIMPLICIO_BASE_URL` — endpoint OpenAI-compatible (deixe vazio para Anthropic nativo).
  - `ANTHROPIC_API_KEY` ou `OPENROUTER_API_KEY` — chave do provedor.
  - `SIMPLICIO_TEST_CMD` — comando de teste do projeto: `npm test`.
  - `SIMPLICIO_SKILLS_DIR` — diretório de skills (opcional).
- As chaves reais ficam em `.env` (ignorado pelo git). Nunca commite chaves.

## Projeto

App desktop Electron + TypeScript (build com `electron-vite`).

Comandos úteis:

| Tarefa | Comando |
| --- | --- |
| Dev | `npm run dev` |
| Build | `npm run build` |
| Lint | `npm run lint` |
| Type-check | `npm run typecheck` |
| Testes | `npm test` (Vitest) |

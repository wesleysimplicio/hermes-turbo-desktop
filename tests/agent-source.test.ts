import { describe, expect, it } from "vitest";
import {
  HERMES_AGENT_REPO,
  HERMES_AGENT_BRANCH,
  HERMES_INSTALL_SH_URL,
  HERMES_INSTALL_PS1_URL,
  UPSTREAM_AGENT_REPO,
  buildUnixInstallCommand,
  buildWindowsInstallWrapperScript,
} from "../src/main/installer";
import {
  UNIX_INSTALL_CMD,
  WINDOWS_INSTALL_CMD,
} from "../src/renderer/src/constants";

// Regression guard for the agent-backend swap: the desktop must install and
// run the Hermes Turbo fork, never the upstream NousResearch repo. The fork's
// own install scripts still hardcode the upstream clone URL with no override
// flag, so the desktop downloads the script and rewrites the clone slug before
// running it. These tests pin that rewrite plus the branch and ~/.hermes-turbo
// data dir so a future edit can't silently regress to upstream.

const FORK = "wesleysimplicio/hermes-turbo-agent";
const BRANCH = "codex/hermes-agent-100x-fast";
const UPSTREAM = "NousResearch/hermes-agent";

describe("Hermes Turbo agent source constants", () => {
  it("points the agent backend at the fork on the chosen branch", () => {
    expect(HERMES_AGENT_REPO).toBe(FORK);
    expect(HERMES_AGENT_BRANCH).toBe(BRANCH);
    expect(UPSTREAM_AGENT_REPO).toBe(UPSTREAM);
  });

  it("derives the install-script URLs from the fork + branch", () => {
    expect(HERMES_INSTALL_SH_URL).toBe(
      `https://raw.githubusercontent.com/${FORK}/${BRANCH}/scripts/install.sh`,
    );
    expect(HERMES_INSTALL_PS1_URL).toBe(
      `https://raw.githubusercontent.com/${FORK}/${BRANCH}/scripts/install.ps1`,
    );
    // The owner segment of the raw URL must be the fork, not the upstream org.
    expect(HERMES_INSTALL_SH_URL).not.toContain("NousResearch");
    expect(HERMES_INSTALL_PS1_URL).not.toContain("NousResearch");
  });
});

describe("buildUnixInstallCommand", () => {
  const cmd = buildUnixInstallCommand({
    shellProfile: "/home/u/.zshrc",
    hermesHome: "/home/u/.hermes-turbo",
    hermesRepo: "/home/u/.hermes-turbo/hermes-agent",
  });

  it("downloads the fork's install.sh", () => {
    expect(cmd).toContain(HERMES_INSTALL_SH_URL);
  });

  it("rewrites the hardcoded upstream clone slug to the fork", () => {
    // The single most important invariant: without this sed the fork's
    // install.sh clones NousResearch and the swap is a no-op.
    expect(cmd).toContain(`sed 's#${UPSTREAM}#${FORK}#g'`);
  });

  it("pins the branch and forces the ~/.hermes-turbo data dir", () => {
    expect(cmd).toContain("--skip-setup");
    expect(cmd).toContain(`--branch "${BRANCH}"`);
    expect(cmd).toContain(`--hermes-home "/home/u/.hermes-turbo"`);
    expect(cmd).toContain(`--dir "/home/u/.hermes-turbo/hermes-agent"`);
  });

  it("propagates the install script's exit code (pipefail-guarded)", () => {
    expect(cmd).toContain("set -o pipefail;");
    expect(cmd).toContain("code=$?;");
    expect(cmd).toContain("exit $code");
  });

  it("sources the shell profile when present and omits it otherwise", () => {
    expect(cmd).toContain('source "/home/u/.zshrc" 2>/dev/null;');
    const noProfile = buildUnixInstallCommand({
      shellProfile: null,
      hermesHome: "/h",
      hermesRepo: "/h/hermes-agent",
    });
    expect(noProfile).not.toContain("source");
  });
});

describe("buildWindowsInstallWrapperScript", () => {
  const script = buildWindowsInstallWrapperScript({
    hermesHome: "C:\\Users\\u\\AppData\\Local\\hermes-turbo",
    installDir: "C:\\Users\\u\\AppData\\Local\\hermes-turbo\\hermes-agent",
  });

  it("downloads the fork's install.ps1", () => {
    expect(script).toContain(HERMES_INSTALL_PS1_URL);
  });

  it("rewrites the hardcoded upstream clone slug to the fork", () => {
    expect(script).toContain(
      `$text = $text -replace '${UPSTREAM}', '${FORK}'`,
    );
  });

  it("pins the branch, skips setup, and forces the turbo target dirs", () => {
    expect(script).toContain("-SkipSetup");
    expect(script).toContain(`-Branch '${BRANCH}'`);
    expect(script).toContain(
      `-HermesHome 'C:\\Users\\u\\AppData\\Local\\hermes-turbo'`,
    );
    expect(script).toContain(
      `-InstallDir 'C:\\Users\\u\\AppData\\Local\\hermes-turbo\\hermes-agent'`,
    );
  });
});

describe("manual fallback install commands (Settings)", () => {
  it("UNIX command targets the fork, rewrites the slug, pins branch + turbo home", () => {
    expect(UNIX_INSTALL_CMD).toContain(
      `https://raw.githubusercontent.com/${FORK}/${BRANCH}/scripts/install.sh`,
    );
    expect(UNIX_INSTALL_CMD).toContain(`sed 's#${UPSTREAM}#${FORK}#g'`);
    expect(UNIX_INSTALL_CMD).toContain(`--branch ${BRANCH}`);
    expect(UNIX_INSTALL_CMD).toContain(".hermes-turbo");
  });

  it("WINDOWS command targets the fork, rewrites the slug, pins branch + turbo home", () => {
    expect(WINDOWS_INSTALL_CMD).toContain(
      `https://raw.githubusercontent.com/${FORK}/${BRANCH}/scripts/install.ps1`,
    );
    expect(WINDOWS_INSTALL_CMD).toContain(`-replace '${UPSTREAM}','${FORK}'`);
    expect(WINDOWS_INSTALL_CMD).toContain(`-Branch '${BRANCH}'`);
    expect(WINDOWS_INSTALL_CMD).toContain(".hermes-turbo");
  });
});

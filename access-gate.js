(() => {
  "use strict";

  const SESSION_KEY = "archive_access_a7f29c4e6b1d";
  const ATTEMPT_KEY = "archive_attempts_a7f29c4e6b1d";
  const HASH_SALT = "archive-gate-v1";
  const EXPECTED_HASH = "56597576710793239ca7fd1470a2c7a418e3326068e97e360b587fb9d754d98f";

  const readSession = (key) => {
    try {
      return window.sessionStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const writeSession = (key, value) => {
    try {
      window.sessionStorage.setItem(key, value);
    } catch {
      // The gate still works for this page when session storage is unavailable.
    }
  };

  const revealPage = () => {
    document.documentElement.classList.remove("access-pending");
    document.documentElement.classList.add("access-granted");
    document.querySelector("#access-gate")?.remove();
  };

  if (readSession(SESSION_KEY) === EXPECTED_HASH) {
    revealPage();
    return;
  }

  const styles = document.createElement("style");
  styles.textContent = `
    html.access-pending body {
      visibility: hidden !important;
      overflow: hidden !important;
    }

    #access-gate {
      --gate-ink: #f6f1e5;
      --gate-muted: #aeb8c8;
      --gate-line: #53637a;
      --gate-accent: #ff765c;
      --gate-panel: #17243a;
      --gate-deep: #101a2b;
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      display: grid;
      place-items: center;
      min-inline-size: 20rem;
      min-block-size: 100dvh;
      padding: clamp(1rem, 4vw, 3rem);
      overflow: auto;
      visibility: visible !important;
      background-color: var(--gate-deep);
      color: var(--gate-ink);
      font-family: "Avenir Next", "PingFang SC", "Hiragino Sans GB", sans-serif;
      line-height: 1.55;
    }

    #access-gate::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      opacity: 0.22;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Cpath d='M0 95.5h96M95.5 0v96' fill='none' stroke='%23788ba7' stroke-width='.5'/%3E%3C/svg%3E");
    }

    #access-gate * { box-sizing: border-box; }

    #access-gate .gate-shell {
      position: relative;
      display: grid;
      grid-template-columns: minmax(0, 1.15fr) minmax(18rem, 0.85fr);
      inline-size: min(64rem, 100%);
      border: 1px solid var(--gate-line);
      background: var(--gate-panel);
      box-shadow: 0 2rem 6rem rgba(0, 0, 0, 0.34);
    }

    #access-gate .gate-identity,
    #access-gate .gate-entry {
      padding: clamp(1.5rem, 5vw, 4.5rem);
    }

    #access-gate .gate-identity {
      display: flex;
      min-block-size: 31rem;
      flex-direction: column;
      justify-content: space-between;
      border-inline-end: 1px solid var(--gate-line);
    }

    #access-gate .gate-index,
    #access-gate .gate-eyebrow {
      margin: 0;
      color: var(--gate-accent);
      font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    #access-gate .gate-title {
      max-inline-size: 9ch;
      margin: 2.5rem 0 0;
      font-family: "Iowan Old Style", "Songti SC", Baskerville, serif;
      font-size: clamp(3rem, 7vw, 6.4rem);
      font-weight: 700;
      letter-spacing: -0.07em;
      line-height: 0.88;
    }

    #access-gate .gate-caption {
      max-inline-size: 34ch;
      margin: 2rem 0 0;
      color: var(--gate-muted);
      font-size: 0.9rem;
    }

    #access-gate .gate-entry {
      align-self: center;
    }

    #access-gate .gate-entry h1 {
      margin: 0.8rem 0 0;
      font-family: "Iowan Old Style", "Songti SC", Baskerville, serif;
      font-size: clamp(2rem, 4vw, 3.25rem);
      letter-spacing: -0.045em;
      line-height: 1.05;
    }

    #access-gate .gate-copy {
      margin: 1rem 0 2rem;
      color: var(--gate-muted);
    }

    #access-gate label {
      display: block;
      margin-block-end: 0.55rem;
      font-size: 0.82rem;
      font-weight: 700;
    }

    #access-gate input {
      inline-size: 100%;
      min-block-size: 3.25rem;
      border: 1px solid var(--gate-line);
      border-radius: 0;
      padding: 0.75rem 0.9rem;
      background: var(--gate-deep);
      color: var(--gate-ink);
      font: 1.1rem/1 ui-monospace, "SFMono-Regular", Menlo, monospace;
      letter-spacing: 0.2em;
    }

    #access-gate input[aria-invalid="true"] {
      border-color: var(--gate-accent);
    }

    #access-gate input:focus-visible,
    #access-gate button:focus-visible {
      outline: 0.2rem solid #9bd3ff;
      outline-offset: 0.2rem;
    }

    #access-gate button {
      inline-size: 100%;
      min-block-size: 3.25rem;
      margin-block-start: 1rem;
      border: 1px solid var(--gate-accent);
      border-radius: 0;
      padding: 0.75rem 1rem;
      background: var(--gate-accent);
      color: #171b26;
      font: inherit;
      font-weight: 800;
      cursor: pointer;
      transition: transform 160ms ease, background-color 160ms ease;
    }

    #access-gate button:hover,
    #access-gate button:focus-visible {
      transform: translateY(-0.15rem);
      background: #ff967f;
    }

    #access-gate .gate-error {
      min-block-size: 1.5rem;
      margin: 0.65rem 0 0;
      color: #ffad9d;
      font-size: 0.82rem;
    }

    #access-gate .gate-privacy {
      margin: 1.5rem 0 0;
      border-block-start: 1px solid var(--gate-line);
      padding-block-start: 1rem;
      color: var(--gate-muted);
      font-size: 0.72rem;
    }

    @media (max-width: 44rem) {
      #access-gate .gate-shell { grid-template-columns: 1fr; }
      #access-gate .gate-identity {
        min-block-size: auto;
        border-inline-end: 0;
        border-block-end: 1px solid var(--gate-line);
      }
      #access-gate .gate-title { font-size: clamp(2.8rem, 15vw, 4.5rem); }
      #access-gate .gate-caption { margin-block-start: 1.25rem; }
    }

    @media (max-width: 23rem) {
      #access-gate { padding: 0.65rem; }
      #access-gate .gate-identity,
      #access-gate .gate-entry { padding: 1.25rem; }
    }

    @media (prefers-reduced-motion: reduce) {
      #access-gate *,
      #access-gate *::before,
      #access-gate *::after { transition-duration: 0.01ms !important; }
    }

    @media (prefers-contrast: more) {
      #access-gate {
        --gate-muted: #e1e7ef;
        --gate-line: #b6c2d2;
      }
      #access-gate .gate-shell,
      #access-gate input,
      #access-gate button { border-width: 2px; }
    }

    @media (forced-colors: active) {
      #access-gate,
      #access-gate .gate-shell,
      #access-gate input,
      #access-gate button { forced-color-adjust: auto; }
    }
  `;
  document.head.append(styles);

  const hashPassword = async (password) => {
    const input = new TextEncoder().encode(`${HASH_SALT}:${password}`);
    const digest = await window.crypto.subtle.digest("SHA-256", input);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  };

  const showGate = () => {
    const gate = document.createElement("div");
    gate.id = "access-gate";
    gate.setAttribute("role", "dialog");
    gate.setAttribute("aria-modal", "true");
    gate.setAttribute("aria-labelledby", "gate-title");
    gate.innerHTML = `
      <div class="gate-shell">
        <section class="gate-identity" aria-label="档案标识">
          <div>
            <p class="gate-index">Access / 01</p>
            <p class="gate-title" aria-hidden="true">FIELD<br>NOTES</p>
          </div>
          <p class="gate-caption">A private study archive maintained under the alias Andy.</p>
        </section>
        <section class="gate-entry">
          <p class="gate-eyebrow">Protected archive</p>
          <h1 id="gate-title">输入访问密码</h1>
          <p class="gate-copy">此页面用于个人学习积累。请输入档案密码后继续。</p>
          <form id="access-form" novalidate>
            <input type="text" name="username" autocomplete="username" value="archive" hidden>
            <label for="access-password">访问密码</label>
            <input id="access-password" name="archive-password" type="password" inputmode="numeric" pattern="[0-9]*" autocomplete="current-password" aria-describedby="access-error" required>
            <button type="submit">进入档案</button>
            <p class="gate-error" id="access-error" role="alert" aria-live="polite"></p>
          </form>
          <p class="gate-privacy">授权只保留在当前浏览器标签页会话中。</p>
        </section>
      </div>
    `;
    document.body.append(gate);

    const form = gate.querySelector("#access-form");
    const input = gate.querySelector("#access-password");
    const button = form.querySelector("button");
    const error = gate.querySelector("#access-error");
    let busy = false;

    const focusable = [input, button];
    gate.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (busy) return;

      if (!input.value.trim()) {
        input.setAttribute("aria-invalid", "true");
        error.textContent = "请输入访问密码。";
        input.focus();
        return;
      }

      if (!window.crypto?.subtle) {
        error.textContent = "当前浏览器不支持密码校验，请更换现代浏览器。";
        return;
      }

      busy = true;
      form.setAttribute("aria-busy", "true");
      button.textContent = "校验中…";
      error.textContent = "";
      input.removeAttribute("aria-invalid");

      const candidateHash = await hashPassword(input.value.trim());
      if (candidateHash === EXPECTED_HASH) {
        writeSession(SESSION_KEY, EXPECTED_HASH);
        writeSession(ATTEMPT_KEY, "0");
        revealPage();
        return;
      }

      const attempts = Math.min(Number.parseInt(readSession(ATTEMPT_KEY) || "0", 10) + 1, 6);
      writeSession(ATTEMPT_KEY, String(attempts));
      input.setAttribute("aria-invalid", "true");
      input.select();
      error.textContent = "密码不正确，请稍后再试。";

      window.setTimeout(() => {
        busy = false;
        form.removeAttribute("aria-busy");
        button.textContent = "进入档案";
        input.focus();
      }, Math.min(400 + attempts * 300, 2200));
    });

    window.requestAnimationFrame(() => input.focus());
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showGate, { once: true });
  } else {
    showGate();
  }
})();

/**
 * TypewriterAnimation — character-by-character typing in terminal boxes.
 *
 * Usage:
 *   const tw = new TypewriterAnimation(containerEl, lines, options);
 *   tw.start();
 */

class TypewriterAnimation {
  /**
   * @param {HTMLElement} container  The .terminal-body element
   * @param {Array<{text: string, isCommand: boolean}>} lines
   * @param {Object} opts
   */
  constructor(container, lines, opts = {}) {
    this.container = container;
    this.content = container.querySelector('.terminal-content');
    this.cursor = container.querySelector('.terminal-cursor');
    this.lines = lines;
    this.charDelay = opts.charDelay ?? 20;
    this.jitter = opts.jitter ?? 15;
    this.lineDelay = opts.lineDelay ?? 200;
    this.loopPause = opts.loopPause ?? 2500;
    this.loop = opts.loop ?? true;
    this._running = false;
    this._aborted = false;
  }

  /** Start the animation (idempotent). */
  start() {
    if (this._running) return;
    this._running = true;
    this._aborted = false;
    this._run();
  }

  /** Stop and reset. */
  stop() {
    this._aborted = true;
    this._running = false;
  }

  async _run() {
    while (!this._aborted) {
      this.content.innerHTML = '';
      for (const line of this.lines) {
        if (this._aborted) return;
        await this._typeLine(line);
        await this._wait(this.lineDelay);
      }
      if (!this.loop) {
        this._running = false;
        return;
      }
      await this._wait(this.loopPause);
    }
  }

  async _typeLine(line) {
    const span = document.createElement('span');
    span.className = line.isCommand
      ? 'terminal-line--command'
      : 'terminal-line--output';
    this.content.appendChild(span);

    for (let i = 0; i < line.text.length; i++) {
      if (this._aborted) return;
      span.textContent += line.text[i];
      this._scrollToBottom();
      const delay = this.charDelay + (Math.random() * this.jitter - this.jitter / 2);
      await this._wait(Math.max(5, delay));
    }

    // Add newline
    this.content.appendChild(document.createTextNode('\n'));
  }

  _scrollToBottom() {
    this.container.scrollTop = this.container.scrollHeight;
  }

  _wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/* ═══════════════════════════════════════════
   CONTENT DEFINITIONS
   ═══════════════════════════════════════════ */

const TYPEWRITER_CONTENT = {
  hero: [
    { text: '> obsidian sync --context meetings', isCommand: true },
    { text: '  Loaded 47 meeting notes into agent memory', isCommand: false },
    { text: '  Building task extraction pipeline...', isCommand: false },
    { text: '  Found 12 action items across 3 projects', isCommand: false },
    { text: '  Personal OS updated.', isCommand: false },
  ],
  'personal-os': [
    { text: '> agent task-manager --integrate obsidian', isCommand: true },
    { text: '  Connecting to vault: ~/ProductNotes', isCommand: false },
    { text: '  Indexing 234 documents...', isCommand: false },
    { text: '  RAG pipeline initialized', isCommand: false },
    { text: '  Ready for natural language queries.', isCommand: false },
  ],
  'ai-workflows': [
    { text: '> mcp-server start --tools browser,api,git', isCommand: true },
    { text: '  Registered 3 tool providers', isCommand: false },
    { text: '  Agent context: 128k tokens available', isCommand: false },
    { text: '  Multi-agent orchestration: enabled', isCommand: false },
    { text: '  Waiting for instructions...', isCommand: false },
  ],
  prototypes: [
    { text: '> prototype --wizard-of-oz "AI support agent"', isCommand: true },
    { text: '  Scaffolding frontend interface...', isCommand: false },
    { text: '  Connecting LLM backend (Claude 3.5)', isCommand: false },
    { text: '  Adding few-shot examples from docs', isCommand: false },
    { text: '  Live prototype ready in 4 minutes.', isCommand: false },
  ],
  xray: [
    { text: '> ai-xray analyze "competitor-product.app"', isCommand: true },
    { text: '  Detecting architecture patterns...', isCommand: false },
    { text: '  Found: RAG + fine-tuned classifier', isCommand: false },
    { text: '  Estimated infra: vector DB + GPT-4 API', isCommand: false },
    { text: '  Moat assessment: weak — replicable in 2 sprints.', isCommand: false },
  ],
};

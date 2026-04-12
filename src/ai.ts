const AI_KEY_STORAGE = 'html_editor_ai_key';
const AI_MODEL = 'gpt-4o-mini';
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 5000;

export class AIService {
  private apiKey: string = '';
  onRetry?: (attempt: number, waitSec: number) => void;

  constructor() {
    this.apiKey = this.loadKey();
  }

  private loadKey(): string {
    try {
      const saved = localStorage.getItem(AI_KEY_STORAGE) || '';
      if (saved && !/^[\x20-\x7E]+$/.test(saved)) {
        localStorage.removeItem(AI_KEY_STORAGE);
        return '';
      }
      return saved;
    } catch {
      return '';
    }
  }

  saveKey(key: string): void {
    this.apiKey = key.trim();
    try {
      if (this.apiKey) {
        localStorage.setItem(AI_KEY_STORAGE, this.apiKey);
      } else {
        localStorage.removeItem(AI_KEY_STORAGE);
      }
    } catch (e) {
      console.error('Error saving API key:', e);
    }
  }

  getKey(): string {
    return this.apiKey;
  }

  hasKey(): boolean {
    return this.apiKey.length > 0;
  }

  clearKey(): void {
    this.apiKey = '';
    try {
      localStorage.removeItem(AI_KEY_STORAGE);
    } catch {}
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async ask(systemPrompt: string, userMessage: string, attempt = 0): Promise<string> {
    if (!this.hasKey()) {
      throw new Error('NO_KEY');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 1500,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const msg = (err as any)?.error?.message || '';
      if (response.status === 401) throw new Error('INVALID_KEY');
      if (response.status === 429) {
        if (attempt < MAX_RETRIES) {
          const waitSec = RETRY_DELAY_MS * (attempt + 1) / 1000;
          this.onRetry?.(attempt + 1, waitSec);
          await this.sleep(RETRY_DELAY_MS * (attempt + 1));
          return this.ask(systemPrompt, userMessage, attempt + 1);
        }
        throw new Error('RATE_LIMIT');
      }
      if (response.status === 402 || msg.includes('quota')) throw new Error('QUOTA');
      throw new Error(msg || 'API_ERROR');
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'No response received.';
  }

  private trimCode(code: string, max = 800): string {
    return code.length > max ? code.substring(0, max) + '\n...(truncated)' : code;
  }

  async fixCode(html: string, css: string, js: string): Promise<string> {
    const system = `Fix all bugs in the HTML/CSS/JS code. Return ONLY fixed code in this format:
===HTML===
(html)
===CSS===
(css)
===JS===
(js)`;

    const user = `HTML:\n${this.trimCode(html)}\nCSS:\n${this.trimCode(css)}\nJS:\n${this.trimCode(js)}`;
    return this.ask(system, user);
  }

  async findErrors(html: string, css: string, js: string): Promise<string> {
    const system = `Review HTML/CSS/JS code for bugs and errors. List each issue with: file, problem, and fix. Be concise. If no issues, say so.`;
    const user = `HTML:\n${this.trimCode(html)}\nCSS:\n${this.trimCode(css)}\nJS:\n${this.trimCode(js)}`;
    return this.ask(system, user);
  }

  async improveCode(html: string, css: string, js: string): Promise<string> {
    const system = `Suggest practical improvements for HTML/CSS/JS code. Focus on best practices, performance, accessibility. Be concise.`;
    const user = `HTML:\n${this.trimCode(html)}\nCSS:\n${this.trimCode(css)}\nJS:\n${this.trimCode(js)}`;
    return this.ask(system, user);
  }

  async explainCode(html: string, css: string, js: string): Promise<string> {
    const system = `Explain what this HTML/CSS/JS code does in simple, beginner-friendly language. Be concise.`;
    const user = `HTML:\n${this.trimCode(html)}\nCSS:\n${this.trimCode(css)}\nJS:\n${this.trimCode(js)}`;
    return this.ask(system, user);
  }

  async chat(message: string, html: string, css: string, js: string): Promise<string> {
    const system = `You are a helpful HTML/CSS/JS coding assistant. Be concise and practical.
Code context — HTML: ${this.trimCode(html, 400)} | CSS: ${this.trimCode(css, 300)} | JS: ${this.trimCode(js, 300)}`;
    return this.ask(system, message);
  }
}

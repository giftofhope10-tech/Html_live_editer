const AI_KEY_STORAGE = 'html_editor_ai_key';
const AI_MODEL = 'gpt-4o-mini';

export class AIService {
  private apiKey: string = '';

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

  async ask(systemPrompt: string, userMessage: string): Promise<string> {
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
        max_tokens: 2000,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const msg = (err as any)?.error?.message || '';
      if (response.status === 401) throw new Error('INVALID_KEY');
      if (response.status === 429) throw new Error('RATE_LIMIT');
      if (response.status === 402 || msg.includes('quota')) throw new Error('QUOTA');
      throw new Error(msg || 'API_ERROR');
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'No response received.';
  }

  async fixCode(html: string, css: string, js: string): Promise<string> {
    const system = `You are an expert HTML/CSS/JavaScript code fixer. 
When given code, fix all bugs and errors. 
Return ONLY the fixed code in this exact format:
===HTML===
(fixed html here)
===CSS===
(fixed css here)
===JS===
(fixed js here)
Do not add any explanation before or after the code blocks.`;

    const user = `Fix all errors in this code:

HTML:
${html || '(empty)'}

CSS:
${css || '(empty)'}

JavaScript:
${js || '(empty)'}`;

    return this.ask(system, user);
  }

  async findErrors(html: string, css: string, js: string): Promise<string> {
    const system = `You are an expert web developer code reviewer.
Analyze the HTML, CSS, and JavaScript code for bugs, errors, and issues.
List each issue with:
- File (HTML/CSS/JS)
- Line or element affected
- What the problem is
- How to fix it
Be specific and helpful. If no issues found, say so clearly.`;

    const user = `Find all errors and issues in this code:

HTML:
${html || '(empty)'}

CSS:
${css || '(empty)'}

JavaScript:
${js || '(empty)'}`;

    return this.ask(system, user);
  }

  async improveCode(html: string, css: string, js: string): Promise<string> {
    const system = `You are an expert web developer.
Suggest specific improvements for the given HTML/CSS/JavaScript code.
Focus on: best practices, performance, accessibility, readability, and modern techniques.
Be concise and practical.`;

    const user = `Suggest improvements for this code:

HTML:
${html || '(empty)'}

CSS:
${css || '(empty)'}

JavaScript:
${js || '(empty)'}`;

    return this.ask(system, user);
  }

  async explainCode(html: string, css: string, js: string): Promise<string> {
    const system = `You are a helpful coding teacher.
Explain what the given HTML/CSS/JavaScript code does in simple, clear language.
Describe the structure, styling, and functionality. Keep it beginner-friendly.`;

    const user = `Explain what this code does:

HTML:
${html || '(empty)'}

CSS:
${css || '(empty)'}

JavaScript:
${js || '(empty)'}`;

    return this.ask(system, user);
  }

  async chat(message: string, html: string, css: string, js: string): Promise<string> {
    const system = `You are a helpful coding assistant for an HTML/CSS/JavaScript editor.
You have access to the user's current code. Help them with any coding questions, fixes, or tasks.
Be concise, practical, and friendly.

Current code context:
HTML: ${html ? html.substring(0, 800) : '(empty)'}
CSS: ${css ? css.substring(0, 500) : '(empty)'}
JS: ${js ? js.substring(0, 500) : '(empty)'}`;

    return this.ask(system, message);
  }
}

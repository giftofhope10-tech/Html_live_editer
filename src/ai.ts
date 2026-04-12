const AI_KEY_STORAGE = 'html_editor_ai_key';
const AI_PROVIDER_STORAGE = 'html_editor_ai_provider';
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 5000;

export type AIProvider = 'openai' | 'gemini' | 'groq';

export const PROVIDERS: Record<AIProvider, {
  name: string;
  model: string;
  placeholder: string;
  keyLink: string;
  keyLinkText: string;
  freeLimit: string;
}> = {
  openai: {
    name: 'OpenAI (ChatGPT)',
    model: 'gpt-4o-mini',
    placeholder: 'sk-...',
    keyLink: 'https://platform.openai.com/api-keys',
    keyLinkText: 'platform.openai.com/api-keys',
    freeLimit: '3 req/min free'
  },
  gemini: {
    name: 'Google Gemini',
    model: 'gemini-1.5-flash',
    placeholder: 'AIza...',
    keyLink: 'https://aistudio.google.com/app/apikey',
    keyLinkText: 'aistudio.google.com/app/apikey',
    freeLimit: '15 req/min free — recommended'
  },
  groq: {
    name: 'Groq (Llama)',
    model: 'llama-3.3-70b-versatile',
    placeholder: 'gsk_...',
    keyLink: 'https://console.groq.com/keys',
    keyLinkText: 'console.groq.com/keys',
    freeLimit: '30 req/min free — fastest'
  }
};

export class AIService {
  private apiKey: string = '';
  private provider: AIProvider = 'gemini';
  onRetry?: (attempt: number, waitSec: number) => void;

  constructor() {
    this.provider = this.loadProvider();
    this.apiKey = this.loadKey();
  }

  private loadProvider(): AIProvider {
    try {
      const saved = localStorage.getItem(AI_PROVIDER_STORAGE);
      if (saved === 'openai' || saved === 'gemini' || saved === 'groq') return saved;
    } catch {}
    return 'gemini';
  }

  private loadKey(): string {
    try {
      const saved = localStorage.getItem(`${AI_KEY_STORAGE}_${this.provider}`) || '';
      if (saved && !/^[\x20-\x7E]+$/.test(saved)) {
        localStorage.removeItem(`${AI_KEY_STORAGE}_${this.provider}`);
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
        localStorage.setItem(`${AI_KEY_STORAGE}_${this.provider}`, this.apiKey);
      } else {
        localStorage.removeItem(`${AI_KEY_STORAGE}_${this.provider}`);
      }
    } catch (e) {
      console.error('Error saving API key:', e);
    }
  }

  setProvider(provider: AIProvider): void {
    this.provider = provider;
    try {
      localStorage.setItem(AI_PROVIDER_STORAGE, provider);
    } catch {}
    this.apiKey = this.loadKey();
  }

  getProvider(): AIProvider {
    return this.provider;
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
      localStorage.removeItem(`${AI_KEY_STORAGE}_${this.provider}`);
    } catch {}
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async askOpenAI(systemPrompt: string, userMessage: string, attempt: number): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: PROVIDERS.openai.model,
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
      if (response.status === 429) throw new Error('RATE_LIMIT_RAW');
      if (response.status === 402 || msg.includes('quota')) throw new Error('QUOTA');
      throw new Error(msg || 'API_ERROR');
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'No response received.';
  }

  private async askGemini(systemPrompt: string, userMessage: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        generationConfig: { maxOutputTokens: 1500, temperature: 0.3 }
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const msg = (err as any)?.error?.message || '';
      const status = response.status;
      if (status === 400 && msg.includes('API_KEY')) throw new Error('INVALID_KEY');
      if (status === 403) throw new Error('INVALID_KEY');
      if (status === 429) throw new Error('RATE_LIMIT_RAW');
      if (msg.includes('quota')) throw new Error('QUOTA');
      throw new Error(msg || 'API_ERROR');
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received.';
  }

  private async askGroq(systemPrompt: string, userMessage: string): Promise<string> {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: PROVIDERS.groq.model,
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
      if (response.status === 429) throw new Error('RATE_LIMIT_RAW');
      throw new Error(msg || 'API_ERROR');
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'No response received.';
  }

  async ask(systemPrompt: string, userMessage: string, attempt = 0): Promise<string> {
    if (!this.hasKey()) throw new Error('NO_KEY');

    try {
      if (this.provider === 'openai') return await this.askOpenAI(systemPrompt, userMessage, attempt);
      if (this.provider === 'gemini') return await this.askGemini(systemPrompt, userMessage);
      if (this.provider === 'groq') return await this.askGroq(systemPrompt, userMessage);
      throw new Error('Unknown provider');
    } catch (err: any) {
      if (err.message === 'RATE_LIMIT_RAW') {
        if (attempt < MAX_RETRIES) {
          const waitSec = RETRY_DELAY_MS * (attempt + 1) / 1000;
          this.onRetry?.(attempt + 1, waitSec);
          await this.sleep(RETRY_DELAY_MS * (attempt + 1));
          return this.ask(systemPrompt, userMessage, attempt + 1);
        }
        throw new Error('RATE_LIMIT');
      }
      throw err;
    }
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

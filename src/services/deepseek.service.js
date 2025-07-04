// Use dynamic import for node-fetch (ESM compatibility)
const fetch = require('node-fetch');
const config = require('../core/config');
const logger = require('../core/logger').createServiceLogger('DeepSeek');

class DeepSeekService {
  constructor() {
    this.apiKey = config.getApiKey('DEEPSEEK');
    this.model = config.get('llm.deepseek.model') || 'deepseek-chat';
    this.maxTokens = config.get('llm.deepseek.maxTokens') || 2048;
    this.temperature = config.get('llm.deepseek.temperature') || 0.7;
    this.apiUrl = 'https://api.deepseek.com/v1/chat/completions';
  }

  updateModel(newModel) {
    this.model = newModel;
  }

  async generateResponse(systemPrompt, userMessage) {
    if (!this.apiKey) throw new Error('DeepSeek API key not configured');
    const body = {
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      max_tokens: this.maxTokens,
      temperature: this.temperature
    };

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}

module.exports = new DeepSeekService(); 
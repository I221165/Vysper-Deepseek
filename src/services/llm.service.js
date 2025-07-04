const deepseekService = require('./deepseek.service');
const { promptLoader } = require('../../prompt-loader');
const logger = require('../core/logger').createServiceLogger('LLM');
const config = require('../core/config');

class LLMService {
  constructor() {
    this.isInitialized = !!deepseekService.apiKey;
  }

  updateModel(newModel) {
    if (deepseekService && typeof deepseekService.updateModel === 'function') {
      deepseekService.updateModel(newModel);
    }
  }

  async processTextWithSkill(text, activeSkill, sessionMemory = [], programmingLanguage = null) {
    if (!this.isInitialized) {
      throw new Error('LLM service not initialized. Check DeepSeek API key configuration.');
    }
    const skillPrompt = promptLoader.getSkillPrompt(activeSkill, programmingLanguage);
    logger.info('Processing text with DeepSeek', { activeSkill, textLength: text.length });
    const response = await deepseekService.generateResponse(skillPrompt, text);
    return {
      response,
      metadata: {
        skill: activeSkill,
        programmingLanguage,
        processingTime: 0 // You can add timing if needed
      }
    };
  }

  async processTranscriptionWithIntelligentResponse(text, activeSkill, sessionMemory = [], programmingLanguage = null) {
    // For voice input, same as above
    return this.processTextWithSkill(text, activeSkill, sessionMemory, programmingLanguage);
  }
}

module.exports = new LLMService();
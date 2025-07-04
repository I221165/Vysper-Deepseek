// DeepSeek API Test - Node.js Version
// Save this as: deepseek-test.js

const readline = require('readline');

// Create interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
    bold: '\x1b[1m'
};

// Function to make API call to DeepSeek
async function testDeepSeek(apiKey, model, prompt) {
    try {
        console.log(`\n${colors.blue}🔄 Testing DeepSeek API connection...${colors.reset}`);
        
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 150,
                temperature: 0.7,
                stream: false
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        // Success response
        console.log(`\n${colors.green}${colors.bold}✅ SUCCESS! DeepSeek API Connection Working!${colors.reset}`);
        console.log(`${colors.cyan}Model: ${data.model}${colors.reset}`);
        console.log(`${colors.cyan}Tokens Used: ${data.usage?.total_tokens || 'N/A'}${colors.reset}`);
        console.log(`\n${colors.green}${colors.bold}AI Response:${colors.reset}`);
        console.log(`${colors.green}${data.choices[0].message.content}${colors.reset}`);
        
        return true;

    } catch (error) {
        console.log(`\n${colors.red}${colors.bold}❌ DeepSeek API Connection Failed${colors.reset}`);
        console.log(`${colors.red}Error: ${error.message}${colors.reset}`);
        
        // Provide helpful error explanations
        if (error.message.includes('401')) {
            console.log(`${colors.yellow}💡 This usually means your API key is invalid or expired.${colors.reset}`);
        } else if (error.message.includes('429')) {
            console.log(`${colors.yellow}💡 Rate limit exceeded. Wait a moment and try again.${colors.reset}`);
        } else if (error.message.includes('insufficient_quota')) {
            console.log(`${colors.yellow}💡 Your DeepSeek account has insufficient credits.${colors.reset}`);
        } else if (error.message.includes('model_not_found')) {
            console.log(`${colors.yellow}💡 The selected model is not available for your account.${colors.reset}`);
        } else if (error.message.includes('fetch')) {
            console.log(`${colors.yellow}💡 Network error. Check your internet connection.${colors.reset}`);
        }
        
        return false;
    }
}

// Quick test prompts
const quickTests = {
    '1': {
        name: 'Simple Greeting',
        prompt: 'Hello! Please respond with a brief greeting to test the API.'
    },
    '2': {
        name: 'Coding Question',
        prompt: 'Write a simple Python function to calculate the fibonacci sequence.'
    },
    '3': {
        name: 'Math Problem',
        prompt: 'What is 25% of 160? Please show your calculation step by step.'
    },
    '4': {
        name: 'Creative Writing',
        prompt: 'Write a short poem about artificial intelligence and the future.'
    },
    '5': {
        name: 'Technical Explanation',
        prompt: 'Explain what deep learning is in simple terms with an example.'
    },
    '6': {
        name: 'Code Review',
        prompt: 'Review this Python code and suggest improvements: def add(a, b): return a + b'
    },
    '7': {
        name: 'System Design',
        prompt: 'How would you design a simple chat application? Give me the high-level architecture.'
    }
};

// Available DeepSeek models
const models = {
    '1': 'deepseek-chat',
    '2': 'deepseek-coder',
    '3': 'deepseek-reasoner'
};

// Main function
async function main() {
    console.log(`${colors.bold}${colors.magenta}🧠 DeepSeek API Test Tool${colors.reset}`);
    console.log(`${colors.cyan}This tool will help you test your DeepSeek API key and connection.${colors.reset}`);
    console.log(`${colors.yellow}Get your API key from: https://platform.deepseek.com/api_keys${colors.reset}\n`);

    // Get API key
    const apiKey = await askQuestion('Enter your DeepSeek API key: ');
    
    if (!apiKey || apiKey.length < 10) {
        console.log(`${colors.red}❌ Invalid API key format. Please enter a valid DeepSeek API key.${colors.reset}`);
        rl.close();
        return;
    }

    // Select model
    console.log(`\n${colors.bold}Available DeepSeek Models:${colors.reset}`);
    console.log('1. deepseek-chat (General conversation and tasks)');
    console.log('2. deepseek-coder (Specialized for coding tasks)');
    console.log('3. deepseek-reasoner (Advanced reasoning capabilities)');
    
    const modelChoice = await askQuestion('Choose model (1-3): ');
    const selectedModel = models[modelChoice] || 'deepseek-chat';
    
    console.log(`${colors.cyan}Selected model: ${selectedModel}${colors.reset}`);

    // Select test type
    console.log(`\n${colors.bold}Quick Test Options:${colors.reset}`);
    Object.entries(quickTests).forEach(([key, test]) => {
        console.log(`${key}. ${test.name}`);
    });
    console.log('8. Custom prompt');

    const testChoice = await askQuestion('Choose test (1-8): ');
    
    let prompt;
    if (testChoice === '8') {
        prompt = await askQuestion('Enter your custom prompt: ');
    } else {
        const test = quickTests[testChoice];
        if (test) {
            prompt = test.prompt;
            console.log(`${colors.cyan}Using prompt: ${test.name}${colors.reset}`);
        } else {
            prompt = quickTests['1'].prompt; // Default to greeting
            console.log(`${colors.yellow}Invalid choice, using default greeting test.${colors.reset}`);
        }
    }

    // Test the API
    const success = await testDeepSeek(apiKey, selectedModel, prompt);
    
    if (success) {
        console.log(`\n${colors.green}${colors.bold}🎉 Your DeepSeek API is working perfectly!${colors.reset}`);
        console.log(`${colors.green}You can now use this API key in your projects.${colors.reset}`);
        
        // Show integration example
        console.log(`\n${colors.bold}${colors.cyan}Integration Example:${colors.reset}`);
        console.log(`${colors.yellow}Base URL: https://api.deepseek.com/v1/chat/completions${colors.reset}`);
        console.log(`${colors.yellow}Model: ${selectedModel}${colors.reset}`);
        console.log(`${colors.yellow}Authorization: Bearer ${apiKey.substring(0, 10)}...${colors.reset}`);
        
        // Ask if user wants to test another prompt
        const testAgain = await askQuestion('\nWould you like to test another prompt? (y/n): ');
        if (testAgain.toLowerCase() === 'y') {
            console.log('\n' + '='.repeat(60));
            main(); // Restart the process
            return;
        }
    } else {
        console.log(`\n${colors.red}${colors.bold}🔧 Please check your API key and try again.${colors.reset}`);
        console.log(`${colors.yellow}Common solutions:${colors.reset}`);
        console.log('• Make sure your API key is correct');
        console.log('• Check your DeepSeek account has sufficient credits');
        console.log('• Verify your account has access to the selected model');
        console.log('• Try again in a few minutes if you hit rate limits');
        console.log('• Visit https://platform.deepseek.com for account details');
    }

    rl.close();
}

// Function to test streaming (bonus feature)
async function testDeepSeekStream(apiKey, model, prompt) {
    try {
        console.log(`\n${colors.blue}🔄 Testing DeepSeek Streaming API...${colors.reset}`);
        
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 150,
                temperature: 0.7,
                stream: true
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        console.log(`\n${colors.green}${colors.bold}🌊 Streaming Response:${colors.reset}`);
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') {
                        console.log(`\n${colors.green}Stream completed!${colors.reset}`);
                        return true;
                    }
                    
                    try {
                        const json = JSON.parse(data);
                        if (json.choices && json.choices[0].delta.content) {
                            process.stdout.write(colors.green + json.choices[0].delta.content + colors.reset);
                        }
                    } catch (e) {
                        // Skip invalid JSON
                    }
                }
            }
        }
        
        return true;
    } catch (error) {
        console.log(`\n${colors.red}Streaming failed: ${error.message}${colors.reset}`);
        return false;
    }
}

// Helper function to ask questions
function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

// Handle errors gracefully
process.on('unhandledRejection', (error) => {
    console.log(`\n${colors.red}❌ Unexpected error: ${error.message}${colors.reset}`);
    rl.close();
});

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
    console.log(`${colors.red}❌ This script requires Node.js 18+ (for built-in fetch support)${colors.reset}`);
    console.log(`${colors.yellow}Please update Node.js or install node-fetch package.${colors.reset}`);
    process.exit(1);
}

// Start the application
main().catch(console.error);
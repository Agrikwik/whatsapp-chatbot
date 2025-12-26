const AgriKwikProcessor = require('./src/services/agriKwikProcessor');

console.log('Testing AgriKwik Bot Logic\n');

const testCases = [
  { input: 'hi', description: 'Greeting' },
  { input: 'menu', description: 'Main menu' },
  { input: '1', description: 'Option 1 - Official Stores' },
  { input: '2', description: 'Option 2 - Agro-dealers' },
  { input: '3', description: 'Option 3 - Rent Equipment' },
  { input: 'help', description: 'Help request' },
  { input: 'tractors', description: 'Keyword: tractors' },
  { input: 'what can you do?', description: 'Question' }
];

testCases.forEach((test, index) => {
  console.log(`\n${index + 1}. ${test.description}`);
  console.log('═'.repeat(50));
  console.log(`📥 Input: "${test.input}"`);
  console.log('─'.repeat(30));
  const response = AgriKwikProcessor.generateResponse(test.input);
  console.log(`📤 Response (${response.length} chars):`);
  console.log(response);
  console.log('═'.repeat(50));
});

console.log('\n✅ AgriKwik Bot Logic Test Complete!');


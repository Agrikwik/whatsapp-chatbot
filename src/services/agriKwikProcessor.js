const whatsappService = require('./whatsappService');

class AgriKwikProcessor {
  async processMessage(sender, text) {
    console.log(`Processing for farmer ${sender}: "${text}"`);
    
    try {
      // Generate response based on message
      const response = this.generateResponse(text);
      
      // Send response
      await whatsappService.sendTextMessage(sender, response);
      
      console.log(`✅ Response sent to ${sender}`);
      
    } catch (error) {
      console.error(`❌ Failed to process for ${sender}:`, error.message);
      
      // Send error message
      try {
        await whatsappService.sendTextMessage(sender, 
          'Sorry, experiencing technical issues. Please try again.'
        );
      } catch (e) {
        console.error('Failed to send error message:', e.message);
      }
    }
  }

  generateResponse(input) {
    const text = (input || '').toLowerCase().trim();
    
    // Handle empty message
    if (!text) {
      return this.getWelcomeMessage();
    }
    
    // Handle greetings
    if (this.isGreeting(text)) {
      return this.getWelcomeMessage();
    }
    
    // Handle menu request
    if (text === 'menu' || text === 'agrikwik' || text === 'options') {
      return this.getMainMenu();
    }
    
    // Handle numeric options
    if (['1', '2', '3'].includes(text)) {
      return this.handleMenuOption(text);
    }
    
    // Handle text options
    if (text.includes('store') || text.includes('official')) {
      return this.handleMenuOption('1');
    }
    
    if (text.includes('dealer') || text.includes('agro-dealer') || text.includes('supplier')) {
      return this.handleMenuOption('2');
    }
    
    if (text.includes('rent') || text.includes('share') || text.includes('equipment') || text.includes('tractor')) {
      return this.handleMenuOption('3');
    }
    
    // Handle help
    if (text.includes('help') || text === '?') {
      return this.getHelpMessage();
    }
    
    // Default response
    return `I'm not sure about "${input}".\n\n` + this.getMainMenu();
  }

  isGreeting(text) {
    const greetings = ['hi', 'hello', 'hey', 'hie', 'greetings', 'morning', 'afternoon'];
    return greetings.includes(text) || greetings.some(g => text.startsWith(g));
  }

  getWelcomeMessage() {
    return `*Welcome to AgriKwik!*\n\n` +
           `Your digital agriculture marketplace.\n` +
           `Buy farm inputs, rent equipment, and connect with trusted agro-suppliers, safely and easily.\n\n` +
           `To get started, reply with:\n` +
           `📋 *"MENU"* - See all options\n` +
           `🆘 *"HELP"* - Get assistance\n\n` +
           `_Serving farmers 24/7_`;
  }

  getMainMenu() {
    return `📋 *AGRIKWIK MENU*\n\n` +
           `1️⃣ *Official Stores*\n` +
           `   Buy directly from verified agricultural brands\n\n` +
           `2️⃣ *Agro-dealers*\n` +
           `   Find trusted agro-dealers near you\n\n` +
           `3️⃣ *Rent & Share*\n` +
           `   Rent tractors, tools & farm equipment\n\n` +
           `*Reply with the number (1, 2, or 3) of your choice.*\n` +
           `Or type MENU to see this again.`;
  }

  handleMenuOption(option) {
    const responses = {
      '1': `🏬 *Official Stores*\n\n` +
           `Connect directly with trusted agricultural brands:\n\n` +
           `• *Pannar* - Quality hybrid seeds\n` +
           `• *Malawi Fertilizer Company* - Premium fertilizers\n` +
           `• *Seed Co Malawi* - Certified seed vatieties\n` +
           `• *Agro-input Sppliers Limited* - Seeds & chemicals\n\n` +
           `*Would you like to:*\n` +
           `A. Browse products by category\n` +
           `B. Get price quotes\n` +
           `C. Contact brand representative\n\n` +
           `Reply A, B, or C\n` +
           `Or type MENU to go back.`,
      
      '2': `👨‍🌾 *Agro-dealers Near You*\n\n` +
           `Find verified agro-dealers in your area:\n\n` +
           `📍 *Search by:*\n` +
           `• Location (District/village)\n` +
           `• Product type (seeds, fertilizers, tools)\n` +
           `• Rating (top-rated dealers)\n\n` +
           `*Available:*\n` +
           `Lilongwe (45), Blantyre (32), Nzuzu (28)\n` +
           `Mangochi (18), Balaka (24), Zomba (15)\n\n` +
           `Reply with your district to find dealers.\n` +
           `Or type MENU to go back.`,
      
      '3': `🚜 *Rent & Share Equipment*\n\n` +
           `Available for rent in your area:\n\n` +
           `🔧 *Equipment List:*\n` +
           `• Tractors (4WD) - From MWK 3,500/day\n` +
           `• Ploughs & Harrows - MWK 800/day\n` +
           `• Planters & Seeders - MWK 1,200/day\n` +
           `• Harvesters - From MWK 6,000/day\n` +
           `• Irrigation pumps - MWK 1,500/day\n\n` +
           `*To proceed:*\n` +
           `1. Tell us your location\n` +
           `2. Choose equipment type\n` +
           `3. Select rental dates\n\n` +
           `Reply with your LOCATION to continue.\n` +
           `Or type MENU to go back.`
    };
    
    return responses[option] || `Please choose 1, 2, or 3 from the menu.`;
  }

  getHelpMessage() {
    return `🆘 *AgriKwik Help*\n\n` +
           `*Common Commands:*\n` +
           `• HI / HELLO - Start conversation\n` +
           `• MENU - Show all options\n` +
           `• 1, 2, 3 - Select menu option\n` +
           `• HELP - Show this message\n\n` +
           `*Need assistant support?*\n` +
           `Call: +265 888 44 42 22\n` +
           `Email: agriKwik@gmail.com\n\n` +
           `We're here 24/7 to help farmers!`;
  }
}

module.exports = new AgriKwikProcessor();

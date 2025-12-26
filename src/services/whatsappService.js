const axios = require('axios');

class WhatsAppService {
  constructor() {
    this.accessToken = process.env.META_ACCESS_TOKEN;
    this.phoneNumberId = process.env.META_PHONE_NUMBER_ID;
    this.apiVersion = 'v19.0'; // Latest stable version
    this.baseURL = `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}`;
  }

  // Send text message
  async sendTextMessage(to, text) {
    try {
      console.log(`📤 Sending to ${to}: ${text.substring(0, 50)}...`);
      
      const response = await axios.post(
        `${this.baseURL}/messages`,
        {
          messaging_product: 'whatsapp',
          to: this.formatPhoneNumber(to),
          type: 'text',
          text: {
            body: text
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Message sent successfully:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ WhatsApp API Error:');
      console.error('Status:', error.response?.status);
      console.error('Response:', error.response?.data);
      console.error('Message:', error.message);
      throw error;
    }
  }

  // Send interactive buttons (for menu)
  async sendMenuButtons(to, text, buttons) {
    try {
      const response = await axios.post(
        `${this.baseURL}/messages`,
        {
          messaging_product: 'whatsapp',
          to: this.formatPhoneNumber(to),
          type: 'interactive',
          interactive: {
            type: 'button',
            body: {
              text: text
            },
            action: {
              buttons: buttons.map((btn, index) => ({
                type: 'reply',
                reply: {
                  id: `btn_${index + 1}`,
                  title: btn.title
                }
              }))
            }
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error sending buttons:', error.response?.data || error.message);
      // Fallback to text
      return this.sendTextMessage(to, text);
    }
  }

  // Format phone number (remove +)
  formatPhoneNumber(phone) {
    // Remove all non-digit characters except +
    let clean = phone.replace(/[^\d+]/g, '');
    
    // Remove leading + if present
    if (clean.startsWith('+')) {
      clean = clean.substring(1);
    }
    
    return clean;
  }

  // Verify webhook signature (for security)
  verifyWebhookSignature(payload, signature) {
    // For now, we'll trust all. In production, implement HMAC verification
    return true;
  }
}

module.exports = new WhatsAppService();
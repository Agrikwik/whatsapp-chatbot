const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Admin control
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);


// Import services
const whatsappService = require('./services/whatsappService');
const agriKwikProcessor = require('./services/agriKwikProcessor');

// ==================== ROUTES ====================

// Health Check
app.get('/', (req, res) => {
  res.json({
    service: 'AgriKwik WhatsApp Bot',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: 'GET /health',
      webhook: 'GET/POST /webhook',
      test: 'POST /test-message'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'AgriKwik WhatsApp API',
    version: '1.0.0',
    uptime: process.uptime()
  });
});

function verifySignature(payload, signature, appSecret) {
    const expectedSignature = crypto
      .createHmac('sha256', appSecret)
      .update(payload)
      .digest('hex');
    
    return signature === `sha256=${expectedSignature}`;
  }

  app.post('/webhook', (req, res) => {
    const signature = req.headers['x-hub-signature-256'];
    const appSecret = process.env.META_APP_SECRET;
    
    if (appSecret) {
      const rawBody = JSON.stringify(req.body);
      if (!verifySignature(rawBody, signature, appSecret)) {
        console.error('❌ Invalid webhook signature');
        return res.status(401).send('Invalid signature');
      }
    }

// Webhook Verification (Meta requirement)
//app.get('/webhook', (req, res) => {
  //const mode = req.query['hub.mode'];
  //const token = req.query['hub.verify_token'];
  //const challenge = req.query['hub.challenge'];

  //console.log('🔍 Webhook verification attempt:', { mode, token });

  // Verify the token
  const verifyToken = process.env.WEBHOOK_VERIFY_TOKEN || 'agrikwik_verify_2024';
  
  if (mode === 'subscribe' && token === verifyToken) {
    console.log('✅ Webhook verified successfully');
    return res.status(200).send(challenge);
  }

  console.log('❌ Webhook verification failed');
  res.status(403).send('Verification failed');
});

// Receive WhatsApp Messages
app.post('/webhook', async (req, res) => {
  console.log('📨 Webhook received');
  
  // Return 200 immediately (Meta requirement)
  res.status(200).send('EVENT_RECEIVED');
  
  // Process the webhook asynchronously
  try {
    const body = req.body;
    
    // Check if it's a WhatsApp message
    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      
      // Handle messages
      if (value?.messages) {
        const message = value.messages[0];
        const sender = message.from;
        const text = message.text?.body || '';
        
        console.log(`📱 Message from ${sender}: "${text}"`);
        
        // Process with AgriKwik logic
        await agriKwikProcessor.processMessage(sender, text);
      }
      
      // Handle message status updates
      if (value?.statuses) {
        console.log('📊 Message status update:', value.statuses[0]);
      }
    }
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
  }
});

// Test endpoint (send message manually)
app.post('/test-message', async (req, res) => {
  try {
    const { phone, message } = req.body;
    
    if (!phone || !message) {
      return res.status(400).json({ error: 'Phone and message required' });
    }
    
    const result = await whatsappService.sendTextMessage(phone, message);
    res.json({ success: true, result });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('💥 Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
AGRIKWIK WHATSAPP BOT STARTED
───────────────────────────────
✅ Server running: http://localhost:${PORT}
✅ Health check:   http://localhost:${PORT}/health
✅ Webhook:        http://localhost:${PORT}/webhook

🔑 Environment Check:
- META_ACCESS_TOKEN: ${process.env.META_ACCESS_TOKEN ? '✅ Set' : '❌ Missing'}
- META_PHONE_NUMBER_ID: ${process.env.META_PHONE_NUMBER_ID ? '✅ Set' : '❌ Missing'}

⚠️  Next Steps:
1. Update .env with Meta credentials
2. Start ngrok: ngrok http ${PORT}
3. Configure webhook in Meta Developer Portal
`);
});
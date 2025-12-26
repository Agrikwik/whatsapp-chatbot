const express = require('express');
const router = express.Router();

// Basic stats endpoint
router.get('/stats', (req, res) => {
  res.json({
    service: 'AgriKwik WhatsApp Bot',
    status: 'active',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    farmers_served: 0, // Add database later
    messages_today: 0
  });
});

// Message log
router.get('/messages', (req, res) => {
  // Return recent messages (implement with DB)
  res.json([]);
});

module.exports = router;


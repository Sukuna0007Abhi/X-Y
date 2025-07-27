const express = require('express');
const router = express.Router();

// Mock trending data
const trending = [
  { topic: '#ReactNative', tweets: '1.7M' },
  { topic: '#Expo', tweets: '1.2M' },
  { topic: '#JavaScript', tweets: '2.1M' },
  { topic: '#TypeScript', tweets: '900K' },
  { topic: '#MobileDevelopment', tweets: '1.5M' },
];

router.get('/', (req, res) => {
  res.json(trending);
});

module.exports = router;

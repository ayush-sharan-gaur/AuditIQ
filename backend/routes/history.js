const express = require('express');
const { getSessions } = require('../utils/store');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ sessions: getSessions() });
});

module.exports = router;
const express = require('express');
const router = express.Router();

const StoreItem = require('../models/StoreItem');

router.get('/items', async (req, res) => {
  const items = await StoreItem.find();
  res.json(items);
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { getRightSlice } = require('../utils');

router.get('/', (req, res) => {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 20;
    const minId = req.query.minId ? parseInt(req.query.minId) : undefined;

    const items = getRightSlice(offset, limit, minId);
    res.json({ items });
});

module.exports = router;
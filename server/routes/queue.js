const express = require('express');
const router = express.Router();
const { enqueueAdd, enqueueAction } = require('../queue');

router.post('/', (req, res) => {
    const { type, payload } = req.body;

    if (type === 'ADD') {
        const queued = enqueueAdd(payload.id);
        return res.json({ queued });
    } else if (['SELECT','DESELECT','REORDER'].includes(type)) {
        enqueueAction({ type, payload });
        return res.json({ queued: true });
    } else {
        return res.status(400).json({ error: 'Unknown type' });
    }
});

module.exports = router;

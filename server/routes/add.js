const express = require('express');
const {isItemPresent} = require("../utils");
const {addedSet} = require("../state");
const router = express.Router();

router.post('/', (req, res) => {
    const { id } = req.body;

    const numId = Number(id);
    if (!numId || numId <= 0) {
        return res.status(400).json({ error: "Неверный ID" });
    }

    if (isItemPresent(numId)) {
        return res.status(400).json({ error: "ID уже сущесвтует" });
    }

    addedSet.add(numId);

    return res.json({ ok: true, id: numId });
});

module.exports = router;
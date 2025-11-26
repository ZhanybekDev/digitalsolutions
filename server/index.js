const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const itemsRouter = require('./routes/items');
const selectedRouter = require('./routes/selected');
const queueRouter = require('./routes/queue');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/items', itemsRouter);
app.use('/api/selected', selectedRouter);
app.use('/api/queue', queueRouter);

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

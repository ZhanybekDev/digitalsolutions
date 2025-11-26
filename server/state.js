const initialRange = { start: 1, end: 1_000_000 };
const addedSet = new Set();
const deletedSet = new Set();
const selectedSet = new Set();
const selectedOrder = [];

const addQueueMap = new Map();
const actionQueue = [];

module.exports = {
    initialRange,
    addedSet,
    deletedSet,
    selectedSet,
    selectedOrder,
    addQueueMap,
    actionQueue
};
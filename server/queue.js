const { addQueueMap, actionQueue, selectedSet, selectedOrder, addedSet } = require('./state');

function enqueueAdd(id) {
    if (addedSet.has(id) || addQueueMap.has(id)) return false;
    addQueueMap.set(id, { type: 'ADD', payload: { id } });
    return true;
}

function enqueueAction(action) {
    const lastIndex = actionQueue.findIndex(a => a.type === action.type && a.payload?.id === action.payload?.id);
    if (lastIndex >= 0) actionQueue.splice(lastIndex, 1);
    actionQueue.push(action);
}

function processAddQueue() {
    addQueueMap.forEach((task, id) => {
        if (!addedSet.has(id)) addedSet.add(id);
        addQueueMap.delete(id);
    });
}

function processActionQueue() {
    while (actionQueue.length > 0) {
        const task = actionQueue.shift();
        const { type, payload } = task;
        if (type === 'SELECT') {
            if (!selectedSet.has(payload.id)) {
                selectedSet.add(payload.id);
                selectedOrder.push(payload.id);
            }
        } else if (type === 'DESELECT') {
            if (selectedSet.has(payload.id)) {
                selectedSet.delete(payload.id);
                const index = selectedOrder.indexOf(payload.id);
                if (index !== -1) selectedOrder.splice(index, 1);
            }
        } else if (type === 'REORDER') {
            selectedOrder.splice(0, selectedOrder.length, ...payload.order.filter(id => selectedSet.has(id)));
        }
    }
}

setInterval(processAddQueue, 10_000);
setInterval(processActionQueue, 1_000);

module.exports = { enqueueAdd, enqueueAction };

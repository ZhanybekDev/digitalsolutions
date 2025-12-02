const { initialRange, addedSet, deletedSet, selectedSet, selectedOrder } = require('./state');

function isItemPresent(id) {
    return (
        (id >= initialRange.start && id <= initialRange.end || addedSet.has(id)) &&
        !deletedSet.has(id)
    );
}

function makeItem(id) {
    return { id, label: String(id) };
}

function getLeftSlice(offset = 0, limit = 20, prefix) {
    const result = [];
    let count = 0;

    const start = initialRange.start;
    const end = initialRange.end;

    const matchesPrefix = prefix
        ? (id) => String(id).includes(String(prefix))
        : () => true;

    for (let id = start; id <= end; id++) {

        if (!matchesPrefix(id)) continue;

        if (!isItemPresent(id)) continue;

        if (selectedSet.has(id)) continue;

        if (count++ < offset) continue;

        result.push(makeItem(id));

        if (result.length >= limit) break;
    }

    const addedFiltered = Array.from(addedSet)
        .filter(id => !selectedSet.has(id))
        .filter(id => matchesPrefix(id))
        .slice(offset, offset + (limit - result.length))
        .map(makeItem);

    return result.concat(addedFiltered);
}


function getRightSlice(offset = 0, limit = 20, prefix) {
    const matchesPrefix = prefix
        ? (id) => String(id).includes(String(prefix))
        : () => true;

    const filtered = selectedOrder.filter(id => {
        if (!isItemPresent(id)) return false;
        if (!matchesPrefix(id)) return false;
        return true;
    });

    return filtered
        .slice(offset, offset + limit)
        .map(makeItem);
}


module.exports = { isItemPresent, makeItem, getLeftSlice, getRightSlice };

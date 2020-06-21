// MinimumEditDistance
const minimumEditDistance = require("../helper/minimumEditDistance");
const backtrace = require("./backtrace");

// Types
const { INSERT, DELETE, REPLACE } = require("../types.js");

// Operations
const {
  otObjectInsert,
  otObjectDelete,
  otObjectReplace,
} = require("../operations");

const transformObject = (path) => (currentObject, nextObject) => {
  // since objects have unique keys sort can be used to stabelize order
  const currentList = Object.keys(currentObject).sort();
  const nextList = Object.keys(nextObject).sort();

  // same keys - dont execute object operation
  if (
    currentList.length === nextList.length &&
    currentList.every((entry, index) => nextList[index] === entry)
  )
    return [];

  // remove common keys from list
  const currentFiltered = currentList.filter(
    (entry) => !nextList.includes(entry)
  );
  const nextFiltered = nextList.filter((entry) => !currentList.includes(entry));

  const matrix = minimumEditDistance(currentFiltered, nextFiltered);
  const operations = backtrace(matrix, currentFiltered, nextFiltered);

  const collection = Array.isArray(path) ? path : [path];

  const transformations = [];
  for (const [op, offset, value] of operations) {
    const insertValue = {
      [value]: nextObject[value],
    };

    const deleteKey = currentFiltered[offset];
    const deleteValue = currentObject[currentFiltered[offset]];

    if (op === DELETE) {
      transformations.push(otObjectDelete(collection, value, deleteValue));
    } else if (op === INSERT) {
      transformations.push(otObjectInsert(collection, value, insertValue));
    } else if (op === REPLACE) {
      transformations.push(
        otObjectReplace(collection, deleteKey, deleteValue, insertValue)
      );
    }
  }

  return transformations;
};

module.exports = transformObject;

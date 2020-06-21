const { nanoid } = require("nanoid");

// MinimumEditDistance
const minimumEditDistance = require("../helper/minimumEditDistance");
const backtrace = require("./backtrace");

// Types
const { INSERT, DELETE, REPLACE } = require("../types.js");

// Operations
const {
  otListInsert,
  otListDelete,
  otListReplace,
  otListMapping,
} = require("../operations");

const copy = (obj) => JSON.parse(JSON.stringify(obj));

// object references need to be compared to ensure equality
const isPrimitive = (value) => {
  const type = typeof value;

  return type === "string" || type === "number";
};

// how do i recognize if object is same
// allow to specify comapre key or function
const compareKeys = ["id", "_id"];
const hasSameIdentifier = (current, next) => {
  for (const key of compareKeys) {
    if (current[key] && current[key] === next[key]) {
      return true;
    }
  }

  return false;
};

// reference or key
const replaceReferences = (currentList, nextList) => {
  const restoreMap = {};

  for (let i = 0; i < currentList.length; i++) {
    for (let j = 0; j < nextList.length; j++) {
      if (isPrimitive(currentList[i]) || isPrimitive(nextList[j])) continue;

      const hasSameReference = currentList[i] === nextList[j];
      const hasSameId = hasSameIdentifier(currentList[i], nextList[j]);

      if (hasSameReference || hasSameId) {
        // replace with unique id to preserve objects
        const unique_id = nanoid();

        restoreMap[unique_id] = [copy(currentList[i]), copy(nextList[j])];

        currentList[i] = unique_id;
        nextList[j] = unique_id;
      }
    }
  }

  return restoreMap;
};

const restoreReferences = (currentList, nextList, restoreMap) => {
  for (const [key, value] of Object.entries(restoreMap)) {
    for (let i = 0; i < currentList.length; i++) {
      const shouldReplace = currentList[i] === key;

      if (shouldReplace) currentList[i] = value[0];
    }
    for (let i = 0; i < nextList.length; i++) {
      const shouldReplace = nextList[i] === key;

      if (shouldReplace) nextList[i] = value[1];
    }
  }
};

const transformList = (path) => (currentList, nextList) => {
  if (currentList.length === 0 && nextList.length === 0) return [];

  // better implementation
  const restoreMap = replaceReferences(currentList, nextList);

  const matrix = minimumEditDistance(currentList, nextList);
  const operations = backtrace(matrix, currentList, nextList);

  const collection = Array.isArray(path) ? path : [path];

  restoreReferences(currentList, nextList, restoreMap);

  const transformations = [];
  for (const [op, offset, value] of operations) {
    const originalValue = (restoreMap[value] && restoreMap[value][1]) || value;

    if (op === DELETE) {
      transformations.push(otListDelete(collection, offset, originalValue));
    } else if (op === INSERT) {
      transformations.push(otListInsert(collection, offset, originalValue));
    } else if (op === REPLACE) {
      transformations.push(
        otListReplace(collection, offset, currentList[offset], originalValue)
      );
    } else {
      transformations.push(otListMapping(collection, value));
    }
  }

  return transformations;
};

module.exports = transformList;

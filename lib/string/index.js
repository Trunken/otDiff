// String functions
const minimumEditDistance = require("../helper/minimumEditDistance");
const backtrace = require("./backtrace");

// OT Types
const { INSERT, DELETE } = require("../types.js");

// Operations
const { otStringDelete, otStringInsert } = require("../operations");

const transformString = (path) => (oldString, newString) => {
  if (oldString === newString) return [];

  const matrix = minimumEditDistance(oldString, newString);
  const operations = backtrace(matrix, oldString, newString);

  const collection = Array.isArray(path) ? path : [path];

  const transformations = [];
  for (const [op, offset, value] of operations) {
    if (op === DELETE) {
      transformations.push(otStringDelete(collection, offset, value));
    } else if (op === INSERT) {
      transformations.push(otStringInsert(collection, offset, value));
    }
  }

  return transformations;
};

module.exports = transformString;

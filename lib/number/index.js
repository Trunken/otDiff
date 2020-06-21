const { otNumberAdd } = require("../operations");

const transformNumber = (path) => (currentNumber, nextNumber) => {
  const diff = nextNumber - currentNumber;

  // micro optimization - dont create object if no change
  if (diff === 0) return [];

  const collection = Array.isArray(path) ? path : [path];

  return [otNumberAdd(collection, diff)];
};

module.exports = transformNumber;

// OT Types
const { NOOP, DELETE, INSERT, REPLACE } = require("../types.js");

const optimizeBacktrace = (operations) => {
  const transformations = [];

  for (let i = 0; i < operations.length; i++) {
    const [operation, value] = operations[i];

    if (operation === NOOP) {
      continue;
    } else if (operation === REPLACE) {
      let [oldValue, nextValue] = value;

      let j = i;
      let deleteString = oldValue;
      let insertString = nextValue;

      // unify consecutive replace and resolve them optimized
      while (j + 1 < operations.length && operations[j + 1][0] === operation) {
        [oldValue, nextValue] = operations[j + 1][1];

        deleteString += oldValue;
        insertString += nextValue;

        j++;
      }

      transformations.push([DELETE, i, deleteString]);
      transformations.push([INSERT, i, insertString]);

      i = j;
    } else {
      let j = i;
      let partialString = value;

      // unify consecutive operations of same type
      while (j + 1 < operations.length && operations[j + 1][0] === operation) {
        partialString += operations[j + 1][1];
        j++;
      }

      transformations.push([operation, i, partialString]);
      i = j;
    }
  }

  return transformations;
};

// fix consecutive deletes wrong index

const backtrace = (matrix, m, n) => {
  let i = matrix.length - 1;
  let j = matrix[0].length - 1;

  // let opIndex = Math.max(i, j);
  // const operations = new Array(opIndex);
  const operations = [];

  if (i === 0) {
    return optimizeBacktrace([[INSERT, n[0]]]);
  } else if (j === 0) {
    return optimizeBacktrace([[DELETE, m[0]]]);
  }

  while (i > 0 || j > 0) {
    // opIndex--;

    if (i > 0 && matrix[i - 1][j] + 1 === matrix[i][j]) {
      operations.unshift([DELETE, m[i - 1]]);
      i--;
    } else if (j > 0 && matrix[i][j - 1] + 1 === matrix[i][j]) {
      operations.unshift([INSERT, n[j - 1]]);
      j--;
    } else if (i > 0 && j > 0 && matrix[i - 1][j - 1] + 1 === matrix[i][j]) {
      operations.unshift([REPLACE, [m[i - 1], n[j - 1]]]);
      i--;
      j--;
    } else if (i > 0 && j > 0 && matrix[i - 1][j - 1] === matrix[i][j]) {
      operations.unshift([NOOP, n[j - 1]]);
      i--;
      j--;
    }
  }

  return optimizeBacktrace(operations);
};

module.exports = backtrace;

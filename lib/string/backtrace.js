// OT Types
const { NOOP, DELETE, INSERT, REPLACE } = require("../types.js");

const optimizeBacktrace = (operations) => {
  const transformations = [];

  let offset = 0;
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

      transformations.push([operation, i - offset, partialString]);
      i = j;

      // correct laster indizes if deletes happend earlier
      if (operation === DELETE) {
        offset += partialString.length;
      }
    }
  }

  return transformations;
};

const backtrace = (matrix, m, n) => {
  let i = matrix.length - 1;
  let j = matrix[0].length - 1;

  const operations = [];

  if (i === 0) {
    // old string empty => only inserts
    return optimizeBacktrace(n.split("").map((char) => [INSERT, char]));
  } else if (j === 0) {
    // new string empty => only deletes
    return optimizeBacktrace(m.split("").map((char) => [DELETE, char]));
  }

  while (i > 0 || j > 0) {
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

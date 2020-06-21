// OT Types
const { NOOP, DELETE, INSERT, REPLACE } = require("../types.js");

const optimizeBacktrace = (operations) => {
  const transformations = [];

  for (let i = 0; i < operations.length; i++) {
    const [operation, value] = operations[i];

    // if (operation === NOOP) {
    //   continue;
    // } else {
    transformations.push([operation, i, value]);
    // }
  }

  return transformations;
};

const backtrace = (matrix, m, n) => {
  // let actions = "Start";
  let i = matrix.length - 1;
  let j = matrix[0].length - 1;

  let opIndex = Math.max(i, j);
  const operations = new Array(opIndex);

  if (i === 0) {
    operations[0] = [INSERT, n[0]];
  } else if (j === 0) {
    operations[0] = [DELETE, m[0]];
  }

  while (i > 0 || j > 0) {
    opIndex--;

    if (i > 0 && matrix[i - 1][j] + 1 === matrix[i][j]) {
      operations[opIndex] = [DELETE, m[i - 1]];
      i--;
    } else if (j > 0 && matrix[i][j - 1] + 1 === matrix[i][j]) {
      operations[opIndex] = [INSERT, n[j - 1]];
      j--;
    } else if (i > 0 && matrix[i - 1][j - 1] + 1 === matrix[i][j]) {
      operations[opIndex] = [REPLACE, n[j - 1]];

      i--;
      j--;
    } else if (i > 0 && matrix[i - 1][j - 1] === matrix[i][j]) {
      // noop operation for internal array mapping
      operations[opIndex] = [NOOP, [i - 1, j - 1]];
      i--;
      j--;
    }
  }

  return optimizeBacktrace(operations);
};

module.exports = backtrace;

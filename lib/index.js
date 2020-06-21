const transformNumber = require("./number");
const transformString = require("./string");
const transformList = require("./list");
const transformObject = require("./object");
const operations = require("./operations");

// optimize by making iterative
function traverse(current, next, path) {
  const currentType = typeof current;
  if (currentType === "number") {
    return transformNumber(path)(current, next);
  } else if (currentType === "string") {
    return transformString(path)(current, next);
  } else if (Array.isArray(next)) {
    const operations = transformList(path)(current, next);

    return operations.flatMap((op, index) => {
      // if replace operation further recursion
      if (op.ld && op.li) {
        // following current value is the value which will be deleted
        const currentValue = op.ld;
        // following next value is the value which will be inserteds
        const nextValue = op.li;

        return traverse(currentValue, nextValue, [...path, index]);
      }
      // indizes which didnt change to traverse them in next round
      else if (op.ln) {
        const [currentIndex, nextIndex] = op.ln;

        return traverse(current[currentIndex], next[nextIndex], [
          ...path,
          nextIndex,
        ]);
      }

      return op;
    });
  } else if (currentType === "object") {
    const operations = transformObject(path)(current, next);

    // get keys which didnt change to traverse them in next round
    const remainingKeys = [
      ...new Set([...Object.keys(current), ...Object.keys(next)]),
    ].filter((key) => !operations.some(({ p }) => p[p.length - 1] === key));

    return [
      ...operations,
      ...remainingKeys.flatMap((key) =>
        traverse(current[key], next[key], [...path, key])
      ),
    ];
  }
  // nothing to do
  else if (currentType === "boolean") {
    return [];
  }
}

function omniDiff(currentObject, nextObject, initialKey) {
  const current = currentObject[initialKey];
  const next = nextObject[initialKey];

  return traverse(current, next, [initialKey]);
}

module.exports = {
  // main function
  omniDiff,
  // type differ
  transformNumber,
  transformString,
  transformList,
  transformObject,
  // operations
  operations,
};

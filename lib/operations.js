// Types
const {
  PATH,
  NUMBER_ADD,
  STRING_INSERT,
  STRING_DELETE,
  LIST_INSERT,
  LIST_DELETE,
  LIST_MAPPING,
  OBJECT_INSERT,
  OBJECT_DELETE,
  DELETE,
  INSERT,
  LIST,
  OBJECT,
} = require("./types.js");

const otNumberAdd = (path, number) => {
  return { [PATH]: [...path], [NUMBER_ADD]: number };
};

const otStringInsert = (path, offset, string) => {
  return { [PATH]: [...path, offset], [STRING_INSERT]: string };
};

const otStringDelete = (path, offset, string) => {
  return { [PATH]: [...path, offset], [STRING_DELETE]: string };
};

const objectLikeInsDel = (op) => (path, index, object) => {
  return { [PATH]: [...path, index], [op]: object };
};

const objectLikeReplace = (type) => (path, index, before, after) => {
  return {
    [PATH]: [...path, index],
    [`${type}${DELETE}`]: before,
    [`${type}${INSERT}`]: after,
  };
};

// internal implementation detail - not part of spec
const otListMapping = (path, index) => {
  return { [PATH]: [...path, ...index], [LIST_MAPPING]: index };
};

module.exports = {
  // number operations
  otNumberAdd,
  // list operations
  otListInsert: objectLikeInsDel(LIST_INSERT),
  otListDelete: objectLikeInsDel(LIST_DELETE),
  otListReplace: objectLikeReplace(LIST),
  otListMapping,
  // object operations
  otObjectInsert: objectLikeInsDel(OBJECT_INSERT),
  otObjectDelete: objectLikeInsDel(OBJECT_DELETE),
  otObjectReplace: objectLikeReplace(OBJECT),
  // string operations
  otStringInsert,
  otStringDelete,
};

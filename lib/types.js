const PATH = "p";

const INSERT = "i";
const DELETE = "d";
const REPLACE = "r";
const NOOP = "n"; // implementation detail - not part of spec
const ADD = "a";
const MOVE = "m";

const STRING = "s";
const NUMBER = "n";
const LIST = "l";
const OBJECT = "o";

const NUMBER_ADD = `${NUMBER}${ADD}`;

const STRING_INSERT = `${STRING}${INSERT}`;
const STRING_DELETE = `${STRING}${DELETE}`;

const LIST_INSERT = `${LIST}${INSERT}`;
const LIST_DELETE = `${LIST}${DELETE}`;
const LIST_MAPPING = `${LIST}${NOOP}`;

const OBJECT_INSERT = `${OBJECT}${INSERT}`;
const OBJECT_DELETE = `${OBJECT}${DELETE}`;

module.exports = {
  PATH,
  INSERT,
  DELETE,
  REPLACE,
  NOOP,
  ADD,
  MOVE,
  STRING,
  NUMBER,
  LIST,
  OBJECT,
  NUMBER_ADD,
  STRING_INSERT,
  STRING_DELETE,
  LIST_INSERT,
  LIST_DELETE,
  LIST_MAPPING,
  OBJECT_INSERT,
  OBJECT_DELETE,
};

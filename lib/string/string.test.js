const transformString = require("./index");

// Operations
const { STRING_DELETE, STRING_INSERT, PATH } = require("../types");

const DUMMY_PATH = "dummy";

const INPUT_1 = "";
const INPUT_2 = "i";
const INPUT_3 = "t";

describe("String transformation", () => {
  let transformer = transformString([DUMMY_PATH]);

  it("Return empty array if numbers dont update", () => {
    const op = transformer("", "");

    expect(op).toHaveLength(0);
  });

  it("Return ot insert", () => {
    const op = transformer(INPUT_1, INPUT_2);

    expect(op[0]).toEqual({ [PATH]: [DUMMY_PATH, 0], [STRING_INSERT]: "i" });
  });

  it("Return ot delete", () => {
    const op = transformer(INPUT_2, INPUT_1);

    expect(op[0]).toEqual({ [PATH]: [DUMMY_PATH, 0], [STRING_DELETE]: "i" });
  });

  it("Converts replace into insert and delete", () => {
    const op = transformer(INPUT_2, INPUT_3);

    expect(op).toHaveLength(2);
  });

  it("Only returns operations for changes indizes", () => {
    const op = transformer(INPUT_3.repeat(5), INPUT_3.repeat(6));

    expect(op).toHaveLength(1);
  });

  it("Batch operations", () => {
    const op = transformer(INPUT_3.repeat(2), INPUT_3.repeat(6));

    expect(op).toHaveLength(1);
    expect(op[0][STRING_INSERT]).toEqual(INPUT_3.repeat(4));
  });

  it("Use transformer with path as string", () => {
    transformer = transformString(DUMMY_PATH);

    const op = transformer(INPUT_1, INPUT_2);
    expect(op).toHaveLength(1);
  });
});

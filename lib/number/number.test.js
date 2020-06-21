const transformNumber = require("./index");

// Operations
const { NUMBER_ADD, PATH } = require("../types");

const DUMMY_PATH = "dummy";

describe("Number transformation", () => {
  let transformer = transformNumber([DUMMY_PATH]);
  it("Return empty array if numbers dont update", () => {
    const op = transformer(0, 0);

    expect(op).toHaveLength(0);
  });

  it("Return ot number diff", () => {
    let op = transformer(0, 1);

    expect(op[0][NUMBER_ADD]).toEqual(1);

    op = transformer(1, 0);

    expect(op[0][NUMBER_ADD]).toEqual(-1);
  });

  it("Create valid ot", () => {
    transformer = transformNumber(DUMMY_PATH);

    const op = transformer(0, 5);

    expect(op[0]).toEqual({ [PATH]: [DUMMY_PATH], [NUMBER_ADD]: 5 });
  });
});

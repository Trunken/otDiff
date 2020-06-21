const transformList = require("./index");
const mark = require("../helper/marker");

// Operations
const { LIST_INSERT, LIST_DELETE, LIST_MAPPING } = require("../types");

const DUMMY_PATH = "dummy";

const LIST_1 = [];
const LIST_2 = [1];
const LIST_3 = [5, 5, 5];
const LIST_4 = [5, 5, 5];
const LIST_5 = [5, 6, 5];

describe("List transformation", () => {
  let transformer = transformList([DUMMY_PATH]);

  it("Return empty array if numbers dont update", () => {
    const op = transformer(LIST_1, LIST_1);

    expect(op).toHaveLength(0);
  });

  it("Inserts element", () => {
    let op = transformer(LIST_1, LIST_2);

    expect(op).toHaveLength(1);
    expect(op[0][LIST_INSERT]).toEqual(LIST_2[0]);
  });

  it("Deletes key:value pair", () => {
    let op = transformer(LIST_2, LIST_1);

    expect(op).toHaveLength(1);
    expect(op[0][LIST_DELETE]).toEqual(LIST_2[0]);
  });

  it("Replace key:value pair", () => {
    let op = transformer(LIST_4, LIST_5);

    expect(op).toHaveLength(LIST_4.length);
    expect(op[1][LIST_INSERT]).toEqual(LIST_5[1]);
    expect(op[1][LIST_DELETE]).toEqual(LIST_4[1]);
  });

  it("Op does not change anything", () => {
    let op = transformer(LIST_3, LIST_4);

    expect(op).toHaveLength(LIST_3.length);

    for (let i = 0; i < op.length; i++) {
      const [curIdx, nextIdx] = op[i][LIST_MAPPING];
      expect(LIST_3[curIdx]).toEqual(LIST_4[nextIdx]);
    }
  });

  it("Does not modify objects with same reference", () => {
    const sameReference = [1];

    let op = transformer([1, 2, sameReference], [1, 2, sameReference]);

    expect(op).toHaveLength(3);
    for (let i = 0; i < op.length; i++) {
      expect(op[i]).toHaveProperty(LIST_MAPPING);
    }

    const obj = mark({});
    const obj2 = { ...obj };

    op = transformer([1, 2, obj], [obj2, 2, 1]);

    expect(op).toHaveLength(3);
    expect(op[0]).toHaveProperty(LIST_INSERT);
    expect(op[0]).toHaveProperty(LIST_DELETE);
    expect(op[2]).toHaveProperty(LIST_INSERT);
    expect(op[2]).toHaveProperty(LIST_DELETE);
  });
});

const transformObject = require("./index");

// Operations
const { OBJECT_INSERT, OBJECT_DELETE } = require("../types");

const DUMMY_PATH = "dummy";

const OBJECT_1 = { test: "key" };
const OBJECT_2 = { test: "key", more: "keys" };
const OBJECT_3 = { test: "key", more: "keys", multiple: "inserts" };
const OBJECT_4 = { test: "key", replace: "keys", multiple: "inserts" };

describe("Object transformation", () => {
  let transformer = transformObject([DUMMY_PATH]);

  it("Return empty array if numbers dont update", () => {
    const op = transformer(OBJECT_1, OBJECT_1);

    expect(op).toHaveLength(0);
  });

  it("Inserts key:value pair", () => {
    let op = transformer(OBJECT_1, OBJECT_2);

    expect(op).toHaveLength(1);
    expect(op[0][OBJECT_INSERT]).toEqual({ more: "keys" });

    op = transformer({}, OBJECT_1);

    expect(op).toHaveLength(1);
    expect(op[0][OBJECT_INSERT]).toEqual(OBJECT_1);

    op = transformer(OBJECT_1, OBJECT_3);

    expect(op).toHaveLength(2);
    expect(op[0][OBJECT_INSERT]).toEqual({ more: "keys" });
    expect(op[1][OBJECT_INSERT]).toEqual({ multiple: "inserts" });
  });

  it("Deletes key:value pair", () => {
    let op = transformer(OBJECT_2, OBJECT_1);

    expect(op).toHaveLength(1);
    expect(op[0][OBJECT_DELETE]).toEqual(OBJECT_2["more"]);

    op = transformer(OBJECT_1, {});

    expect(op).toHaveLength(1);
    expect(op[0][OBJECT_DELETE]).toEqual(OBJECT_1["test"]);
  });

  it("Replace key:value pair", () => {
    let op = transformer(OBJECT_3, OBJECT_4);

    expect(op).toHaveLength(1);
    expect(op[0][OBJECT_DELETE]).toEqual(OBJECT_3["more"]);
    expect(op[0][OBJECT_INSERT]).toEqual({ replace: "keys" });
  });

  it("Replace key:value pair", () => {
    let op = transformer(OBJECT_3, OBJECT_4);

    expect(op).toHaveLength(1);
    expect(op[0][OBJECT_DELETE]).toEqual(OBJECT_3["more"]);
    expect(op[0][OBJECT_INSERT]).toEqual({ replace: "keys" });
  });

  it("Op does not change anything", () => {
    let op = transformer(OBJECT_4, OBJECT_4);

    expect(op).toHaveLength(0);
  });
});

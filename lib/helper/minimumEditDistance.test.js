const editDistance = require("./minimumEditDistance");

describe("Minimum Edit Distance", () => {
  it("Return distance matrix", () => {
    const STRING_1 = "old_str";
    const STRING_2 = "new_string";
    const matrix = editDistance(STRING_1, STRING_2);

    expect(matrix.length).toEqual(STRING_1.length + 1);
    expect(matrix[0].length).toEqual(STRING_2.length + 1);
  });
});

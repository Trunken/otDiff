const { omniDiff, mark } = require("./index");

// TYPES
const {
  PATH,
  NUMBER_ADD,
  STRING_INSERT,
  STRING_DELETE,
  LIST_INSERT,
  OBJECT_INSERT,
} = require("./types");

const PATH_KEY = "doc";
const createDoc = (data) => ({
  [PATH_KEY]: data,
});

// Types
describe("Test diffing", () => {
  describe("Flat structures", () => {
    it("diffs number", () => {
      const number_1 = 1;
      const number_2 = 2;

      const diff = omniDiff(createDoc(number_1), createDoc(number_2), PATH_KEY);

      expect(diff[0]).toHaveProperty(NUMBER_ADD, 1);
    });

    it("diffs string", () => {
      const string_1 = "1";
      const string_2 = "2";

      const diff = omniDiff(createDoc(string_1), createDoc(string_2), PATH_KEY);

      expect(diff[0]).toHaveProperty(STRING_INSERT, "2");
      expect(diff[1]).toHaveProperty(STRING_DELETE, "1");
    });

    it("diffs list", () => {
      const list_1 = [];
      const list_2 = [1];

      const diff = omniDiff(createDoc(list_1), createDoc(list_2), PATH_KEY);

      expect(diff[0]).toHaveProperty(LIST_INSERT, 1);
    });

    it("diffs object", () => {
      const object_1 = {};
      const object_2 = { key: 2 };

      const diff = omniDiff(createDoc(object_1), createDoc(object_2), PATH_KEY);

      expect(diff[0]).toHaveProperty(OBJECT_INSERT, { key: 2 });
    });
  });

  describe("Nested structures", () => {
    describe("Depth 1", () => {
      it("increases number in list", () => {
        const list_1 = [1, 2, 3];
        const list_2 = [1, 2, 2];

        const diff = omniDiff(createDoc(list_1), createDoc(list_2), PATH_KEY);

        expect(diff).toHaveLength(1);
        expect(diff[0]).toHaveProperty(NUMBER_ADD, -1);
        expect(diff[0][PATH]).toHaveLength(2);
      });
    });

    describe("Depth 1", () => {
      it("increases number in object", () => {
        const object_1 = { key: 1 };
        const object_2 = { key: 4 };

        const diff = omniDiff(
          createDoc(object_1),
          createDoc(object_2),
          PATH_KEY
        );

        expect(diff).toHaveLength(1);
        expect(diff[0]).toHaveProperty(NUMBER_ADD, 3);
        expect(diff[0][PATH]).toHaveLength(2);
      });
    });

    describe("Depth X", () => {
      const createNestedObject = (value, depth = 10) => {
        const obj = {};

        let tmp = obj;
        for (let i = 0; i < depth - 1; i++) {
          tmp.key = {};
          tmp = tmp.key;
        }
        tmp.key = value;

        return obj;
      };

      it("increases number in object", () => {
        const depth = 10;
        const object_1 = createNestedObject(1, depth);
        const object_2 = createNestedObject(2, depth);

        const diff = omniDiff(
          createDoc(object_1),
          createDoc(object_2),
          PATH_KEY
        );

        expect(diff).toHaveLength(1);
        expect(diff[0]).toHaveProperty(NUMBER_ADD, 1);
        // +1 for doc key
        expect(diff[0][PATH]).toHaveLength(depth + 1);
      });

      it("deletes string in object", () => {
        const depth = 10;
        const text = "test";
        const object_1 = createNestedObject(text, depth);
        const object_2 = createNestedObject("", depth);

        const diff = omniDiff(
          createDoc(object_1),
          createDoc(object_2),
          PATH_KEY
        );

        expect(diff).toHaveLength(1);
        expect(diff[0]).toHaveProperty(STRING_DELETE, text);
        // +2 for doc key and string offset
        expect(diff[0][PATH]).toHaveLength(depth + 2);
      });

      it("updates object in list in object", () => {
        const depth = 10;
        const obj1 = { test: [1] };
        const obj2 = JSON.parse(JSON.stringify(obj1));
        obj2.test[0] = 2;

        const object_1 = createNestedObject(obj1, depth);
        const object_2 = createNestedObject(obj2, depth);

        const diff = omniDiff(
          createDoc(object_1),
          createDoc(object_2),
          PATH_KEY
        );

        expect(diff).toHaveLength(1);
        expect(diff[0]).toHaveProperty(NUMBER_ADD, 1);
        // +2 for doc key and string offset +1 for object depth
        expect(diff[0][PATH]).toHaveLength(depth + 2 + 1);
      });

      it("updates multiple types in nested object", () => {
        const depth = 10;

        const obj1 = { test: [1, "a"] };
        const obj2 = JSON.parse(JSON.stringify(obj1));
        obj2.test[0] = 2;
        obj2.test[1] = "b";

        const object_1 = createNestedObject(obj1, depth);
        const object_2 = createNestedObject(obj2, depth);

        const diff = omniDiff(
          createDoc(object_1),
          createDoc(object_2),
          PATH_KEY
        );

        expect(diff).toHaveLength(3);
        expect(diff[0]).toHaveProperty(NUMBER_ADD, 1);
        // +2 for doc key and string offset +1 for object depth
        expect(diff[0][PATH]).toHaveLength(depth + 2 + 1);
        expect(diff[1]).toHaveProperty(STRING_INSERT, "b");
        expect(diff[2]).toHaveProperty(STRING_DELETE, "a");
        expect(diff[1][PATH]).toHaveLength(depth + 2 + 2);
      });
    });
  });
});

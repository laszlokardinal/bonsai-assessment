import { createDataReducer } from "./index.js";

describe("createDataReducer", () => {
  it("returns an empty object as initial state", () => {
    expect(
      createDataReducer("testRecords")(undefined, { type: "INIT" })
    ).to.deep.equal({});
  });

  it("returns the same state on unknown action", () => {
    const state = {};

    expect(
      createDataReducer("testRecords")(state, { type: "UNKNOWN" })
    ).to.equal(state);
  });

  describe("on QUERY__LOAD_SUCCESS type", () => {
    it("returns the same state if there is no matching dataType", () => {
      const state = {};

      expect(
        createDataReducer("testRecords")(state, {
          type: "QUERY__LOAD_SUCCESS",
          payload: {
            queryId: "id2",
            data: { otherType: { id1: { id: "id1" } } }
          }
        })
      ).to.equal(state);
    });

    it("adds new records", () => {
      expect(
        createDataReducer("testRecords")(
          {
            id1: { id: "id1", x: 1, queryIds: { a: true } },
            id2: { id: "id2", x: 2, queryIds: { a: true } }
          },
          {
            type: "QUERY__LOAD_SUCCESS",
            payload: {
              queryId: "b",
              data: {
                testRecords: {
                  id2: { id: "id2", y: 4 },
                  id3: { id: "id3", y: 5 }
                }
              }
            }
          }
        )
      ).to.deep.equal({
        id1: { id: "id1", x: 1, queryIds: { a: true } },
        id2: { id: "id2", x: 2, y: 4, queryIds: { a: true, b: true } },
        id3: { id: "id3", y: 5, queryIds: { b: true } }
      });
    });

    it("removes previous records with the same queryId", () => {
      expect(
        createDataReducer("testRecords")(
          {
            id1: { id: "id1", x: 1, queryIds: { a: true } },
            id2: { id: "id2", x: 2, queryIds: { b: true } }
          },
          {
            type: "QUERY__LOAD_SUCCESS",
            payload: {
              queryId: "b",
              data: {
                testRecords: {}
              }
            }
          }
        )
      ).to.deep.equal({
        id1: { id: "id1", x: 1, queryIds: { a: true } }
      });
    });
  });

  describe("on QUERY__RELEASE type", () => {
    it("returns the same state if there is no record with the queryId", () => {
      const state = {
        id1: { id: "id1", queryIds: { a: true } },
        id2: { id: "id2", queryIds: { b: true } }
      };

      expect(
        createDataReducer("testRecords")(state, {
          type: "QUERY__RELEASE",
          payload: { queryId: "c" }
        })
      ).to.equal(state);
    });

    it("removes queryIds from records", () => {
      expect(
        createDataReducer("testRecords")(
          {
            id1: { id: "id1", queryIds: { a: true, b: true } }
          },
          { type: "QUERY__RELEASE", payload: { queryId: "a" } }
        )
      ).to.deep.equal({
        id1: { id: "id1", queryIds: { b: true } }
      });
    });

    it("removes records without any queryId", () => {
      expect(
        createDataReducer("testRecords")(
          {
            id1: { id: "id1", queryIds: { a: true } },
            id2: { id: "id2", queryIds: { b: true } }
          },
          { type: "QUERY__RELEASE", payload: { queryId: "a" } }
        )
      ).to.deep.equal({
        id2: { id: "id2", queryIds: { b: true } }
      });
    });
  });
});

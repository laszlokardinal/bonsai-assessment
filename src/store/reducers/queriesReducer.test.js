import { queriesReducer } from "./index.js";

describe("queriesReducer", () => {
  it("returns an empty object as initial state", () => {
    expect(queriesReducer(undefined, { type: "INIT" })).to.deep.equal({});
  });

  it("returns the same state on unknown action", () => {
    const state = {};

    expect(queriesReducer(state, { type: "UNKNOWN" })).to.equal(state);
  });

  describe("on QUERY__LOAD type", () => {
    describe("if reload is false in the payload", () => {
      it("adds the queryId with initialLoading=true", () => {
        expect(
          queriesReducer(
            { id1: { initialLoading: false, loading: false, error: null } },
            { type: "QUERY__LOAD", payload: { queryId: "id2", reload: false } }
          )
        ).to.deep.equal({
          id1: { initialLoading: false, loading: false, error: null },
          id2: { initialLoading: true, loading: true, error: null }
        });
      });
    });

    describe("if reload is true in the payload", () => {
      it("adds the queryId with initialLoading=false", () => {
        expect(
          queriesReducer(
            {
              id1: { initialLoading: false, loading: false, error: null },
              id2: { initialLoading: false, loading: false, error: null }
            },
            { type: "QUERY__LOAD", payload: { queryId: "id2", reload: true } }
          )
        ).to.deep.equal({
          id1: { initialLoading: false, loading: false, error: null },
          id2: { initialLoading: false, loading: true, error: null }
        });
      });
    });
  });

  describe("on QUERY__LOAD_SUCCESS type", () => {
    it("sets loading and initialLoading to false", () => {
      expect(
        queriesReducer(
          {
            id1: { initialLoading: false, loading: false, error: null },
            id2: { initialLoading: false, loading: true, error: null }
          },
          { type: "QUERY__LOAD_SUCCESS", payload: { queryId: "id2" } }
        )
      ).to.deep.equal({
        id1: { initialLoading: false, loading: false, error: null },
        id2: { initialLoading: false, loading: false, error: null }
      });
    });
  });

  describe("on QUERY__LOAD_FAILURE type", () => {
    it("sets loading and initialLoading to false, and the error from the payload", () => {
      expect(
        queriesReducer(
          {
            id1: { initialLoading: false, loading: false, error: null },
            id2: { initialLoading: false, loading: true, error: null }
          },
          {
            type: "QUERY__LOAD_FAILURE",
            payload: { queryId: "id2", error: "TEST_ERROR" }
          }
        )
      ).to.deep.equal({
        id1: { initialLoading: false, loading: false, error: null },
        id2: { initialLoading: false, loading: false, error: "TEST_ERROR" }
      });
    });
  });

  describe("on QUERY__RELEASE type", () => {
    it("removes the queryId", () => {
      expect(
        queriesReducer(
          {
            id1: { initialLoading: false, loading: false, error: null },
            id2: { initialLoading: false, loading: true, error: null }
          },
          { type: "QUERY__RELEASE", payload: { queryId: "id1" } }
        )
      ).to.deep.equal({
        id2: { initialLoading: false, loading: true, error: null }
      });
    });
  });
});

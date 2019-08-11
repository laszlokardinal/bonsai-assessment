import { SongsList } from "./";

const testProps = {
  songs: [],
  selectedSongIds: [],
  draggingSongId: null,
  draggingIndicatorSongId: null,
  onRatingChange: () => null,
  onToggleSelectedId: () => null,
  onSetDraggingSongId: () => null,
  onSetDraggingIndicatorSongId: () => null,
  onSetPosition: () => null
};

const songsForDraggingTests = [
  { id: "id1", position: 1, performer: "", title: "", rating: 1 },
  { id: "id2", position: 2, performer: "", title: "", rating: 1 },
  { id: "id3", position: 3, performer: "", title: "", rating: 1 },
  { id: "id4", position: 4, performer: "", title: "", rating: 1 },
  { id: "id5", position: 5, performer: "", title: "", rating: 1 }
];

describe("<SongsList />", () => {
  describe("with songs", () => {
    it("matches snapshot", () => {
      const songs = [
        {
          id: "id1",
          performer: "performer 1",
          title: "title 1",
          rating: 5,
          position: 1
        },
        {
          id: "id2",
          performer: "performer 2",
          title: "title 2",
          rating: 4,
          position: 2
        },
        {
          id: "id3",
          performer: "performer 3",
          title: "title 3",
          rating: 3,
          position: 3
        }
      ];
      const selectedSongIds = ["id2"];

      const wrapper = shallow(
        <SongsList
          {...testProps}
          songs={songs}
          selectedSongIds={selectedSongIds}
        />
      );

      expect(prettyFormat(wrapper.getElement())).not.to.be.differentFrom(`
<div
  onDragExit={[Function]}
>
  <Card
    className="card"
    draggable={true}
    onDragOver={[Function]}
    onDragStart={[Function]}
    onMouseLeave={[Function]}
    onMouseMove={[Function]}
  >
    <i
      className="material-icons dragIndicator"
    >
      drag_indicator
    </i>
    <button
      className="checkbox"
      onClick={[Function]}
    >
      <i
        className="material-icons"
      >
        check_box_outline_blank
      </i>
    </button>
    <div
      className="title"
    />
    <Rating
      onChange={[Function]}
      rating={5}
    />
  </Card>
  <Card
    className="card"
    draggable={true}
    onDragOver={[Function]}
    onDragStart={[Function]}
    onMouseLeave={[Function]}
    onMouseMove={[Function]}
  >
    <i
      className="material-icons dragIndicator"
    >
      drag_indicator
    </i>
    <button
      className="checkbox"
      onClick={[Function]}
    >
      <i
        className="material-icons checked"
      >
        check_box
      </i>
    </button>
    <div
      className="title"
    />
    <Rating
      onChange={[Function]}
      rating={4}
    />
  </Card>
  <Card
    className="card"
    draggable={true}
    onDragOver={[Function]}
    onDragStart={[Function]}
    onMouseLeave={[Function]}
    onMouseMove={[Function]}
  >
    <i
      className="material-icons dragIndicator"
    >
      drag_indicator
    </i>
    <button
      className="checkbox"
      onClick={[Function]}
    >
      <i
        className="material-icons"
      >
        check_box_outline_blank
      </i>
    </button>
    <div
      className="title"
    />
    <Rating
      onChange={[Function]}
      rating={3}
    />
  </Card>
</div>
`);
    });
  });

  describe("without songs", () => {
    it("matches snapshot", () => {
      const wrapper = shallow(<SongsList {...testProps} />);

      expect(prettyFormat(wrapper.getElement())).not.to.be.differentFrom(`
<div
  onDragExit={[Function]}
>
  <div
    className="empty"
  >
    This playlist has no songs yet
  </div>
</div>
`);
    });
  });

  describe("wrapper's onDragExit", () => {
    it("calls onSetDraggingIndicatorSongId with null", () => {
      const onSetDraggingIndicatorSongId = sinon.spy();

      const wrapper = shallow(
        <SongsList
          {...testProps}
          onSetDraggingIndicatorSongId={onSetDraggingIndicatorSongId}
        />
      );

      expect(onSetDraggingIndicatorSongId).not.to.have.been.called;

      wrapper.simulate("dragExit");

      expect(onSetDraggingIndicatorSongId).to.have.been.calledOnce;
      expect(onSetDraggingIndicatorSongId).to.have.been.calledWith(null);
    });
  });

  describe("item's onDragStart", () => {
    it("updates dataTransfer & call handlers", () => {
      const songs = [
        { id: "TEST_ID", performer: "", title: "", rating: 5, position: 1 }
      ];

      const onSetDraggingSongId = sinon.spy();
      const onSetDraggingIndicatorSongId = sinon.spy();
      const wrapper = shallow(
        <SongsList
          {...testProps}
          onSetDraggingSongId={onSetDraggingSongId}
          onSetDraggingIndicatorSongId={onSetDraggingIndicatorSongId}
          songs={songs}
        />
      );

      const dataTransfer = {
        setData: sinon.spy(),
        setDragImage: sinon.spy()
      };

      expect(onSetDraggingSongId).not.to.have.been.called;
      expect(onSetDraggingIndicatorSongId).not.to.have.been.called;

      wrapper
        .find("Card")
        .simulate("dragStart", { dataTransfer, target: "TEST_EVENT_TARGET" });

      expect(dataTransfer.setData).to.have.been.called;

      expect(dataTransfer.setDragImage.args).to.deep.equal([
        ["TEST_EVENT_TARGET", -999999, -999999]
      ]);

      expect(onSetDraggingSongId.args).to.deep.equal([["TEST_ID"]]);

      expect(onSetDraggingIndicatorSongId.args).to.deep.equal([[null]]);
    });
  });

  describe("item's onDragOver", () => {
    it("does not call onSetPosition if there is no song dragging", () => {
      const onSetPosition = sinon.spy();

      const wrapper = shallow(
        <SongsList
          {...testProps}
          onSetPosition={onSetPosition}
          songs={songsForDraggingTests}
          draggingSongId={null}
        />
      );

      wrapper
        .find("Card")
        .at(2)
        .simulate("dragOver");

      expect(onSetPosition).not.to.have.been.called;
    });

    it("does not call onSetPosition if its on the dragging song", () => {
      const onSetPosition = sinon.spy();

      const wrapper = shallow(
        <SongsList
          {...testProps}
          onSetPosition={onSetPosition}
          songs={songsForDraggingTests}
          draggingSongId="id3"
        />
      );

      wrapper
        .find("Card")
        .at(2)
        .simulate("dragOver");

      expect(onSetPosition).not.to.have.been.called;
    });

    describe("dragging upwards on the first item", () => {
      it("calls onSetPosition with the first position - 1", () => {
        const onSetPosition = sinon.spy();

        const wrapper = shallow(
          <SongsList
            {...testProps}
            onSetPosition={onSetPosition}
            songs={songsForDraggingTests}
            draggingSongId="id2"
          />
        );

        expect(onSetPosition).not.to.have.been.called;

        wrapper
          .find("Card")
          .at(0)
          .simulate("dragOver");

        expect(onSetPosition).to.have.been.calledOnce;
        expect(onSetPosition).to.have.been.calledWith("id2", 0);
      });
    });

    describe("dragging upwards", () => {
      it("calls onSetPosition with the average of the two songs' position", () => {
        const onSetPosition = sinon.spy();

        const wrapper = shallow(
          <SongsList
            {...testProps}
            onSetPosition={onSetPosition}
            songs={songsForDraggingTests}
            draggingSongId="id3"
          />
        );

        expect(onSetPosition).not.to.have.been.called;

        wrapper
          .find("Card")
          .at(1)
          .simulate("dragOver");

        expect(onSetPosition).to.have.been.calledOnce;
        expect(onSetPosition).to.have.been.calledWith("id3", 1.5);
      });
    });

    describe("dragging downwards", () => {
      it("calls onSetPosition with the average of the two songs' position", () => {
        const onSetPosition = sinon.spy();

        const wrapper = shallow(
          <SongsList
            {...testProps}
            onSetPosition={onSetPosition}
            songs={songsForDraggingTests}
            draggingSongId="id3"
          />
        );

        expect(onSetPosition).not.to.have.been.called;

        wrapper
          .find("Card")
          .at(3)
          .simulate("dragOver");

        expect(onSetPosition).to.have.been.calledOnce;
        expect(onSetPosition).to.have.been.calledWith("id3", 4.5);
      });
    });

    describe("dragging downwards on the last item", () => {
      it("calls onSetPosition with the last position + 1", () => {
        const onSetPosition = sinon.spy();

        const wrapper = shallow(
          <SongsList
            {...testProps}
            onSetPosition={onSetPosition}
            songs={songsForDraggingTests}
            draggingSongId="id4"
          />
        );

        expect(onSetPosition).not.to.have.been.called;

        wrapper
          .find("Card")
          .at(4)
          .simulate("dragOver");

        expect(onSetPosition).to.have.been.calledOnce;
        expect(onSetPosition).to.have.been.calledWith("id4", 6);
      });
    });
  });

  describe("item's onMouseMove", () => {
    it("calls onSetDraggingIndicatorSongId with the song's id", () => {
      const songs = [
        { id: "TEST_ID", performer: "", title: "", rating: 5, position: 1 }
      ];
      const onSetDraggingIndicatorSongId = sinon.spy();

      const wrapper = shallow(
        <SongsList
          {...testProps}
          onSetDraggingIndicatorSongId={onSetDraggingIndicatorSongId}
          songs={songs}
        />
      );

      expect(onSetDraggingIndicatorSongId).not.to.have.been.called;

      wrapper.find("Card").simulate("mouseMove");

      expect(onSetDraggingIndicatorSongId).to.have.been.calledWith("TEST_ID");
    });
  });

  describe("item's onMouseLeave", () => {
    it("calls onSetDraggingIndicatorSongId with null", () => {
      const songs = [
        { id: "TEST_ID", performer: "", title: "", rating: 5, position: 1 }
      ];
      const onSetDraggingIndicatorSongId = sinon.spy();

      const wrapper = shallow(
        <SongsList
          {...testProps}
          onSetDraggingIndicatorSongId={onSetDraggingIndicatorSongId}
          songs={songs}
        />
      );

      expect(onSetDraggingIndicatorSongId).not.to.have.been.called;

      wrapper.find("Card").simulate("mouseLeave");

      expect(onSetDraggingIndicatorSongId).to.have.been.calledWith(null);
    });
  });

  describe("checkbox's onClick", () => {
    it("calls onToggleSelectedId", () => {
      const songs = [
        { id: "TEST_ID", performer: "", title: "", rating: 5, position: 1 }
      ];
      const onToggleSelectedId = sinon.spy();

      const wrapper = shallow(
        <SongsList
          {...testProps}
          onToggleSelectedId={onToggleSelectedId}
          songs={songs}
        />
      );

      expect(onToggleSelectedId).not.to.have.been.called;

      wrapper.find(".checkbox").simulate("click");

      expect(onToggleSelectedId).to.have.been.calledOnce;
      expect(onToggleSelectedId).to.have.been.calledWith("TEST_ID");
    });
  });

  describe("rating's onChange", () => {
    it("calls onRatingChange", () => {
      const songs = [
        { id: "TEST_ID", performer: "", title: "", rating: 5, position: 1 }
      ];
      const onRatingChange = sinon.spy();

      const wrapper = shallow(
        <SongsList
          {...testProps}
          onRatingChange={onRatingChange}
          songs={songs}
        />
      );

      expect(onRatingChange).not.to.have.been.called;

      wrapper.find("Rating").simulate("change", 1);

      expect(onRatingChange).to.have.been.calledOnce;
      expect(onRatingChange).to.have.been.calledWith("TEST_ID", 1);
    });
  });
});

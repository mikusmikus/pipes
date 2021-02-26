import cloneDeep from "lodash/cloneDeep";
import {
  Pipe,
  ShapeType,
  Position,
  initNewPipe,
  makeShapeGridFromRows,
  splitRawDataInShapeRows,
  translateFromShapeToPipe,
  transformShapeGridToPipeGrid,
  rotatePipe,
  appendRotateMessage,
  calculateRotationCount,
  mustBeNotConnected,
  mustBeConnected,
  spliceOutPositions,
  checkLeft_Line,
  checkBottom_Line,
  checkTop_Line,
  checkRight_Line,
} from "./engine";

const SAMPLE =
  "map:\n╸╺┏╸╹━┣╻\n━┏┣┏┓┗━╻\n┫━┗┏┓┳┳┗\n┃╹┫╸╸┫┃╻\n━┳┗┗┫┛╻╻\n╺┫┃┻┓╺╋┏\n╹┫┓╸┓┗┳┓\n┛┗┏┃━┻╸╸\n ";

const step1 = splitRawDataInShapeRows(SAMPLE);
const step2 = makeShapeGridFromRows(step1);
const SAMPLE_PIPES = transformShapeGridToPipeGrid(step2);

describe("splitRawDataInRows function", () => {
  it("should work properly", () => {
    const result = splitRawDataInShapeRows(SAMPLE);
    const expected = [
      "╸╺┏╸╹━┣╻",
      "━┏┣┏┓┗━╻",
      "┫━┗┏┓┳┳┗",
      "┃╹┫╸╸┫┃╻",
      "━┳┗┗┫┛╻╻",
      "╺┫┃┻┓╺╋┏",
      "╹┫┓╸┓┗┳┓",
      "┛┗┏┃━┻╸╸",
    ];
    expect(result).toEqual(expected);
  });
});

describe("makeGridFromRows function", () => {
  it("should work properly", () => {
    const ROWS = ["╸╺┏╸", "━┏┣┏"];
    const expected = [
      ["╸", "╺", "┏", "╸"],
      ["━", "┏", "┣", "┏"],
    ];
    const result = makeShapeGridFromRows(ROWS);
    expect(result).toEqual(expected);
  });
});

describe("initNewPipe function", () => {
  it("should work properly", () => {
    const expected: Pipe = {
      top: false,
      right: true,
      bottom: true,
      left: false,
      name: "Elbow",
      isDone: false,
      position: 90,
      allowedPositions: [0, 90, 180, 270],
    };
    const result = initNewPipe("Elbow", false, true, true, false, 90);
    expect(result).toEqual(expected);
  });
});

describe("translateFromShapeToPipe function", () => {
  it("should work case ┏", () => {
    const expected: Pipe = {
      top: false,
      right: true,
      bottom: true,
      left: false,
      name: "Elbow",
      isDone: false,
      position: 90,
      allowedPositions: [0, 90, 180, 270],
    };
    const result = translateFromShapeToPipe("┏");
    expect(result).toEqual(expected);
  });
  it("should work case ┓", () => {
    const expected: Pipe = {
      top: false,
      right: false,
      bottom: true,
      left: true,
      name: "Elbow",
      isDone: false,
      position: 180,
      allowedPositions: [0, 90, 180, 270],
    };
    const result = translateFromShapeToPipe("┓");
    expect(result).toEqual(expected);
  });
  it("should work case ┗", () => {
    const expected: Pipe = {
      top: true,
      right: true,
      bottom: false,
      left: false,
      name: "Elbow",
      isDone: false,
      position: 0,
      allowedPositions: [0, 90, 180, 270],
    };
    const result = translateFromShapeToPipe("┗");
    expect(result).toEqual(expected);
  });
  it("should work case ┛", () => {
    const expected: Pipe = {
      top: true,
      right: false,
      bottom: false,
      left: true,
      name: "Elbow",
      isDone: false,
      position: 270,
      allowedPositions: [0, 90, 180, 270],
    };
    const result = translateFromShapeToPipe("┛");
    expect(result).toEqual(expected);
  });
  it("should work case |╸|", () => {
    const expected: Pipe = {
      top: false,
      right: false,
      bottom: false,
      left: true,
      name: "End",
      isDone: false,
      position: 270,
      allowedPositions: [0, 90, 180, 270],
    };
    const result = translateFromShapeToPipe("╸");
    expect(result).toEqual(expected);
  });
  it("should work case |╺|", () => {
    const expected: Pipe = {
      top: false,
      right: true,
      bottom: false,
      left: false,
      name: "End",
      isDone: false,
      position: 90,
      allowedPositions: [0, 90, 180, 270],
    };
    const result = translateFromShapeToPipe("╺");
    expect(result).toEqual(expected);
  });
  it("should work case ╹", () => {
    const expected: Pipe = {
      top: true,
      right: false,
      bottom: false,
      left: false,
      name: "End",
      isDone: false,
      position: 0,
      allowedPositions: [0, 90, 180, 270],
    };
    const result = translateFromShapeToPipe("╹");
    expect(result).toEqual(expected);
  });
  it("should work case ╻", () => {
    const expected: Pipe = {
      top: false,
      right: false,
      bottom: true,
      left: false,
      name: "End",
      isDone: false,
      position: 180,
      allowedPositions: [0, 90, 180, 270],
    };
    const result = translateFromShapeToPipe("╻");
    expect(result).toEqual(expected);
  });
  it("should work case ┣", () => {
    const expected: Pipe = {
      top: true,
      right: true,
      bottom: true,
      left: false,
      name: "Tee",
      isDone: false,
      position: 90,
      allowedPositions: [0, 90, 180, 270],
    };
    const result = translateFromShapeToPipe("┣");
    expect(result).toEqual(expected);
  });
  it("should work case ┳", () => {
    const expected: Pipe = {
      top: false,
      right: true,
      bottom: true,
      left: true,
      name: "Tee",
      isDone: false,
      position: 180,
      allowedPositions: [0, 90, 180, 270],
    };
    const result = translateFromShapeToPipe("┳");
    expect(result).toEqual(expected);
  });
  it("should work case ┻", () => {
    const expected: Pipe = {
      top: true,
      right: true,
      bottom: false,
      left: true,
      name: "Tee",
      isDone: false,
      position: 0,
      allowedPositions: [0, 90, 180, 270],
    };
    const result = translateFromShapeToPipe("┻");
    expect(result).toEqual(expected);
  });
  it("should work case ┫", () => {
    const expected: Pipe = {
      top: true,
      right: false,
      bottom: true,
      left: true,
      name: "Tee",
      isDone: false,
      position: 270,
      allowedPositions: [0, 90, 180, 270],
    };
    const result = translateFromShapeToPipe("┫");
    expect(result).toEqual(expected);
  });
  it("should work case |━|", () => {
    const expected: Pipe = {
      top: false,
      right: true,
      bottom: false,
      left: true,
      name: "Line",
      isDone: false,
      position: 90,
      allowedPositions: [0, 90, 180, 270],
    };
    const result = translateFromShapeToPipe("━");
    expect(result).toEqual(expected);
  });
  it("should work case ┃", () => {
    const expected: Pipe = {
      top: true,
      right: false,
      bottom: true,
      left: false,
      name: "Line",
      isDone: false,
      position: 0,
      allowedPositions: [0, 90, 180, 270],
    };
    const result = translateFromShapeToPipe("┃");
    expect(result).toEqual(expected);
  });
  it("should work case ╋", () => {
    const expected: Pipe = {
      top: true,
      right: true,
      bottom: true,
      left: true,
      name: "Cross",
      isDone: true,
      position: 0,
      allowedPositions: [0],
    };
    const result = translateFromShapeToPipe("╋");
    expect(result).toEqual(expected);
  });
});

describe("transformShapeGridToPipeGrid function", () => {
  it("should work corectly", () => {
    const input: ShapeType[][] = [
      ["╸", "╺", "┏", "╸"],
      ["━", "┏", "┣", "┏"],
    ];

    const expected = [
      [
        {
          top: false,
          right: false,
          bottom: false,
          left: true,
          name: "End",
          isDone: false,
          position: 270,
          allowedPositions: [0, 90, 180, 270],
        },
        {
          top: false,
          right: true,
          bottom: false,
          left: false,
          name: "End",
          isDone: false,
          position: 90,
          allowedPositions: [0, 90, 180, 270],
        },
        {
          top: false,
          right: true,
          bottom: true,
          left: false,
          name: "Elbow",
          isDone: false,
          position: 90,
          allowedPositions: [0, 90, 180, 270],
        },
        {
          top: false,
          right: false,
          bottom: false,
          left: true,
          name: "End",
          isDone: false,
          position: 270,
          allowedPositions: [0, 90, 180, 270],
        },
      ],
      [
        {
          top: false,
          right: true,
          bottom: false,
          left: true,
          name: "Line",
          isDone: false,
          position: 90,
          allowedPositions: [0, 90, 180, 270],
        },
        {
          top: false,
          right: true,
          bottom: true,
          left: false,
          name: "Elbow",
          isDone: false,
          position: 90,
          allowedPositions: [0, 90, 180, 270],
        },
        {
          top: true,
          right: true,
          bottom: true,
          left: false,
          name: "Tee",
          isDone: false,
          position: 90,
          allowedPositions: [0, 90, 180, 270],
        },
        {
          top: false,
          right: true,
          bottom: true,
          left: false,
          name: "Elbow",
          isDone: false,
          position: 90,
          allowedPositions: [0, 90, 180, 270],
        },
      ],
    ];
    const result = transformShapeGridToPipeGrid(input);
    expect(result).toEqual(expected);
  });
});

describe("rotatePipe function", () => {
  it("should work properly", () => {
    const input: Pipe = {
      top: false,
      right: true,
      bottom: true,
      left: false,
      name: "Elbow",
      isDone: false,
      position: 90,
      allowedPositions: [0, 90, 180, 270],
    };
    const expected: Pipe = {
      top: false,
      right: false,
      bottom: true,
      left: true,
      name: "Elbow",
      isDone: false,
      position: 180,
      allowedPositions: [0, 90, 180, 270],
    };
    const result = rotatePipe(input);
    expect(result).toEqual(expected);
  });
});

describe("appendRotateMessage function", () => {
  it("should work properly on first move", () => {
    const input = "rotate";
    const expected = "rotate 5 3";
    const result = appendRotateMessage(input, 5, 3);
    expect(result).toEqual(expected);
  });
  it("should work properly on later moves", () => {
    const input = "rotate 5 3\n2 4";
    const expected = "rotate 5 3\n2 4\n6 4";
    const result = appendRotateMessage(input, 6, 4);
    expect(result).toEqual(expected);
  });
});

describe("calculateRotationCount function", () => {
  it("should work when passed same numbers", () => {
    const expected = 0;
    const result = calculateRotationCount(90, 90);
    expect(result).toBe(expected);
  });
  it("should work when 3 rotations needed", () => {
    const expected = 3;
    const result = calculateRotationCount(180, 90);
    expect(result).toBe(expected);
  });
});

describe("mustBeNotConnected function", () => {
  it("should work case 1", () => {
    const grid = cloneDeep(SAMPLE_PIPES);
    grid[1][1].allowedPositions = [90, 180];
    const expected = true;
    const result = mustBeNotConnected(1, 1, "top", grid);
    expect(result).toBe(expected);
  });
  it("should work case 2", () => {
    const grid = cloneDeep(SAMPLE_PIPES);
    grid[2][2].allowedPositions = [0, 180];
    const expected = false;
    const result = mustBeNotConnected(2, 2, "left", grid);
    expect(result).toBe(expected);
  });
  it("should work case 3", () => {
    const grid = cloneDeep(SAMPLE_PIPES);
    grid[3][3].allowedPositions = [0, 90, 180, 270];
    const expected = false;
    const result = mustBeNotConnected(3, 3, "left", grid);
    expect(result).toBe(expected);
  });
  it("should work case 4", () => {
    const grid = cloneDeep(SAMPLE_PIPES);
    grid[4][4].allowedPositions = [270];
    const expected = true;
    const result = mustBeNotConnected(4, 4, "right", grid);
    expect(result).toBe(expected);
  });
  it("should work when all positions possible", () => {
    const grid = cloneDeep(SAMPLE_PIPES);
    grid[5][5].allowedPositions = [0, 90, 180];
    const expected = true;
    const result = mustBeNotConnected(5, 5, "left", grid);
    expect(result).toBe(expected);
  });
  it("should work case 6", () => {
    const grid = cloneDeep(SAMPLE_PIPES);
    grid[6][6].allowedPositions = [90, 270];
    const expected = false;
    const result = mustBeNotConnected(6, 6, "top", grid);
    expect(result).toBe(expected);
  });
  it("should work case 7", () => {
    const grid = cloneDeep(SAMPLE_PIPES);
    grid[7][7].allowedPositions = [0, 270];
    const expected = true;
    const result = mustBeNotConnected(7, 7, "right", grid);
    expect(result).toBe(expected);
  });
  it("should work case 8", () => {
    const grid = cloneDeep(SAMPLE_PIPES);
    grid[4][0].allowedPositions = [0, 90];
    const expected = false;
    const result = mustBeNotConnected(4, 0, "bottom", grid);
    expect(result).toBe(expected);
  });
});

describe("mustBeConnected function", () => {
  it("should work case 1", () => {
    const grid = cloneDeep(SAMPLE_PIPES);
    grid[0][0].allowedPositions = [0, 90, 180, 270];
    const expected = false;
    const result = mustBeConnected(0, 0, "right", grid);
    expect(result).toBe(expected);
  });
  it("should work case 2", () => {
    const grid = cloneDeep(SAMPLE_PIPES);
    grid[1][1].allowedPositions = [0, 90];
    const expected = true;
    const result = mustBeConnected(1, 1, "right", grid);
    expect(result).toBe(expected);
  });
  it("should work case 3", () => {
    const grid = cloneDeep(SAMPLE_PIPES);
    grid[2][2].allowedPositions = [0, 90];
    const expected = false;
    const result = mustBeConnected(2, 2, "top", grid);
    expect(result).toBe(expected);
  });
  it("should work case 4", () => {
    const grid = cloneDeep(SAMPLE_PIPES);
    grid[3][3].allowedPositions = [270];
    const expected = true;
    const result = mustBeConnected(3, 3, "left", grid);
    expect(result).toBe(expected);
  });
  it("should work case 5", () => {
    const grid = cloneDeep(SAMPLE_PIPES);
    grid[4][4].allowedPositions = [90, 180, 270];
    const expected = true;
    const result = mustBeConnected(4, 4, "bottom", grid);
    expect(result).toBe(expected);
  });
  it("should work case 6", () => {
    const grid = cloneDeep(SAMPLE_PIPES);
    grid[5][5].allowedPositions = [90, 180, 270];
    const expected = false;
    const result = mustBeConnected(5, 5, "bottom", grid);
    expect(result).toBe(expected);
  });
  it("should work case 7", () => {
    const grid = cloneDeep(SAMPLE_PIPES);
    grid[6][6].allowedPositions = [180, 270];
    const expected = true;
    const result = mustBeConnected(6, 6, "bottom", grid);
    expect(result).toBe(expected);
  });
});

describe("spliceOutPositions function", () => {
  it("should work when passed 1 position", () => {
    const expected = [0, 180, 270];
    const result = spliceOutPositions([0, 90, 180, 270], 90);
    expect(result).toEqual(expected);
  });
  it("should work when passed 2 positions case 1", () => {
    const expected = [0, 180];
    const result = spliceOutPositions([0, 180, 270], 270);
    expect(result).toEqual(expected);
  });
  it("should work when passed 2 positions", () => {
    const expected = [0];
    const result = spliceOutPositions([0, 90, 270], 90, 270);
    expect(result).toEqual(expected);
  });
  it("should work when passed 3 positions", () => {
    const expected = [270];
    const result = spliceOutPositions([0, 90, 180, 270], 0, 90, 180);
    expect(result).toEqual(expected);
  });
  it("should work when passed all positions", () => {
    const expected: Position[] = [];
    const result = spliceOutPositions([0, 90], 90, 0);
    expect(result).toEqual(expected);
  });
});

describe("checkLeft_Line function", () => {
  it("should work if there is no pipe on left", () => {
    const expected = [0];
    const result = checkLeft_Line(0, 3, SAMPLE_PIPES);
    expect(result).toEqual(expected);
  });
  it("should work if there is not done pipe on left", () => {
    const expected = [0, 90, 180, 270];
    const result = checkLeft_Line(2, 5, SAMPLE_PIPES);
    expect(result).toEqual(expected);
  });
});

describe("checkRight_Line function", () => {
  it("should work if there is no pipe on right", () => {
    const expected = [0];
    const input = [...SAMPLE_PIPES];
    input[0][7].top = true;
    input[0][7].name = "Line";
    const result = checkRight_Line(7, 0, input);
    expect(result).toEqual(expected);
  });
  it("should work if there is not done pipe on right", () => {
    const expected = [0, 90, 180, 270];
    const result = checkRight_Line(5, 0, SAMPLE_PIPES);
    expect(result).toEqual(expected);
  });
});

describe("checkTop_Line function", () => {
  it("should work if there is no pipe on top", () => {
    const expected = [90];
    const result = checkTop_Line(5, 0, SAMPLE_PIPES);
    expect(result).toEqual(expected);
  });
  it("should work if there is not done pipe on right", () => {
    const expected = [0, 90, 180, 270];
    const result = checkTop_Line(6, 3, SAMPLE_PIPES);
    expect(result).toEqual(expected);
  });
});

describe("checkBottom_Line function", () => {
  it("should work if there is no pipe on bottom", () => {
    const expected = [90];
    const result = checkBottom_Line(3, 7, SAMPLE_PIPES);
    expect(result).toEqual(expected);
  });
  it("should work if there is not done pipe on right", () => {
    const expected = [0, 90, 180, 270];
    const result = checkBottom_Line(6, 3, SAMPLE_PIPES);
    expect(result).toEqual(expected);
  });
});

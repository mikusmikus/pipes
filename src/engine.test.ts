import cloneDeep from "lodash/cloneDeep";
import {
  Pipe,
  ShapeType,
  Position,
  initNewPipe,
  makeShapeGridFromRows,
  splitRawDataInShapeRows,
  translateFromShapeToPipe,
  translateFromPipeToShape,
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
  checkLeft_Tee,
  checkRight_Tee,
  checkTop_Tee,
  checkBottom_Tee,
  solvePipe,
  checkLine,
  checkTee,
  checkEnd,
  findNextCoordinates,
  checkLeft_End,
  checkLeft_Elbow,
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

describe("makeShapeGridFromRows function", () => {
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
  it("should work properly case 1", () => {
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
  it("should work properly case 2", () => {
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
    const result = initNewPipe("Cross", true, true, true, true, 0);
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

describe("translateFromPipeToShape function", () => {
  it("should work case ┏", () => {
    const pipe: Pipe = {
      top: false,
      right: true,
      bottom: true,
      left: false,
      name: "Elbow",
      isDone: false,
      position: 90,
      allowedPositions: [0, 90, 180, 270],
    };
    const expected = "┏"
    const result = translateFromPipeToShape(pipe);
    expect(result).toEqual(expected);
  });
  it("should work case ╺", () => {
    const pipe: Pipe = {
      top: false,
      right: true,
      bottom: false,
      left: false,
      name: "End",
      isDone: true,
      position: 90,
      allowedPositions: [90],
    };
    const expected = "╺"
    const result = translateFromPipeToShape(pipe);
    expect(result).toEqual(expected);
  });
  it("should work case ╋", () => {
    const pipe: Pipe = {
      top: true,
      right: true,
      bottom: true,
      left: true,
      name: "Cross",
      isDone: true,
      position: 90,
      allowedPositions: [0],
    };
    const expected = "╋"
    const result = translateFromPipeToShape(pipe);
    expect(result).toEqual(expected);
  });
})

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
  it("should work properly case", () => {
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
  it("should work case 1 '┏'", () => {
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
    const result = spliceOutPositions([0, 90], 0, 90);
    expect(result).toEqual(expected);
  });
});

// --------------- CHECK LINE SHAPE -------------
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

// --------------- CHECK TEE SHAPE -------------
describe("checkLeft_Tee function", () => {
  it("should work if there is no pipe on left", () => {
    const expected = [90];
    const result = checkLeft_Tee(0, 7, SAMPLE_PIPES);
    expect(result).toEqual(expected);
  });
  it("should work if there is not done pipe on left", () => {
    const expected = [0, 90, 180, 270];
    const result = checkLeft_Tee(1, 1, SAMPLE_PIPES);
    expect(result).toEqual(expected);
  });
})

describe("checkright_Tee function", () => {
  it("should work if there is no pipe on right", () => {
    const expected = [270];
    const result = checkRight_Tee(7, 6, SAMPLE_PIPES);
    expect(result).toEqual(expected);
  });
  it("should work if there is not done pipe on right", () => {
    const expected = [0, 90, 180, 270];
    const result = checkRight_Tee(3, 1, SAMPLE_PIPES);
    expect(result).toEqual(expected);
  });
})

describe("checkTop_Tee function", () => {
  it("should work if there is no pipe on top", () => {
    const expected = [180];
    const result = checkTop_Tee(2, 0, SAMPLE_PIPES);
    expect(result).toEqual(expected);
  });
  it("should work if there is not done pipe on top", () => {
    const expected = [0, 90, 180, 270];
    const result = checkTop_Tee(3, 1, SAMPLE_PIPES);
    expect(result).toEqual(expected);
  });
})

describe("checkBottom_Tee function", () => {
  it("should work if there is no pipe on bottom", () => {
    const expected = [0];
    const result = checkBottom_Tee(2, 7, SAMPLE_PIPES);
    expect(result).toEqual(expected);
  });
  it("should work if there is not done pipe on bottom", () => {
    const expected = [0, 90, 180, 270];
    const result = checkBottom_Tee(3, 1, SAMPLE_PIPES);
    expect(result).toEqual(expected);
  });
})

// --------------- CHECK END SHAPE -------------
describe("checkLeft_End function", () => {
  it("should work if there is no pipe on left", () => {
    const expected = [0, 90, 180];
    const result = checkLeft_End(0, 0, SAMPLE_PIPES);
    expect(result).toEqual(expected);
  });
  it("should work if there is done pipe on left", () => {
    const output = cloneDeep(SAMPLE_PIPES);
    output[0][2].isDone=true;
    output[0][2].allowedPositions=[90];

    const expected = [270];
    const result = checkLeft_End(3, 0, output);
    expect(result).toEqual(expected);
  });
  it("should work if there is not done pipe on left", () => {
    const expected = [0, 90, 180, 270];
    const result = checkLeft_End(3, 0, SAMPLE_PIPES);
    expect(result).toEqual(expected);
  });
})
// --------------- CHECK ELBOW SHAPE -------------
describe("checkLeft_Elbow function", () => {
  it("should work if there is no pipe on left", () => {
    const expected = [0, 90];
    const result = checkLeft_Elbow(0, 7, SAMPLE_PIPES);
    expect(result).toEqual(expected);
  });
  it("should work if there is done pipe on left", () => {
    const output = cloneDeep(SAMPLE_PIPES);
    output[0][1].isDone=true;
    output[0][1].allowedPositions=[90];
    
    const expected = [180, 270];
    const result = checkLeft_Elbow(2, 0, output);
    expect(result).toEqual(expected);
  });
  it("should work if there is not done pipe on left", () => {
    const expected = [0, 90, 180, 270];
    const result = checkLeft_Elbow(3, 0, SAMPLE_PIPES);
    expect(result).toEqual(expected);
  });
})




describe("solve Pipe function", ()=> {
  it('return new rotate message and new pipesLeft count (case 1 - rotate 1 time)', () => {
    const input = cloneDeep(SAMPLE_PIPES);
    input[1][5].allowedPositions=[90]
    
    const expected = {pipesLeft: 63, rotateMessage: "rotate 5 1"};
    const result = solvePipe(5, 1, input, 'rotate', 64)

    expect(result).toEqual(expected);
  })
  it('solved 2 pipes (each rotate at least 1 time)', () => {

    const input = cloneDeep(SAMPLE_PIPES);
    input[3][3].allowedPositions=[90]
    input[1][5].allowedPositions=[180]

    const firstResult = solvePipe(5, 1, input, 'rotate', 64)
    const finalResult = solvePipe(3, 3, input, firstResult.rotateMessage, firstResult.pipesLeft)
    const expected = {pipesLeft: 62, rotateMessage: "rotate 5 1\n5 1\n3 3\n3 3"};

    expect(finalResult).toEqual(expected);
  })
})

describe('checkLine function', () => {
  it ('should rotate "line" and recieve new rotate msg un pipes left count', () => {
    const input = cloneDeep(SAMPLE_PIPES);

    const expected = {pipesLeft: 63, rotateMessage: "rotate 0 1\n0 1\n0 1"};
    const result = checkLine(0, 1, input, 'rotate', 64)
    
    expect(result).toEqual(expected);
  })
  it ('should not rotate "line" and receive same msg and count', () => {
    const input = cloneDeep(SAMPLE_PIPES);

    const expected = {pipesLeft: 64, rotateMessage: "rotate"};
    const result = checkLine(6, 3, input, 'rotate', 64)

    expect(result).toEqual(expected);
  })
})

describe('checkTee function', () => {
  it ('should rotate "tee" and recieve new rotate msg un pipes left count', () => {
    const input = cloneDeep(SAMPLE_PIPES);

    const expected = {pipesLeft: 63, rotateMessage: "rotate 6 0"};
    const result = checkTee(6, 0, input, 'rotate', 64)

    expect(result).toEqual(expected);
  })
  it ('should not rotate "tee" and receive same msg and count', () => {
    const input = cloneDeep(SAMPLE_PIPES);

    const expected = {pipesLeft: 64, rotateMessage: "rotate"};
    const result = checkTee(4, 4, input, 'rotate', 64)

    expect(result).toEqual(expected);
  })
})

describe('checkEnd function', () => {
  it ('should rotate "end" and recieve new rotate msg un pipes left count', () => {
    const input = cloneDeep(SAMPLE_PIPES);

    const expected = {pipesLeft: 63, rotateMessage: "rotate 0 0\n0 0\n0 0"};
    const result = checkEnd(0, 0, input, 'rotate', 64);

    expect(result).toEqual(expected);
  })
  it ('should not rotate "end" and receive same msg and count', () => {
    const input = cloneDeep(SAMPLE_PIPES);

    const expected = {pipesLeft: 64, rotateMessage: "rotate"};
    const result = checkTee(3, 3, input, 'rotate', 64)

    expect(result).toEqual(expected);
  })
})

describe('checkElbow function', () => {
  it ('should rotate "elbow" and recieve new rotate msg un pipes left count', () => {
    const input = cloneDeep(SAMPLE_PIPES);

    const expected = {pipesLeft: 63, rotateMessage: "rotate 2 0"};
    const result = checkEnd(2, 0, input, 'rotate', 64);

    expect(result).toEqual(expected);
  })
  it ('should not rotate "elbow" and receive same msg and count', () => {
    const input = cloneDeep(SAMPLE_PIPES);

    const expected = {pipesLeft: 64, rotateMessage: "rotate"};
    const result = checkTee(3, 3, input, 'rotate', 64)

    expect(result).toEqual(expected);
  })
})

describe('findNextCoordinates function', () => {
  it('should find first not solved pipe and return pipe coordinates', () => {
    const input = cloneDeep(SAMPLE_PIPES);
  
    input[0][0].isDone=true;
    input[0][1].isDone=true;
    input[0][2].isDone=true;

    const expected = {x:3, y:0}
    
    const result = findNextCoordinates(64, 64, 0, 0, input);
    expect(result).toEqual(expected);
  });
})
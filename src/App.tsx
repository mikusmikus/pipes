/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useRef, useState } from "react";
import { w3cwebsocket } from "websocket";
import {
  Pipe,
  makeShapeGridFromRows,
  splitRawDataInShapeRows,
  transformShapeGridToPipeGrid,
  rotatePipe,
  appendRotateMessage,
  checkPipe,
} from "./engine";
import Options from "./components/options/Options";
import Heading from "./components/header/Header";
import Verify from "./components/verify/Verify";
import FancyGrid from "./components/fancyGrid/FancyGrid";
import SimpleGrid from "./components/simpleGrid/SimpleGrid";
import Slider from "./components/slider/Slider";
import ResultsTable from "./components/resultsTable/ResultsTable";
import Spinner from "./components/spinner/Spinner";

export interface WhatRender {
  levelsBtns: boolean;
  fancyGrid: boolean;
  startGameBtn: boolean;
  startSolveBtn: boolean;
  stopSolveBtn: boolean;
  simpleGrid: boolean;
  restartBtn: boolean;
  verify: boolean;
  info: boolean;
}
const client = new w3cwebsocket("wss://hometask.eg1236.com/game-pipes/");

client.onopen = () => {
  console.log("Connected");
};

const levels = [1, 2, 3, 4, 5, 6];

let cellWidth = "";

function App() {
  const [grid, setGrid] = useState<Pipe[][]>([]);
  const [verifyMsg, setVerifyMsg] = useState("rotate");
  const [counter, setCounter] = useState(0);
  const [autoSolve, setAutoSolve] = useState(false);
  const [verifyResponde, setVerifyResponde] = useState("");
  const [autoSolveTime, setAutoSolveTime] = useState(2);
  const [whatRender, setWhatRender] = useState({
    levelsBtns: true,
    fancyGrid: false,
    simpleGrid: false,
    startGameBtn: false,
    startSolveBtn: false,
    stopSolveBtn: false,
    restartBtn: false,
    verify: false,
    info: true,
  });

  const timeOut = useRef<NodeJS.Timeout>();
  const mapAsString = useRef("");
  const xx = useRef(0);
  const yy = useRef(0);
  const rotateCount = useRef(0);
  const totalPipes = useRef(0);
  const pipesToSolve = useRef(0);
  const currentLevel = useRef(0);

  client.onmessage = (msg) => {
    const info: string = msg.data as string;
    console.log("info", info);
    if (info.startsWith("verify: Correct")) {
      setVerifyResponde(info);
    }
    if (info.startsWith("verify: Incorrect")) {
      setVerifyResponde(
        `${info} Something is not connecting right, keep solving`
      );
    }
    mapAsString.current = info;
  };

  // string to bytes
  const byteCount = (s: string) => {
    return encodeURI(s).split(/%..|./).length - 1;
  };

  useEffect(() => {
    if (grid.length && autoSolve) {
      findNextCoordinates(counter);

      timeOut.current = setTimeout(() => {
        const { rotateMessage, pipesLeft } = checkPipe(
          xx.current,
          yy.current,
          grid,
          verifyMsg,
          pipesToSolve.current
        );

        if (rotateMessage.length !== verifyMsg.length) {
          rotateCount.current = counter;
          setVerifyMsg(rotateMessage);
        }

        pipesToSolve.current = pipesLeft;
        if (counter - rotateCount.current > pipesToSolve.current) {
          stopAutoSolve();
          return;
        }
        setCounter(counter + 1);
      }, autoSolveTime * 200);
    }
  }, [counter, autoSolve]);

  const findNextCoordinates = (count: number) => {
    let loopCountLeft = totalPipes.current;
    let keepLooping = true;
    do {
      if (count) {
        xx.current += 1;
      }
      if (xx.current >= grid[0].length) {
        xx.current = 0;
        yy.current += 1;
      }
      if (yy.current >= grid.length) {
        yy.current = 0;
        xx.current = 0;
      }

      if (!grid[yy.current][xx.current].isDone) {
        keepLooping = false;
      }

      loopCountLeft -= 1;
      if (loopCountLeft < 0) {
        keepLooping = false;
      }
    } while (keepLooping);
  };

  const fastAutoSolve = () => {
    console.log("started");

    let countCounter = counter;
    console.log(countCounter);
    
    let msg = "rotate";

    while (countCounter - rotateCount.current < pipesToSolve.current) {
      findNextCoordinates(countCounter);
      const { rotateMessage, pipesLeft } = checkPipe(
        xx.current,
        yy.current,
        grid,
        msg,
        pipesToSolve.current
      );

      if (rotateMessage.length !== msg.length) {
        msg = rotateMessage;
        rotateCount.current = countCounter;
        pipesToSolve.current = pipesLeft;
      }
      countCounter += 1;
    }

    stopAutoSolve();
    setCounter(countCounter);
    setVerifyMsg(msg);
  };

  const setLevel = (level: number) => {
    client.send(`new ${level}`);
    client.send("map");
    currentLevel.current = level;
    setWhatRender({
      ...whatRender,
      levelsBtns: false,
      startGameBtn: true,
      restartBtn: true,
    });
  };

  const startGameBtn = () => {
    const step1 = splitRawDataInShapeRows(mapAsString.current);
    const step2 = makeShapeGridFromRows(step1);
    const step3 = transformShapeGridToPipeGrid(step2);
    totalPipes.current = step3.length * step3[0].length;
    cellWidth = `${100 / step2[0].length}%`;
    pipesToSolve.current = totalPipes.current;
    setGrid(step3);
    setVerifyMsg("rotate");
    if (currentLevel.current <= 3) {
      setWhatRender({
        ...whatRender,
        startGameBtn: false,
        restartBtn: true,
        startSolveBtn: true,
        fancyGrid: true,
        verify: true,
      });
    } else {
      setWhatRender({
        ...whatRender,
        startGameBtn: false,
        restartBtn: true,
        startSolveBtn: true,
        verify: true,
      });
    }

  };

  const restartGameBtn = () => {
    setVerifyMsg("rotate");
    setCounter(0);
    xx.current = 0;
    yy.current = 0;
    clearTimeout(timeOut.current!);
    setAutoSolve(false);
    setVerifyResponde("");
    setWhatRender({
      ...whatRender,
      levelsBtns: true,
      startGameBtn: false,
      restartBtn: false,
      startSolveBtn: false,
      stopSolveBtn: false,
      fancyGrid: false,
      simpleGrid: false,
      verify: false,
    });
  };

  const startAutoSolve = () => {
    rotateCount.current = counter;
    setVerifyResponde("");
    if (currentLevel.current < 2) {
      setWhatRender({
        ...whatRender,
        startSolveBtn: false,
        stopSolveBtn: true,
        verify: false,
        simpleGrid: false,
      });
      setAutoSolve(true);
      return;
    }

    setWhatRender({
      ...whatRender,
      startSolveBtn: false,
      stopSolveBtn: true,
      verify: false,
      simpleGrid: false,
      fancyGrid: false,
    });

    setTimeout(() => {
      fastAutoSolve()
      setWhatRender({
        ...whatRender,
        startSolveBtn: true,
        stopSolveBtn: false,
        verify: true,
      });
    }, 0);

    return;
  };

  const stopAutoSolve = () => {
    clearTimeout(timeOut.current!);
    setAutoSolve(false);
    setWhatRender({
      ...whatRender,
      startSolveBtn: true,
      stopSolveBtn: false,
      verify: true,
    });
  };

  const cellClickHandler = (x: number, y: number, pipe?: Pipe) => {
    if (grid[y][x].isDone) {
      alert("you need to unlock pipe to rotate it");
      return;
    }
    setCounter(counter + 1);
    const newGrid = [...grid];
    grid[y][x] = rotatePipe(newGrid[y][x]);
    setVerifyMsg(appendRotateMessage(verifyMsg, x, y));
    setVerifyResponde("");
    setGrid(newGrid);
  };

  const rightClickHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    x: number,
    y: number
  ) => {
    e.preventDefault();
    const newGrid = [...grid];
    if (newGrid[y][x].isDone) {
      newGrid[y][x].isDone = false;
      setGrid(newGrid);
      return;
    }
    newGrid[y][x].allowedPositions = [newGrid[y][x].position];
    newGrid[y][x].isDone = true;
    setGrid(newGrid);
  };

  const verifyResults = () => {
    client.send(verifyMsg);
    client.send("verify");
    setVerifyMsg("rotate");
  };

  return (
    <div>
      <Heading />
      <div className='container container-fluid main-content'>
        <div className='row'>
          <div className='col-sm-9 col-xs-12'>
            <Options
              whatRender={whatRender}
              levels={levels}
              onLevelClick={setLevel}
              onStartClick={startGameBtn}
              onAutoSolveClick={startAutoSolve}
              onStopAutoSolveClick={stopAutoSolve}
              onRestartClick={restartGameBtn}
            />
            <ResultsTable
              verifyResponde={verifyResponde}
              currentLevel={currentLevel.current}
              levels={levels}
              whatRender={whatRender}
            />
            {currentLevel.current < 3 && whatRender.fancyGrid && (
              <Slider
                min={0}
                max={4}
                value={autoSolveTime}
                onChange={(value) => {
                  setAutoSolveTime(value);
                }}
              />
            )}
            {currentLevel.current > 2 && whatRender.stopSolveBtn && <Spinner />}
            <FancyGrid
              whatRender={whatRender}
              grid={grid}
              cellWidth={cellWidth}
              xx={xx.current}
              yy={yy.current}
              level={currentLevel.current}
              cellClickHandler={cellClickHandler}
              rightClickHandler={rightClickHandler}
            />
            <SimpleGrid
              handleGridShow={() =>
                setWhatRender({
                  ...whatRender,
                  simpleGrid: true,
                })
              }
              rightClickHandler={rightClickHandler}
              whatRender={whatRender}
              cellClickHandler={cellClickHandler}
              grid={grid}
              level={currentLevel.current}
            />
          </div>
          <div className='col-sm-3 col-xs-12 center-xs'>
            <Verify
              whatRender={whatRender}
              verifyMsg={verifyMsg}
              counter={counter}
              verifyResponde={verifyResponde}
              level={currentLevel.current}
              onVerifyClick={verifyResults}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

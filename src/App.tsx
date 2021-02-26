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
  ShapeType,
} from "./engine";
import Options from "./components/options/Options";
import Heading from "./components/header/Header";
import History from "./components/history/History";
import FancyGrid from "./components/fancyGrid/FancyGrid";
import SimpleGrid from "./components/simpleGrid/SimpleGrid";

export interface WhatRender {
  levelsBtns: boolean;
  fancyGrid: boolean;
  startGame: boolean;
  startSolveBtn: boolean;
  stopSolveBtn: boolean;
  simpleGrid: boolean;
  restartBtn: boolean;
  verify: boolean;
  info: boolean;
}
const client = new w3cwebsocket("ws://hometask.eg1236.com/game-pipes/");

client.onopen = () => {
  console.log("Connected");
};

const levels = [1, 2, 3, 4, 5, 6];

let cellWidth = "";

function App() {
  const [grid, setGrid] = useState<Pipe[][]>([]);
  const [history, setHistory] = useState("rotate");
  const [counter, setCounter] = useState(0);
  const [autoSolve, setAutoSolve] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState("");
  const [autoSolveTime, setAutoSolveTime] = useState(2);
  const [whatRender, setWhatRender] = useState({
    levelsBtns: true,
    fancyGrid: false,
    simpleGrid: false,
    startGame: false,
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
    // console.log("info", info);
    if (info.startsWith("verify: Correct")) {
      setVerifyMsg(info);
    }
    if (info.startsWith("verify: Incorrect")) {
      setVerifyMsg(`${info} Something is not connecting right, keep solving`);
    }
    mapAsString.current = info;
  };
  // console.log("mapAsString.current", mapAsString.current);

  useEffect(() => {
    if (grid.length && autoSolve) {
      let loopCountLeft = totalPipes.current;
      let keepLooping = true;
      do {
        if (counter) {
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

      timeOut.current = setTimeout(() => {
        const { rotateMessage, pipesLeft } = checkPipe(
          xx.current,
          yy.current,
          grid,
          history,
          pipesToSolve.current
        );

        if (rotateMessage.length !== history.length) {
          rotateCount.current = counter;
          setHistory(rotateMessage);
        }

        pipesToSolve.current = pipesLeft;
        if (counter - rotateCount.current > pipesToSolve.current) {
          stopAutoSolve();
          return;
        }
        setCounter(counter + 1);
      }, autoSolveTime * autoSolveTime * 50);
    }
  }, [counter, autoSolve]);

  console.log(autoSolveTime);

  const setLevel = (level: number) => {
    client.send(`new ${level}`);
    client.send("map");
    currentLevel.current = level;
    setWhatRender({
      ...whatRender,
      levelsBtns: false,
      startGame: true,
      restartBtn: true,
    });
  };

  const startGame = () => {
    const step1 = splitRawDataInShapeRows(mapAsString.current);
    const step2 = makeShapeGridFromRows(step1);
    const step3 = transformShapeGridToPipeGrid(step2);
    totalPipes.current = step3.length * step3[0].length;
    cellWidth = `${100 / step2[0].length}%`;
    pipesToSolve.current = totalPipes.current;
    setGrid(step3);
    setHistory("rotate");
    if (currentLevel.current <= 3) {
      setWhatRender({
        ...whatRender,
        startGame: false,
        restartBtn: true,
        startSolveBtn: true,
        fancyGrid: true,
        verify: true,
      });
    } else {
      setWhatRender({
        ...whatRender,
        startGame: false,
        restartBtn: true,
        startSolveBtn: true,
        // simpleGrid: true,
        verify: true,
      });
    }
  };
  const restartGame = () => {
    setHistory("rotate");
    setCounter(0);
    xx.current = 0;
    yy.current = 0;
    clearTimeout(timeOut.current!);
    setAutoSolve(false);
    setVerifyMsg("");
    setWhatRender({
      ...whatRender,
      levelsBtns: true,
      startGame: false,
      restartBtn: false,
      startSolveBtn: false,
      stopSolveBtn: false,
      fancyGrid: false,
      simpleGrid: false,
      verify: false,
    });
  };
  const startAutoSolve = () => {
    if (currentLevel.current > 2) {
      setAutoSolveTime(0);
    } else {
      setAutoSolveTime(2);
    }
    rotateCount.current = counter;
    setAutoSolve(true);
    setVerifyMsg("");
    setWhatRender({
      ...whatRender,
      startSolveBtn: false,
      stopSolveBtn: true,
      verify: false,
      simpleGrid: false,
    });
  };
  const stopAutoSolve = () => {
    setWhatRender({
      ...whatRender,
      startSolveBtn: true,
      stopSolveBtn: false,
      verify: true,
    });
    clearTimeout(timeOut.current!);
    setAutoSolve(false);
  };

  const cellClickHandler = (x: number, y: number, pipe?: Pipe) => {
    if (grid[y][x].isDone) {
      alert("you need to unlock pipe to rotate it");
      return;
    }
    setCounter(counter + 1);
    const newGrid = [...grid];
    grid[y][x] = rotatePipe(newGrid[y][x]);
    setHistory(appendRotateMessage(history, x, y));
    setVerifyMsg("");
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
    client.send(history);
    client.send("verify");
    setHistory("rotate");
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
              onStartClick={startGame}
              onAutoSolveClick={startAutoSolve}
              onStopAutoSolveClick={stopAutoSolve}
              onRestartClick={restartGame}
            />
            <FancyGrid
              whatRender={whatRender}
              grid={grid}
              cellWidth={cellWidth}
              xx={xx.current}
              yy={yy.current}
              level={currentLevel.current}
              cellClickHandler={cellClickHandler}
              rightClickHandler={rightClickHandler}
              autoSolveTime={autoSolveTime}
              onSliderChange={(value) => {
                setAutoSolveTime(value);
              }}
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
            <History
              whatRender={whatRender}
              history={history}
              counter={counter}
              verifyMsg={verifyMsg}
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

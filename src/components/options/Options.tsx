import React, { FC } from "react";
import { WhatRender } from "../../App";
import Button from "../button/Button";
import style from "./options.module.scss";

type Props = {
  levels: number[];
  whatRender: WhatRender;
  onLevelClick: (level: number) => void;
  onStartClick: () => void;
  onAutoSolveClick: () => void;
  onStopAutoSolveClick: () => void;
  onRestartClick: () => void;
};

const Options: FC<Props> = ({
  levels,
  whatRender,
  onLevelClick,
  onStartClick,
  onAutoSolveClick,
  onStopAutoSolveClick,
  onRestartClick,
}) => {
  const {
    levelsBtns,
    startGame,
    startSolveBtn,
    stopSolveBtn,
    restartBtn,
  } = whatRender;
  return (
    <div className={style.options}>
      {levelsBtns && (
        <div className='row center-xs'>
          <div className='col-xs-12'>
            <h1>Select difficulty Level</h1>
            {levels.map((level, index) => (
              <Button
                key={level}
                size='medium'
                color={index > 2 ? "danger" : "warning"}
                onClick={() => onLevelClick(level)}
              >
                LEVEL {index + 1}
              </Button>
            ))}
          </div>
        </div>
      )}
      <div className='row middle-xs center-xs'>
        <div className='col-xs-8'>
          {startGame && (
            <Button size='large' color='warning' onClick={onStartClick}>
              Start Game
            </Button>
          )}
          {startSolveBtn && (
            <Button size='large' color='warning' onClick={onAutoSolveClick}>
              Start Auto Solve
            </Button>
          )}
          {stopSolveBtn && (
            <Button size='large' color='warning' onClick={onStopAutoSolveClick}>
              Stop Auto Solve
            </Button>
          )}
          {restartBtn && (
            <Button size='medium' color='dark' onClick={onRestartClick}>
              {startGame ? "Back" : "Restart game"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Options;

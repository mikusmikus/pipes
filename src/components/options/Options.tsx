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
    startGameBtn,
    startSolveBtn,
    stopSolveBtn,
    restartBtn,
  } = whatRender;
  return (
    <div className={`${style.options} row middle-xs`}>
      {levelsBtns && (
        <div className='col-xs-9 center-xs'>
          <h2>Select difficulty Level</h2>
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
      )}
      <div className='col-xs-9 center-xs'>
        {startGameBtn && (
          <Button size='large' color='warning' onClick={onStartClick}>
            Start Game
          </Button>
        )}
        {startSolveBtn && (
          <Button size='large' color='danger' onClick={onAutoSolveClick}>
            Start Auto Solve
          </Button>
        )}
        {stopSolveBtn && (
          <Button size='large' color='warning' onClick={onStopAutoSolveClick}>
            Stop Auto Solve
          </Button>
        )}
      </div>
      <div className='col-xs-3 center-xs'>
        {restartBtn && (
          <Button size='medium' color='dark' onClick={onRestartClick}>
            {startGameBtn ? "Back" : "Restart game"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Options;

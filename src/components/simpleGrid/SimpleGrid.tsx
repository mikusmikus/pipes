import React, { FC } from "react";
import { WhatRender } from "../../App";
import Button from "../button/Button";
import { Pipe, translateFromPipeToShape } from "../../engine";
import Spinner from "../spinner/Spinner";
import style from "./simpleGrid.module.scss";

type Props = {
  whatRender: WhatRender;
  level: number;
  cellClickHandler: (x: number, y: number) => void;
  handleGridShow: () => void;
  rightClickHandler: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    x: number,
    y: number
  ) => void;
  grid: Pipe[][];
};
const SimpleGrid: FC<Props> = ({
  whatRender,
  grid,
  level,
  cellClickHandler,
  rightClickHandler,
  handleGridShow,
}) => {
  const { simpleGrid, startSolveBtn, stopSolveBtn } = whatRender;

  const handleCellClick = (x: number, y: number) => {
    cellClickHandler(x, y);
  };

  return (
    <div className={style.simpleGrid}>
      {level > 3 && !simpleGrid && startSolveBtn && (
        <div className={style.warning}>
          <h1>Warning!!!</h1>
          <h3>
            Game size is very big, do you realy want to see it? it can take some
            time...
          </h3>
          <Button color='danger' size='large' onClick={() => handleGridShow()}>
            show grid
          </Button>
        </div>
      )}
      <div className={style.loading}>
        <Spinner />
      </div>
      {simpleGrid && level > 3 &&
        grid.map((row, y) => {
          return (
            <div className={style.grid} key={`key${y}`}>
              {row.map((pipe, x) => {
                return (
                  <div
                    key={`key${y}${x}`}
                    className={`${style.pipe} ${pipe.isDone && style.isDone}`}
                    onClick={() => handleCellClick(x, y)}
                    onContextMenu={(
                      e: React.MouseEvent<HTMLDivElement, MouseEvent>
                    ) => rightClickHandler(e, x, y)}
                  >
                    {translateFromPipeToShape(pipe)}
                  </div>
                );
              })}
            </div>
          );
        })}
    </div>
  );
};

export default SimpleGrid;

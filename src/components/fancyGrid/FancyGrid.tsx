import React, { FC } from "react";
import { WhatRender } from "../../App";
import { Pipe } from "../../engine";
import { Cell } from "../cell/Cell";
import Slider from "../slider/Slider";
import Spinner from "../spinner/Spinner";
import style from "./fancyGrid.module.scss";

type Props = {
  grid: Pipe[][];
  cellWidth: string;
  xx: number;
  yy: number;
  level: number;
  whatRender: WhatRender;
  cellClickHandler: (x: number, y: number, pipe: Pipe) => void;
  rightClickHandler: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    x: number,
    y: number
  ) => void;
};

const FancyGrid: FC<Props> = ({
  grid,
  cellWidth,
  xx,
  yy,
  level,
  whatRender,
  cellClickHandler,
  rightClickHandler,
}) => {
  const { fancyGrid, stopSolveBtn } = whatRender;

  const showFancyGrid = () => {
    if (fancyGrid && level > 2 && stopSolveBtn) {
      return false;
    }
    if (fancyGrid) {
      return true;
    }
    return false;
  };
  return (
    <div className={style.fancyGrid}>
      {fancyGrid && level > 2 && stopSolveBtn && <Spinner />}
      {showFancyGrid() &&
        grid.map((row, y) => {
          return (
            <div className={style.grid} key={`key${y}`}>
              {row.map((pipe, x) => {
                return (
                  <div
                    key={`key${y}${x}`}
                    style={{ width: cellWidth, minWidth: "30px" }}
                  >
                    <Cell
                      pipe={pipe}
                      isActive={xx === x && yy === y}
                      onClick={() => cellClickHandler(x, y, pipe)}
                      onRightClick={(
                        e: React.MouseEvent<HTMLDivElement, MouseEvent>
                      ) => rightClickHandler(e, x, y)}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
    </div>
  );
};

export default FancyGrid;

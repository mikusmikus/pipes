import React, { FC } from "react";
import { Pipe } from "../../engine";
import style from "./cell.module.scss";

interface Props {
  pipe: Pipe;
  onClick?: () => void;
  onRightClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  isActive?: boolean;
  pipeColor?: string;
}

export const Cell: FC<Props> = ({
  pipe,
  onClick,
  isActive = false,
  onRightClick,
}) => {
  const { top, left, bottom, right, isDone } = pipe;

  let backgroundColor = "";

  if (isDone) backgroundColor = "#fca311";
  else if (isActive) backgroundColor = "#ec404f";

  
  return (
    <div
      className={style.wrapper}
      style={{ backgroundColor: backgroundColor }}
      onClick={onClick}
      onContextMenu={onRightClick}
    >
      {top && <div className={`${style.pipe} ${style.top}`} />}
      {left && <div className={`${style.pipe} ${style.left}`} />}
      {bottom && <div className={`${style.pipe} ${style.bottom}`} />}
      {right && <div className={`${style.pipe} ${style.right}`} />}
    </div>
  );
};

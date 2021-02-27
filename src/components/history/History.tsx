import React, { FC, useEffect, useRef } from "react";
import { WhatRender } from "../../App";
import Button from "../button/Button";
import style from "./history.module.scss";

type Props = {
  counter: number;
  history: string;
  verifyMsg: string;
  textAreaRef?: React.RefObject<HTMLTextAreaElement>;
  whatRender: WhatRender;
  level:number;
  onVerifyClick: () => void;
};
const History: FC<Props> = ({
  counter,
  history,
  verifyMsg,
  whatRender,
  level,
  onVerifyClick,
}) => {
  const { verify, stopSolveBtn } = whatRender;
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
    }
  });
  const showHistory = () => {
    if (stopSolveBtn && level<4) 
    return true
    if (!stopSolveBtn){
      return true
    }
    return false
  }

  return (
    <div className={style.historyWrapper}>
      {showHistory() &&(
        <>
      <h4>MOVE COUNTER: {counter}</h4>
      <div>
        <textarea
          ref={textAreaRef}
          value={history}
          className={style.historyArea}
          readOnly
        />
      </div>
      </>
      )}
      {verify && (
        <>
          <div className={style.buttonWrapper}>
            <Button size='medium' color='warning' onClick={onVerifyClick}>
              VERIFY
            </Button>
          </div>
          <div className='verify'>{verifyMsg && <h3>{verifyMsg}</h3>}</div>
        </>
      )}
    </div>
  );
};

export default History;

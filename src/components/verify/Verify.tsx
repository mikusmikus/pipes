import React, { FC, useEffect, useRef } from "react";
import { WhatRender } from "../../App";
import Button from "../button/Button";
import style from "./verify.module.scss";

type Props = {
  counter: number;
  verifyMsg: string;
  verifyResponde: string;
  textAreaRef?: React.RefObject<HTMLTextAreaElement>;
  whatRender: WhatRender;
  level:number;
  onVerifyClick: () => void;
};
const Verify: FC<Props> = ({
  counter,
  verifyMsg,
  verifyResponde,
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
  const showVerifyMsg = () => {
    if (stopSolveBtn && level<3) 
    return true
    if (!stopSolveBtn){
      return true
    }
    return false
  }

  return (
    <div className={style.verifyMsgWrapper}>
      {showVerifyMsg() &&(
        <>
      <h4>MOVE COUNTER: {counter}</h4>
      <div>
        <textarea
          ref={textAreaRef}
          value={verifyMsg}
          className={style.verifyMsgArea}
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
          <div className='verify'>{verifyResponde && <h3>{verifyResponde}</h3>}</div>
        </>
      )}
    </div>
  );
};

export default Verify;

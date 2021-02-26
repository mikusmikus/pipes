import React, { FC } from "react";
import Button from "../../common-components/button/Button";
import style from "./rules.module.scss";

type Props = {
  showRules: boolean;
  onRulesClick: () => void;
};
const rules = [
  "Pipes is a classic game where you can exercise your plumbing skills.",
  "You have to connect all pipes on the board so the water can flow through them.",
  "Use mouse left click to rotate clockwise",
  "Use mouse right click to lock the pipe",
];
const Rules: FC<Props> = ({ showRules, onRulesClick }) => {
  return (
    <div
      className={`${style.rulesWrapper} ${showRules && style.rulesActive}`}
      onClick={onRulesClick}
    >
      <div className='container'>
        <div className='row center-xs'>
          <div className='col-sm-8 col-xs-12'>
            <div className={style.rules} onClick={(e)=> {e.stopPropagation()}}>
              <div className={style.overlay}></div>
              <h1>Rules!</h1>
              <ul>
                {rules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
              <div className={style.buttonWrapper}>
                <Button color='warning' size='large' onClick={onRulesClick}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rules;
import React, { useState, useEffect } from "react";
import Button from "../button/Button";
import style from "./header.module.scss";
import Rules from "./../rules/Rules";

const Header = () => {
  const [showRules, setShowRules] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setShowRules(true);
    }, 2000);
  }, []);
  return (
    <header>
      <Rules showRules={showRules} onRulesClick={() => setShowRules(false)} />
      <div className={style.header}>
        <div className='container'>
          <div className='row'>
            <div className='col-sm-9 col-xs-12'>
              <h1 className={style.heading}>WELCOME TO PIPE GAME</h1>
            </div>
            <div className='col-xs-3 center-xs middle-xs'>
              {!showRules && (
                <div className={style.buttonWrapper}>
                  <Button size='medium' onClick={() => setShowRules(!showRules)}>
                    How to play
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

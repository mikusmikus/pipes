import React, { FC } from "react";
import style from "./spinner.module.scss";


const Spinner:FC = ({children}) => {
  return (
    <div className={style.solving}>
        <div>
      <h1 className={style.heading}>
        {children}
      </h1>
        </div>
      <div className={style.spinner}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Spinner;

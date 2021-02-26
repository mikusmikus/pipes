import React from "react";
import style from "./spinner.module.scss";

const Spinner = () => {
  return (
    <div className={style.solving}>
        <div>
      <h1 className={style.heading}>Solving...</h1>
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

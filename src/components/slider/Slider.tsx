import React, { FC } from "react";
import style from "./slider.module.scss";

type Props = {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
};

const Slider: FC<Props> = ({ min = 0, max = 4, value, onChange }) => {
  return (
    <div className='row'>
      <div className="col-xs-12 center-xs">
        auto solve speed
      </div>
      <div className='col-xs-2 end-xs col-xs-offset-1'>slower</div>
      <div className='col-xs-6'>
        <div className={style.slider}>
          <input
            className={style.range}
            type='range'
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
          />
        </div>
      </div>
      <div className='col-xs-2 start-xs'>faster</div>
    </div>
  );
};

export default Slider;

import React, { FC } from "react";

type Props = {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
};

const Slider: FC<Props> = ({ min, max, value, onChange }) => {
  return (
    <input
      type='range'
      min={0}
      max={5}
      value={value}
      onChange={(e) => {
        onChange(parseInt(e.target.value, 10));
      }}
    />
  );
};

export default Slider;

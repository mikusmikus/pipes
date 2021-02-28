import React, { FC } from "react";
import style from "./button.module.scss";

type Props = {
  size?: string;
  color?: string;
  disabled?: boolean;
  onClick?: () => void;
};
const Button: FC<Props> = ({
  children,
  size = "medium",
  color = "light",
  disabled = false,
  onClick,
}) => {

  return (
    <button className={`${style.button} ${style[color]} ${style[size]}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;

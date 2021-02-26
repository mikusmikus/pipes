import React, { FC } from "react";
import style from "./button.module.scss";

type Props = {
  size?: string;
  color?: string;
  onClick?: () => void;
};
const Button: FC<Props> = ({
  children,
  size = "medium",
  color = "light",
  onClick,
}) => {
  // const getFontSize = (size: string) => {
  //   if (size === "small") {
  //     return "1rem";
  //   }
  //   if (size === "large") {
  //     return "2rem";
  //   }
  //   return "1.25rem";
  // };

  // const styleObject = {
  //   fontSize: getFontSize(size),
  // };

  return (
    <button className={`${style.button} ${style[color]} ${style[size]}`} onClick={onClick} >
      {children}
    </button>
  );
};

export default Button;

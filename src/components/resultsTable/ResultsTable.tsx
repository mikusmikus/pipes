import React, { FC, useEffect, useState } from "react";
import { WhatRender } from "../../App";
import style from "./resultsTable.module.scss";

type Props = {
  verifyResponde: string;
  currentLevel: number;
  levels: number[];
  whatRender: WhatRender;
};
interface Results {
  level: number;
  password: string;
}
const ResultsTable: FC<Props> = ({
  verifyResponde,
  currentLevel,
  levels,
  whatRender,
}) => {
  const [results, setResults] = useState<Results[]>([]);
  const { levelsBtns, startGameBtn } = whatRender;
  useEffect(() => {
    const resultArr = levels.map((level) => {
      return {
        level,
        password: "",
      };
    });
    const storagePipes = JSON.parse(localStorage.pipesGame || "[]");
    if (storagePipes.length) {
      setResults(storagePipes);
    } else {
      setResults(resultArr);
    }
    if (verifyResponde.startsWith("verify: Correct")) {
      const resultsCopy = [...results];
      const password = verifyResponde.split("verify: Correct! Password: ");
      resultsCopy[currentLevel - 1].password = password[1];
      setResults(resultsCopy);
      localStorage.pipesGame = JSON.stringify(resultsCopy);
    }
    
  }, [verifyResponde]);

  return (
    <>
      {(startGameBtn || levelsBtns) && (
        <div className={style.results}>
          <table>
            <thead>
              <tr>
                <th>Level</th>
                <th>Password</th>
              </tr>
            </thead>
            <tbody>
              {results.map(({ level, password }, index) => (
                <tr key={level}>
                  <td>{index + 1}</td>
                  <td>{password}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default ResultsTable;

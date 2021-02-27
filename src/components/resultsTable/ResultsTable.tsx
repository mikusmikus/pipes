import React, { FC, useEffect, useState } from "react";
import style from "./resultsTable.module.scss";

type Props = {
  verifyResponde: string;
  currentLevel: number;
  levels: number[];
};
interface Results {
  level: number;
  password: string;
}
const ResultsTable: FC<Props> = ({ verifyResponde, currentLevel, levels }) => {
  const [results, setResults] = useState<Results[]>([]);

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
    <div className={style.results}>
      {/* <h1>Passwords</h1> */}
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
  );
};

export default ResultsTable;

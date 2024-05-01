import React, { useState } from "react";
import Year from "./components/year";
import grades from "./grades";
import "./index.css";
const App = () => {
  const [totalScore, setTotalScore] = useState(0);
  const [eachGradePerYear, setEachGradePerYear] = useState([[], [], [], []]);
  const [totalSubjectsPerYear, setTotalSubjectsPerYear] = useState(
    new Array(4).fill(0)
  );
  const [tooManySubjestsInYear, setTooManySubjectsInYear] = useState(
    Array(4).fill(false)
  );

  const handleQCA = (grade, year) => () => {
    if (totalSubjectsPerYear[year - 1] === 10) {
      const tooManySubjestsInYearCopy = [...tooManySubjestsInYear];
      tooManySubjestsInYearCopy[year - 1] = true;
      setTooManySubjectsInYear(tooManySubjestsInYearCopy);
      setTimeout(() => {
        setTooManySubjectsInYear(Array(4).fill(false));
      }, 2000);
      return;
    }
    const eachGradePerYearCopy = [...eachGradePerYear];
    eachGradePerYearCopy[year - 1].push(grade);
    setEachGradePerYear(eachGradePerYearCopy);
    setTotalScore(totalScore + grades[grade]);
    const totalSubjectsPerYearCopy = [...totalSubjectsPerYear];
    totalSubjectsPerYearCopy[year - 1] += 1;
    setTotalSubjectsPerYear(totalSubjectsPerYearCopy);
  };

  const clearYear = (year) => () => {
    const totalSubjectsPerYearCopy = [...totalSubjectsPerYear];
    totalSubjectsPerYearCopy[year - 1] = 0;
    setTotalSubjectsPerYear(totalSubjectsPerYearCopy);
    const eachGradePerYearCopy = [...eachGradePerYear];
    eachGradePerYearCopy[year - 1] = [];
    setEachGradePerYear(eachGradePerYearCopy);
  };

  const clearLastSubject = (year) => () => {
    if (totalSubjectsPerYear[year - 1] === 0) return;
    const eachGradePerYearCopy = [...eachGradePerYear];
    eachGradePerYearCopy[year - 1].pop();
    setEachGradePerYear(eachGradePerYearCopy);
    const totalSubjectsPerYearCopy = [...totalSubjectsPerYear];
    totalSubjectsPerYearCopy[year - 1]--;
    setTotalSubjectsPerYear(totalSubjectsPerYearCopy);
  };
  let totalPoints = 0;
  let totalSubjects = 0;

  const yearWeights = {
    // 1st year is weighted at 0 on your final QCA
    1: 0,
    2: 1,
    3: 1,
    // 4th year is weighted double on your final QCA
    4: 2
  };

  eachGradePerYear.forEach((y, index) => {
    const year = index + 1;
    y.forEach((g) => {
      totalPoints += grades[g] * yearWeights[year];
      totalSubjects += 1 * yearWeights[year];
    });
  });
  const qca = totalPoints / totalSubjects;

  return (
    <>
      <div className="header">
        <h1 id="title">QCA Calculator</h1>
      </div>
      <div className="topInfo">
        <p>
          {totalPoints === 0
            ? "Select your grades"
            : `Overall QCA is ${qca.toFixed(2)}`}
        </p>
        <p>Total number of subjects: {totalSubjects}</p>
      </div>
      <div className="yearsContainer">
        {totalSubjectsPerYear.map((s, i) => (
          <Year
            key={i}
            year={i + 1}
            handleQCA={handleQCA}
            totalSubjectsPerYear={totalSubjectsPerYear}
            clearYear={clearYear}
            eachGradePerYear={eachGradePerYear}
            tooManySubjestsInYear={tooManySubjestsInYear}
            clearLastSubject={clearLastSubject}
          />
        ))}
      </div>
    </>
  );
};

export default App;

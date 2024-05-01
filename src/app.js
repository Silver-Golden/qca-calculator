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
  let totalWeight = 0;
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
      totalSubjects += 1;
      totalWeight += 1 * yearWeights[year];
    });
  });
  const qca = totalPoints / totalWeight;

  const honors = (qca) => {
    let result = "Fail";
    if(qca >= 2.0){
      result = "Third class honours";
    }
    if(qca >= 2.6){
      result = "Second class, grade 2 (2.2)";
    }
    if(qca >= 3.0){
      result = "Second class, grade 1 (2.1)";
    }
    if(qca >= 3.4){
      result = "First class honours";
    }
    return result;
  }

  const header = (totalPoints, totalSubjects, qca) => {
    if(totalSubjects === 0){
      return "Select your grades";
    }else if(totalPoints === 0){
      return "1st year results do not factor into final QCA";
    } else {
      return `Overall QCA is ${qca.toFixed(2)}, ${honors(qca)}`;
    }
  }

  return (
    <>
      <div className="header">
        <h1 id="title">QCA Calculator</h1>
      </div>
      <div className="topInfo">
        <p>
          {header(totalPoints, totalSubjects, qca)}
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

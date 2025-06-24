import Button from '@code-dot-org/component-library/button';
import Papa from 'papaparse';
import React, {useState} from 'react';

import {HumanEvaluation} from '@cdo/apps/aiEvaluation/aiEvaluationApi';

const AccuracyCheck: React.FC = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [data, setData] = useState<HumanEvaluation[]>([]);
  const csvSelected = !!csvFile;

  const getAIEvaluations = () => {
    console.log(data);
  };

  const compareEvaluations = () => {
    // For each row does evaluation == aiEvaluation?
    // where diff is the difference between human and AI evaluations
    // e.g. if human=3 and AI=1, diff = -2
    // {
    //   match: true/false,
    //   diff: +2/-2,
    // }
  };

  const calculateAccuracy = () => {
    // {
    //   skill-key: { % match, % AI higher, % AI lower }
    //   level-summary: { % match, % AI higher, % AI lower }
    //   overall total: { % match, % AI higher, % AI lower }
    // }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setCsvFile(file);
    }
  };

  const importCSV = () => {
    if (csvFile) {
      Papa.parse<HumanEvaluation>(csvFile, {
        complete: updateData,
        header: true,
      });
    }
  };

  const updateData = (result: {data: HumanEvaluation[]}) => {
    if (result.data.length === 0) {
      alert('No data found in the CSV file.');
      return;
    }
    const validationErrors: string[] = [];
    result.data.forEach((humanEvaluation, index) => {
      if (!humanEvaluation.studentWork || !humanEvaluation.evaluation) {
        validationErrors.push(
          `Row ${index + 1} is missing student work and/or evaluation.`
        );
      }
    });
    if (validationErrors.length > 0) {
      alert(
        `Please fix: \n${validationErrors.join(
          '\n'
        )} \nThen, try the upload again.`
      );
      return;
    } else {
      setData(result.data);
      getAIEvaluations();
    }
  };

  return (
    <div>
      <h2>Check AI Evaluation Accuracy</h2>
      <p>
        Upload a CSV of human-evaluated sample solutions. The CSV should have
        the following columns: studentWork and evaluation. TODO: describe scale
        TODO: describe skill-based evaluations format
      </p>
      <br />
      <div>
        <input
          className="csv-input"
          type="file"
          name="file"
          onChange={handleChange}
        />
      </div>
      <br />
      <div>
        <Button
          text="Upload Human-Evaluated Dataset"
          onClick={importCSV}
          disabled={!csvSelected}
        />
      </div>
      <br />
      <br />
      <h3>Summary of AI vs Human Evaluation Accuracy</h3>
    </div>
  );
};

export default AccuracyCheck;

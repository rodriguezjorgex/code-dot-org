import Button from '@code-dot-org/component-library/button';
import Papa from 'papaparse';
import React, {useState} from 'react';

import {
  AIResponse,
  evaluationFromOpenAI,
  HumanEvaluation,
} from '@cdo/apps/aiEvaluation/aiEvaluationApi';
import {AiEvaluationTypes} from '@cdo/generated-scripts/sharedConstants';

type EvaluatedCodeSample = HumanEvaluation &
  AIResponse & {
    [key in `skill${number}${
      | 'evaluationCriteria'
      | 'aiEvaluation'
      | 'aiReasoning'}`]?: string;
  };

const AccuracyCheck: React.FC = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [humanEvaluatedSamples, setHumanEvaluatedSamples] = useState<
    HumanEvaluation[]
  >([]);
  const [evaluationPending, setEvaluationPending] = useState<boolean>(false);
  const [aiEvaluatedSamples, setAiEvaluatedSamples] = useState<
    EvaluatedCodeSample[]
  >([]);
  const csvSelected = !!csvFile;
  const datasetName = csvFile
    ? `${csvFile.name}-ai-evaluations.csv`
    : 'ai-evaluations.csv';

  const downloadCSV = () => {
    const csv = Papa.unparse(aiEvaluatedSamples);
    const csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    const csvURL = window.URL.createObjectURL(csvData);
    const tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', datasetName);
    tempLink.click();
  };

  const getAIEvaluations = async () => {
    setEvaluationPending(true);
    const responsePromises = humanEvaluatedSamples.map(
      async humanEvaluatedSample => {
        return evaluateStudentWork(humanEvaluatedSample);
      }
    );
    await Promise.allSettled(responsePromises);
    setEvaluationPending(false);
  };

  const evaluateStudentWork = async (humanEvaluatedSample: HumanEvaluation) => {
    const aiResponse = await evaluationFromOpenAI(
      humanEvaluatedSample.studentWork,
      31684,
      569,
      AiEvaluationTypes.SINGLE_STUDENT
    );
    const parsedResponse = JSON.parse(aiResponse?.content || '{}');
    const evaluation: EvaluatedCodeSample = {
      evaluation: humanEvaluatedSample.evaluation,
      studentWork: humanEvaluatedSample.studentWork,
      aiEvaluation: parsedResponse?.aiEvaluation,
      aiReasoning: parsedResponse?.aiReasoning,
      evaluationCriteria: parsedResponse?.evaluationCriteria,
      id: parsedResponse?.id,
    };
    if (parsedResponse?.skillEvaluations) {
      for (let i = 0; i < parsedResponse.skillEvaluations.length; i++) {
        const skillEvaluation = parsedResponse.skillEvaluations[i];
        const skillId = skillEvaluation.skillId;
        evaluation[`skill${skillId}evaluationCriteria`] =
          skillEvaluation.evaluationCriteria;
        evaluation[`skill${skillId}aiEvaluation`] =
          skillEvaluation.aiEvaluation;
        evaluation[`skill${skillId}aiReasoning`] = skillEvaluation.aiReasoning;
      }
    }
    setAiEvaluatedSamples(prevSamples => [...prevSamples, evaluation]);
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
      if (!humanEvaluation.studentWork) {
        validationErrors.push(`Row ${index + 1} is missing student work.`);
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
      setHumanEvaluatedSamples(result.data);
      getAIEvaluations();
    }
  };

  return (
    <div>
      <h2>Check AI Evaluations</h2>
      <p>
        Upload a CSV of sample student solutions. The CSV should have a column
        named studentWork. TODO: describe scale TODO: describe skill-based
        evaluations format
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
          text="Upload Student Examples Dataset"
          onClick={importCSV}
          disabled={!csvSelected}
          isPending={evaluationPending}
        />
      </div>
      <br />
      <div>
        <Button
          text="Download CSV"
          onClick={downloadCSV}
          disabled={aiEvaluatedSamples.length === 0}
        />
      </div>
    </div>
  );
};

export default AccuracyCheck;

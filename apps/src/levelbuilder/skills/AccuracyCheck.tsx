import Button from '@code-dot-org/component-library/button';
import Link from '@code-dot-org/component-library/link';
import Papa from 'papaparse';
import React, {useState} from 'react';

import {
  evaluationFromOpenAI,
  HumanEvaluation,
} from '@cdo/apps/aiEvaluation/aiEvaluationApi';
import {AiEvaluationTypes} from '@cdo/generated-scripts/sharedConstants';

type AIResponse = {
  aiEvaluation?: string;
  aiReasoning?: string;
  evaluationCriteria?: string;
};

type EvaluatedExample = ExampleAnswer &
  AIResponse & {
    [key in `skill${string}${
      | 'evaluationCriteria'
      | 'aiEvaluation'
      | 'aiReasoning'}`]?: string;
  };

type ExampleAnswer = {
  studentWork: string;
};

const AccuracyCheck: React.FC<{levelId: number}> = ({levelId}) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [studentAnswers, setStudentAnswers] = useState<ExampleAnswer[]>([]);
  const [evaluationPending, setEvaluationPending] = useState<boolean>(false);
  const [aiEvaluatedAnswers, setAiEvaluatedAnswers] = useState<
    EvaluatedExample[]
  >([]);
  const csvSelected = !!csvFile;
  const datasetName = csvFile
    ? `${csvFile.name}-ai-evaluations.csv`
    : 'ai-evaluations.csv';

  const downloadCSV = () => {
    const csv = Papa.unparse(aiEvaluatedAnswers);
    const csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    const csvURL = window.URL.createObjectURL(csvData);
    const tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', datasetName);
    tempLink.click();
  };

  const getAIEvaluations = async () => {
    setEvaluationPending(true);
    const responsePromises = studentAnswers.map(async studentAnswer => {
      return evaluateStudentWork(studentAnswer);
    });
    await Promise.allSettled(responsePromises);
    setEvaluationPending(false);
  };

  const evaluateStudentWork = async (example: ExampleAnswer) => {
    const aiResponse = await evaluationFromOpenAI(
      example.studentWork,
      levelId,
      569,
      AiEvaluationTypes.SINGLE_STUDENT
    );
    const parsedResponse = JSON.parse(aiResponse?.content || '{}');
    const evaluation: EvaluatedExample = {
      studentWork: example.studentWork,
      aiEvaluation: parsedResponse?.aiEvaluation,
      aiReasoning: parsedResponse?.aiReasoning,
      evaluationCriteria: parsedResponse?.evaluationCriteria,
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
    setAiEvaluatedAnswers(prevSamples => [...prevSamples, evaluation]);
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

  const updateData = (result: {data: {studentWork: string}[]}) => {
    if (result.data.length === 0) {
      alert('No data found in the CSV file.');
      return;
    }
    const validationErrors: string[] = [];
    result.data.forEach((row, index) => {
      if (!row.studentWork) {
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
      setStudentAnswers(result.data);
      getAIEvaluations();
    }
  };

  return (
    <div>
      <h2>Check AI Evaluations</h2>
      <p>
        Upload a CSV of sample student solutions. The CSV should have a column
        named `studentWork`. The AI will evaluate each student work sample, and
        then you can download the results as a CSV file. Review the evaluations
        and reasoning provided by the AI for each sample to see if they match
        your expectations.
      </p>
      <p>
        If you find discrepancies, you can iterate by: editing evaluation
        criteria for a mis-evaluated skill or adjusting the level's
        instructions. For more tips & tricks see this{' '}
        <Link
          text="resource"
          href="https://docs.google.com/document/d/143_guZFrAxY0fywoTvstJvD2V2_0E_0tvrvIJfLbru4/edit?tab=t.0"
          openInNewTab={true}
          size="s"
        />
      </p>
      <p>
        If you are noticing a widespread issue or a specific pattern in the AI's
        evaluations, contact an engineer to help troubleshoot.
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
          disabled={aiEvaluatedAnswers.length === 0}
        />
      </div>
    </div>
  );
};

export default AccuracyCheck;

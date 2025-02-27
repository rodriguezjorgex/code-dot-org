import {getChatCompletionMessage} from '@cdo/apps/aiTutor/chatApi';
import Button from '@cdo/apps/componentLibrary/button';
import style from '@cdo/apps/levelbuilder/ai-iteration-tools/ai-tutor/ai-tutor-tester.module.scss';
import React, {useEffect, useState} from 'react';

// Add responses as a prop
// define response type shape
// write function that sends free reponses to AI
// import all the stuff we need to manage in state
// call function in useEffect
// display the AI's response
// hide this component behind a feature flag
// make this collapsible ?
// TBD: store the AI's summary somewhere?

interface StudentResponse {
  user_id: number;
  text: string;
  student_display_name: string;
  aiEvaluation: string;
}

interface FreeResponseAIEvaluationProps {
  responses: StudentResponse[];
}
const FreeResponseAIEvaluation: React.FunctionComponent<
  FreeResponseAIEvaluationProps
> = ({responses}) => {
  const [evaluationsPending, setEvaluationsPending] = useState<boolean>(false);
  const [evaluations, setEvaluations] = useState<StudentResponse[]>([]);
  const [evaluationCount, setEvaluationCount] = useState<number>(0);
  const evaluationComplete = responses.length === evaluationCount;

  // useEffect(() => {
  //   setStudentResponses(responses);
  // }, [responses]);

  useEffect(() => {
    if (evaluationComplete) {
      setEvaluationsPending(false);
    }
  }, [evaluationComplete]);

  // TODO: Pass these in as a prop or pull from state somewhere.
  const levelInstructions =
    'When creating an if-else-if statement you should always make your first condition the most specific. Write a short paragraph responding to the questions below. What does it mean to put the most specific case first? Why is it important to put the most specific case first? What types of errors does it help avoid?';
  const basePrompt = `You are a teaching assistant for a high school AP Computer Science class where the students are learniing JavaScript. Please review the student's response to the the instructions and indicate whether the response is "great", "ok", or "needs revision" with a one sentence explanation. The student's instructions are: ${levelInstructions}.`;

  const getAIEvaluations = async () => {
    setEvaluationsPending(true);
    const responsePromises = responses.map(async studentResponse => {
      return askAITutor(studentResponse);
    });

    await Promise.allSettled(responsePromises);
  };

  const askAITutor = async (studentResponse: StudentResponse) => {
    const studentResponseString = `${studentResponse.student_display_name} replied ${studentResponse.text}`;
    const chatApiResponse = await getChatCompletionMessage(
      studentResponseString,
      [],
      basePrompt
    );
    const aiEvaluation = chatApiResponse.assistantResponse;
    if (aiEvaluation) {
      const evaluation = {
        ...studentResponse,
        aiEvaluation: aiEvaluation,
      };
      setEvaluations(prevEvaluations => [...prevEvaluations, evaluation]);
      setEvaluationCount(prevCount => prevCount + 1);
    }
  };

  return (
    <div>
      <h3>AI Analysis (beta)</h3>
      <Button
        text="Evaluate individual student responses"
        onClick={getAIEvaluations}
        disabled={!responses.length || evaluationsPending}
        isPending={evaluationsPending}
      />
      {evaluationComplete && (
        <table>
          <thead>
            {evaluations.map(evaluation => (
              <tr key={evaluation.user_id} className={style.row}>
                <td className={style.cell}>
                  <div>{evaluation.student_display_name}</div>
                </td>
                <td className={style.cell}>
                  <div>{evaluation.text}</div>
                </td>
                <td className={style.cell}>
                  <div>{evaluation.aiEvaluation}</div>
                </td>
              </tr>
            ))}
          </thead>
        </table>
      )}
    </div>
  );
};

export default FreeResponseAIEvaluation;

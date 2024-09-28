import { useContext, useEffect, useState } from "react";
import { QuizContext } from "../context/QuizContext";
import { useNavigate } from "react-router-dom";
import Divider from "./Divider";
import LoadingSpinner from "./LoadingSpinner";
import { downloadPDF } from "../scripts/pdfHelper";
import logo from "../components/images/logo.png";
import api from "../scripts/axiosInstance";

function Result() {
  const { quiz } = useContext(QuizContext);
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");
  const [isLoadingReport, setLoadingReport] = useState(false);

  useEffect(() => {
    if (quiz.length == 0) {
      homePage();
    } else {
      getFeedback();
    }
  }, [quiz]);

  function homePage() {
    navigate("/*");
  }
  const getScore = () => {
    let score = 0;
    quiz.forEach((data) => {
      if (data.answer === data.userResponse) {
        score++;
      }
    });
    return score;
  };

  const getFeedback = async () => {
    const wrongQuestions = quiz.filter((q) => q.answer !== q.userResponse);
    const rightQuestions = quiz.filter((q) => q.answer === q.userResponse);

    const data = {
      wrongQuestions: wrongQuestions,
      rightQuestions: rightQuestions
    }

    try {
      const response = await api.post('/gpt/feedback', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const feedback = response.data;
      setFeedback(feedback);
    } catch (error) {

    }
  };

  const downloadReport = async () => {  
    const token = localStorage.getItem('accessToken');  
    const template = 'report';
    setLoadingReport(true);

    const quizData = {
      score: `${getScore()} / ${quiz.length}`,
      questions: quiz.map((q) => ({
        question: q.question,
        options: q.options,
        userResponse: q.userResponse,
        correctAnswer: q.answer,
        explanation: q.explanation,
      })),
      feedback: feedback,
    };

    const reqData = {
      token: token,
      quizData: quizData,
      templateID: template,
      pwd: null,
      report: true
    }

    try {
      const response = await api.post('/pdf/generate', reqData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if(response.data.downloadUri){
        await downloadPDF(response.data.downloadUri);
      } else {
        throw new Error('Invalid response from Intelliquiz Server');
      }
    } catch (error) {
      console.log("Failed to generate PDF report. ", error);
    } finally {
      setLoadingReport(false);
    }
  };

  return (
    <div className="col-span-12">
      <h1 className="text-4xl text-dPurple mb-6">
        Your Score{" "}
        <span className="text-amethyst">
          {getScore()} / {quiz.length}
        </span>
      </h1>
      <div className="flex gap-4 mb-10">
        <button
          className="text-seasalt bg-amethyst text-center w-150 py-1 text-button rounded-md drop-shadow-lg hover:bg-thistle hover:text-dPurple"
          onClick={homePage}
        >
          Home Page
        </button>
        <button
          className="text-dPurple bg-magnolia inner-border-3 inner-border-amethyst text-center px-2 py-1 text-button rounded-md drop-shadow-lg enabled:hover:bg-thistle enabled:hover:inner-border-thistle disabled:opacity-70"
          onClick={downloadReport}
          disabled={feedback === ""}
        >
          Download Report{" "}
        </button>
        {isLoadingReport ? (<div className="flex gap-2">
          <img src={logo} alt="Intelliquiz logo" className="w-12 h-12 animate-fade-in-out"/>
          <h1 className="text-dPurple text-button">Loading...</h1>  
        </div>) : (<></>)}
      </div>
      <Divider />
      <div>
        {quiz.map((data, i) => (
          <DisplayQuiz data={data} key={i} index={i + 1} />
        ))}
      </div>
      <Divider />
      <h1 className="text-header text-dPurple mb-3">Feedback</h1>

      <div className="feedback-section my-4">
        {feedback == "" ? (
          <div>
            <h1 className="text-header text-dPurple mb-5">Loading...</h1>
            <LoadingSpinner />
          </div>
        ) : (
          <p className="text-dPurple bg-seasalt inner-border-3 inner-border-thistle rounded-md p-2">
            {feedback}
          </p>
        )}
      </div>
      <div className="flex gap-4">
      <button
        type="button"
        className="text-seasalt bg-amethyst text-center w-150 py-1 text-button rounded-md drop-shadow-lg hover:bg-thistle hover:text-dPurple my-6"
        onClick={homePage}
      >
        Home Page
      </button>
      <button
        className="text-dPurple bg-magnolia inner-border-3 inner-border-amethyst text-center px-2 py-1 text-button rounded-md drop-shadow-lg enabled:hover:bg-thistle enabled:hover:inner-border-thistle disabled:opacity-70 my-6"
        disabled={feedback === ""}
        onClick={downloadReport}
        data-testid="download-report-button"
      >
        Download Report
      </button>     
      {isLoadingReport ? (<div className="flex gap-2 my-6">
        <img src={logo} alt="Intelliquiz logo" className="w-12 h-12 animate-fade-in-out"/>
        <h1 className="text-dPurple text-button">Loading...</h1>  
      </div>) : (<></>)}
      </div>
    </div>
  );
}

export const DisplayQuiz = ({ data, index }) => {
  return (
    <div className="mb-10">
      <div>
        <p className="text-button text-dPurple mb-3">
          {index}. {data.question}
        </p>
      </div>
      <div>
        {data.options.map((value, index) => (
          <div
            key={`default-${value}`}
            className={`mb-2 flex items-center gap-2 rounded-md p-2 inner-border-3 ${
              value == data.answer
                ? "bg-iqLightGreen inner-border-iqGreen"
                : value == data.userResponse
                ? "bg-iqLightRed inner-border-iqRed"
                : "bg-seasalt inner-border-thistle"
            }`}
          >
            <p className="text-body">{`${value}`}</p>
          </div>
        ))}
      </div>
      <div>
        {data.options.map((value, index) => (
          <div key={`explanation-${value}`}>
            {value == data.answer && value == data.userResponse ? (
              ""
            ) : data.answer == value ? (
              <p>{data.explanation}</p>
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Result;

import { Form, Radio, Button } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
// @ts-ignore
import he from "he";

interface QuestionsTypes {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}
import { useNavigate } from "react-router";
function QuizPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<QuestionsTypes[]>([]);
  useEffect(() => {
    async function getData() {
      const paramsString = window.location.search;
      const searchParams = new URLSearchParams(paramsString);
      const { category, difficulty } = {
        category: searchParams.get("category"),
        difficulty: searchParams.get("difficulty"),
      };
      const url = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`;
      const response = await axios.get(url);
      setQuestions(response.data.results);
    }
    getData();
  }, []);

  async function onFinish(values: any) {
    const correctAnswers = correctAnswersFn();
    let userAnswers: string[] = [];
    for (let key in values) {
      userAnswers.push(values[key]);
    }
    const matches = correctAnswers.filter((value) =>
      userAnswers.includes(value)
    );
    const score = matches.length.toString();
    const params = new URLSearchParams({ score: score });
    navigate(`/home?${params}`);
    console.log(matches);
  }
  if (!questions.length) {
    return <h1>Loading....</h1>;
  }

  function shuffleArray(array: string[]): string[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
  function correctAnswersFn() {
    const correct_answers: string[] = [];
    questions.map((question) => {
      correct_answers.push(question.correct_answer);
    });
    return correct_answers;
  }

  return (
    <div className="home-page-wrapper flex justify-center items-center">
      <div className="nav-container w-2/3 bg-white px-16 p-4 my-20 rounded-2xl">
        <div className="sign-up-form-heading mt-8 items-center flex justify-center mb-8">
          <h1 className="sign-up-heading text-gray-900 text-4xl">Quiz Time!</h1>
        </div>
        <Form onFinish={onFinish} requiredMark={false}>
          {questions.map((question, index) => {
            const randomArray = shuffleArray([
              ...question.incorrect_answers,
              question.correct_answer,
            ]);
            return (
              <div
                key={index}
                className="question-wrapper text-gray-900 text-l my-6"
              >
                <div className="question mb-10 text-wrap">{`${
                  index + 1 + ". "
                }${he.decode(question.question)}`}</div>
                <div className="options">
                  <Form.Item
                    name={`radio-group-${index + 1}`}
                    rules={[
                      { required: true, message: "Please select an option" },
                    ]}
                  >
                    <Radio.Group>
                      <div className="grid grid-cols-2 gap-6 pr-12">
                        <Radio value={`${randomArray[0]}`}>
                          {he.decode(randomArray[0])}
                        </Radio>
                        <Radio value={`${randomArray[1]}`}>
                          {he.decode(randomArray[1])}
                        </Radio>
                        <Radio value={`${randomArray[2]}`}>
                          {he.decode(randomArray[2])}
                        </Radio>
                        <Radio value={`${randomArray[3]}`}>
                          {he.decode(randomArray[3])}
                        </Radio>
                      </div>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </div>
            );
          })}
          <div className="btn-container flex justify-end mr-6">
            <Button type="primary" htmlType="submit" className="mr-6">
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default QuizPage;

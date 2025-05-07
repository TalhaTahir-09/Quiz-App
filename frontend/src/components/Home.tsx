import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import Button from "./Button.tsx";
import "antd/dist/reset.css";

function Home() {
  const search = window.location.search;
  const searchParams = new URLSearchParams(search);
  const score = searchParams.get("score");
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const responseFunction = async () => {
      if (!token) {
        navigate("/signup");
      } else {
        try {
          const response = await axios.get("http://localhost:3000/app/home", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(response);
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status == 401) {
            navigate("/signup");
          }
        }
      }
    };
    responseFunction();
  }, []);
  const handleSubmitQuiz = () => {
    navigate("/quiz-config");
  };
  const handleSubmitLead = () => {
    navigate("/leaderboard");
  };
  if (score) {
    return (
      <div className="home-page-wrapper flex justify-center items-center h-svh">
        <div className="nav-container w-2/4 bg-white px-12 pt-6 rounded-2xl">
          <div className="header-home grid place-items-center">
            <h1 className="text-gray-900 text-5xl font-semibold">
              {`Your Score is ${score}`}
            </h1>
          </div>

          <div className="button-container-home flex items-center justify-center gap-6">
            <Button title="Start Quiz" onSubmit={handleSubmitQuiz} />
            <Button title="LeaderBoard" onSubmit={handleSubmitLead} />
          </div>
          <button></button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="home-page-wrapper flex justify-center items-center h-svh">
        <div className="nav-container w-2/4 bg-white px-12 pt-6 rounded-2xl">
          <div className="header-home grid place-items-center">
            <h1 className="text-gray-900 text-5xl font-semibold">
              Welcome to home!
            </h1>
          </div>

          <div className="button-container-home flex items-center justify-center gap-6">
            <Button title="Start Quiz" onSubmit={handleSubmitQuiz} />
            <Button title="LeaderBoard" onSubmit={handleSubmitLead} />
          </div>
          <button></button>
        </div>
      </div>
    );
  }
}

export default Home;

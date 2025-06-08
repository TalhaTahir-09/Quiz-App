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

  useEffect(() => {
    const responseFunction = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/signup");
      } else {
        try {
          await axios.get("http://localhost:3000/app/home", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          });
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status == 401) {
            navigate("/signup");
          } else if (
            axios.isAxiosError(error) &&
            error.response?.status == 403
          ) {
            const response = await axios.get(
              "http://localhost:3000/app/refresh",
              {
                withCredentials: true,
              }
            );
            console.log(response);
            localStorage.setItem("accessToken", "");
            localStorage.setItem("accessToken", response.data.accessToken);
          } else if (
            axios.isAxiosError(error) &&
            error.response?.status == 400
          ) {
            console.log("Ran refresh token generetd");
            localStorage.setItem("accessToken", " ");
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
  const handleSubmitProfile = () => {
    navigate("/profile");
  };
  const handleSubmitLead = () => {
    navigate("/leaderboard");
  };
    function handleSignOut(){
    localStorage.setItem("accessToken", " ")
    navigate("/signup")
  }
  if (score) {
    return (
      <>
       <button className="bg-blue-500 transition duration-250 ease-in-out hover:-translate-y-0.5 hover:scale-105 hover:bg-indigo-500 fixed right-4 top-8" onClick={handleSignOut}>
          Signout
        </button>
      <div className="home-page-wrapper flex justify-center items-center h-svh">
        <div className="nav-container w-2/4 bg-white px-12 pt-6 rounded-2xl">
          <div className="header-home grid place-items-center">
            <h1 className="text-gray-900 text-5xl font-semibold">
              {`Your Score is ${score}`}
            </h1>
          </div>

          <div className="button-container-home flex items-center justify-center gap-6">
            <Button title="Start Quiz" onSubmit={handleSubmitQuiz} />
            <Button title="View Profile" onSubmit={handleSubmitProfile} />
            <Button title="LeaderBoard" onSubmit={handleSubmitLead} />
          </div>
          <button></button>
        </div>
      </div>
      </>
    );
  } else {
    return (
      <>
        <button className="bg-blue-500 transition duration-250 ease-in-out hover:-translate-y-0.5 hover:scale-105 hover:bg-indigo-500 fixed right-4 top-8" onClick={handleSignOut}>
          Signout
        </button>
        <div className="home-page-wrapper flex justify-center items-center h-svh">
          <div className="nav-container w-2/4 bg-white px-12 pt-6 rounded-2xl">
            <div className="header-home grid place-items-center">
              <h1 className="text-gray-900 text-5xl font-semibold">
                Welcome to home!
              </h1>
            </div>

            <div className="button-container-home flex items-center justify-center gap-6">
              <Button title="Start Quiz" onSubmit={handleSubmitQuiz} />
              <Button title="View Profile" onSubmit={handleSubmitProfile} />
              <Button title="LeaderBoard" onSubmit={handleSubmitLead} />
            </div>
            <button></button>
          </div>
        </div>
      </>
    );
  }
}

export default Home;

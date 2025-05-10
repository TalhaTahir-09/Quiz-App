import "@ant-design/v5-patch-for-react-19";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
function QuizConfig() {
  const navigate = useNavigate();
  interface UserData {
    easy: number;
    medium: number;
    hard: number;
    attempts: number;
  }
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const responseFunction = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/signup");
      } else {
        try {
          const response = await axios.get(
            "http://localhost:3000/app/profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          );
          setUserData(response.data);
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
            console.log(response.data.accessToken);
            localStorage.setItem("accessToken", "");
            localStorage.setItem("accessToken", response.data.accessToken);
          }
        }
      }
    };
    responseFunction();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen home-page-wrapper">
      <div className="bg-white rounded-2xl p-12  w-[90%] max-w-xl shadow-xl">
        <h1 className="text-3xl font-semibold text-center text-gray-900 mb-4">
          Profile:
        </h1>
        <p className="text-blue-600 text-lg font-medium text-center mb-6">
          Attempted Quizzes: {userData?.attempts || "0"}
        </p>
        <div className="flex justify-center gap-4">
          <div className="bg-gray-800 text-sm text-white rounded-md px-4 py-2 flex items-center gap-2 shadow-sm">
            <span className="text-teal-300 font-semibold">Easy</span>
            <span>{userData?.easy || "0"}</span>
          </div>  
          <div className="bg-gray-800 text-sm text-white rounded-md px-4 py-2 flex items-center gap-2 shadow-sm">
            <span className="text-yellow-400 font-semibold">Medium</span>
            <span>{userData?.medium || "0"}</span>
          </div>
          <div className="bg-gray-800 text-sm text-white rounded-md px-4 py-2 flex items-center gap-2 shadow-sm">
            <span className="text-red-400 font-semibold">Hard</span>
            <span>{userData?.hard || "0"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizConfig;

import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router";
function Home() {
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
  return (
    <div>
      <h1>Hello Home!</h1>
    </div>
  );
}

export default Home;

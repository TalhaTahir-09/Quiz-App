import { Table } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
type userScores = {
  [key: string]: {
    user_name: string;
    score: number;
    username: string;
  };
};
function Leaderboard() {
  const pointsTable: any = {
    easy: 1,
    medium: 2,
    hard: 3,
  };
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const responseFunction = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/app/leaderboard",
          {
            withCredentials: true,
          }
        );
        setScores(response?.data?.scores);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status == 401) {
          navigate("/signup");
        }
      }
    };
    responseFunction();
  }, []);

  console.log(scores);

  const userScores: userScores = {};
  scores.forEach(
    (value: { user_name: string; difficulty: string; score: number }) => {
      if (userScores[value.user_name] === undefined) {
        userScores[value.user_name] = {
          username: value.user_name,
          score: 0,
          user_name: value.user_name,
        };
      }
      userScores[value.user_name].score +=
        value.score * pointsTable[value.difficulty];
    }
  );
  console.log(userScores, "userScores");
  const leaderboardData = Object.values(userScores)
    .sort((a: any, b: any) => b.score - a.score)
    .map((value: any, index: number) => ({
      id: value.user_id,
      name: value.username,
      score: value.score,
      rank: index + 1,
    }));
  const topThreeUsers = leaderboardData.slice(0, 3);
  console.log(leaderboardData, "LeaderBoard")

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Rank", dataIndex: "rank", key: "rank" },
    { title: "Score", dataIndex: "score", key: "score" },
  ];
  if (!scores && topThreeUsers) {
    return "Loading";
  }
  return (
    <div className="leaderboard-wrapper min-h-screen p-10 bg-white text-black flex flex-col gap-12">
      <div className="upper flex flex-col gap-20">
        <div className="header-cont flex justify-between items-center">
          <div className="header">
            <h1 className="text-5xl" style={{ marginBottom: "10px" }}>
              See where you are!
            </h1>
            <p className="opacity-50">Here is your Leaderboard</p>
          </div>
          <img
            src="https://cdn-icons-png.flaticon.com/512/11865/11865967.png"
            alt="Leaderboard svg"
            className="w-36"
          />
        </div>
        <div className="position-cards flex gap-16 justify-between items-center">
          <div
            className="card w-1/4 h-20 flex items-center bg-[#F2F2F2] rounded-2xl"
            style={{ boxShadow: `2px 2px 5px` }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/2583/2583350.png"
              alt="Silver Medal"
              className="w-16 mx-4"
            />
            <div className="username text-2xl">
              {" "}
              <p style={{ margin: 0 }}>{topThreeUsers[1]?.name || "..."}</p>
            </div>
          </div>
          <div
            className="card w-1/4 h-20 flex items-center bg-[#F2F2F2] rounded-2xl"
            style={{ boxShadow: `2px 2px 5px` }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/2583/2583381.png"
              alt="Gold Medal"
              className="w-16 mx-4"
            />
            <div className="username text-2xl">
              {" "}
              <p style={{ margin: 0 }}>
                {topThreeUsers[0]?.name || "Username...."}
              </p>
            </div>
          </div>
          <div
            className="card w-1/4 h-20 flex items-center bg-[#F2F2F2] rounded-2xl"
            style={{ boxShadow: `2px 2px 5px` }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/2583/2583448.png"
              alt="Bronze Medal"
              className="w-16 mx-4"
            />
            <div className="username text-2xl">
              {" "}
              <p style={{ margin: 0 }}>{topThreeUsers[2]?.name || "..."}</p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="lower-table rounded-2xl p-4"
        style={{ boxShadow: `-1px 0px 10px #b5b5b5` }}
      >
        <Table
          columns={columns}
          dataSource={leaderboardData}
        />
      </div>
    </div>
  );
}

export default Leaderboard;

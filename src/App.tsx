import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Score from "./pages/Score";
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "./scripts/axiosInstance";
import Oops from "./pages/Oops";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [_token, setToken] = useState<string | null>(null);

  const fetchNewToken = async () => {
    try {
      const response = await api.get("/pdf/auth");

      const { access_token, expires_in } = response.data;
      const currentTime = new Date().getTime();
      const expirationTime = currentTime + expires_in * 1000; // Expiration timestamp in milliseconds

      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("tokenExpiration", expirationTime.toString());

      setToken(access_token);
    } catch (error) {
      console.log("Failed to fetch token: ", error);
    }
  };

  const isTokenValid = () => {
    const storedExpiration = Number(localStorage.getItem("tokenExpiration"));

    if (!storedExpiration || isNaN(storedExpiration)) return false;

    const currentTime = new Date().getTime();
    return currentTime < storedExpiration;
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");

    if (storedToken && isTokenValid()) {
      setToken(storedToken);
      setLoading(false);
    } else {
      fetchNewToken().finally(() => setLoading(false));
    }
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col w-full px-4 mx-auto h-screen justify-center items-center">
        <LoadingSpinner />
        <h1 className="heading-font mb-5">Loading...</h1>
        <h1 className="button-font text-center">
          This might take some time while the server wakes up.
        </h1>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen">
        <Router>
          <Routes>
            <Route path="/*" element={<Home />} />
            <Route path="/quiz/:quizId" element={<Quiz />} />
            <Route path="/score/:quizId" element={<Score />} />
            <Route path="/oops" element={<Oops />} />
          </Routes>
        </Router>
      </div>
      <div className="w-full h-4 bg-primary-200 mt-20"></div>
    </>
  );
};

export default App;

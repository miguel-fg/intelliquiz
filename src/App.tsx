import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Score from "./pages/Score";
import Navbar from "./components/Navbar";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Oops from "./pages/Oops";

const App = () => {
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

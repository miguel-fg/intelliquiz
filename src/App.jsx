import Home from "./pages/Home";
import { HashRouter as Router } from "react-router-dom";
function App() {
  return (
    <div className="flex justify-center">
      <Router>
        <Home />
      </Router>
    </div>
  );
}

export default App;

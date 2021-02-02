import "./App.css";
import Landing from "./pages/Landing/Landing";
import Profile from "./pages/Profile/Profile";
import { Route, BrowserRouter } from "react-router-dom";

function App() {
  return (
      <div className="App">
        <BrowserRouter>
          <Route exact path="/">
            <Landing />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
        </BrowserRouter>
      </div>
  );
}

export default App;

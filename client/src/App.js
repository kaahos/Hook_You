import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Navigation from "./pages/Navigation";
import Home from "./pages/Home";
import About from "./pages/About";
import Analysis from "./pages/Analyse";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  const getUser = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/auth/login/success`;
      const { data } = await axios.get(url, { withCredentials: true });
	  if(user == null && accessToken == null) {
		setUser(data.user._json);
		setAccessToken(data.accessToken);
	  }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  
  useEffect(() => {
    getUser();
  }, [getUser]);

  if (isLoading) {
    return <div className="container"><Navigation /></div>;
  }

  return (
    <div className="container">
      <div>
        <Navigation />
      </div>
      <div className="container2">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route
            exact
            path="/analyse"
            element={user ? <Analysis token={accessToken} /> : <Navigate to="/" />}
          />
          <Route
            exact
            path="/login"
            element={user ? <Navigate to="/profile" /> : <Login />}
          />
          <Route
            exact
            path="/profile"
            element={user ? <Profile user={{user, accessToken}} /> : <Navigate to="/login" />}
          />
          <Route exact path="/about" element={<About />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

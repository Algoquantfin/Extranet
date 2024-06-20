import React, { useState, useEffect } from "react";
import "./App.css";
import HeaderNav from "./HeaderNav";
import Dashboard from "../src/components/Dashboard";
import Login from "./components/Login";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogin = async (username, password) => {
    if (
      username === process.env.REACT_APP_USERNAME &&
      password === process.env.REACT_APP_PASSWORD
    ) {
      setIsLoggedIn(true);
      // Store login state in localStorage
      localStorage.setItem("isLoggedIn", "true");
    } else {
      alert("Invalid username or password");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Clear localStorage on logout
    localStorage.removeItem("isLoggedIn");
  };

  const handleChangePassword = () => {
    alert("Change password functionality is not implemented yet.");
  };

  return (
    <div className="App">
      <div className="wrapper">
        {!isLoggedIn && <Login onLogin={handleLogin} />}
        {isLoggedIn && (
          <>
            <HeaderNav
              isLoggedIn={isLoggedIn}
              handleLogout={handleLogout}
              handleChangePassword={handleChangePassword}
            />
            <Dashboard />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
